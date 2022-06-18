import HomePage from "../components/HomePage";
import "twin.macro";
import { useSession, useSignOut } from "../hooks/authentication";
import { useGetUserQuery, useGetUsersQuery, useMeQuery } from "@oyelowo/graphql-client";
import { client } from "../config/client";

export default function Home() {
  const { signOutCustom } = useSignOut();
  const { session, isLoading, isAuth, isIdle } = useSession();
  const { data: { me } = {} } = useMeQuery(client);

  if (isLoading) {
    return (
      <div tw="bg-black h-screen text-white">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (session) {
    return (
      <div tw="bg-black h-screen text-white">
        Signed in as:
        <div>
          Email: {session.userId} <br />
          Username: {me?.username} <br />
          Email: {me?.email} <br />
          Post: {me?.postCount} <br />
        </div>
        <button onClick={() => signOutCustom()}>Sign out</button>
        <HomePage />
      </div>
    );
  }

  return null;
}
