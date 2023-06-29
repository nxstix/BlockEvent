import Card from 'react-bootstrap/Card';
import React from "react";
import { Button, Container } from "react-bootstrap";
import contractABI from "../../artifacts/contracts/EventNFT.sol/EventNFT.json"
import priceABI from "./PriceAbi.json"
import { usePrepareContractWrite, useContractWrite, useAccount, useContractRead } from 'wagmi'
import SuccessPage from '../../components/successPage';
import { useState, useEffect } from 'react';
import { ethers } from "ethers"
import Modal from 'react-bootstrap/Modal';
import { Web3Button } from '@web3modal/react';
import { useSession } from 'next-auth/react';
const { dateAndTimeToString } = require("../../backend/utils/dateToString");


export default function eventDetails({ event }) {
  const [showError, setShowError] = useState(false);
  const [show, setShow] = useState(false);
  const [price, setPrice] = useState("0000");
  const [showModal, setShowModal] = useState(false);
  const ipfs = event?.ipfs;
  const weiPrice = ethers.utils.parseEther(price);
  const { address, isConnected } = useAccount();
  const { data: session } = useSession();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;


  const { data: latestRoundData, isSuccess: isSuccessRound } = useContractRead({
    address: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    abi: priceABI,
    functionName: 'latestRoundData',
  })

  const { data: decimals, isSuccess: isSuccessdecimals } = useContractRead({
    address: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
    abi: priceABI,
    functionName: 'decimals',
  })


  const { write, isSuccess } = useContractWrite({
    address: contractAddress,
    abi: contractABI.abi,
    functionName: 'mintNFT',
    args: [address, ipfs, weiPrice],
    value: weiPrice,
    onError(error) {
      setShowModal(false);
      setShowError(true);
      console.log(weiPrice)
    }
  })

  function setEthPrice() {
    if (latestRoundData && decimals) {
      let price = latestRoundData.toString().split(',')
      price = (+price[1] / Math.pow(10, decimals));
      price = (event.price * (1 / price)).toFixed(5);
      setPrice(price.toString());
    }
  }
  React.useEffect(() => { setEthPrice(); }, [isSuccessRound, isSuccessdecimals]);
  React.useEffect(() => { if (isSuccess == true) { setShow(true); setShowModal(false); } }, [isSuccess]);

  if (!event) {
    return <div>Not found</div>
  }

  return (
    <div>
      {!show && (
        <Container>
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Transaction is on the way</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Check your wallet to confirm the transaction.</p>
            </Modal.Body>
          </Modal>
          <Modal show={showError} onHide={() => setShowError(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Transaction failed</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>The transaction failed or was rejected. Please try again</p>
            </Modal.Body>
          </Modal>
          <Card className="shadow-lg" style={{ marginTop: "4rem" }}>
            <Card.Img style={{ objectFit: "cover", objectPosition: "center", height: "33rem" }} variant="top" src={event.image} />
            <Card.Body>
              <Card style={{ padding: "1rem" }} className="shadow-lg">
                <Card.Title><b>{event.title}</b></Card.Title>
                <Card.Subtitle style={{ marginTop: "0.6rem" }} >{event.location + " | " + dateAndTimeToString(new Date(event.date))}</Card.Subtitle>
                <Card.Text>Price: {event.price} USD ≈ {price} ETH </Card.Text>
                <Card.Text style={{ marginTop: "1rem" }}>{event.description}</Card.Text>
              </Card>
              {isConnected && session && (
                <div style={{ paddingTop: "1.5rem", paddingBottom: "0.5rem" }} className="d-flex flex-column align-items-center">
                  <Button size="lg" variant="outline-secondary" onClick={() => { write?.(); setShowModal(true); }}>Buy NFT Ticket</Button>
                </div>
              )}
              {!isConnected && session && (
                <div style={{ paddingTop: "1.5rem", paddingBottom: "0.5rem" }} className="d-flex flex-column align-items-center">
                  <p style={{ paddingBottom: "1.5rem" }}>To buy a ticket please connect your wallet.</p>
                  <Web3Button />
                </div>
              )}
              {!session && (
                <div style={{ paddingTop: "1.5rem", paddingBottom: "0.5rem" }} className="d-flex flex-column align-items-center">
                  <p>To buy a ticket please login.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>
      )}
      {show && (
        <SuccessPage></SuccessPage>
      )}
    </div>
  )
}

export async function getServerSideProps(context) {
  const { eventid } = context.query
  try {
    const response = await fetch(`${process.env.VERCEL_URL}/api/events/${eventid}`);
    if (!response.ok) {
      throw new Error("Failed to fetch events here");
    }
    const event = await response.json();
    return {
      props: {
        event,
      },
    };
  } catch (error) {
    console.error(error.message);
    return {
      props: {
        event: null,
      },
    };
  }
}
