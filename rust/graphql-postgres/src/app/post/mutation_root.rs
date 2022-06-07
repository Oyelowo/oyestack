use crate::utils::postgresdb::{get_pg_connection_from_ctx, get_pg_pool_from_ctx};

use super::{model::PostActiveModel, Post, PostEntity};
// use super::{CreatePostInput, InsertPost, Post, UpdatePostInput};
use async_graphql::*;
use common::error_handling::ApiHttpStatus;
use sea_orm::{ActiveModelTrait, EntityTrait, Set};
use sqlx::types::Uuid;
use validator::Validate;

#[derive(Default)]
pub struct PostMutationRoot;

#[Object]
impl PostMutationRoot {
    async fn create_post(
        &self,
        ctx: &async_graphql::Context<'_>,
        #[graphql(desc = "id of user")] user_id: Uuid,
        #[graphql(desc = "post data")] post_input: Post,
    ) -> async_graphql::Result<Post> {
        let db = get_pg_connection_from_ctx(ctx)?;
        // NOTE: Normally, user id will be retrieved from session or jwt or oauth.
        // but hard code as a parameter for now.
        post_input.validate()?;
        let p = serde_json::to_value(post_input)?;
        let k = PostActiveModel::from_json(p)?.insert(db).await?;
        // let new_post = super::model::ActiveModel {
        //     user_id: sea_orm::ActiveValue::Set(user_id),
        //     title: sea_orm::ActiveValue::Set(post_input.title),
        //     content: sea_orm::ActiveValue::Set(post_input.content),
        //     ..Default::default()
        // }
        // .insert(db)
        // .await?;

        Ok(k)
    }

    async fn update_post(
        &self,
        ctx: &async_graphql::Context<'_>,
        id: Uuid,
        post_input: Post,
    ) -> async_graphql::Result<Post> {
        post_input.validate()?;
        let db = get_pg_connection_from_ctx(ctx)?;
        // // TODO: validate using async-graphql guard that the updater is the authenticated user i.e post.user_id === session/jwt.user_id
        // let mut post = Post::by_id(db, &id).await?;

        let updated_post = PostActiveModel::from_json(serde_json::to_value(post_input)?)?;
        let ost = PostEntity::find_by_id(id).one(db).await?;

        let post = PostActiveModel {
            id: Set(ost.unwrap().id),
            ..updated_post
        }
        .update(db)
        .await
        .map_err(|e| {
            ApiHttpStatus::InternalServerError(
                "Could not update your user data. Try again later".into(),
            )
            .extend()
        })?;

        Ok(post)
    }
}
