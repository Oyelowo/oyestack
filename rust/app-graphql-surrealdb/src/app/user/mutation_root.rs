use anyhow::Context as ContextAnyhow;
use lib_common::{
    authentication::{
        TypedSession, {generate_password_hash, validate_password, PasswordHashPHC, PasswordPlain},
    },
    error_handling::ApiHttpStatus,
};
use log::error;

use super::{
    error::{self, UserNotFoundError},
    Role, SignInCredentials, SignOutMessage, User,
};
use async_graphql::*;
use chrono::Utc;

use validator::Validate;

#[derive(Union)]
enum UserCreateResult {
    User(User),
    UserRegisterInvalidInputError(error::UserRegisterInvalidInputError),
    UserNotFoundError(error::UserNotFoundError),
    // UserBaseError(UserBaseError)
}

type UserSignUpResult = UserCreateResult;

#[derive(Union)]
enum UserSignInResult {
    User(User),
    UserSignInInvalidInputError(error::UserSignInInvalidInputError), // UserBaseError(UserBaseError)
    UserNotFoundError(error::UserNotFoundError),
}

#[derive(Union)]
enum UserSignOutResult {
    SignOutMessage(SignOutMessage),
    UserSessionExpiredError(error::UserSessionExpiredError),
    ServerError(error::ServerError),
}

macro_rules! session_from_ctx {
    ($ctx:expr) => {
        match TypedSession::from_ctx($ctx) {
            Ok(session) => session,
            Err(_) => {
                return error::ServerError {
                    message: "".to_string(),
                    solution: "".to_string(),
                }
                .into()
            }
        }
    };
}

macro_rules! get_current_user_id_unchecked {
    ($session:expr) => {
        match $session.get_current_user_id() {
            Ok(user_id) => user_id,
            Err(_) => {
                return error::UserSessionExpiredError {
                    message: "Bad thing".to_string(),
                    solution: "".to_string(),
                }
                .into()
            }
        }
    };
}

macro_rules! get_current_user_id_from_ctx {
    ($ctx:expr) => {
        get_current_user_id_unchecked!(session_from_ctx!($ctx))
    };
}

#[derive(Default)]
pub struct UserMutationRoot;

#[Object]
impl UserMutationRoot {
    async fn create_user(
        &self,
        ctx: &async_graphql::Context<'_>,
        #[graphql(desc = "user data")] user_input: User,
    ) -> Result<UserCreateResult> {
        user_input.validate()?;
        // let db = get_db_from_ctx(ctx)?;
        todo!()
    }

    async fn sign_in(
        &self,
        ctx: &async_graphql::Context<'_>,
        #[graphql(desc = "sign in credentials")] sign_in_credentials: SignInCredentials,
    ) -> Result<UserSignInResult> {
        /*    let db = get_db_from_ctx(ctx)?;
            let session = TypedSession::from_ctx(ctx)?;
            let maybe_user_id = session.get_user_id::<uuid::Uuid>().ok();

            // Return user if found from session
            match maybe_user_id {
                Some(ref user_id) => {
                    let user = User::find_by_id(db, user_id).await;
                    session.renew();
                    log::info!("Successfully authenticated and renew session for user: {user_id}");
                    user
                }
                // If not found from session, handle fresh signin flow
                None => {
                    let user = User::find_by_username(db, sign_in_credentials.username).await?;

                    let password_hash = &user.password.clone().ok_or_else(|| {
                        error!("Password does not exist for normal signed in user 🤔");
                        ApiHttpStatus::Unauthorized("Invalid Credentials".into()).extend()
                    })?;

                    let plain_password = PasswordPlain::new(sign_in_credentials.password);
                    let hashed_password = PasswordHashPHC::new(password_hash);
                    let user_id = user.id.ok_or_else(|| {
                        error!("Invalid user_id");
                        ApiHttpStatus::InternalServerError("Malformed id".into()).extend()
                    })?;

                    validate_password(plain_password, hashed_password)
                        .await
                        .map_err(|e| {
                            error!("Invalid password by user: {user_id}. Error: {e:?}");
                            ApiHttpStatus::Unauthorized("Invalid Credentials".into()).extend()
                        })?;

                    session.insert_user_id(&user_id);
                    Ok(user)
                }
            }
        */
        todo!()
    }

    // async fn sign_out(&self, ctx: &async_graphql::Context<'_>) -> Result<SignOutMessage> {
    async fn sign_out(&self, ctx: &async_graphql::Context<'_>) -> UserSignOutResult {
        let session = session_from_ctx!(ctx);
        let user_id = get_current_user_id_unchecked!(session);

        session.purge();

        SignOutMessage {
            message: "Successfully signed out".into(),
            user_id,
        }
        .into()
    }

    /// Creates a new user but doesn't log in the user
    /// Currently like this because of future developments
    async fn sign_up(
        &self,
        ctx: &async_graphql::Context<'_>,
        #[graphql(desc = "Sign Up credentials")] user: User,
    ) -> Result<UserSignUpResult> {
        todo!()
    }
}
