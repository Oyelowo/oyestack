import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";
import { z } from "zod";
// import type { PlaywrightTestConfig } from '@playwright/experimental-ct-react';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();
const processEnv = z
	.object({
		CI: z.boolean().optional(),
	})
	.parse(process.env);
/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
	testDir: "./tests",
	/* Maximum time one test can run for. */
	timeout: 30 * 1000,
	// ctViteConfig: {},
	webServer: [
		{
			command: "pnpm dev",
			// url: '',
			port: 5173,
			timeout: 120 * 1000,
			reuseExistingServer: !processEnv.CI,
		},
	],
	use: {
		baseURL: "http://localhost:5173/",
		/* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
		actionTimeout: 0,
		/* Base URL to use in actions like `await page.goto('/')`. */
		// baseURL: 'http://localhost:3000',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on-first-retry",
	},
	expect: {
		/**
		 * Maximum time expect() should wait for the condition to be met.
		 * For example in `await expect(locator).toHaveText();`
		 */
		timeout: 5000,
	},
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!processEnv.CI,
	/* Retry on CI only */
	retries: processEnv.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: processEnv.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: "html",
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

	/* Configure projects for major browsers */
	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
			},
		},

		{
			name: "firefox",
			use: {
				...devices["Desktop Firefox"],
			},
		},

		{
			name: "webkit",
			use: {
				...devices["Desktop Safari"],
			},
		},
		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: {
		//     ...devices['Pixel 5'],
		//   },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: {
		//     ...devices['iPhone 12'],
		//   },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: {
		//     channel: 'msedge',
		//   },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: {
		//     channel: 'chrome',
		//   },
		// },
	],
	/* Folder for test artifacts such as screenshots, videos, traces, etc. */
	// outputDir: 'test-results/',

	/* Run your local dev server before starting the tests */
	// webServer: {
	//   command: 'npm run start',
	//   port: 3000,
	// },
};

export default config;
