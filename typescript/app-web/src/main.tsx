import { createRoot } from "react-dom/client";
import { Outlet, RouterProvider } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { router } from "./router.js";
import { Avatar, Grid, MantineProvider } from "@mantine/core";
import { atom, useAtom } from "jotai";
import { DoubleNavbar } from "./NavbarMain/Nav.js";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import React, { FC, lazy, useEffect } from "react";
import {
	defineMessage,
	FormattedMessage,
	FormattedNumber,
	IntlProvider,
	useIntl,
} from "react-intl";
import { Locale } from "./config/Locale.js";
import { match } from "ts-pattern";

// Translated messages in French with matching IDs to what you declared
const messagesInFrench = {
	myMessage: "Aujourd'hui, c'est le {ts, date, ::yyyyMMdd}",
};

if (!window.Temporal) {
	await import("@js-temporal/polyfill").then((polyfill) => {
		Date.prototype.toTemporalInstant = polyfill.toTemporalInstant;
		window.Temporal = polyfill.Temporal;
		// (window as any).Intl = polyfill.Intl;
	});
}

const colorSchemeAtom = atom<"light" | "dark">("dark");
const queryClient = new QueryClient();

function App() {
	const [colorScheme, setColorScheme] = useAtom(colorSchemeAtom);

	return (
		<>
<LocaleProv>
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
				<FormattedMessage defaultMessage="My name is {name}"values={{name: "lowo"}}/>
				<FormattedMessage defaultMessage="They know the place another {place}" values={{place: "lowo"}}/>

				<RouterProvider router={router} defaultPreload="intent" />
				<QueryClientProvider client={queryClient}>
					<>
						{/* <IntlProvider
					messages={localeData}
					locale="fr"
					defaultLocale="en"
				> */}
					</>
					{/* </IntlProvider> */}
				</QueryClientProvider>
			</MantineProvider>
					</LocaleProv>
		</>
	);
}

async function importMessages(locale: Locale) {
	return import(`./locales/compiled-lang/${locale}.json`);
}
const LocaleProv: FC<{ children: React.ReactElement }> = ({ children }) => {
	const locale = "fr";
	type LocaleMessages = any;
	const [messages, setMessages] = React.useState<LocaleMessages | null>(null);
	useEffect(() => {
		importMessages(locale).then((locale) => {
			console.log("mppmp", locale.default);
			setMessages(locale.default);
		});
	}, [locale]);

	// 	const locale: Locale = "fr";
	// 	const { data: localeData } = useQuery(["locale", locale], () =>
	// 		loadLocaleData(locale),
	// 	);

	// 	const messagesInFrench = {
	//   myMessage: "Aujourd'hui, c'est le {ts, date, ::yyyyMMdd}",
	// };
	return (
		<IntlProvider messages={messages} locale={locale} defaultLocale="en">
			{children}
		</IntlProvider>
	);
};

const rootElement = document.getElementById("app");

if (!rootElement?.innerHTML) {
	const root = createRoot(rootElement!);
	root.render(<App />);
}

// export async function bootstrapApplication(locale: Locale) {
//   const messages = await loadLocaleData(locale)
//   return <App locale={locale} messages={messages.default} />
// }
