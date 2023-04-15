/*
 * Author: Oyelowo Oyedayo
 * Email: oyelowooyedayo@gmail.com
 * Copyright (c) 2023 Oyelowo Oyedayo
 * Licensed under the MIT license
 */

#![warn(missing_docs)]
#![warn(missing_doc_code_examples)]
#![forbid(unsafe_code)]

//! # Surrealdb-orm is a hyper expressive and intuitive query builder and ORM for surrealdb implemented in Rust.
//! If you know raw SurrealQl, you know Surrealdb-Orm.
//!
//! <div align="center">
//! <!-- CI -->
//! <img src="https://github.com/oyelowo/surrealdb-orm/workflows/CI/badge.svg" />
//! <!-- codecov -->
//! <img src="https://codecov.io/gh/surrealdb-orm/surrealdb-orm/branch/master/graph/badge.svg" />
//! <!-- Crates version -->
//! <a href="https://crates.io/crates/surrealdb-orm">
//! <img src="https://img.shields.io/crates/v/surrealdb-orm.svg?style=flat-square"
//! alt="Crates.io version" />
//! </a>
//! <!-- Downloads -->
//! <a href="https://crates.io/crates/surrealdb-orm">
//! <img src="https://img.shields.io/crates/d/surrealdb-orm.svg?style=flat-square"
//! alt="Download" />
//! </a>
//! <!-- docs.rs docs -->
//! <a href="https://docs.rs/surrealdb-orm">
//! <img src="https://img.shields.io/badge/docs-latest-blue.svg?style=flat-square"
//! alt="docs.rs docs" />
//! </a>
//! <a href="https://github.com/rust-secure-code/safety-dance/">
//! <img src="https://img.shields.io/badge/unsafe-forbidden-success.svg?style=flat-square"
//! alt="Unsafe Rust forbidden" />
//! </a>
//! </div>
//!
//! ## Documentation
//!
//! * [Book](https://surrealdb-orm.github.io/surrealdb-orm/en/index.html)
//! * [fr-placeholder](https://surrealdb-orm.github.io/surrealdb-orm/fr/index.html)
//! * [Docs](https://docs.rs/surrealdb-orm)
//! * [GitHub repository](https://github.com/oyelowo/surrealdb-orm)
//! * [Cargo package](https://crates.io/crates/surrealdb-orm)
//! * Minimum supported Rust version: 1.60.0 or later
//!
//! # Table of contents
//!
//! - [Features](#high-level-features)
//! - [Getting Started](#getting-started)
//! - [Example](#example)
//! - [Surrealdb Model](#surrealdb-model)
//! - [Surrealdb Node](#Node)
//! - [Surrealdb Edge](#surrealdb-edge)
//! - [Surrealdb Object](#surrealdb-object)
//! - [Query Execution](#query-execution)
//! - [Examples](#examples)
//!
//!
//!
//! ## Features
//!
//! * Fully supports for surrealdb specifications
//! * Compile-time Type safety
//! * Intuitive, innovative and idiomatic API. If you know surrealql, you know surrealdb-orm
//! * Rustfmt friendly (Procedural Macro)
//! * Complex query of any nesting level
//! * Automatic parameter binding and sql injection handling
//! * Automatic Struct mapping for insert statement parameters
//! * Automatic return type for query return types
//! * Fully typed dynamic filterable graph building of any depth
//! * Fully typed dynamic filterable node
//! * Fully typed nested filterable object
//! * Fully compile-time checked schema type definition
//! * Complex Transaction
//! * Query Chaining
//! * All surrealdb Statements including:
//! USE, LET, BEGIN, CANCEL, COMMIT, IF ELSE, SELECT, INSERT, CREATE, UPDATE, RELATE,
//! DELETE, DEFINE, REMOVE, INFO, SLEEP
//! * Query execution
//! * All Surrealdb Operators e.g CONTAINSALL, INTERSECTS, == etc
//! * Array functions
//! * Count function
//! * Crypto functions
//! * Geo functions
//! * HTTP functions
//! * Validation functions
//! * Math functions
//! * Meta functions
//! * Parse functions
//! * Rand functions
//! * Session functions
//! * Sleep function
//! * String functions
//! * Time functions
//! * Type functions
//! * Scripting functions
//! * All Surrealdb types
//! * Surrealdb parameters
//! * All Surrealdb cast functions
//!
//! ## Getting Started
//! ## How to Install
//!```cargo.toml
//! [dependencies]
//! surrealdb-orm = "1.0"!
//!```
//!
//! ## Integrations
//!
//! * Surrealdb [surrealdb](https://crates.io/crates/surrealdb)
//!
//! ## License
//!
//! Licensed under either of
//!
//! * Apache License, Version 2.0,
//! (./LICENSE-APACHE or <http://www.apache.org/licenses/LICENSE-2.0>)
//! * MIT license (./LICENSE-MIT or <http://opensource.org/licenses/MIT>)
//! at your option.
//!
//! ## References
//!
//! * [Surrealdb](https://surrealdb.com)
//!
//! ## Examples
//!
//! All examples are in the [sub-repository](https://github.com/oyelowo/surrealdb-orm/examples), located in the examples directory.
//!
//! **Run an example:**
//!
//! ```shell
//! git submodule update # update the examples repo
//! cd examples && cargo run --bin [name]
//! ```
//!
//! ## Benchmarks
//!
//! Ensure that there is no CPU-heavy process in background!
//!
//! ```shell script
//! cd benchmark
//! cargo bench
//! ```
//!
//! Now a HTML report is available at `benchmark/target/criterion/report`.
pub use surrealdb_derive::*;
pub use surrealdb_query_builder::*;

#[test]
fn test_orm_basic() {
    let email = Field::new("email");
    let select_statement = statements::select(All)
        .where_(cond(email.like("@oyelowo")).and(email.is("Oyedayo")))
        .group_by(email)
        .parallel()
        .to_raw();

    self::functions::geo::hash::decode!("RE".to_string());
    insta::assert_display_snapshot!(select_statement);
}
