/*
 * Author: Oyelowo Oyedayo
 * Email: oyelowooyedayo@gmail.com
 * Copyright (c) 2023 Oyelowo Oyedayo
 * Licensed under the MIT license
 */

use serde::Serialize;
use surrealdb::{
    opt::RecordId,
    sql::{Id, Thing, Uuid},
};

use crate::{
    types::{NodeClause, Table},
    Alias,
};

use super::Raw;

// SurrealdbModel is a market trait signifying superset of SurrealdbNode and SurrealdbEdge. IOW, both are
pub trait SurrealdbModel {
    // fn table_name() -> surrealdb::sql::Table;
    fn table_name() -> Table;
    fn get_serializable_field_names() -> Vec<&'static str>;
    fn define_table() -> Raw;
    fn define_fields() -> Vec<Raw>;

    /// Create a new SurrealId from a string
    fn create_id(id: impl Into<Id>) -> Thing {
        Thing::from((Self::table_name().to_string(), id.into()))
    }

    fn create_uuid() -> Thing {
        Thing::from((Self::table_name().to_string(), Uuid::new_v4().to_string()))
    }
}

pub trait SurrealdbNode: SurrealdbModel + Serialize {
    type Schema;
    type Aliases;
    type TableNameChecker;
    fn schema() -> Self::Schema;
    fn aliases() -> Self::Aliases;
    // fn get_key<T: Into<RecordId>>(&self) -> ::std::option::Option<&T>;
    fn get_key<T: From<RecordId>>(self) -> Option<T>;
    // fn get_table_name() -> surrealdb::sql::Table;
    fn get_table_name() -> Table;
    fn with(clause: impl Into<NodeClause>) -> Self::Schema;

    fn get_fields_relations_aliased() -> Vec<Alias>;
}

pub trait SurrealdbEdge: SurrealdbModel + Serialize {
    type In;
    type Out;
    type TableNameChecker;
    type Schema;

    fn schema() -> Self::Schema;
    // fn get_key(&self) -> ::std::option::Option<&SurId>;
    fn get_key<T: From<RecordId>>(self) -> Option<T>;
    // fn get_table_name() -> surrealdb::sql::Table;
    fn get_table_name() -> Table;
}

pub trait SurrealdbObject: Serialize {
    type Schema;
    fn schema() -> Self::Schema;
    // fn with(clause: impl Into<Clause>) -> Self::Schema;
}

pub type ErrorList = Vec<String>;
pub trait Erroneous {
    fn get_errors(&self) -> ErrorList {
        vec![]
    }
}
