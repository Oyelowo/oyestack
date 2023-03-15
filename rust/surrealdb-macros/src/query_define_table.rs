/*
 * Author: Oyelowo Oyedayo
 * Email: oyelowooyedayo@gmail.com
 * Copyright (c) 2023 Oyelowo Oyedayo
 * Licensed under the MIT license
 */

use std::{
    fmt::{self, Display},
    ops::Deref,
};

use insta::{assert_debug_snapshot, assert_display_snapshot};
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use surrealdb::sql::{self, statements::DefineStatement};

use crate::{
    db_field::{cond, Binding},
    query_create::CreateStatement,
    query_define_index::Table,
    query_define_token::{Name, Scope},
    query_delete::DeleteStatement,
    query_ifelse::Expression,
    query_insert::{Buildable, InsertStatement},
    query_relate::RelateStatement,
    query_remove::{Event, RemoveScopeStatement, Runnable},
    query_select::{Duration, SelectStatement},
    query_update::UpdateStatement,
    BindingsList, DbField, DbFilter, Parametric, Queryable,
};

// DEFINE TABLE statement
// The DEFINE TABLE statement allows you to declare your table by name, enabling you to apply strict controls to a table's schema by making it SCHEMAFULL, create a foreign table view, and set permissions specifying what operations can be performed on the field.
//
// Requirements
// You must be authenticated as a root, namespace, or database user before you can use the DEFINE TABLE statement.
// You must select your namespace and database before you can use the DEFINE TABLE statement.
// Statement syntax
// DEFINE TABLE @name
// 	[ DROP ]
// 	[ SCHEMAFULL | SCHEMALESS ]
// 	[ AS SELECT @projections
// 		FROM @tables
// 		[ WHERE @condition ]
// 		[ GROUP [ BY ] @groups ]
// 	]
// 	[ PERMISSIONS [ NONE | FULL
// 		| FOR select @expression
// 		| FOR create @expression
// 		| FOR update @expression
// 		| FOR delete @expression
// 	] ]
// Example usage
// The following expression shows the simplest way to use the DEFINE TABLE statement.
//
// -- Declare the name of a table.
// DEFINE TABLE reading;
// The following example uses the DROP portion of the DEFINE TABLE statement. This would be like telling the database to drop any table that has the given name and replace it with a new one of the same name.
//
// -- Drop the table if it exists and create a new one with the same name.
// DEFINE TABLE reading DROP;
// The following example demonstrates the SCHEMAFULL portion of the DEFINE TABLE statement. When a table is defined as schemafull, the database strictly enforces any schema definitions that are specified using the DEFINE TABLE statement. New fields can not be added to a SCHEMAFULL table unless they are defined via the DEFINE FIELD statement.
//
// -- Create schemafull user table.
// DEFINE TABLE user SCHEMAFULL;

// -- Create schemaless user table.
// DEFINE TABLE user SCHEMALESS;
//
// -- Define a table as a view which aggregates data from the reading table
// DEFINE TABLE temperatures_by_month AS
// 	SELECT
// 		count() AS total,
// 		time::month(recorded_at) AS month,
// 		math::mean(temperature) AS average_temp
// 	FROM reading
// 	GROUP BY city
// ;
//
// -- SEE IT IN ACTION
// -- 1: Add a new temperature reading with some basic attributes
// CREATE reading SET
// 	temperature = 27.4,
// 	recorded_at = time::now(),
// 	city = 'London',
// 	location = (-0.118092, 51.509865)
// ;
//
// -- 2: Query the projection
// SELECT * FROM temperatures_by_month;
// The following shows how to set table level PERMISSIONS using the DEFINE TABLE statement. This allows you to set independent permissions for selecting, creating, updating, and deleting data.
//
// -- Specify access permissions for the 'post' table
// DEFINE TABLE post SCHEMALESS
// 	PERMISSIONS
// 		FOR select
// 			-- Published posts can be selected
// 			WHERE published = true
// 			-- A user can select all their own posts
// 			OR user = $auth.id
// 		FOR create, update
// 			-- A user can create or update their own posts
// 			WHERE user = $auth.id
// 		FOR delete
// 			-- A user can delete their own posts
// 			WHERE user = $auth.id
// 			-- Or an admin can delete any posts
// 			OR $auth.admin = true
// ;
//

pub struct DefineTableStatement {
    table_name: String,
    drop: Option<bool>,
    schema_type: Option<SchemaType>,
    as_select: Option<String>,
    permissions_none: Option<bool>,
    permissions_full: Option<bool>,
    permissions_for: Vec<String>,
    bindings: BindingsList,
}

pub fn define_table(table_name: impl Into<Table>) -> DefineTableStatement {
    let table: Table = table_name.into();
    DefineTableStatement {
        table_name: table.to_string(),
        drop: None,
        schema_type: None,
        as_select: None,
        permissions_none: None,
        permissions_full: None,
        permissions_for: vec![],
        bindings: vec![],
    }
}

impl DefineTableStatement {
    pub fn drop(mut self) -> Self {
        self.drop = Some(true);
        self
    }

    pub fn schemafull(mut self) -> Self {
        self.schema_type = Some(SchemaType::Schemafull);
        self
    }

    pub fn schemaless(mut self) -> Self {
        self.schema_type = Some(SchemaType::Schemaless);
        self
    }

    pub fn as_select(mut self, select_statement: impl Into<SelectStatement>) -> Self {
        let statement: SelectStatement = select_statement.into();
        self.as_select = Some(statement.to_string());
        self.bindings.extend(statement.get_bindings());
        self
    }

    pub fn permissions_none(mut self) -> Self {
        self.permissions_none = Some(true);
        self
    }

    pub fn permissions_full(mut self) -> Self {
        self.permissions_full = Some(true);
        self
    }

    pub fn permissions_for(mut self, fors: impl Into<PermisisonForables>) -> Self {
        let fors: PermisisonForables = fors.into();
        match fors {
            PermisisonForables::For(one) => {
                self.permissions_for.push(one.to_string());
                self.bindings.extend(one.get_bindings());
            }
            PermisisonForables::Fors(many) => many.iter().for_each(|f| {
                self.permissions_for.push(f.to_string());
                self.bindings.extend(f.get_bindings());
            }),
        }
        self
    }
}

// Statement syntax
// DEFINE TABLE @name
// 	[ DROP ]
// 	[ SCHEMAFULL | SCHEMALESS ]
// 	[ AS SELECT @projections
// 		FROM @tables
// 		[ WHERE @condition ]
// 		[ GROUP [ BY ] @groups ]
// 	]
// 	[ PERMISSIONS [ NONE | FULL
// 		| FOR select @expression
// 		| FOR create @expression
// 		| FOR update @expression
// 		| FOR delete @expression
// 	] ]
impl Buildable for DefineTableStatement {
    fn build(&self) -> String {
        let mut query = format!("DEFINE TABLE {}", &self.table_name);

        if self.drop.unwrap_or_default() {
            query = format!("{query} DROP");
        }

        match self.schema_type {
            Some(SchemaType::Schemafull) => {
                query = format!("{query} SCHEMAFULL");
            }
            Some(SchemaType::Schemaless) => {
                query = format!("{query} SCHEMALESS");
            }
            None => {}
        };

        if let Some(true) = self.permissions_none {
            query = format!("{query} PERMISSIONS NONE");
        } else if let Some(true) = self.permissions_full {
            query = format!("{query} PERMISSIONS FULL");
        } else if !&self.permissions_for.is_empty() {
            query = format!(
                "{query} PERMISSIONS\n\t\t{}",
                self.permissions_for.join("\n")
            );
        }
        query.push_str("\n;");

        query
    }
}

impl Display for DefineTableStatement {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.build())
    }
}

impl Runnable for DefineTableStatement {}

impl Queryable for DefineTableStatement {}

impl Parametric for DefineTableStatement {
    fn get_bindings(&self) -> BindingsList {
        self.bindings.to_vec()
    }
}

#[derive(Clone, Copy)]
pub enum ForCrudType {
    Create,
    Select,
    Update,
    Delete,
}

impl Display for ForCrudType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let crud_type = match self {
            ForCrudType::Create => "create",
            ForCrudType::Select => "select",
            ForCrudType::Update => "update",
            ForCrudType::Delete => "delete",
        };
        write!(f, "{}", crud_type)
    }
}

struct ForData {
    crud_types: Vec<ForCrudType>,
    condition: Option<DbFilter>,
    bindings: BindingsList,
}

impl Parametric for For {
    fn get_bindings(&self) -> BindingsList {
        self.0.bindings.to_vec()
    }
}

#[derive(Clone)]
pub enum ForArgs {
    ForOption(ForCrudType),
    ForOptions(Vec<ForCrudType>),
}
impl From<ForCrudType> for ForArgs {
    fn from(value: ForCrudType) -> Self {
        Self::ForOption(value)
    }
}

impl From<Vec<ForCrudType>> for ForArgs {
    fn from(value: Vec<ForCrudType>) -> Self {
        Self::ForOptions(value)
    }
}
impl From<ForArgs> for Vec<ForCrudType> {
    fn from(value: ForArgs) -> Self {
        match value {
            ForArgs::ForOption(one) => vec![one],
            ForArgs::ForOptions(many) => many,
        }
    }
}

impl<'a, const N: usize> From<&[ForCrudType; N]> for ForArgs {
    fn from(value: &[ForCrudType; N]) -> Self {
        Self::ForOptions(value.to_vec())
    }
}

pub struct ForStart(ForData);

impl ForStart {
    pub fn where_(mut self, condition: impl Into<DbFilter>) -> For {
        let condition: DbFilter = condition.into();
        self.0.condition = Some(condition.clone());
        self.0.bindings.extend(condition.get_bindings());
        For(self.0)
    }
}

pub fn for_(for_crud_types: impl Into<ForArgs>) -> ForStart {
    ForStart(ForData {
        crud_types: for_crud_types.into().into(),
        condition: None,
        bindings: vec![],
    })
}
pub struct For(ForData);

impl Buildable for For {
    fn build(&self) -> String {
        let mut query = format!("FOR");
        if !&self.0.crud_types.is_empty() {
            query = format!(
                "{query} {}",
                &self
                    .0
                    .crud_types
                    .iter()
                    .map(|ct| {
                        let ct = ct.to_string();
                        ct
                    })
                    .collect::<Vec<_>>()
                    .join(", ")
            );
        }

        if let Some(cond) = &self.0.condition {
            query = format!("{query}\n\tWHERE {cond}");
        }
        query
    }
}

impl Display for For {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.build())
    }
}

pub enum PermisisonForables {
    For(For),
    Fors(Vec<For>),
}

impl From<For> for PermisisonForables {
    fn from(value: For) -> Self {
        Self::For(value)
    }
}

impl From<Vec<For>> for PermisisonForables {
    fn from(value: Vec<For>) -> Self {
        Self::Fors(value)
    }
}

enum SchemaType {
    Schemafull,
    Schemaless,
}

#[cfg(test)]
mod tests {

    use std::time::Duration;

    use crate::{
        query_remove::Table,
        query_select::{select, All},
        value_type_wrappers::SurrealId,
    };

    use super::*;

    #[test]
    fn test_define_for_statement_state_machine() {
        let name = DbField::new("name");

        let for_res = for_(ForCrudType::Create).where_(name.like("Oyelowo"));
        assert_eq!(
            for_res.to_string(),
            "FOR create\n\tWHERE name ~ $_param_00000000".to_string()
        );
        insta::assert_display_snapshot!(for_res);
        insta::assert_debug_snapshot!(for_res.get_bindings());
    }

    #[test]
    fn test_define_for_statement_state_machine_multiple() {
        use ForCrudType::*;
        let name = DbField::new("name");

        let for_res = for_(&[Create, Delete, Select, Update]).where_(name.is("Oyedayo"));
        assert_eq!(
            for_res.to_string(),
            "FOR create, delete, select, update\n\tWHERE name IS $_param_00000000".to_string()
        );
        insta::assert_display_snapshot!(for_res);
        insta::assert_debug_snapshot!(for_res.get_bindings());
    }
}
