import { AppProps } from "next/app";
import "../styles/globals.css";
import { GlobalStyles } from "twin.macro";
import { Provider } from "jotai";
 import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
 import { useState } from "react";
import { ReactQueryDevtools } from "react-query/devtools";

 const App = ({ Component, pageProps }: AppProps) => {
   const [queryClient] = useState(() => new QueryClient());

   return (
     <QueryClientProvider client={queryClient}>
       <Hydrate state={pageProps.dehydratedState}>
         <GlobalStyles />
         <Component {...pageProps} />
         <ReactQueryDevtools initialIsOpen={false} />
       </Hydrate>
     </QueryClientProvider>
   );
 };

export default App;
