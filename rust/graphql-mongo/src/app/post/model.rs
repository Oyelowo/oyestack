use async_graphql::*;

use common::error_handling::ApiHttpStatus;
use mongodb::bson::{doc, oid::ObjectId};
use my_macros::FieldsGetter;
use serde::{Deserialize, Serialize};
use typed_builder::TypedBuilder;
use validator::Validate;
use wither::Model;

use crate::{app::user::User, utils::mongodb::get_db_from_ctx};

#[derive(
    FieldsGetter,
    Model,
    SimpleObject,
    InputObject,
    Clone,
    Serialize,
    Deserialize,
    TypedBuilder,
    Validate,
    Debug,
)]
#[serde(rename_all = "camelCase")]
#[graphql(input_name = "PostInput")]
#[graphql(complex)]
pub struct Post {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[builder(default)]
    #[graphql(skip_input)]
    pub id: Option<ObjectId>,

    // This will usually come from session/jwt token / oauth token
    #[graphql(skip_input)]
    pub poster_id: ObjectId,

    #[validate(length(min = 1))]
    pub title: String,

    #[validate(length(min = 1))]
    pub content: String,
}

#[ComplexObject]
impl Post {
    async fn poster(&self, ctx: &Context<'_>) -> Result<User> {
        let db = get_db_from_ctx(ctx)?;
        let post_keys = Post::get_fields_serialized();

        User::collection(db)
            .find_one(doc! {post_keys._id: self.poster_id}, None)
            .await?
            .ok_or_else(|| ApiHttpStatus::NotFound("".into()))
            .extend()
    }
}
