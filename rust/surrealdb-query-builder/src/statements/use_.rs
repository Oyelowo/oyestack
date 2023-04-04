/*
 * Author: Oyelowo Oyedayo
 * Email: oyelowooyedayo@gmail.com
 * Copyright (c) 2023 Oyelowo Oyedayo
 * Licensed under the MIT license
 */

use std::fmt::Display;

use crate::{
    traits::{BindingsList, Buildable, Erroneous, Parametric, Queryable},
    types::{Database, Namespace},
};

pub fn use_() -> UseStatement {
    UseStatement::default()
}

#[derive(Default)]
pub struct UseStatement {
    namespace: Option<Namespace>,
    database: Option<Database>,
}

impl UseStatement {
    pub fn namespace(mut self, namespace: impl Into<Namespace>) -> Self {
        self.namespace = Some(namespace.into());
        self
    }

    pub fn database(mut self, database: impl Into<Database>) -> Self {
        self.database = Some(database.into());
        self
    }
}

impl Buildable for UseStatement {
    fn build(&self) -> String {
        let mut query = String::from("USE");

        if let Some(database) = &self.database {
            query.push_str(&format!(" DB {database}"));
        }

        if let Some(namespace) = &self.namespace {
            query.push_str(&format!(" NS {namespace}"));
        }

        query.push_str(";");

        query
    }
}

impl Display for UseStatement {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.build())
    }
}

impl Queryable for UseStatement {}

impl Erroneous for UseStatement {}

impl Parametric for UseStatement {
    fn get_bindings(&self) -> BindingsList {
        vec![]
    }
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn test_use_statement() {
        assert_eq!(
            use_().database(Database::from("root".to_string())).build(),
            "USE DB root;"
        );
        assert_eq!(
            use_()
                .namespace(Namespace::from("mars".to_string()))
                .to_string(),
            "USE NS mars;"
        );

        assert_eq!(
            use_()
                .database(Database::from("root".to_string()))
                .namespace(Namespace::from("mars".to_string()))
                .build(),
            "USE DB root NS mars;"
        );
    }
}
