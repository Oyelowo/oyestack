/*
 * Author: Oyelowo Oyedayo
 * Email: oyelowooyedayo@gmail.com
 * Copyright (c) 2023 Oyelowo Oyedayo
 * Licensed under the MIT license
 */

use chrono::{DateTime, Utc};
use geo::Point;
use geo::Polygon;
use pretty_assertions::assert_eq;
use serde::{Deserialize, Serialize};
use std::time::Duration;
use surreal_models::{Alien, SpaceShip, Weapon};
use surreal_orm::*;
use surrealdb::engine::local::Mem;
use surrealdb::sql;
use surrealdb::Surreal;

// Explicityly specifying all field types. Most of it can be inferred.
// So, you usually wouldn't have to annotate the type manually. (See Alien).
// Adding this for testing purpose.
#[derive(Node, Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[surreal_orm(table_name = "alien_with_explicit_attributes")]
pub struct AlienWithExplicitAttributes {
    #[surreal_orm(type = "record(alien_with_explicit_attributes)")]
    id: sql::Thing,

    #[surreal_orm(type = "string")]
    name: String,

    #[surreal_orm(type = "int")]
    age: u8,

    #[surreal_orm(type = "datetime")]
    created: DateTime<Utc>,

    #[surreal_orm(type = "duration")]
    life_expectancy: Duration,

    #[surreal_orm(type = "geometry(feature)")]
    territory_area: Polygon,

    #[surreal_orm(type = "geometry(feature)")]
    home: Point,

    #[surreal_orm(content_type = "string")]
    // Full definitions. This also works.
    // #[surreal_orm(type = "array", content_type = "string")]
    tags: Vec<String>,

    // database type attribute is autogenerated for all links of the struct. But you can also provide it
    #[surreal_orm(
        link_self = "AlienWithExplicitAttributes",
        type = "record(alien_with_explicit_attributes)"
    )]
    ally: LinkSelf<AlienWithExplicitAttributes>,

    #[surreal_orm(link_one = "Weapon", type = "record(weapon)")]
    weapon: LinkOne<Weapon>,

    // Again, we dont have to provide the type attribute, it can auto detect
    #[surreal_orm(
        link_many = "SpaceShip",
        type = "array",
        content_type = "record(space_ship)"
    )]
    space_ships: LinkMany<SpaceShip>,
}

#[derive(Edge, Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[surreal_orm(table_name = "visits")]
pub struct Visits<In: Node, Out: Node> {
    id: sql::Thing,
    #[serde(rename = "in")]
    in_: LinkOne<In>,
    out: LinkOne<Out>,
    time_visited: Duration,
}
//
#[derive(Node, Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
#[surreal_orm(table_name = "planet")]
pub struct Planet {
    id: sql::Thing,
    name: String,
    area: Polygon,
    population: u64,
    created: DateTime<Utc>,
    tags: Vec<String>,
}

#[tokio::test]
async fn test_node_atttributes_auto_inferred() -> SurrealOrmResult<()> {
    let db = Surreal::new::<Mem>(()).await.unwrap();

    db.use_ns("test").use_db("test").await.unwrap();
    Alien::define_fields();
    assert_eq!(
        Alien::define_table().to_raw().build(),
        "DEFINE TABLE alien;"
    );

    assert_eq!(
        Alien::define_fields()
            .iter()
            .map(|x| x.to_raw().build())
            .collect::<Vec<_>>()
            .join("\n"),
        "DEFINE FIELD id ON TABLE alien TYPE record (alien);
DEFINE FIELD name ON TABLE alien TYPE string;
DEFINE FIELD age ON TABLE alien TYPE int;
DEFINE FIELD created ON TABLE alien TYPE datetime;
DEFINE FIELD lifeExpectancy ON TABLE alien TYPE duration;
DEFINE FIELD linePolygon ON TABLE alien TYPE geometry (feature);
DEFINE FIELD territoryArea ON TABLE alien TYPE geometry (feature);
DEFINE FIELD home ON TABLE alien TYPE geometry (feature);
DEFINE FIELD tags ON TABLE alien TYPE array;
DEFINE FIELD ally ON TABLE alien TYPE record (alien);
DEFINE FIELD weapon ON TABLE alien TYPE record (weapon);
DEFINE FIELD spaceShips ON TABLE alien TYPE array;
DEFINE FIELD spaceShips.* ON TABLE alien TYPE record (space_ship);"
    );

    Ok(())
}

#[tokio::test]
async fn test_node_atttributes_explicit() -> SurrealOrmResult<()> {
    let db = Surreal::new::<Mem>(()).await.unwrap();
    db.use_ns("test").use_db("test").await.unwrap();
    Alien::define_fields();
    assert_eq!(
        AlienWithExplicitAttributes::define_table().to_raw().build(),
        "DEFINE TABLE alien_with_explicit_attributes;"
    );

    assert_eq!(
        AlienWithExplicitAttributes::define_fields()
            .iter()
            .map(|x| x.to_raw().build())
            .collect::<Vec<_>>()
            .join("\n"),
        "DEFINE FIELD id ON TABLE alien_with_explicit_attributes TYPE record (alien_with_explicit_attributes);
DEFINE FIELD name ON TABLE alien_with_explicit_attributes TYPE string;
DEFINE FIELD age ON TABLE alien_with_explicit_attributes TYPE int;
DEFINE FIELD created ON TABLE alien_with_explicit_attributes TYPE datetime;
DEFINE FIELD lifeExpectancy ON TABLE alien_with_explicit_attributes TYPE duration;
DEFINE FIELD territoryArea ON TABLE alien_with_explicit_attributes TYPE geometry (feature);
DEFINE FIELD home ON TABLE alien_with_explicit_attributes TYPE geometry (feature);
DEFINE FIELD tags ON TABLE alien_with_explicit_attributes TYPE array;
DEFINE FIELD tags.* ON TABLE alien_with_explicit_attributes TYPE string;
DEFINE FIELD ally ON TABLE alien_with_explicit_attributes TYPE record (alien_with_explicit_attributes);
DEFINE FIELD weapon ON TABLE alien_with_explicit_attributes TYPE record (weapon);
DEFINE FIELD spaceShips ON TABLE alien_with_explicit_attributes TYPE array;
DEFINE FIELD spaceShips.* ON TABLE alien_with_explicit_attributes TYPE record (space_ship);"
    );

    Ok(())
}