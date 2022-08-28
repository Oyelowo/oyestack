use std::fmt::Debug;

use oauth2::http::Uri;
use typed_builder::TypedBuilder;
use url::Url;

use super::{
    cache_storage::CacheStorage,
    github::GithubConfig,
    google::GoogleConfig,
    utils::{
        AuthUrlData, OauthConfigTrait, OauthError, OauthProviderTrait, OauthResult,
        RedirectUrlReturned,
    },
    AccountOauth, OauthProvider,
};

#[derive(Debug, TypedBuilder, Clone)]
pub struct Providers {
    #[builder(default, setter(strip_option))]
    github: Option<GithubConfig>,
    #[builder(default, setter(strip_option))]
    google: Option<GoogleConfig>,
}

// #[async_trait::async_trait]
impl Providers {
    pub async fn fetch_account<C: CacheStorage + Debug>(
        &self,
        redirect_url: Url,
        cache_storage: C,
    ) -> OauthResult<AccountOauth> {
        // let redirect_url = Url::parse(&format!("{base_url}{uri}")).map(RedirectUrlReturned)?;
        let redirect_url_wrapped = RedirectUrlReturned(redirect_url.clone());

        let code = redirect_url_wrapped.get_authorization_code().ok_or(
            OauthError::AuthorizationCodeNotFoundInRedirectUrl(redirect_url.to_string()),
        )?;

        // make .verify give me back both the csrf token and the provider
        let csrf_token = redirect_url_wrapped.get_csrf_token().ok_or(
            OauthError::CsrfTokenNotFoundInRedirectUrl(redirect_url.to_string()),
        )?;

        let evidence = AuthUrlData::verify_csrf_token(csrf_token, &cache_storage)
            .await
            .unwrap()
            .evidence;

        let account_oauth = match evidence.provider {
            OauthProvider::Github => {
                self.github
                    .as_ref()
                    .expect("You must provide github credentials")
                    .fetch_oauth_account(code, evidence.pkce_code_verifier)
                    .await
            }
            OauthProvider::Google => {
                self.google
                    .as_ref()
                    .expect("You must provide google oauth credentials")
                    .fetch_oauth_account(code, evidence.pkce_code_verifier)
                    .await
            }
        }?;

        Ok(account_oauth)
    }

    // pub async fn generate_auth_url_data<T: CacheStorage>(
    pub fn generate_auth_url_data(
        &self,
        oauth_provider: OauthProvider,
        // cache_storage: &mut T,
    ) -> AuthUrlData {
        // ) -> OauthResult<AuthUrlData> {
        // self.provider_configs.github.unwrap().basic_config().generate_auth_url()
        let auth_url_data = match oauth_provider {
            OauthProvider::Github => self
                .github
                .as_ref()
                .expect("no github config")
                .basic_config()
                .generate_auth_url(),
            OauthProvider::Google => self
                .google
                .as_ref()
                .expect("no google config")
                .basic_config()
                .generate_auth_url(),
        };

        // let cache = cg::RedisCache(redis.clone());
        // let p = self.cache_storage;
        // auth_url_data.save(cache_storage).await?;
        auth_url_data
        // Ok(auth_url_data)
    }
}
