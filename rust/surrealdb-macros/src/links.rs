use serde::{Deserialize, Serialize};

use super::*;

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(untagged)]
enum Reference<V: SurrealdbNode> {
    FetchedValue(V),
    Id(String),
    Null,
}

// impl<V: SurrealdbModel> Default for Reference<V> {
//     fn default() -> Self {
//         Self::None
//     }
// }

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct LinkOne<V: SurrealdbNode>(Reference<V>);

pub type LinkMany<V> = Vec<LinkOne<V>>;
pub type Relate<V> = Vec<LinkOne<V>>;

// Use boxing to break reference cycle
pub type LinkSelf<V> = Box<LinkOne<V>>;

impl<V: SurrealdbNode> From<V> for LinkOne<V> {
    fn from(model: V) -> Self {
        let x = model.get_key();
        Self(Reference::Id(
            x.expect("Id not found. Make sure Id exists for this model")
                .to_owned(),
        ))
    }
}

impl<V: SurrealdbNode> From<&V> for LinkOne<V> {
    fn from(model: &V) -> Self {
        let x = model.clone().get_key();
        match x {
            Some(x) => Self(Reference::Id(x.to_owned())),
            None => Self(Reference::Null),
        }
        // Self(Reference::Id(
        //     x.expect("Id not found. Make sure Id exists for this model"),
        // ))
    }
}

impl<V> LinkOne<V>
where
    V: SurrealdbNode,
{
    /// .
    ///
    /// # Panics
    ///
    /// Panics if .
    pub fn from_model(model: impl SurrealdbNode) -> Self {
        let x = model.get_key();
        Self(Reference::Id(
            x.expect("Id not found. Make sure Id exists for this model")
                .to_owned(),
        ))
    }

    pub fn id(&self) -> Option<&String> {
        match &self.0 {
            Reference::Id(v) => Some(v),
            _ => None,
        }
    }

    pub fn value_ref(&self) -> Option<&V> {
        match &self.0 {
            Reference::FetchedValue(v) => Some(v),
            _ => None,
        }
    }

    pub fn value_owned(self) -> Option<V> {
        match self.0 {
            Reference::FetchedValue(v) => Some(v),
            _ => None,
        }
    }
}
