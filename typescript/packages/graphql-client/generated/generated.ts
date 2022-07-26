import { GraphQLClient } from "graphql-request";
import { RequestInit } from "graphql-request/dist/types.dom";
import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  UseMutationOptions,
  UseQueryOptions,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};

function fetcher<TData, TVariables>(
  client: GraphQLClient,
  query: string,
  variables?: TVariables,
  headers?: RequestInit["headers"]
) {
  return async (): Promise<TData> =>
    client.request<TData, TVariables>(query, variables, headers);
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * Implement the DateTime<Utc> scalar
   *
   * The input/output is a string in RFC3339 format.
   */
  DateTime: any;
  ObjectId: any;
};

export type AccountOauth = {
  __typename?: "AccountOauth";
  accessToken: Scalars["String"];
  displayName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  emailVerified: Scalars["Boolean"];
  /** access token expiration timestamp, represented as the number of seconds since the epoch (January 1, 1970 00:00:00 UTC). */
  expiresAt?: Maybe<Scalars["DateTime"]>;
  /** unique identifier for the oauth provider. Don't use name of user because that could be changed */
  id: Scalars["String"];
  idToken?: Maybe<Scalars["String"]>;
  oauthToken?: Maybe<Scalars["String"]>;
  oauthTokenSecret?: Maybe<Scalars["String"]>;
  provider: OauthProvider;
  providerAccountId: OauthProvider;
  refreshToken?: Maybe<Scalars["String"]>;
  scopes: Array<Scalars["String"]>;
  tokenType?: Maybe<TokenType>;
};

export type Address = {
  city: Scalars["String"];
  houseNumber: Scalars["String"];
  street: Scalars["String"];
  zip: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  createPost: Post;
  createUser: User;
  signIn: User;
  signOut: SignOutMessage;
  /**
   * Creates a new user but doesn't log in the user
   * Currently like this because of future developments
   */
  signUp: User;
};

export type MutationCreatePostArgs = {
  post: PostInput;
};

export type MutationCreateUserArgs = {
  userInput: UserInput;
};

export type MutationSignInArgs = {
  signInCredentials: SignInCredentials;
};

export type MutationSignUpArgs = {
  user: UserInput;
};

export enum OauthProvider {
  Github = "GITHUB",
  Google = "GOOGLE",
}

export type Post = {
  __typename?: "Post";
  content: Scalars["String"];
  id?: Maybe<Scalars["ObjectId"]>;
  poster: User;
  posterId: Scalars["ObjectId"];
  title: Scalars["String"];
};

export type PostInput = {
  content: Scalars["String"];
  title: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  getUser: User;
  me: User;
  post: Post;
  posts: Array<Post>;
  session: Session;
  user: User;
  users: Array<User>;
};

export type QueryGetUserArgs = {
  userBy: UserBy;
};

export type QueryPostArgs = {
  id: Scalars["ObjectId"];
};

export type QueryUserArgs = {
  id: Scalars["ObjectId"];
};

export enum Role {
  Admin = "ADMIN",
  User = "USER",
}

export type Session = {
  __typename?: "Session";
  expiresAt: Scalars["DateTime"];
  userId: Scalars["ObjectId"];
};

export type SignInCredentials = {
  password: Scalars["String"];
  username: Scalars["String"];
};

export type SignOutMessage = {
  __typename?: "SignOutMessage";
  message: Scalars["String"];
  userId: Scalars["ObjectId"];
};

export type Subscription = {
  __typename?: "Subscription";
  values: Scalars["Int"];
};

export enum TokenType {
  Bearer = "BEARER",
}

export type User = {
  __typename?: "User";
  accounts: Array<AccountOauth>;
  age?: Maybe<Scalars["Int"]>;
  city?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["DateTime"]>;
  email?: Maybe<Scalars["String"]>;
  emailVerified: Scalars["Boolean"];
  firstName?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["ObjectId"]>;
  lastName?: Maybe<Scalars["String"]>;
  postCount: Scalars["Int"];
  posts: Array<Post>;
  roles: Array<Role>;
  socialMedia: Array<Scalars["String"]>;
  username: Scalars["String"];
};

export type UserBy = {
  address?: InputMaybe<Address>;
  email?: InputMaybe<Scalars["String"]>;
  userId?: InputMaybe<Scalars["ObjectId"]>;
  username?: InputMaybe<Scalars["String"]>;
};

export type UserInput = {
  age?: InputMaybe<Scalars["Int"]>;
  city?: InputMaybe<Scalars["String"]>;
  email?: InputMaybe<Scalars["String"]>;
  firstName?: InputMaybe<Scalars["String"]>;
  lastName?: InputMaybe<Scalars["String"]>;
  password?: InputMaybe<Scalars["String"]>;
  socialMedia: Array<Scalars["String"]>;
  username: Scalars["String"];
};

export type SignInMutationVariables = Exact<{
  signInCredentials: SignInCredentials;
}>;

export type SignInMutation = {
  __typename?: "Mutation";
  signIn: {
    __typename?: "User";
    username: string;
    email?: string | null;
    age?: number | null;
  };
};

export type SignUpMutationVariables = Exact<{
  user: UserInput;
}>;

export type SignUpMutation = {
  __typename?: "Mutation";
  signUp: {
    __typename?: "User";
    username: string;
    email?: string | null;
    age?: number | null;
  };
};

export type SignOutMutationVariables = Exact<{ [key: string]: never }>;

export type SignOutMutation = {
  __typename?: "Mutation";
  signOut: { __typename?: "SignOutMessage"; userId: any; message: string };
};

export type SessionQueryVariables = Exact<{ [key: string]: never }>;

export type SessionQuery = {
  __typename?: "Query";
  session: { __typename?: "Session"; userId: any; expiresAt: any };
};

export type CreateUserMutationVariables = Exact<{
  userInput: UserInput;
}>;

export type CreateUserMutation = {
  __typename?: "Mutation";
  createUser: {
    __typename?: "User";
    id?: any | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    age?: number | null;
  };
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never }>;

export type GetUsersQuery = {
  __typename?: "Query";
  users: Array<{
    __typename?: "User";
    id?: any | null;
    firstName?: string | null;
    lastName?: string | null;
    age?: number | null;
    email?: string | null;
    socialMedia: Array<string>;
    createdAt?: any | null;
    posts: Array<{
      __typename?: "Post";
      posterId: any;
      title: string;
      content: string;
    }>;
  }>;
};

export type GetUserQueryVariables = Exact<{
  UserBy: UserBy;
}>;

export type GetUserQuery = {
  __typename?: "Query";
  getUser: {
    __typename?: "User";
    id?: any | null;
    firstName?: string | null;
    lastName?: string | null;
    age?: number | null;
    email?: string | null;
    socialMedia: Array<string>;
    createdAt?: any | null;
    posts: Array<{
      __typename?: "Post";
      posterId: any;
      title: string;
      content: string;
    }>;
  };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: "Query";
  me: {
    __typename?: "User";
    id?: any | null;
    username: string;
    firstName?: string | null;
    lastName?: string | null;
    age?: number | null;
    city?: string | null;
    roles: Array<Role>;
    email?: string | null;
    socialMedia: Array<string>;
    createdAt?: any | null;
    postCount: number;
    accounts: Array<{ __typename?: "AccountOauth"; provider: OauthProvider }>;
    posts: Array<{
      __typename?: "Post";
      posterId: any;
      title: string;
      content: string;
    }>;
  };
};

export const SignInDocument = `
    mutation signIn($signInCredentials: SignInCredentials!) {
  signIn(signInCredentials: $signInCredentials) {
    username
    email
    age
  }
}
    `;
export const useSignInMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    SignInMutation,
    TError,
    SignInMutationVariables,
    TContext
  >,
  headers?: RequestInit["headers"]
) =>
  useMutation<SignInMutation, TError, SignInMutationVariables, TContext>(
    ["signIn"],
    (variables?: SignInMutationVariables) =>
      fetcher<SignInMutation, SignInMutationVariables>(
        client,
        SignInDocument,
        variables,
        headers
      )(),
    options
  );
export const SignUpDocument = `
    mutation signUp($user: UserInput!) {
  signUp(user: $user) {
    username
    email
    age
  }
}
    `;
export const useSignUpMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    SignUpMutation,
    TError,
    SignUpMutationVariables,
    TContext
  >,
  headers?: RequestInit["headers"]
) =>
  useMutation<SignUpMutation, TError, SignUpMutationVariables, TContext>(
    ["signUp"],
    (variables?: SignUpMutationVariables) =>
      fetcher<SignUpMutation, SignUpMutationVariables>(
        client,
        SignUpDocument,
        variables,
        headers
      )(),
    options
  );
export const SignOutDocument = `
    mutation signOut {
  signOut {
    userId
    message
  }
}
    `;
export const useSignOutMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    SignOutMutation,
    TError,
    SignOutMutationVariables,
    TContext
  >,
  headers?: RequestInit["headers"]
) =>
  useMutation<SignOutMutation, TError, SignOutMutationVariables, TContext>(
    ["signOut"],
    (variables?: SignOutMutationVariables) =>
      fetcher<SignOutMutation, SignOutMutationVariables>(
        client,
        SignOutDocument,
        variables,
        headers
      )(),
    options
  );
export const SessionDocument = `
    query session {
  session {
    userId
    expiresAt
  }
}
    `;
export const useSessionQuery = <TData = SessionQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: SessionQueryVariables,
  options?: UseQueryOptions<SessionQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useQuery<SessionQuery, TError, TData>(
    variables === undefined ? ["session"] : ["session", variables],
    fetcher<SessionQuery, SessionQueryVariables>(
      client,
      SessionDocument,
      variables,
      headers
    ),
    options
  );
export const useInfiniteSessionQuery = <TData = SessionQuery, TError = unknown>(
  _pageParamKey: keyof SessionQueryVariables,
  client: GraphQLClient,
  variables?: SessionQueryVariables,
  options?: UseInfiniteQueryOptions<SessionQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useInfiniteQuery<SessionQuery, TError, TData>(
    variables === undefined
      ? ["session.infinite"]
      : ["session.infinite", variables],
    (metaData) =>
      fetcher<SessionQuery, SessionQueryVariables>(
        client,
        SessionDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
        headers
      )(),
    options
  );

export const CreateUserDocument = `
    mutation createUser($userInput: UserInput!) {
  createUser(userInput: $userInput) {
    id
    firstName
    lastName
    email
    age
  }
}
    `;
export const useCreateUserMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    CreateUserMutation,
    TError,
    CreateUserMutationVariables,
    TContext
  >,
  headers?: RequestInit["headers"]
) =>
  useMutation<
    CreateUserMutation,
    TError,
    CreateUserMutationVariables,
    TContext
  >(
    ["createUser"],
    (variables?: CreateUserMutationVariables) =>
      fetcher<CreateUserMutation, CreateUserMutationVariables>(
        client,
        CreateUserDocument,
        variables,
        headers
      )(),
    options
  );
export const GetUsersDocument = `
    query GetUsers {
  users {
    id
    firstName
    lastName
    age
    email
    socialMedia
    createdAt
    posts {
      posterId
      title
      content
    }
  }
}
    `;
export const useGetUsersQuery = <TData = GetUsersQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: GetUsersQueryVariables,
  options?: UseQueryOptions<GetUsersQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useQuery<GetUsersQuery, TError, TData>(
    variables === undefined ? ["GetUsers"] : ["GetUsers", variables],
    fetcher<GetUsersQuery, GetUsersQueryVariables>(
      client,
      GetUsersDocument,
      variables,
      headers
    ),
    options
  );
export const useInfiniteGetUsersQuery = <
  TData = GetUsersQuery,
  TError = unknown
>(
  _pageParamKey: keyof GetUsersQueryVariables,
  client: GraphQLClient,
  variables?: GetUsersQueryVariables,
  options?: UseInfiniteQueryOptions<GetUsersQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useInfiniteQuery<GetUsersQuery, TError, TData>(
    variables === undefined
      ? ["GetUsers.infinite"]
      : ["GetUsers.infinite", variables],
    (metaData) =>
      fetcher<GetUsersQuery, GetUsersQueryVariables>(
        client,
        GetUsersDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
        headers
      )(),
    options
  );

export const GetUserDocument = `
    query getUser($UserBy: UserBy!) {
  getUser(userBy: $UserBy) {
    id
    firstName
    lastName
    age
    email
    socialMedia
    createdAt
    posts {
      posterId
      title
      content
    }
  }
}
    `;
export const useGetUserQuery = <TData = GetUserQuery, TError = unknown>(
  client: GraphQLClient,
  variables: GetUserQueryVariables,
  options?: UseQueryOptions<GetUserQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useQuery<GetUserQuery, TError, TData>(
    ["getUser", variables],
    fetcher<GetUserQuery, GetUserQueryVariables>(
      client,
      GetUserDocument,
      variables,
      headers
    ),
    options
  );
export const useInfiniteGetUserQuery = <TData = GetUserQuery, TError = unknown>(
  _pageParamKey: keyof GetUserQueryVariables,
  client: GraphQLClient,
  variables: GetUserQueryVariables,
  options?: UseInfiniteQueryOptions<GetUserQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useInfiniteQuery<GetUserQuery, TError, TData>(
    ["getUser.infinite", variables],
    (metaData) =>
      fetcher<GetUserQuery, GetUserQueryVariables>(
        client,
        GetUserDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
        headers
      )(),
    options
  );

export const MeDocument = `
    query me {
  me {
    id
    username
    firstName
    lastName
    age
    city
    roles
    email
    socialMedia
    createdAt
    postCount
    accounts {
      provider
    }
    posts {
      posterId
      title
      content
    }
  }
}
    `;
export const useMeQuery = <TData = MeQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: MeQueryVariables,
  options?: UseQueryOptions<MeQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useQuery<MeQuery, TError, TData>(
    variables === undefined ? ["me"] : ["me", variables],
    fetcher<MeQuery, MeQueryVariables>(client, MeDocument, variables, headers),
    options
  );
export const useInfiniteMeQuery = <TData = MeQuery, TError = unknown>(
  _pageParamKey: keyof MeQueryVariables,
  client: GraphQLClient,
  variables?: MeQueryVariables,
  options?: UseInfiniteQueryOptions<MeQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useInfiniteQuery<MeQuery, TError, TData>(
    variables === undefined ? ["me.infinite"] : ["me.infinite", variables],
    (metaData) =>
      fetcher<MeQuery, MeQueryVariables>(
        client,
        MeDocument,
        { ...variables, ...(metaData.pageParam ?? {}) },
        headers
      )(),
    options
  );
