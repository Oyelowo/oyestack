use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use typed_builder::TypedBuilder;
use validator::Validate;

#[derive(Debug, Deserialize, Serialize, Clone, PartialEq, Eq, Copy)]
#[serde(rename_all = "lowercase")]
pub enum TokenType {
    Bearer,
}

#[derive(Debug, Deserialize, Serialize, Clone, PartialEq, Eq, Copy, Hash)]
#[serde(rename_all = "lowercase")]
pub enum OauthProvider {
    Github,
    Google,
}

#[derive(TypedBuilder, Serialize, Deserialize, Debug, Clone, Validate)]
#[serde(rename_all = "camelCase")]
pub struct UserAccount {
    /// unique identifier for the oauth provider. Don't use name of user because that could be changed
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
    pub oauth_token: Option<String>,
    #[builder(default, setter(strip_option))]
    pub oauth_token_secret: Option<String>,
}
