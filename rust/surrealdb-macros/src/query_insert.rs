use std::collections::HashMap;

use serde::{de::DeserializeOwned, Deserialize, Serialize};
use serde_json::{json, Value};
use surrealdb::{engine::local::Db, method::Query, opt::QueryResult, sql, Response, Surreal};

use crate::SurrealdbNode;

pub struct InsertStatement<T: Serialize + DeserializeOwned + SurrealdbNode> {
    // table: String,
    values: Vec<T>,
}

impl<T: Serialize + DeserializeOwned + SurrealdbNode> InsertStatement<T> {
    // pub fn new(table: String) -> Self {
    pub fn new() -> Self {
        Self {
            // table,
            values: Vec::new(),
        }
    }

    pub fn insert(&mut self, value: T) -> &mut Self {
        self.values.push(value);
        self
    }

    pub fn insert_all(&mut self, values: Vec<T>) -> &mut Self {
        self.values = values;
        self
    }

    // pub fn build(&self) -> Result<(String, Vec<(String, Value)>), String> {
    pub fn build(&self) -> Result<(String, Vec<(String, sql::Value)>), String> {
        if self.values.is_empty() {
            return Err(String::from("No values to insert"));
        }

        let first_value = self.values.get(0).unwrap();
        let field_names = get_field_names(first_value);

        let mut query = String::new();
        query.push_str("INSERT INTO ");
        let table_name = T::get_table_name();
        query.push_str(&T::get_table_name());
        // query.push_str(&self.table);
        query.push_str(" (");
        query.push_str(&field_names.join(", "));
        query.push_str(") VALUES ");

        let mut variables = Vec::new();
        let mut values = String::new();

        for (i, value) in self.values.iter().enumerate() {
            let mut row_values = Vec::new();
            for field_name in &field_names {
                let field_value = get_field_value(value, field_name)?;
                let placeholder_var_names = format!("{}_{}", field_name, i);
                variables.push((placeholder_var_names.clone(), field_value));
                // row_values.push(format!("${}", variables.len()));
                row_values.push(format!("${}", placeholder_var_names));
            }
            if i > 0 {
                values.push_str(", ");
            }
            values.push_str("(");
            values.push_str(&row_values.join(", "));
            values.push_str(")");
        }

        query.push_str(&values);

        Ok((query, variables))
    }

    pub async fn get_one(&self, db: Surreal<Db>) -> surrealdb::Result<T> {
        let (query, variables) = self.build().unwrap();
        let response = variables
            .clone()
            .iter()
            .fold(db.query(query), |acc, val| acc.bind(val))
            .await?
            .take::<Option<T>>(0)?;

        // TODO:: Handle error if nothing is returned
        Ok(response.unwrap())
    }

    pub async fn get_many(&self, db: Surreal<Db>) -> surrealdb::Result<Vec<T>> {
        let (query, variables) = self.build().unwrap();
        let response = variables
            .clone()
            .iter()
            .fold(db.query(query), |acc, val| acc.bind(val))
            .await?
            .take::<Vec<T>>(0)?;

        Ok(response)
    }
}

fn get_field_names<T>(value: &T) -> Vec<String>
where
    T: serde::Serialize,
{
    serde_json::to_value(value)
        .unwrap()
        .as_object()
        .unwrap()
        .keys()
        .map(ToString::to_string)
        .collect()
}

fn get_field_value<T: Serialize>(
    value: &T,
    field_name: &str,
) -> Result<surrealdb::sql::Value, String>
where
    T: serde::Serialize,
{
    let whole_struct = json!(value);
    // TODO: Improve error handling
    Ok(sql::json(&whole_struct[field_name].to_string())?)
}

// use std::collections::HashMap;
//
// struct InsertQuery {
//     table: String,
//     fields: Option<Vec<String>>,
//     values: Vec<Vec<String>>,
//     on_duplicate_key_update: Option<HashMap<String, String>>,
// }
//
// impl InsertQuery {
//     fn new(table: &str) -> InsertQuery {
//         InsertQuery {
//             table: String::from(table),
//             fields: None,
//             values: Vec::new(),
//             on_duplicate_key_update: None,
//         }
//     }
//
//     fn fields(mut self, fields: &[&str]) -> InsertQuery {
//         self.fields = Some(fields.iter().map(|f| String::from(*f)).collect());
//         self
//     }
//
//     fn values(mut self, values: &[&[&str]]) -> InsertQuery {
//         self.values = values
//             .iter()
//             .map(|v| v.iter().map(|s| String::from(*s)).collect())
//             .collect();
//         self
//     }
//
//     fn on_duplicate_key_update(mut self, updates: &[(&str, &str)]) -> InsertQuery {
//         let update_map: HashMap<String, String> = updates
//             .iter()
//             .map(|(k, v)| (String::from(*k), String::from(*v)))
//             .collect();
//         self.on_duplicate_key_update = Some(update_map);
//         self
//     }
//
//     fn build(&self) -> String {
//         let mut query = String::from("INSERT INTO ");
//         query.push_str(&self.table);
//
//         if let Some(fields) = &self.fields {
//             let fields_str = fields.join(", ");
//             query.push_str(&format!(" ({}) ", fields_str));
//         }
//
//         if !self.values.is_empty() {
//             let values_str: Vec<String> = self
//                 .values
//                 .iter()
//                 .map(|v| {
//                     let values_list = v.join(", ");
//                     format!("({})", values_list)
//                 })
//                 .collect();
//
//             query.push_str(" VALUES ");
//             query.push_str(&values_str.join(", "));
//         }
//
//         if let Some(update_map) = &self.on_duplicate_key_update {
//             let updates_str: Vec<String> = update_map
//                 .iter()
//                 .map(|(k, v)| format!("{} = {}", k, v))
//                 .collect();
//
//             query.push_str(" ON DUPLICATE KEY UPDATE ");
//             query.push_str(&updates_str.join(", "));
//         }
//
//         query.push_str(";");
//
//         query
//     }
// }
// mod xfdf {
//
//     use std::collections::HashMap;
//
//     use serde::{Deserialize, Serialize};
//
//     #[derive(Serialize)]
//     #[serde(rename_all = "snake_case")]
//     enum Value<'a> {
//         Str(&'a str),
//         Struct(HashMap<&'a str, Value<'a>>),
//         Array(Vec<Value<'a>>),
//     }
//
//     impl<'a> Value<'a> {
//         fn from_serde_value(v: &'a serde_json::Value) -> Self {
//             match v {
//                 serde_json::Value::String(s) => Value::Str(s),
//                 serde_json::Value::Array(a) => {
//                     let v: Vec<Value<'a>> = a.iter().map(Value::from_serde_value).collect();
//                     Value::Array(v)
//                 }
//                 serde_json::Value::Object(o) => {
//                     let v: HashMap<&'a str, Value<'a>> = o
//                         .iter()
//                         .map(|(k, v)| (k.as_str(), Value::from_serde_value(v)))
//                         .collect();
//                     Value::Struct(v)
//                 }
//                 _ => unreachable!(),
//             }
//         }
//
//         fn to_sql_value(&self) -> String {
//             match self {
//                 Value::Str(s) => s.to_string(),
//                 Value::Struct(fields) => {
//                     let fields = fields
//                         .iter()
//                         .map(|(k, v)| format!("{}: {}", k, v.to_sql_value()))
//                         .collect::<Vec<String>>()
//                         .join(", ");
//                     format!("{{{}}}", fields)
//                 }
//                 Value::Array(values) => {
//                     let values = values
//                         .iter()
//                         .map(Value::to_sql_value)
//                         .collect::<Vec<String>>()
//                         .join(", ");
//                     format!("[{}]", values)
//                 }
//             }
//         }
//     }
//
//     pub struct InsertQuery<'a> {
//         table: &'a str,
//         fields: Vec<&'a str>,
//         values: Vec<Value<'a>>,
//         on_duplicate_key_update: Vec<(&'a str, &'a str)>,
//     }
//
//     impl<'a> InsertQuery<'a> {
//         pub fn new(table: &'a str) -> Self {
//             Self {
//                 table,
//                 fields: Vec::new(),
//                 values: Vec::new(),
//                 on_duplicate_key_update: Vec::new(),
//             }
//         }
//
//         pub fn fields(&mut self, fields: &'a [&'a str]) -> &mut Self {
//             self.fields = fields.to_vec();
//             self
//         }
//
//         // pub fn values(&mut self, values: &'a [serde_json::Value]) -> &mut Self {
//         //     self.values = values.iter().map(Value::from_serde_value).collect();
//         //     self
//         // }
//         pub fn values<T: Serialize>(&mut self, values: &'a [T]) -> &mut Self {
//             self.values = values
//                 .iter()
//                 .map(|v| Value::from_serde_value(&serde_json::to_value(v).unwrap()))
//                 .collect();
//             self
//         }
//
//         pub fn on_duplicate_key_update(&mut self, fields: &'a [(&'a str, &'a str)]) -> &mut Self {
//             self.on_duplicate_key_update = fields.to_vec();
//             self
//         }
//
//         pub fn build(&self) -> String {
//             let fields = self.fields.join(", ");
//             let values = self
//                 .values
//                 .iter()
//                 .map(Value::to_sql_value)
//                 .collect::<Vec<String>>()
//                 .join(", ");
//             let mut sql = format!(
//                 "INSERT INTO {} ({}) VALUES ({})",
//                 self.table, fields, values
//             );
//
//             if !self.on_duplicate_key_update.is_empty() {
//                 let update_fields = self
//                     .on_duplicate_key_update
//                     .iter()
//                     .map(|(k, v)| format!("{} = {}", k, v))
//                     .collect::<Vec<String>>()
//                     .join(", ");
//                 sql.push_str(&format!(" ON DUPLICATE KEY UPDATE {}", update_fields));
//             }
//
//             sql
//         }
//     }
//
//     #[derive(Serialize, Deserialize, Debug)]
//     struct Founder {
//         person: String,
//     }
//
//     #[derive(Serialize, Deserialize, Debug)]
//     struct Company {
//         name: String,
//         founded: String,
//         founders: Vec<Founder>,
//         tags: Vec<String>,
//     }
//
//     #[derive(Serialize, Deserialize)]
//     struct Person {
//         name: String,
//         age: u8,
//     }
//
//     #[test]
//     fn test_surrealdb_insert() {
//         // Create a new `Person` instance
//         let person = Person {
//             name: "Alice".to_owned(),
//             age: 25,
//         };
//
//         let person = Person {
//             name: "Alice".to_owned(),
//             age: 25,
//         };
//
//         let mut insert_query = InsertQuery::new("person");
//         insert_query.fields(&["name", "age"]);
//         insert_query.values(&[Value::from(person)]);
//         // Create an `InsertQuery` builder and set the table name, fields, and values
//         let mut insert_query = InsertQuery::new("person");
//         insert_query.fields(&["name", "age"]);
//         insert_query.values(&[person]);
//
//         // Build the SQL query string
//         let sql = insert_query.build();
//         // let query = InsertQuery::new("company").values(&Company {
//         //     name: "SurrealDB".to_string(),
//         //     founded: "2021-09-10".to_string(),
//         //     founders: vec![
//         //         Founder {
//         //             person: "tobie".to_string(),
//         //         },
//         //         Founder {
//         //             person: "jaime".to_string(),
//         //         },
//         //     ],
//         //     tags: vec!["big data".to_string(), "database".to_string()],
//         // });
//         // assert_eq!(query, "INSERT INTO company {\"name\":\"SurrealDB\",\"founded\":\"2021-09-10\",\"founders\":[{\"person\":\"tobie\"},{\"person\":\"jaime\"}],\"tags\":[\"big data\",\"database\"]};");
//     }
// }
// ///
// ///
// /// Third
// mod xxxxx {
//
//     use std::collections::HashMap;
//
//     use serde::Serialize;
//
//     #[derive(Serialize)]
//     #[serde(rename_all = "snake_case")]
//     enum Value<'a> {
//         Str(&'a str),
//         Struct(HashMap<&'a str, Value<'a>>),
//         Array(Vec<Value<'a>>),
//     }
//
//     impl<'a> Value<'a> {
//         fn from_serde_value(v: &'a serde_json::Value) -> Self {
//             match v {
//                 serde_json::Value::String(s) => Value::Str(s),
//                 serde_json::Value::Array(a) => {
//                     let v: Vec<Value<'a>> = a.iter().map(Value::from_serde_value).collect();
//                     Value::Array(v)
//                 }
//                 serde_json::Value::Object(o) => {
//                     let v: HashMap<&'a str, Value<'a>> = o
//                         .iter()
//                         .map(|(k, v)| (k.as_str(), Value::from_serde_value(v)))
//                         .collect();
//                     Value::Struct(v)
//                 }
//                 _ => unreachable!(),
//             }
//         }
//
//         fn to_sql_value(&self) -> String {
//             match self {
//                 Value::Str(s) => s.to_string(),
//                 Value::Struct(fields) => {
//                     let fields = fields
//                         .iter()
//                         .map(|(k, v)| format!("{}: {}", k, v.to_sql_value()))
//                         .collect::<Vec<String>>()
//                         .join(", ");
//                     format!("{{{}}}", fields)
//                 }
//                 Value::Array(values) => {
//                     let values = values
//                         .iter()
//                         .map(Value::to_sql_value)
//                         .collect::<Vec<String>>()
//                         .join(", ");
//                     format!("[{}]", values)
//                 }
//             }
//         }
//     }
//
//     pub struct InsertQuery<'a> {
//         table: &'a str,
//         fields: Vec<&'a str>,
//         values: Vec<Vec<Value<'a>>>,
//         on_duplicate_key_update: Vec<(&'a str, &'a str)>,
//     }
//
//     impl<'a> InsertQuery<'a> {
//         pub fn new(table: &'a str) -> Self {
//             Self {
//                 table,
//                 fields: Vec::new(),
//                 values: Vec::new(),
//                 on_duplicate_key_update: Vec::new(),
//             }
//         }
//
//         pub fn fields(&mut self, fields: &'a [&'a str]) -> &mut Self {
//             self.fields = fields.to_vec();
//             self
//         }
//
//         pub fn values(&mut self, values: &'a [Vec<serde_json::Value>]) -> &mut Self {
//             self.values = values
//                 .iter()
//                 .map(|row| row.iter().map(Value::from_serde_value).collect())
//                 .collect();
//             self
//         }
//
//         pub fn on_duplicate_key_update(&mut self, fields: &'a [(&'a str, &'a str)]) -> &mut Self {
//             self.on_duplicate_key_update = fields.to_vec();
//             self
//         }
//
//         pub fn build(&self) -> String {
//             let fields = self.fields.join(", ");
//             let values = self
//                 .values
//                 .iter()
//                 .map(|row| {
//                     let row_values = row
//                         .iter()
//                         .map(Value::to_sql_value)
//                         .collect::<Vec<String>>()
//                         .join(", ");
//                     format!("({})", row_values)
//                 })
//                 .collect::<Vec<String>>()
//                 .join(", ");
//             let on_duplicate_key_update = if !self.on_duplicate_key_update.is_empty() {
//                 let fields = self
//                     .on_duplicate_key_update
//                     .iter()
//                     .map(|(k, v)| format!("{} = {}", k, v))
//                     .collect::<Vec<String>>()
//                     .join(", ");
//                 format!("ON DUPLICATE KEY UPDATE {}", fields)
//             } else {
//                 String::new()
//             };
//             format!(
//                 "INSERT INTO {} ({}) VALUES {} {};",
//                 self.table, fields, values, on_duplicate_key_update
//             )
//         }
//     }
