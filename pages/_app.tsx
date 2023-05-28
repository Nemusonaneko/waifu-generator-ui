import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "react-query";
import { NotificationsProvider } from "@mantine/notifications";
import { AppProps } from "next/app";
import { config } from "../components/Web3/index";
import { WagmiConfig } from "wagmi";

const queryClient = new QueryClient();

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <WagmiConfig config={config}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: "dark",
          }}
        >
          <QueryClientProvider client={queryClient}>
            <NotificationsProvider>
              <Component {...pageProps} />
            </NotificationsProvider>
          </QueryClientProvider>
        </MantineProvider>
      </WagmiConfig>
    </>
  );
}
