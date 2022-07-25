import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';
import '../styles/globals.css';
import { Provider } from 'jotai';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
  // { Component, pageProps: { session, ...pageProps } }: AppProps
  const [queryClient] = useState(() => new QueryClient());
  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Hydrate>{children}</Hydrate>
      </QueryClientProvider>
    </Provider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
import '@testing-library/jest-dom';
export { customRender as render };
export { rest };
export { setupServer };
