use crate::utils::postgresdb::{get_pg_connection_from_ctx, get_pg_pool_from_ctx};

use super::{model::User, UserEntity};

use async_graphql::*;
use sea_orm::EntityTrait;
use sqlx::query_as;
use uuid::Uuid;

#[derive(Default)]
pub struct UserQueryRoot;

#[Object]
impl UserQueryRoot {
    async fn user(
        &self,
        ctx: &async_graphql::Context<'_>,
        #[graphql(desc = "id of the User")] id: Uuid,
    ) -> async_graphql::Result<User> {
        let db = get_pg_connection_from_ctx(ctx)?;

        let user = UserEntity::find_by_id(id).one(db).await?.expect("msg");

        Ok(user)
    }

    async fn users(&self, ctx: &async_graphql::Context<'_>) -> async_graphql::Result<Vec<User>> {
        let db = get_pg_pool_from_ctx(ctx)?;
        // let users = query_as::<_, User>("SELECT * FROM users").fetch_all(db).await?;
        let users = query_as!(
            User,
            r#"SELECT first_name, id, created_at, updated_at, deleted_at, username, last_name, email, age, disabled, last_login, role as "role: _" FROM users"#
        )
        .fetch_all(db)
        .await?;

        Ok(users)
    }
}
