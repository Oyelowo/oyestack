/*
 * Author: Oyelowo Oyedayo
 * Email: oyelowooyedayo@gmail.com
 * Copyright (c) 2023 Oyelowo Oyedayo
 * Licensed under the MIT license
 */

// HTTP functions
// These functions can be used when opening and submitting remote web requests, and webhooks.
//
// Function	Description
// http::head()	Perform a remote HTTP HEAD request
// http::get()	Perform a remote HTTP GET request
// http::put()	Perform a remote HTTP PUT request
// http::post()	Perform a remote HTTP POST request
// http::patch()	Perform a remote HTTP PATCH request
// http::delete()	Perform a remote HTTP DELETE request

use std::collections::hash_map;

use surrealdb::sql;

use crate::{
    sql::{Binding, Buildable, Empty, ToRawStatement},
    Field,
};

use super::array::Function;

pub struct Url(sql::Value);

impl<T: Into<sql::Strand>> From<T> for Url {
    fn from(value: T) -> Self {
        let value: sql::Strand = value.into();
        Self(value.into())
    }
}

impl From<Field> for Url {
    fn from(value: Field) -> Self {
        Self(value.into())
    }
}

impl From<Url> for sql::Value {
    fn from(value: Url) -> Self {
        value.0
    }
}
pub enum Object {
    Empty,
    Object(sql::Value),
}

// impl From<Object> for sql::Value {
//     fn from(value: Object) -> Self {
//         match value {
//             Object::Empty => ,
//             Object::Object(_) => todo!(),
//         }
//     }
// }

impl From<Empty> for Object {
    fn from(value: Empty) -> Self {
        Self::Empty
    }
}

impl From<Field> for Object {
    fn from(value: Field) -> Self {
        Self::Object(value.into())
    }
}

impl<T: Into<sql::Object>> From<T> for Object {
    fn from(value: T) -> Self {
        let value: sql::Object = value.into();
        Self::Object(value.into())
    }
}

pub fn head(url: impl Into<Url>, custom_headers: impl Into<Object>) -> Function {
    let url: sql::Value = url.into().into();
    let custom_headers: Object = custom_headers.into();
    let url_binding = Binding::new(url);
    let url_parametized = url_binding.get_param_dollarised();

    let mut all_bindings = vec![url_binding];

    let string = match custom_headers {
        Object::Empty => {
            format!("http::head({})", &url_parametized)
        }
        Object::Object(headers) => {
            let header_binding = Binding::new(headers);
            let header_parametized = header_binding.get_param_dollarised();
            all_bindings.push(header_binding);

            format!("http::head({}, {})", url_parametized, header_parametized)
        }
    };

    Function {
        query_string: string,
        bindings: all_bindings,
    }
}

#[test]
fn test_head_method_with_empty_header() {
    let result = head("https://codebreather.com", Empty);
    assert_eq!(result.fine_tune_params(), "http::head($_param_00000001)");
    assert_eq!(
        result.to_raw().to_string(),
        "http::head('https://codebreather.com')"
    );
}

#[test]
fn test_field_head_method_with_empty_header() {
    let homepage = Field::new("homepage");

    let result = head(homepage, Empty);
    assert_eq!(result.fine_tune_params(), "http::head($_param_00000001)");
    assert_eq!(result.to_raw().to_string(), "http::head(homepage)");
}

#[test]
fn test_head_method_with_plain_custom_header() {
    let headers = hash_map::HashMap::from([("x-my-header".into(), "some unique string".into())]);
    let result = head("https://codebreather.com", headers);
    assert_eq!(
        result.fine_tune_params(),
        "http::head($_param_00000001, $_param_00000002)"
    );
    assert_eq!(
        result.to_raw().to_string(),
        "http::head('https://codebreather.com', { \"x-my-header\": 'some unique string' })"
    );
}

#[test]
fn test_head_method_with_field_custom_header() {
    let homepage = Field::new("homepage");
    let headers = Field::new("headers");

    let result = head(homepage, headers);
    assert_eq!(
        result.fine_tune_params(),
        "http::head($_param_00000001, $_param_00000002)"
    );
    assert_eq!(result.to_raw().to_string(), "http::head(homepage, headers)");
}
