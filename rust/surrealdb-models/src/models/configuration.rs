use std::fmt::Display;

use serde::{Deserialize, Serialize};
use surrealdb_orm::SurrealdbObject;

// Configuration
#[derive(SurrealdbObject, Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct Configuration {
    length: u64,
    #[surrealdb(type = "string")]
    shape: Shape,
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy, Default)]
pub enum Shape {
    #[default]
    Circle,
    Square,
    Triangle,
}

impl From<Shape> for String {
    fn from(value: Shape) -> Self {
        value.to_string()
    }
}

impl Display for Shape {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Shape::Circle => write!(f, "circle"),
            Shape::Square => write!(f, "square"),
            Shape::Triangle => write!(f, "triangle"),
        }
    }
}
