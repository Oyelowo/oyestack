use super::model::Post;

use async_graphql::*;
use bson::oid::ObjectId;
use lib_common::error_handling::ApiHttpStatus;
use futures_util::TryStreamExt;
use log::warn;
use lib_my_macros::FieldsGetter;

#[derive(Default)]
pub struct PostQueryRoot;

#[Object]
impl PostQueryRoot {
    async fn post(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "id of the Post")] id: uuid::Uuid,
    ) -> Result<Post> {
        // let db = get_db_from_ctx(ctx)?;
        todo!();
    }

    async fn posts(&self, ctx: &Context<'_>) -> Result<Vec<Post>> {
        // let db = get_db_from_ctx(ctx)?;
        todo!()
    }
}
