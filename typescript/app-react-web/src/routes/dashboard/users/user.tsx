import * as React from "react";
import { router } from "../../../router.tsx";
import { fetchUserById } from "../../../mockTodos.ts";
import { usersRoute } from "./index.tsx";

export const userRoute = usersRoute.createRoute({
  path: ":userId",
  parseParams: ({ userId }) => ({ userId: Number(userId) }),
  stringifyParams: ({ userId }) => ({ userId: `${userId}` }),
  component: User,
  loader: async ({ params: { userId } }) => {
    return {
      user: await fetchUserById(userId),
    };
  },
});

function User() {
  const {
    loaderData: { user },
  } = router.useMatch(userRoute.id);

  return (
    <>
      <h4 className="p-2 font-bold">{user?.name}</h4>
      <pre className="text-sm whitespace-pre-wrap">
        {JSON.stringify(user, null, 2)}
      </pre>
    </>
  );
}