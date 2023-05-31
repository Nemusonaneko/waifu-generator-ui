import { configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, goerli } from "wagmi/chains";

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli],
  [publicProvider()]
);

export const config = createConfig({
  publicClient,
  webSocketPublicClient,
});
