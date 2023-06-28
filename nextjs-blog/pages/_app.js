import { SessionProvider } from "next-auth/react";
import Navbar from '../components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/globals.css"
import Footer from './footer';

// wallet
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
// wagmmi allows easy read and write smart contracts
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
// test net from Ethereum
import { sepolia } from 'wagmi/chains'

export default function App({ session2, Component, pageProps: { session, ...pageProps } }) {
  //const { data: session2, status } = getSession();
  const chains = [sepolia]
  const projectId = 'ed4d4e6d9f08a0939c9722b02ecff68d';

  // wagmi client
  const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, version: 1, chains }),
    publicClient
  })
  // web3modal Ethereum client
  const ethereumClient = new EthereumClient(wagmiConfig, chains)
  //Add walletAdress to user



  return (
    <SessionProvider session={session}>
      <WagmiConfig config={wagmiConfig}>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </SessionProvider>
  );
}
