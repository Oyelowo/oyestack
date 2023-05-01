use std::time::Duration;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use surrealdb::sql;
use surrealdb_orm::{LinkMany, LinkOne, LinkSelf, Relate, SurrealId, SurrealdbNode};

use crate::{AlienVisitsPlanet, Planet, SpaceShip, Weapon};

// Alien
#[derive(SurrealdbNode, Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[surrealdb(table_name = "alien")]
pub struct Alien {
    pub id: SurrealId<Self>,
    pub name: String,
    pub age: u8,
    pub created: DateTime<Utc>,
    pub life_expectancy: Duration,
    pub line_polygon: sql::Geometry,
    pub territory_area: sql::Geometry,
    pub home: sql::Geometry,
    pub tags: Vec<String>,
    // database type attribute is autogenerated for all links of the struct. But you can also provide it
    #[surrealdb(link_self = "Alien", type = "record(alien)")]
    pub ally: LinkSelf<Alien>,

    // #[serde(skip_serializing)]
    #[surrealdb(link_one = "Weapon", type = "record(weapon)")]
    pub weapon: LinkOne<Weapon>,

    // Again, we dont have to provide the type attribute, it can auto detect
    // #[serde(skip_serializing)]
    #[surrealdb(
        link_many = "SpaceShip",
        type = "array",
        content_type = "record(space_ship)"
    )]
    pub space_ships: LinkMany<SpaceShip>,

    // This is a read only field
    #[surrealdb(relate(model = "AlienVisitsPlanet", connection = "->visits->planet"))]
    #[serde(skip_serializing, default)]
    pub planets_to_visit: Relate<Planet>,
}
