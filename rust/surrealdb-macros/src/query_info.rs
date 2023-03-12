use std::fmt;

use crate::{query_insert::Buildable, query_remove::Runnable};

pub fn info_for() -> InfoStatement {
    InfoStatement::new()
}

// Enum representing the different levels of the SurrealDB system
enum SurrealLevel {
    Kv,
    Namespace,
    Database,
    Scope(String),
    Table(String),
}

// Struct representing the INFO statement
pub struct InfoStatement {
    level: SurrealLevel,
}

impl InfoStatement {
    fn new() -> Self {
        InfoStatement {
            level: SurrealLevel::Kv,
        }
    }

    pub fn namespace(mut self) -> Self {
        self.level = SurrealLevel::Namespace;
        self
    }

    pub fn database(mut self) -> Self {
        self.level = SurrealLevel::Database;
        self
    }

    pub fn scope(mut self, scope: &str) -> Self {
        self.level = SurrealLevel::Scope(scope.to_string());
        self
    }

    pub fn table(mut self, table: &str) -> Self {
        self.level = SurrealLevel::Table(table.to_string());
        self
    }
}
impl Buildable for InfoStatement {
    fn build(&self) -> String {
        match &self.level {
            SurrealLevel::Kv => "INFO FOR KV;".to_string(),
            SurrealLevel::Namespace => "INFO FOR NS;".to_string(),
            SurrealLevel::Database => "INFO FOR DB;".to_string(),
            SurrealLevel::Scope(scope) => format!("INFO FOR SCOPE {};", scope),
            SurrealLevel::Table(table) => format!("INFO FOR TABLE {};", table),
        }
    }
}

impl fmt::Display for InfoStatement {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.build())
    }
}

impl Runnable for InfoStatement {}

// Example usage
fn main() {
    let statement = InfoStatement::new().database().build();

    println!("{}", statement);

    // Output: "INFO FOR DB;"
}