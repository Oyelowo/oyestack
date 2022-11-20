use super::guards::{AuthGuard, RoleGuard};
use crate::app::post::Post;
use async_graphql::*;
use chrono::{serde::ts_nanoseconds_option, DateTime, Utc};
use lib_common::oauth::account;
use lib_common::{authentication::TypedSession, error_handling::ApiHttpStatus};
use futures_util::TryStreamExt;
use lib_my_macros::FieldsGetter;
use serde::{Deserialize, Serialize};
use surrealdb::Datastore;
use typed_builder::TypedBuilder;
use validator::Validate;

#[derive(
    SimpleObject, InputObject, Serialize, Deserialize, TypedBuilder, Validate, Debug, FieldsGetter,
)]
#[serde(rename_all = "camelCase")]
#[graphql(complex)]
#[graphql(input_name = "UserInput")]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[builder(default)]
    #[graphql(skip_input)]
    pub id: Option<uuid::Uuid>,

    // use bson::serde_helpers::uuid_as_binary;
    // #[serde(with = "uuid_as_binary")]
    // uuid: Uuid,

    // Created_at should only be set once when creating the field, it should be ignored at other times
    // make it possible do just do created_at(value) instead of created_at(Some(value)) at the call site
    // Skip only from input but available for output. Can be useful for sorting on the client side
    #[serde(with = "ts_nanoseconds_option")] // not really necessary
    #[builder(default, setter(strip_option))]
    #[graphql(skip_input)]
    pub created_at: Option<DateTime<Utc>>,

    #[serde(with = "ts_nanoseconds_option")]
    #[builder(default=Some(Utc::now()), setter(strip_option))]
    #[graphql(skip)] // skip from noth input and output. Mainly for business logic stuff
    pub updated_at: Option<DateTime<Utc>>,

    #[serde(with = "ts_nanoseconds_option")]
    #[builder(default, setter(strip_option))]
    #[graphql(skip)] // skip from both input and output. Mainly for business logic stuff
    pub deleted_at: Option<DateTime<Utc>>,

    #[validate(length(min = 1), /*custom = "validate_unique_username"*/)]
    pub username: String,

    // I intentionally not strip option here because I want
    // it to be explicit that user is not specifying password e.g when using Oauth login
    #[validate(length(min = 1))]
    #[graphql(skip_output)]
    pub password: Option<String>,

    #[validate(length(min = 1))]
    #[builder(default)]
    pub first_name: Option<String>,

    #[validate(length(min = 1))]
    #[builder(default)]
    pub last_name: Option<String>,

    #[validate(length(min = 1))]
    #[builder(default, setter(strip_option))]
    pub city: Option<String>,

    #[validate(email)]
    #[builder(default)]
    pub email: Option<String>,

    #[graphql(skip_input)]
    #[builder(default)]
    pub email_verified: bool,

    #[validate(range(min = 18, max = 160))]
    pub age: Option<u8>,

    #[serde(default)]
    #[builder(default)]
    pub social_media: Vec<String>,

    #[graphql(skip_input)]
    pub roles: Vec<Role>,

    #[graphql(skip_input)]
    pub accounts: Vec<AccountOauth>,
}

#[derive(
    InputObject,
    SimpleObject,
    TypedBuilder,
    Serialize,
    Deserialize,
    Debug,
    Clone,
    FieldsGetter,
    Validate,
)]
#[serde(rename_all = "camelCase")]
#[graphql(input_name = "AccountOauthInput")]
pub struct AccountOauth {
    /// unique identifier for the oauth provider. Don't use name of user because that could be changed
    #[graphql(skip_input)]
    pub id: String,

    pub display_name: Option<String>,

    #[validate(email)]
    pub email: Option<String>,
    pub email_verified: bool,

    pub provider: OauthProvider,
    pub provider_account_id: OauthProvider,
    pub access_token: String,
    pub refresh_token: Option<String>,

    /// access token expiration timestamp, represented as the number of seconds since the epoch (January 1, 1970 00:00:00 UTC).
    pub expires_at: Option<DateTime<Utc>>,
    pub token_type: Option<TokenType>, // Should probably be changed to an enum. i.e oauth | anything else?
    pub scopes: Vec<String>,

    #[builder(default)]
    pub id_token: Option<String>,
    /* NOTE
    In case of an OAuth 1.0 provider (like Twitter), you will have to look for oauth_token and oauth_token_secret string fields. GitHub also has an extra refresh_token_expires_in integer field. You have to make sure that your database schema includes these fields.

    A single User can have multiple Accounts, but each Account can only have one User.
                 */
    #[builder(default, setter(strip_option))]
    oauth_token: Option<String>,
    #[builder(default, setter(strip_option))]
    oauth_token_secret: Option<String>,
}

impl From<account::UserAccount> for AccountOauth {
    fn from(user_account: account::UserAccount) -> Self {
        Self {
            id: user_account.id,
            display_name: user_account.display_name,
            email: user_account.email,
            email_verified: user_account.email_verified,
            provider: user_account.provider.into(),
            provider_account_id: user_account.provider_account_id.into(),
            access_token: user_account.access_token,
            refresh_token: user_account.refresh_token,
            expires_at: user_account.expires_at,
            token_type: user_account.token_type.map(Into::into),
            scopes: user_account.scopes,
            id_token: user_account.id_token,
            oauth_token: user_account.oauth_token,
            oauth_token_secret: user_account.oauth_token_secret,
        }
    }
}

#[derive(Debug, Deserialize, Serialize, Clone, Enum, PartialEq, Eq, Copy, Hash)]
#[serde(rename_all = "lowercase")]
pub enum OauthProvider {
    Github,
    Google,
}

impl From<account::OauthProvider> for OauthProvider {
    fn from(provider: account::OauthProvider) -> Self {
        match provider {
            account::OauthProvider::Github => Self::Github,
            account::OauthProvider::Google => Self::Google,
        }
    }
}

#[derive(Debug, Deserialize, Serialize, Clone, Enum, PartialEq, Eq, Copy)]
#[serde(rename_all = "lowercase")]
pub enum TokenType {
    Bearer,
}

impl From<account::TokenType> for TokenType {
    fn from(token_type: account::TokenType) -> Self {
        match token_type {
            account::TokenType::Bearer => Self::Bearer,
        }
    }
}

#[ComplexObject]
impl User {
    #[graphql(guard = "RoleGuard::new(Role::User).or(AuthGuard)")]
    async fn posts(&self, ctx: &Context<'_>) -> Result<Vec<Post>> {
        // let user = User::from_ctx(ctx)?.and_has_role(Role::Admin);
        // let db = get_db_from_ctx(ctx)?;
        let post_fields = Post::get_fields_serialized();

        // Post::collection(db)
        //     .find(doc! {post_fields.posterId: self.id}, None)
        //     .await?
        //     .try_collect()
        //     .await
        //     .map_err(|_| ApiHttpStatus::NotFound("Post not found".into()).extend())
        todo!()
    }

    async fn post_count(&self, ctx: &Context<'_>) -> Result<usize> {
        self.posts(ctx).await.map(|p| p.len()).map_err(|_| {
            ApiHttpStatus::UnprocessableEntity("Problem occured while getting posts".into())
                .extend()
        })
    }
}

#[derive(InputObject, TypedBuilder)]
pub struct SignInCredentials {
    pub username: String,
    pub password: String,
}

#[derive(Enum, Copy, Clone, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum Role {
    Admin,
    User,
}

#[derive(OneofObject)]
pub enum UserBy {
    UserId(uuid::Uuid),
    Username(String),
    Address(Address),
    // #[validate(email)]
    Email(String),
}
#[derive(InputObject, Validate)]
pub struct Address {
    street: String,
    house_number: String,
    city: String,
    zip: String,
}

impl User {
    pub async fn get_current_user(ctx: &Context<'_>) -> Result<User> {
        // let db = get_db_from_ctx(ctx)?;
        // let user_id = TypedSession::from_ctx(ctx)?.get_user_id::<uuid::Uuid>()?;

        // Self::find_by_id(db, &user_id).await
        todo!()
    }

    pub async fn get_user(db: &Datastore, user_by: UserBy) -> Result<Self> {
        // let uf = User::get_fields_serialized();
        // let search_doc = match user_by {
        //     UserBy::UserId(id) => doc! { uf._id: id },
        //     UserBy::Username(user_name) => {
        //         let doc = doc! { uf.username: user_name };
        //         doc
        //     }
        //     // Temporary
        //     UserBy::Address(address) => doc! { uf.city: address.city },
        //     UserBy::Email(email) => doc! { uf.email: email },
        // };
        // todo!()
        // User::find_one(db, search_doc, None)
        //     .await?
        //     .ok_or_else(|| ApiHttpStatus::NotFound("User not found".into()).extend())
        // User::collection(db)
        //     .find_one(search_doc, None)
        //     .await?
        //     .ok_or_else(|| ApiHttpStatus::NotFound("User not found".into()).extend())
        todo!()
    }
    // pub async fn _search_users(db: &Database, user_by: Vec<UserBy>) -> Result<Vec<Self>> {
    //     todo!()
    // }
    pub async fn find_by_id(db: &Datastore, id: &uuid::Uuid) -> Result<Self> {
        let uk = User::get_fields_serialized();
        todo!()
    }

    pub async fn find_or_create_for_oauth(
        db: &Datastore,
        account_oauth: AccountOauth,
    ) -> anyhow::Result<Self> {
        todo!()
    }

    pub async fn find_by_username(db: &Datastore, username: impl Into<String>) -> Result<Self> {
        todo!()
    }
}

#[derive(SimpleObject)]
pub struct SignOutMessage {
    pub message: String,
    pub user_id: uuid::Uuid,
}
