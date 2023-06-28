import { useState, useEffect } from 'react'
import { NFTCard } from '../components/nftCard'
import { useAccount } from 'wagmi'
import { Container, Card } from "react-bootstrap";
import { Web3Button } from '@web3modal/react';
import { useSession, getSession } from "next-auth/react";

function UserTickets() {
    const { data: session } = useSession();
    const { address, isConnected } = useAccount()
    const [NFTs, setNFTs] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    const fetchNFTs = async () => {
        if (isConnected) {
            const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
            let nfts;
            const api_key = "e_-YaL8gmwwok_l8WSmLUcZIRAMSyLfc"
            const baseURL = `https://eth-sepolia.g.alchemy.com/v2/${api_key}/getNFTs/`;
            var requestOptions = {
                method: 'GET'
            };
            const fetchURL = `${baseURL}?owner=${address}&contractAddresses\[\]=${contractAddress}`;
            nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
            if (nfts) {
                console.log("nfts:", nfts);
                setNFTs(nfts.ownedNfts);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchNFTs();
    }, [])

    return (
        <Container style={{ height: "90vh" }}>
            <h2 style={{ textAlign: 'center', marginTop: "3rem" }}>My Events</h2>
            {isConnected ? (
                isLoading ? (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status"></div>
                    </div>
                ) : (
                    NFTs.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'left' }}>
                            {NFTs.map(nft => (
                                <NFTCard key={nft.id.tokenId} nft={nft} />
                            ))}
                        </div>
                    ) : (
                        <p style={{ display: 'flex', gap: '20px', justifyContent: "center", marginTop: "15rem" }}>Your wallet looks quite empty, go buy some NFTs.</p>
                    )
                )
            ) : (
                <div>
                    <p style={{ display: 'flex', gap: '20px', justifyContent: "center", marginTop: "15rem" }}>To see your tickets please connect your wallet.</p>
                    <Web3Button style={{ display: 'flex', gap: '20px', justifyContent: "center", paddingTop: "2rem" }} />
                </div>
            )}
        </Container>

    );
}
export default UserTickets;