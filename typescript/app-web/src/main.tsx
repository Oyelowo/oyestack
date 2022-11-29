import { createRoot } from "react-dom/client";
import { Outlet, RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { router } from "./router.js";
import { Avatar, Grid, MantineProvider } from "@mantine/core";
import { atom, useAtom } from "jotai";
import { DoubleNavbar } from "./NavbarMain/Nav.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
if (!window.Temporal) {
	await import("@js-temporal/polyfill").then((polyfill) => {
		Date.prototype.toTemporalInstant = polyfill.toTemporalInstant;
		window.Temporal = polyfill.Temporal;
		(window as any).Intl = polyfill.Intl;
	});
}

const colorSchemeAtom = atom<"light" | "dark">("dark");
const queryClient = new QueryClient();

function App() {
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
					<QueryClientProvider client={queryClient}>
						{/* Normally <Router /> acts as it's own outlet,
            but if we pass it children, route matching is
            deferred until the first <Outlet /> is found. */}
						{Temporal.Now.zonedDateTimeISO().toString()}
						<Root />
					</QueryClientProvider>
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
				<DoubleNavbar />
			</Grid.Col>
			<Grid.Col span={11}>
				{/* Render our first route match */}
				<Outlet />
			</Grid.Col>
		</Grid>
	);
}

if (document) {
	const rootElement = document.getElementById("app")!;
	if (!rootElement.innerHTML) {
		const root = createRoot(rootElement);
		root.render(<App />);
	}
}