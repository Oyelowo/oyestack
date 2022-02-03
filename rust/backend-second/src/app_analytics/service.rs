use anyhow::Result;
use bson::doc;
use mongodb::options::{FindOneOptions, ReadConcern};
use tonic::{Response, Status};
pub mod app_analytics {
    tonic::include_proto!("app_analytics");
}

use app_analytics::{
    app_analytics_server::{AppAnalytics, AppAnalyticsServer},
    CreateUserAppEventRequest, GetAllUserAppEventsResponse, GetUserAppEventRequest,
    UserAppEventResponse,
};
use validator::Validate;
use wither::Model;

use crate::configs::{establish_connection, model_cursor_to_vec};

use super::UserAppEvent;

#[derive(Debug, Default)]
pub struct AnalyticsService;

#[tonic::async_trait]
impl AppAnalytics for AnalyticsService {
    async fn create_user_app_event(
        &self,
        request: tonic::Request<app_analytics::CreateUserAppEventRequest>,
    ) -> anyhow::Result<tonic::Response<app_analytics::UserAppEventResponse>, tonic::Status> {
        let CreateUserAppEventRequest {
            user_id,
            page,
            event_name,
            description,
        } = request.into_inner();
        let db = establish_connection().await;

        let mut user_app_event = UserAppEvent::builder()
            .user_id(user_id)
            .page(page)
            .event_name(event_name)
            .description(description)
            .build();

        user_app_event
            .validate()
            .map_err(|e| Status::invalid_argument(format!("Invalid argument {:?}", e)))?;

        user_app_event
            .save(&db, None)
            .await
            .map_err(|_| Status::not_found("User not found"))?;
        let id = user_app_event.id.expect("id not found").to_string();

        Ok(Response::new(UserAppEventResponse {
            id,
            user_id: user_app_event.user_id,
            page: user_app_event.page,
            event_name: user_app_event.event_name,
            description: user_app_event.description,
        }))
    }

    async fn get_user_app_event(
        &self,
        request: tonic::Request<app_analytics::GetUserAppEventRequest>,
    ) -> Result<tonic::Response<app_analytics::UserAppEventResponse>, tonic::Status> {
        let GetUserAppEventRequest { event_id, user_id } = request.into_inner();

        let db = establish_connection().await;

        // Validate that it is being called by authorized user if necessary

        let find_one_options = FindOneOptions::builder()
            .read_concern(ReadConcern::majority())
            .build();

        let user_found = UserAppEvent::find_one(
            &db,
            doc! {"_id": event_id, "user_id": user_id},
            find_one_options,
        )
        .await
        .map_err(|_| Status::not_found("User event not found"))?
        .expect("Id not found");

        let id = user_found.id.expect("id not found").to_string();

        let user_app_event_response = UserAppEventResponse {
            id,
            user_id: user_found.user_id,
            event_name: user_found.event_name,
            page: user_found.page,
            description: user_found.description,
        };
        Ok(Response::new(user_app_event_response))
    }

    async fn get_all_user_app_events(
        &self,
        _request: tonic::Request<app_analytics::Empty>,
    ) -> anyhow::Result<tonic::Response<app_analytics::GetAllUserAppEventsResponse>, tonic::Status>
    {
        // let Empty {  } = request.into_inner();

        let db = establish_connection().await;

        let user_app_event_found = UserAppEvent::find(&db, doc! {"user_id": ""}, None)
            .await
            .map_err(|_| Status::not_found("User data not found"))
            .expect("Problem finding user");

        let user_app_event = model_cursor_to_vec(user_app_event_found)
            .await
            .map_err(|_| Status::aborted("problem converting"))?
            .into_iter()
            .map(|event| {
                let id = event.id.expect("Id not found").to_string();
                UserAppEventResponse {
                    id,
                    user_id: event.user_id,
                    event_name: event.event_name,
                    page: event.page,
                    description: event.description,
                }
            })
            .collect::<Vec<UserAppEventResponse>>();

        Ok(Response::new(GetAllUserAppEventsResponse {
            user_app_event,
        }))
    }
}

pub struct AnalyticsApp;

impl AnalyticsApp {
    pub fn get_server() -> AppAnalyticsServer<AnalyticsService> {
        AppAnalyticsServer::new(AnalyticsService::default())
    }
}
