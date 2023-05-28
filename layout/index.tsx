import Head from "next/head";
import { AppShell, Button, Header, Navbar, Text, Stack } from "@mantine/core";
import React from "react";
import DogO from "../public/DogO.png";
import Image from "next/image";
import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import formatAddress from "../utils/address";
import Link from "next/link";

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
        navbar={
          <Navbar width={{ sm: 200 }} style={{ marginTop: "10px" }}>
            <div style={{ marginLeft: "5px", marginRight: "5px" }}>
              <Stack>
                <Link href="/" style={{textDecoration: "none"}}>
                  <Button fullWidth>
                    <Text size="lg">Home</Text>
                  </Button>
                </Link>
                <Link href="/pass" style={{textDecoration: "none"}}>
                  <Button fullWidth>
                    <Text size="lg">Waifu Pass</Text>
                  </Button>
                </Link>
                <Link href="/faq" style={{textDecoration: "none"}}>
                  <Button fullWidth>
                    <Text size="lg">FAQ</Text>
                  </Button>
                </Link>
                <Link href="/disclaimers" style={{textDecoration: "none"}}>
                  <Button fullWidth>
                    <Text size="lg">Disclaimers</Text>
                  </Button>
                </Link>
              </Stack>
            </div>
          </Navbar>
        }
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
                <Image src={DogO} alt="DogO" width={64} height={64} />
                <Text size="xl" fw={700}>
                  {"Nemu's Waifu Generator"}
                </Text>
              </div>
              <div
                style={{
                  display: "flex",
                  marginRight: "10px",
                  position: "absolute",
                  right: "10px",
                }}
              >
                <Button
                  radius="md"
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
