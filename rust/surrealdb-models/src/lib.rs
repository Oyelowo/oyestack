/*
 * Author: Oyelowo Oyedayo
 * Email: oyelowooyedayo@gmail.com
 * Copyright (c) 2023 Oyelowo Oyedayo
 * Licensed under the MIT license
 */

#![allow(dead_code)]
#![allow(non_upper_case_globals)]
#![allow(non_snake_case)]
#![allow(non_camel_case_types)]
#![allow(unused_imports)]

use _core::time::Duration;
use insta;
use regex;
use serde::{Deserialize, Serialize};
use static_assertions::*;
use surrealdb::{
    engine::local::{Db, Mem},
    opt::IntoResource,
    sql::Id,
    Result, Surreal,
};
// use surrealdb_derive::{SurrealdbEdge, SurrealdbNode};

use std::fmt::{Debug, Display};
use surrealdb_orm::{
    links::{LinkMany, LinkOne, LinkSelf, Relate},
    sql::{All, SurrealId},
    statements::{
        define_table, order, select, DefineTableStatement, For, ForCrudType, SelectStatement,
    },
    utils::for_,
    Field, Operatable, RecordId, SurrealdbEdge, SurrealdbModel, SurrealdbNode, Table,
};

use test_case::test_case;
use typed_builder::TypedBuilder;

fn gama() -> SelectStatement {
    // All
    select(All)
}
fn full() -> u32 {
    54
}
fn perm() -> Vec<For> {
    use ForCrudType::*;
    let name = Field::new("name");
    let age = Field::new("age");
    vec![
        for_(&[Create, Delete]).where_(name.is("Oyedayo")),
        for_(Update).where_(age.less_than_or_equal(130)),
    ]
}

fn define_student() -> DefineTableStatement {
    use ForCrudType::*;
    let name = Field::new("name");
    let user_table = Table::from("user");
    let age = Field::new("age");
    let country = Field::new("country");
    let fake_id2 = SurrealId::try_from("user:oyedayo").unwrap();

    let statement = define_table(Student::table_name())
        .drop()
        .as_select(
            select(All)
                .from(fake_id2)
                .where_(country.is("INDONESIA"))
                .order_by(order(&age).numeric().desc())
                .limit(20)
                .start(5),
        )
        .schemafull()
        .permissions_for(for_(Select).where_(age.greater_than_or_equal(18))) // Single works
        .permissions_for(for_(&[Create, Delete]).where_(name.is("Oyedayo"))) //Multiple
        .permissions_for(&[
            for_(&[Create, Delete]).where_(name.is("Oyedayo")),
            for_(Update).where_(age.less_than_or_equal(130)),
        ]);

    statement
}
#[derive(SurrealdbNode, TypedBuilder, Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
#[surrealdb(
    table_name = "student",
    drop,
    schemafull,
    as_select = "select(All)",
    permissions = "perm()",
    define = "define_student()"
)]
pub struct Student {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[builder(default, setter(strip_option))]
    id: Option<SurrealId>,

    first_name: String,
    last_name: String,
    #[surrealdb(
        type = "string",
        default = "5",
        assert = "45 + 5",
        define = "define_age"
    )]
    age: u8,

    #[surrealdb(link_self = "Student")]
    best_friend: LinkSelf<Student>,

    #[surrealdb(link_one = "Book")]
    #[serde(rename = "unoBook")]
    fav_book: LinkOne<Book>,

    #[surrealdb(link_one = "Book", skip_serializing)]
    course: LinkOne<Book>,

    #[surrealdb(link_many = "Book")]
    #[serde(rename = "semCoures")]
    all_semester_courses: LinkMany<Book>,

    #[surrealdb(relate(model = "StudentWritesBook", connection = "->writes->book"))]
    #[serde(skip_serializing)]
    written_books: Relate<Book>,
}
#[test]
fn xama() {
    assert_eq!(Student::define_table().to_string(), "re".to_string());
}

#[derive(SurrealdbEdge, TypedBuilder, Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
#[surrealdb(table_name = "writes")]
pub struct Writes<In: SurrealdbNode, Out: SurrealdbNode> {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[builder(default, setter(strip_option))]
    pub id: Option<SurrealId>,

    #[serde(rename = "in")]
    pub in_: LinkOne<In>,
    pub out: LinkOne<Out>,
    pub time_written: Duration,
}

pub type StudentWritesBook = Writes<Student, Book>;

#[derive(SurrealdbNode, TypedBuilder, Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
#[surrealdb(table_name = "book")]
pub struct Book {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[builder(default, setter(strip_option))]
    id: Option<SurrealId>,
    title: String,
    content: String,
}

#[derive(SurrealdbNode, TypedBuilder, Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[surrealdb(table_name = "blog")]
pub struct Blog {
    #[serde(skip_serializing_if = "Option::is_none")]
    #[builder(default, setter(strip_option))]
    id: Option<SurrealId>,
    title: String,
    content: String,
}

trait WhiteSpaceRemoval {
    fn remove_extra_whitespace(&self) -> String
    where
        Self: std::borrow::Borrow<str>,
    {
        let mut result = String::with_capacity(self.borrow().len());
        let mut last_char_was_whitespace = true;

        for c in self.borrow().chars() {
            if c.is_whitespace() {
                if !last_char_was_whitespace {
                    result.push(' ');
                    last_char_was_whitespace = true;
                }
            } else {
                result.push(c);
                last_char_was_whitespace = false;
            }
        }

        result
    }
}
impl WhiteSpaceRemoval for &str {}
impl WhiteSpaceRemoval for String {}

// macro_rules! sql {
//     ($($item:tt)*) => {{
//         let valid_tokens = ["SELECT", "WHERE"];
//         let mut exprs = vec![];
//         $(
//             match stringify!($item) {
//                 $(
//                     x if x == valid_tokens[0] => {
//                         exprs.push(syn::parse_str(x).unwrap());
//                     }
//                 )*
//                 $(
//                     x if x == valid_tokens[1] => {
//                         exprs.push(syn::parse_str(x).unwrap());
//                     }
//                 )*
//                 _ => {
//                     exprs.push(syn::parse_str(stringify!($item)).unwrap_or_else(|_| {
//                         compile_error!(concat!("Invalid expression or token: ", stringify!($item)))
//                     }));
//                 }
//             }
//         )*
//         exprs
//     }};
// }

use serde_json::{Map, Value};

// fn remove_field_from_json_string(json_string: &str, field_name: &str) -> String {
//     let value: Value = serde_json::from_str(json_string).expect("Invalid JSON string");
//
//     let mut map = match value {
//         Value::Object(map) => map,
//         _ => panic!("Expected a JSON object"),
//     };
//
//     map.remove(field_name);
//
//     serde_json::to_string(&Value::Object(map)).expect("Failed to serialize JSON value")
// }

fn remove_field_from_json_string(json_string: &str, field_name: &str) -> String {
    let value: Value = serde_json::from_str(json_string).expect("Invalid JSON string");

    let updated_value = match value {
        Value::Object(mut map) => {
            map.remove(field_name);
            Value::Object(map)
        }
        Value::Array(mut vec) => {
            for element in vec.iter_mut() {
                if let Value::Object(ref mut map) = *element {
                    map.remove(field_name);
                }
            }
            Value::Array(vec)
        }
        _ => value,
    };

    serde_json::to_string(&updated_value).expect("Failed to serialize JSON value")
}