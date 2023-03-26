/*
 * Author: Oyelowo Oyedayo
 * Email: oyelowooyedayo@gmail.com
 * Copyright (c) 2023 Oyelowo Oyedayo
 * Licensed under the MIT license
 */

pub use surrealdb_derive::*;

// pub use surrealdb_query_builder::*;

use surrealdb_query_builder::utils::cond;
pub use surrealdb_query_builder::{
    field, filter, json, links, model_id, query as statements,
    sql::{self, All, ToRawStatement},
    utils, BindingsList, Clause, Erroneous, ErrorList, Field, Operatable, Parametric, RecordId,
    Schemaful, SurrealdbEdge, SurrealdbModel, SurrealdbNode, Table, Value,
};

#[test]
fn mananana() {
    let email = Field::new("email");
    let xx = statements::select(All)
        .where_(cond(email.like("@oyelowo")).and(email.is("Oyedayo")))
        .group_by(email)
        .parallel()
        .to_raw();

    insta::assert_display_snapshot!(xx);
}
