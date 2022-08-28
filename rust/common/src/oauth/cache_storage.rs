use lru;
use std::collections::HashMap;

#[async_trait::async_trait]
pub trait CacheStorage: Send + Sync + 'static {
    /// Load the query by `key`.
    async fn get(&mut self, key: String) -> Option<String>;
    /// Save the query by `key`.
    async fn set(&mut self, key: String, query: String);
}

use redis::AsyncCommands;

#[derive(Clone)]
pub struct RedisCache(pub(crate) redis::Client);

#[async_trait::async_trait]
impl CacheStorage for RedisCache {
    async fn get(&mut self, key: String) -> Option<String> {
        let data: String = self
            .0
            .get_async_connection()
            .await
            .unwrap()
            .get(key)
            .await
            .unwrap();

        Some(data)
    }

    async fn set(&mut self, key: String, value: String) {
        let mut con = self.0.get_async_connection().await.unwrap();
        con.set::<String, String, String>(key.clone(), value);

        con.expire::<_, u16>(key, 600).await.unwrap();
    }
}

#[derive(Debug, Clone)]
pub struct HashMapCache(HashMap<String, String>);

impl HashMapCache {
    pub fn new() -> Self {
        Self(HashMap::new())
    }
}

#[async_trait::async_trait]
impl CacheStorage for HashMapCache {
    async fn get(&mut self, key: String) -> Option<String> {
        let data = self.0.get(&key).map(String::from);

        data
    }

    async fn set(&mut self, key: String, value: String) {
        self.0.insert(key, value);
    }
}

/// LRU cache.
#[derive(Debug)]
pub struct LruCache(lru::LruCache<String, String>);

impl LruCache {
    pub fn new(cap: u16) -> Self {
        Self(lru::LruCache::new(cap as usize))
    }
}

#[async_trait::async_trait]
impl CacheStorage for LruCache {
    async fn get(&mut self, key: String) -> Option<String> {
        self.0.get(&key).map(|v| v.clone())
    }

    async fn set(&mut self, key: String, value: String) {
        self.0.put(key, value);
    }
}
