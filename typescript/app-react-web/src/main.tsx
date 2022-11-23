import { createRoot } from "react-dom/client";
import { Outlet, RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { router } from "./router.jsx";
import { Avatar, Grid, MantineProvider } from "@mantine/core";
import { atom, useAtom } from "jotai";
// import { DoubleNavbar } from "./NavbarMain/Nav.jsx";

const colorSchemeAtom = atom<"light" | "dark">("dark");

export function App() {
  const [colorScheme, setColorScheme] = useAtom(colorSchemeAtom);

  return (
    <>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme }}
      >
        <Avatar
          color="cyan"
          radius="xl"
          onClick={() =>
            setColorScheme((prev) => (prev === "light" ? "dark" : "light"))
          }
        >
          OO
        </Avatar>

        <RouterProvider router={router}>
          {/* Normally <Router /> acts as it's own outlet,
            but if we pass it children, route matching is
            deferred until the first <Outlet /> is found. */}

          <Root />
        </RouterProvider>
        <TanStackRouterDevtools router={router} position="bottom-right" />
      </MantineProvider>
    </>
  );
}

function Root() {
  const routerState = router.useState();

  return (
    <Grid>
      <Grid.Col span={1}>
        {/* <DoubleNavbar /> */}
        erer
      </Grid.Col>
      <Grid.Col span={11}>
        {/* Render our first route match */}
        rer
        {/* <Outlet /> */}
      </Grid.Col>
    </Grid>
  );
}

// if (document) {
//   const rootElement = document.getElementById("app")!;
//   if (!rootElement.innerHTML) {
//     const root = createRoot(rootElement);
//     root.render(<App />);
//   }
// }
