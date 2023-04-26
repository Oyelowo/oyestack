use std::time::Duration;

use chrono::{DateTime, Utc};
use geo::point;
use geo::polygon;
use geo::Point;
use geo::Polygon;
use serde::{Deserialize, Serialize};
use surrealdb::sql;
use surrealdb_orm::{statements::create, *};

#[derive(SurrealdbNode, Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[surrealdb(table_name = "alien")]
pub struct Alien {
    id: Option<sql::Thing>,
    name: String,
    age: u8,
    created: DateTime<Utc>,
    life_expectancy: Duration,
    territory_area: Polygon,
    home: Point,
    tags: Vec<String>,
    // database type attribute is autogenerated for all links of the struct. But you can also provide it
    #[surrealdb(link_self = "Alien", type = "record(alien)")]
    ally: LinkSelf<Alien>,

    #[surrealdb(link_one = "Weapon", type = "record(weapon)")]
    weapon: LinkOne<Weapon>,

    // Again, we dont have to provide the type attribute, it can auto detect
    #[surrealdb(
        link_many = "SpaceShip",
        type = "array",
        content_type = "record(space_ship)"
    )]
    space_ships: LinkMany<SpaceShip>,
}

#[derive(SurrealdbEdge, Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[surrealdb(table_name = "visits")]
pub struct Visits<In: SurrealdbNode, Out: SurrealdbNode> {
    id: Option<sql::Thing>,
    #[serde(rename = "in")]
    in_: LinkOne<In>,
    out: LinkOne<Out>,
    time_visited: Duration,
}

#[derive(SurrealdbNode, Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[surrealdb(table_name = "planet")]
pub struct Planet {
    id: Option<sql::Thing>,
    name: String,
    area: Polygon,
    population: u64,
    created: DateTime<Utc>,
    tags: Vec<String>,
}

#[derive(SurrealdbNode, Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[surrealdb(table_name = "weapon")]
pub struct Weapon {
    id: Option<sql::Thing>,
    name: String,
    created: DateTime<Utc>,
}

#[derive(SurrealdbNode, Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[surrealdb(table_name = "space_ship")]
pub struct SpaceShip {
    id: Option<sql::Thing>,
    name: String,
    created: DateTime<Utc>,
}