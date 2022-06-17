use chrono::{Duration, Utc};
use oauth2::{
    reqwest::async_http_client, AuthUrl, AuthorizationCode, ClientId, ClientSecret, CsrfToken,
    PkceCodeVerifier, RedirectUrl, Scope, TokenResponse, TokenUrl,
};
use serde::{Deserialize, Serialize};

use super::utils::{
    OauthConfig, OauthError, OauthProviderTrait, OauthResult, OauthUrl, REDIRECT_URL,
};
use crate::{
    app::user::{AccountOauth, OauthProvider, Role, TokenType, User},
    oauth::utils::OauthConfigTrait,
};


#[derive(Debug, Deserialize, Serialize)]
struct GithubUserData {
    id: u32,
    login: String,
    #[serde(rename = "type")]
    account_type: String,
    name: String,
    email: Option<Option<String>>,
    avatar_url: Option<String>,
    gravatar_id: Option<String>,
    url: Option<String>,
    location: Option<String>,
    // Many other irrelevant fields discarded
}

#[derive(Debug, Deserialize)]
struct GithubEmail {
    email: String,
    primary: bool,
    verified: bool,
    visibility: Option<String>,
}
#[derive(Debug, Clone)]
pub(crate) struct GithubConfig {
    pub(crate) basic_config: OauthConfig,
}

impl GithubConfig {
    pub fn new() -> Self {
        let k = CsrfToken::new_random;
        let basic_config = OauthConfig {
            // Get first two from environment variable
            client_id: ClientId::new("7b42a802131cb19d2b49".to_string()),
            client_secret: ClientSecret::new("bd30006cbcdb2a40901c9d4207a4a79d8c4f67c0".into()),
            auth_url: AuthUrl::new("https://github.com/login/oauth/authorize".to_string())
                .expect("Invalid authorization endpoint URL"),
            token_url: TokenUrl::new("https://github.com/login/oauth/access_token".to_string())
                .expect("Invalid token endpoint URL"),
            redirect_url: RedirectUrl::new(REDIRECT_URL.to_string()).expect("Invalid redirect URL"),
            scopes: vec![
                Scope::new("public_repo".into()),
                Scope::new("read:user".into()),
                Scope::new("user:email".into()),
            ],
            provider: OauthProvider::Github,
            revocation_url: None,
        };
        Self { basic_config }
    }
}

#[async_trait::async_trait]
impl OauthProviderTrait for GithubConfig {
    fn basic_config(&self) -> OauthConfig {
        self.basic_config.to_owned()
    }

    async fn fetch_oauth_account(
        &self,
        code: AuthorizationCode,
        pkce_verifier: PkceCodeVerifier,
    ) -> OauthResult<User> {
        let token = self
            .basic_config()
            .client()
            .exchange_code(code)
            .set_pkce_verifier(pkce_verifier)
            .request_async(async_http_client)
            .await
            .map_err(|e| OauthError::TokenFetchFailed(e.to_string()))?;

        print!("FFFFFF{:?}", token.access_token().secret().to_string());
        let profile = OauthUrl("https://api.github.com/user")
            .fetch_resource::<GithubUserData>(&token, None)
            .await?;

        let user_emails = OauthUrl("https://api.github.com/user/emails")
            .fetch_resource::<Vec<GithubEmail>>(&token, None)
            .await?;

        // Get the primary email or any first
        let primary_email = user_emails
            .iter()
            .filter(|r| r.primary)
            .next()
            .or_else(|| user_emails.first());

        // TODO: First search the database if the user exists, if exists, just update, else create
        // User::find({profile: profile.id, provider: provider});
        let expiration = token.expires_in().unwrap_or(std::time::Duration::new(0, 0));
        let expiration = Duration::from_std(expiration).unwrap_or(Duration::seconds(0));
        let expires_at = Utc::now() + expiration;
        let scopes = self
            .basic_config()
            .scopes
            .iter()
            .map(|x| x.to_string())
            .collect::<Vec<String>>();

        let account = AccountOauth::builder()
            .id(profile.id.to_string())
            .account_type(profile.account_type)
            .provider(OauthProvider::Github)
            .provider_account_id(OauthProvider::Github)
            .access_token(token.access_token().secret().into())
            .refresh_token(token.refresh_token().map(|rf| rf.secret().into()))
            .expires_at(Some(expires_at))
            .token_type(Some(TokenType::Bearer))
            .scopes(scopes)
            .build();

        let autogenerated_id = uuid::Uuid::new_v4().to_string();
        let email = primary_email.map(|p| p.email.to_string());
        let user = User::builder()
            .username(format!("{}-{autogenerated_id}", profile.login))
            .email(email.or(profile.email.unwrap_or_default()))
            .roles(vec![Role::User])
            .accounts(vec![account])
            .age(None)
            .password(None)
            .build();

        Ok(user)
    }
}
