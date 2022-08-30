use common::configurations::mongodb::MongodbConfigs;
use mongodb::Database;

pub async fn establish_connection() -> Database {
    let database = MongodbConfigs::default();

    database.get_database().unwrap_or_else(|e| {
        panic!("failed to get mongo database. Error: {e}");
    })
}
