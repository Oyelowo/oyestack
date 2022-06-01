use std::process;

use anyhow::Context;
use mongodb::{
    options::{ClientOptions, Credential, ServerAddress},
    Client, Database,
};

use serde::{de::DeserializeOwned, Deserialize, Serialize};
use serde_aux::prelude::deserialize_number_from_string;

#[derive(PartialEq, Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum Environment {
    Local,
    Development,
    Staging,
    Production,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "lowercase")]
pub struct ApplicationConfigs {
    #[serde(deserialize_with = "deserialize_number_from_string")]
    pub port: u16,
    pub host: String,
    pub environment: Environment,
}

impl ApplicationConfigs {
    pub fn get_url(&self) -> String {
        let Self { host, port, .. } = self;
        // Url::parse(format!("http://{host}:{port}").as_ref()).expect("Problem parsing application uri")
        format!("{host}:{port}")
    }
}

#[derive(Deserialize, Debug, Default)]
#[serde(rename_all = "lowercase")]
pub struct DatabaseConfigs {
    pub name: String,
    pub username: String,
    pub password: String,
    pub host: String,

    #[serde(deserialize_with = "deserialize_number_from_string")]
    pub port: u16,

    #[serde(default = "default_require_ssl")]
    pub require_ssl: Option<bool>,
}

fn default_require_ssl() -> Option<bool> {
    Some(false)
}

impl DatabaseConfigs {
    pub fn get_database(self) -> anyhow::Result<Database> {
        let credential = Credential::builder()
            .username(self.username)
            .password(self.password)
            .source(self.name.clone())
            .build();

        let hosts = vec![ServerAddress::Tcp {
            host: self.host,
            port: Some(self.port),
        }];

        let options = ClientOptions::builder()
            .app_name(Some("graphql-mongo".into()))
            .hosts(hosts)
            .credential(credential)
            .build();

        let db = Client::with_options(options)
            .context("Faulty db option")?
            .database(&self.name);
        Ok(db)
    }
}

#[derive(Deserialize, Debug, Default, Clone)]
#[serde(rename_all = "lowercase")]
pub struct RedisConfigs {
    // pub name: String,
    pub username: String,
    pub password: String,
    pub host: String,

    #[serde(deserialize_with = "deserialize_number_from_string")]
    pub port: u16,
}

impl RedisConfigs {
    pub fn get_url(&self) -> String {
        let Self {
            host,
            port,
            // username,
            // password,
            ..
        } = self;
        // protocol://[user]:[password]@host[:port]. https://github.com/mitsuhiko/redis-rs/issues/144
        // TODO: Try out including protocol
        // Url::parse(format!("http://{host}:{port}").as_ref()).expect("Problem parsing application uri")
        // "redis-database-master.development:6379".into()
        // TODO: Add password auth
        // format!("${username}:${password}@{host}:{port}")
        // Redis seem to not require username

        let url = format!("{host}:{port}");
        // let url = format!("redis://:{password}@graphql-mongo-redis-master.applications:6379");
        println!("Redis URL =======>>>>>>>>>>: {}", url);
        // format!(":{password}@{host}:{port}")
        url
    }
}

#[derive(Debug)]
pub struct Configs {
    pub application: ApplicationConfigs,
    pub database: DatabaseConfigs,
    pub redis: RedisConfigs,
}

impl Configs {
    pub fn init() -> Self {
        Self {
            application: get_config("APP_"),
            database: get_config("MONGODB_"),
            redis: get_config("REDIS_"),
        }
    }
}

fn get_config<T: DeserializeOwned>(config_prefix: &str) -> T {
    envy::prefixed(config_prefix)
        .from_env::<T>()
        .unwrap_or_else(|e| {
            log::error!(
                "problem with {config_prefix:?} environment variables(s). 
            Check that the prefix is correctly spelled and the configs are complete. Error {e:?}"
            );
            process::exit(1);
        })
}
