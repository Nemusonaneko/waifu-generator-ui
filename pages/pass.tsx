import {
  useAccount,
  useConnect,
  useContractRead,
  useContractWrite,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import Layout from "../layout";
import {
  Box,
  Button,
  Center,
  Container,
  Group,
  NumberInput,
  Text,
} from "@mantine/core";
import { GOERLI_WAIFU_PASS } from "../utils/contracts";
import { abi } from "../abis/nemupass";
import { parseEther } from "viem";
import React from "react";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Carousel } from "@mantine/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";
import BigNumber from "bignumber.js";
import { useWindowSize } from "../hooks/useWindowSize";

function importAll(r: any) {
  return r.keys().map(r);
}

const images = importAll(
  require.context("../public/waifus/", false, /\.(png|jpe?g|svg)$/)
);

export default function Pass() {
  const { isConnected } = useAccount();
  const [amountToMint, setAmountToMint] = React.useState<number>(1);

  const windowSize = useWindowSize();
  const width = (windowSize && windowSize.width) ?? 256;

  const { data: totalSupply } = useContractRead({
    address: GOERLI_WAIFU_PASS,
    abi: abi,
    functionName: "totalSupply",
  });

  const { isLoading, write } = useContractWrite({
    address: GOERLI_WAIFU_PASS,
    abi: abi,
    functionName: "mint",
    onError(error: Error) {
      showNotification({
        title: "Something went wrong!",
        message: error.message,
        color: "red",
        loading: false,
      });
    },
    onSuccess(data) {
      showNotification({
        title: "Transaction Sent!",
        loading: true,
        color: "green",
        message: (
          <Link
            href={`https://goerli.etherscan.io/tx/${data.hash}`}
            target="_blank"
          >
            {"View Transaction Here"}
          </Link>
        ),
      });
    },
  });

  // const waitForTransaction = useWaitForTransaction({
  //   confirmations: 1,
  //   hash: data?.hash,
  //   timeout: 300_000,
  //   onSuccess(data) {
  //     showNotification({
  //       title: "Transaction Successful!",
  //       message: (
  //         <Link
  //           href={`https://goerli.etherscan.io/tx/${data.transactionHash}`}
  //           target="_blank"
  //         >
  //           {"View Transaction Here"}
  //         </Link>
  //       ),
  //       color: "green",
  //       loading: false,
  //     });
  //   },
  //   onError(error) {
  //     showNotification({
  //       title: "Transaction Failed!",
  //       message: error.message,
  //       color: "red",
  //       loading: false,
  //     });
  //   },
  // });

  const autoplay = React.useRef(Autoplay({ delay: 2000 }));

  const { chain } = useNetwork();

  const { switchNetwork } = useSwitchNetwork({
    chainId: 5,
  });

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  async function onMint() {
    if (isConnected) {
      const toPay = new BigNumber(amountToMint).times(0.1).toNumber();
      write({
        args: [amountToMint],
        value: parseEther(`${toPay}`),
      });
    }
  }


  return (
    <Layout>
      <Container fluid>
        <Center>
          <Box w="95%">
            <Text size={36} fw={700}>
              Waifu Pass
            </Text>
          </Box>
        </Center>
        <Carousel
          height={256}
          loop
          plugins={[autoplay.current]}
          withControls={false}
          draggable={false}
          slidesToScroll={1}
          slideSize={256 / width}
          speed={1}
          slideGap="xs"
        >
          {images.map((x: any, i: number) => {
            return (
              <Carousel.Slide key={i}>
                <Image
                  src={x.default.src}
                  key={i}
                  alt="waifu"
                  width={256}
                  height={256}
                />
              </Carousel.Slide>
            );
          })}
        </Carousel>
        <Center>
          <Text size="md">{`Total Minted: ${totalSupply} / 1000`}</Text>
        </Center>
        <Group position="center" align="center" pt={10}>
          <Text size="md">{`Amount to Mint:`}</Text>
          <NumberInput
            min={1}
            max={10}
            disabled={Number(totalSupply) >= 1000}
            value={amountToMint}
            onChange={(x) => setAmountToMint(Number(x))}
            w={64}
          />
        </Group>
        <Center>
          <Text size="md">{`Total Cost to Mint: ${BigNumber(0.1)
            .times(amountToMint)
            .toString()} ETH + Gas`}</Text>
        </Center>
        <Center pt={5}>
          <Button
            radius="md"
            disabled={Number(totalSupply) >= 1000}
            size="md"
            onClick={
              !isConnected
                ? () => connect()
                : chain?.id === 5
                ? () => onMint()
                : () => switchNetwork?.(5)
            }
            loading={isLoading}
            w={192}
          >
            <Text size="lg">
              {!isConnected
                ? "Connect Wallet"
                : chain?.id === 5
                ? "Mint"
                : "Switch Network"}
            </Text>
          </Button>
        </Center>
      </Container>
    </Layout>
  );
}
