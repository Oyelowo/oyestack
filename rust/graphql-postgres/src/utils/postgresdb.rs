use async_graphql::{Context, ErrorExtensions};
use common::error_handling::ApiHttpStatus;
use log::warn;
use sqlx::PgPool;

pub fn get_pg_pool_from_ctx<'a>(ctx: &'a Context<'_>) -> async_graphql::Result<&'a PgPool> {
    ctx.data::<PgPool>().map_err(|e| {
        warn!("{e:?}");
        ApiHttpStatus::InternalServerError(
            "Something went wrong while fetching your data. Please try again later".into(),
        )
        .extend()
    })
}
