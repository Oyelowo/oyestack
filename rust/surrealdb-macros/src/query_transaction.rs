/*
 * Author: Oyelowo Oyedayo
 * Email: oyelowooyedayo@gmail.com
 * Copyright (c) 2023 Oyelowo Oyedayo
 * Licensed under the MIT license
 */

use std::fmt::{self, Display};

use insta::{assert_debug_snapshot, assert_display_snapshot};
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use surrealdb::sql;

use crate::{
    db_field::{cond, Binding},
    query_create::CreateStatement,
    query_delete::DeleteStatement,
    query_insert::{Buildable, InsertStatement},
    query_relate::RelateStatement,
    query_remove::RemoveScopeStatement,
    query_select::SelectStatement,
    query_update::UpdateStatement,
    BindingsList, DbField, DbFilter, Parametric, Queryable,
};

pub fn begin_transaction() -> QueryTransaction {
    BeginTransaction::new()
}

fn test_tra() {
    // begin_transaction()
    //     .query(todo!())
    //     .query(todo!())
    //     .query(todo!())
    //     .query(todo!())
    //     .commit_transaction();
    //
    // begin_transaction()
    //     .query(todo!())
    //     .query(todo!())
    //     .query(todo!())
    //     .query(todo!())
    //     .cancel_transaction();
}

pub struct QueryTransaction {
    data: TransactionData,
}

impl QueryTransaction {
    pub fn query(mut self, query: impl Queryable + Parametric + Display) -> Self {
        self.data.bindings.extend(query.get_bindings());
        self.data.queries.push(query.to_string());
        self
    }

    pub fn commit_transaction(mut self) -> TransactionCompletion {
        let mut transaction = TransactionCompletion { data: self.data };
        transaction.data.transaction_completion_type =
            Some(TranctionCompletionType::CommitTransaction);
        transaction
    }

    pub fn cancel_transaction(mut self) -> TransactionCompletion {
        let mut transaction = TransactionCompletion { data: self.data };
        transaction.data.transaction_completion_type =
            Some(TranctionCompletionType::CancelTransaction);
        transaction
    }
}

pub struct BeginTransaction;

impl BeginTransaction {
    pub(crate) fn new() -> QueryTransaction {
        QueryTransaction {
            data: TransactionData {
                transaction_completion_type: None,
                queries: vec![],
                bindings: vec![],
            },
        }
    }
}

enum TranctionCompletionType {
    CommitTransaction,
    CancelTransaction,
}

pub struct TransactionData {
    transaction_completion_type: Option<TranctionCompletionType>,
    queries: Vec<String>,
    bindings: BindingsList,
}

pub struct TransactionCompletion {
    data: TransactionData,
}

impl Parametric for TransactionCompletion {
    fn get_bindings(&self) -> BindingsList {
        self.data.bindings.to_vec()
    }
}

impl Buildable for TransactionCompletion {
    fn build(&self) -> String {
        let mut output = String::new();
        output.push_str("BEGIN TRANSACTION\n");

        self.data.queries.iter().for_each(|q| {
            output.push_str(&format!("\n{}\n", q));
        });

        if let Some(completion_type) = &self.data.transaction_completion_type {
            let com_type = match completion_type {
                TranctionCompletionType::CommitTransaction => {
                    sql::statements::CommitStatement.to_string()
                }
                TranctionCompletionType::CancelTransaction => {
                    sql::statements::CancelStatement.to_string()
                }
            };
            output.push_str(&format!("\n{}\n\t", com_type));
        }

        output
    }
}

impl fmt::Display for TransactionCompletion {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.build())
    }
}

#[cfg(test)]
mod tests {
    use crate::{
        query_select::{order, select, All},
        value_type_wrappers::SurrealId,
    };

    use super::*;

    #[test]
    fn test_transaction_commit() {
        let name = DbField::new("name");
        let age = DbField::new("age");
        let country = DbField::new("country");
        let city = DbField::new("city");
        let fake_id = SurrealId::try_from("user:oyelowo").unwrap();
        let fake_id2 = SurrealId::try_from("user:oyedayo").unwrap();

        let statement1 = select(All)
            .from(fake_id)
            .where_(cond(
                city.is("Prince Edward Island")
                    .and(city.is("NewFoundland"))
                    .or(city.like("Toronto")),
            ))
            .order_by(order(&age).numeric())
            .limit(153)
            .start(10)
            .parallel();

        let statement2 = select(All)
            .from(fake_id2)
            .where_(country.is("INDONESIA"))
            .order_by(order(&age).numeric())
            .limit(20)
            .start(5);

        let transaction = begin_transaction()
            .query(statement1)
            .query(statement2)
            .commit_transaction();

        assert_debug_snapshot!(transaction.get_bindings());
        assert_display_snapshot!(transaction);
        assert_eq!(
            format!("{transaction:#}"),
"BEGIN TRANSACTION\n\nSELECT * FROM $_param_00000000 WHERE city IS $_param_00000000 AND $_param_00000000 OR $_param_00000000 ORDER BY age NUMERIC ASC LIMIT 153 START AT 10 PARALLEL;\n\nSELECT * FROM $_param_00000000 WHERE country IS $_param_00000000 ORDER BY age NUMERIC ASC LIMIT 20 START AT 5;\n\nCOMMIT TRANSACTION\n\t"
        );
    }

    fn test_transaction_cancel() {
        let name = DbField::new("name");
        let age = DbField::new("age");
        let country = DbField::new("country");
        let city = DbField::new("city");
        let fake_id = SurrealId::try_from("user:oyelowo").unwrap();
        let fake_id2 = SurrealId::try_from("user:oyedayo").unwrap();

        let statement1 = select(All)
            .from(fake_id)
            .where_(cond(
                city.is("Prince Edward Island")
                    .and(city.is("NewFoundland"))
                    .or(city.like("Toronto")),
            ))
            .order_by(order(&age).numeric())
            .limit(153)
            .start(10)
            .parallel();

        let statement2 = select(All)
            .from(fake_id2)
            .where_(country.is("INDONESIA"))
            .order_by(order(&age).numeric())
            .limit(20)
            .start(5);

        let transaction = begin_transaction()
            .query(statement1)
            .query(statement2)
            .cancel_transaction();

        assert_debug_snapshot!(transaction.get_bindings());
        assert_display_snapshot!(transaction);
        assert_eq!(
            format!("{transaction:#}"),
"BEGIN TRANSACTION\n\nSELECT * FROM $_param_00000000 WHERE city IS $_param_00000000 AND $_param_00000000 OR $_param_00000000 ORDER BY age NUMERIC ASC LIMIT 153 START AT 10 PARALLEL;\n\nSELECT * FROM $_param_00000000 WHERE country IS $_param_00000000 ORDER BY age NUMERIC ASC LIMIT 20 START AT 5;\n\nCOMMIT TRANSACTION\n\t"
        );
    }
}
