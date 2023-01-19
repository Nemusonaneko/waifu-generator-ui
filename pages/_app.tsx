import { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "react-query";
import { NotificationsProvider } from "@mantine/notifications";

const queryClient = new QueryClient();

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
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
    </>
  );
}

