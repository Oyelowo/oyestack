use std::time::Duration;

use serde::{Deserialize, Serialize};
use surreal_orm::{Edge, LinkOne, Node, SurrealSimpleId};

use crate::{Alien, Planet};

// Visits
#[derive(Edge, Serialize, Deserialize, Debug, Clone, Default)]
#[serde(rename_all = "camelCase")]
#[surreal_orm(table_name = "visits")]
pub struct Visits<In: Node, Out: Node> {
    // pub id: SurrealId<Visits<In, Out>>,
    pub id: SurrealSimpleId<Self>,
    #[serde(rename = "in")]
    pub in_: LinkOne<In>,
    pub out: LinkOne<Out>,
    pub time_visited: Duration,
}

// Connects Alien to Planet via Visits
pub type AlienVisitsPlanet = Visits<Alien, Planet>;