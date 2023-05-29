import Head from "next/head";
import {
  AppShell,
  Button,
  Header,
  Text,
  Flex,
  Menu,
  UnstyledButton,
} from "@mantine/core";
import React from "react";
import DogO from "../public/DogO.png";
import Image from "next/image";
import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import formatAddress from "../utils/address";
import Link from "next/link";
import { borgar, twitter, opensea, discord } from "../public/icons";
import blur from "../public/blur.webp";

export default function Layout({ children }: { children: any }) {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  return (
    <>
      <Head>
        <title>{"Nemu's Waifu Generator"}</title>
        <meta name="description" content="UwU" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/DogO.png" />
      </Head>
      <AppShell
        header={
          <Header height={{ base: 64, md: 72 }} withBorder>
            <div
              style={{ display: "flex", alignItems: "center", height: "100%" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "10px",
                  gap: "10px",
                }}
              >
                <Flex align="center" gap={5}>
                  <Menu>
                    <Menu.Target>
                      <UnstyledButton sx={{ width: 36, height: 36 }}>
                        {borgar}
                      </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Link href="/" style={{ textDecoration: "none" }}>
                        <Menu.Item>
                          <Text size="xl" fw={500}>
                            Home
                          </Text>
                        </Menu.Item>
                      </Link>
                      <Link href="/pass" style={{ textDecoration: "none" }}>
                        <Menu.Item>
                          <Text size="xl" fw={500}>
                            Waifu Pass
                          </Text>
                        </Menu.Item>
                      </Link>
                      {/* <Link href="/faq" style={{ textDecoration: "none" }}>
                        <Menu.Item>
                          <Text size="xl" fw={500}>
                            FAQ
                          </Text>
                        </Menu.Item>
                      </Link> */}
                      <Link
                        href="/disclaimers"
                        style={{ textDecoration: "none" }}
                      >
                        <Menu.Item>
                          <Text size="xl" fw={500}>
                            Disclaimers
                          </Text>
                        </Menu.Item>
                      </Link>
                    </Menu.Dropdown>
                  </Menu>
                  <Link href="/">
                    <Image src={DogO} alt="DogO" width={64} height={64} />
                  </Link>
                  <Text size="xl" fw={700}>
                    {"Nemu's Waifu Generator"}
                  </Text>
                </Flex>
              </div>
              <div
                style={{
                  display: "flex",
                  marginRight: "10px",
                  position: "absolute",
                  right: "10px",
                  gap: "5px",
                  alignItems: "center",
                }}
              >
                <UnstyledButton sx={{ width: 38, height: 38 }}>
                  <Link href="https://discord.gg/nbEN88q6dw" target="_blank">
                    {discord}
                  </Link>
                </UnstyledButton>

                <UnstyledButton sx={{ width: 44, height: 44 }}>
                  <Link href="https://twitter.com/waifugeneth" target="_blank">
                    {twitter}
                  </Link>
                </UnstyledButton>
                <UnstyledButton sx={{ width: 38, height: 38 }}>
                  <Link href="/" target="_blank">
                    {opensea}
                  </Link>
                </UnstyledButton>
                <UnstyledButton sx={{ width: 38, height: 38 }}>
                  <Link href="/" target="_blank">
                    <Image src={blur} width={40} height={40} alt="blur" />
                  </Link>
                </UnstyledButton>
                <Link href="/pass" style={{ textDecoration: "none" }}>
                  <Button radius="md" w={128}>
                    <Text size="md" fw={500}>
                      {"Waifu Pass"}
                    </Text>
                  </Button>
                </Link>
                <Button
                  radius="md"
                  w={148}
                  onClick={isConnected ? () => disconnect() : () => connect()}
                >
                  <Text size="sm" fw={500}>
                    {isConnected
                      ? ensName ?? formatAddress(address)
                      : "Connect Wallet"}
                  </Text>
                </Button>
              </div>
            </div>
          </Header>
        }
      >
        {children}
      </AppShell>
    </>
  );
}
