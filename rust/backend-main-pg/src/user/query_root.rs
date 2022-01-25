use super::model::User;

use async_graphql::*;
use sqlx::{PgPool, Pool, Postgres};
use uuid::Uuid;

#[derive(Default)]
pub struct UserQueryRoot;

#[Object]
impl UserQueryRoot {
    async fn user(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "id of the User")] id: Uuid,
    ) -> anyhow::Result<User> {
        let db = ctx.data_unchecked::<PgPool>();

        let user = User::get_by_id(db, &id).await?;

        Ok(user)
    }

    async fn users(&self, ctx: &Context<'_>) -> anyhow::Result<Vec<User>> {
        let db = ctx.data_unchecked::<PgPool>();
        let users = ormx::conditional_query_as!(User, r#"SELECT * FROM users"#)
            .fetch_all(db)
            .await?;

        Ok(users)
    }
}
