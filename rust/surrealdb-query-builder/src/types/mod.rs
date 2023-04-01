pub(crate) mod array;
pub(crate) mod clause;
pub(crate) mod expression;
pub(crate) mod field;
pub(crate) mod field_updater;
pub(crate) mod filter;
pub(crate) mod geometry;
pub(crate) mod helper;
pub(crate) mod idiom;
pub(crate) mod numbers;
pub(crate) mod ordinal;
pub(crate) mod param;
pub(crate) mod return_;
pub(crate) mod strand;
pub(crate) mod surreal_id;
pub(crate) mod token_target;
pub(crate) mod value;

pub use array::*;
pub use clause::*;
pub use field::*;
pub use field_updater::*;
pub use filter::*;
pub use geometry::*;
pub use idiom::*;
pub use numbers::*;
pub use numbers::*;
pub use ordinal::*;
pub use ordinal::*;
pub use param::*;
pub use param::*;
pub use return_::*;
pub use strand::*;
pub use surreal_id::*;
pub use token_target::*;
pub use value::*;

macro_rules! create_value_like_struct {
    ($sql_type_name:expr) => {
        paste::paste! {
            #[derive(serde::Serialize, Debug, Clone)]
            pub enum [<$sql_type_name Like>] {
                [<$sql_type_name>](sql::[<$sql_type_name>]),
                Field(sql::Idiom),
                Param(sql::Param),
            }
            // macro_rules! impl_geometry_like_from {
            //     ($($t:ty),*) => {
            //         $(impl From<$t> for GeometryLike {
            //             fn from(value: $t) -> Self {
            //                 Self::Geometry(sql::Geometry::from(value))
            //             }
            //         })*
            //     };
            // }
            //
            // impl_geometry_like_from!(
            //     geo::Polygon,
            //     geo::Point,
            //     geo::LineString,
            //     geo::MultiPoint,
            //     geo::MultiPolygon,
            //     geo::MultiLineString
            // );

            use surrealdb::sql;

            use super::{Field, Param};

            impl<T: Into<sql::[<$sql_type_name>]>> From<T> for [<$sql_type_name Like>] {
                fn from(value: T) -> Self {
                    let value: sql::[<$sql_type_name>] = value.into();
                    Self::Geometry(value.into())
                }
            }

            impl From<Field> for [<$sql_type_name Like>] {
                fn from(val: Field) -> Self {
                    [<$sql_type_name Like>]::Field(val.into())
                }
            }

            impl From<Param> for [<$sql_type_name Like>] {
                fn from(val: Param) -> Self {
                    [<$sql_type_name Like>]::Param(val.into())
                }
            }

            impl From<&Field> for [<$sql_type_name Like>] {
                fn from(val: &Field) -> Self {
                    [<$sql_type_name Like>]::Field(val.into())
                }
            }

            impl From<sql::Value> for [<$sql_type_name Like>] {
                fn from(value: sql::Value) -> [<$sql_type_name Like>] {
                    Self::Geometry(value)
                }
            }

            impl From<[<$sql_type_name Like>]> for sql::Value {
                fn from(val: StrandLike) -> sql::Value {
                    match val {
                        [<$sql_type_name Like>]::[<$sql_type_name>](g) => g.into(),
                        [<$sql_type_name Like>]::Field(f) => f.into(),
                        [<$sql_type_name Like>]::Param(p) => p.into(),
                    }
                }
            }
        };
    };
}

create_value_like_struct!("Number");
create_value_like_struct!("Strand");
create_value_like_struct!("Geometry");
create_value_like_struct!("Array");
create_value_like_struct!("Idiom");
create_value_like_struct!("Duration");
create_value_like_struct!("Datetime");
