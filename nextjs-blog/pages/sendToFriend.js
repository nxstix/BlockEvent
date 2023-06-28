import { useState, useEffect } from "react"
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import contractABI from "../artifacts/contracts/EventNFT.sol/EventNFT.json"
import { useAccount, useContractWrite } from 'wagmi';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { Web3Button } from '@web3modal/react';
import Modal from 'react-bootstrap/Modal';
import React from "react";



import Button from 'react-bootstrap/Button';
import { Container } from "react-bootstrap";

export default function senToFriend() {
  const router = useRouter();
  const imgSrc = router.query.imgsrc;
  const date = router.query.date;
  const tokenId = router.query.tokenid;
  const title = router.query.title;
  const location = router.query.location;
  const { address, isConnected } = useAccount();
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const [userSel, setUserSel] = useState({
    id: "",
    email: "",
    walletAddress: ""

  });
  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const { write, isSuccess } = useContractWrite({
    address: contractAddress,
    abi: contractABI.abi,
    functionName: 'sendToFriend',
    args: [address, userSel.walletAddress, tokenId],
    onError(error) {
      setShowModal(false);
      setShowError(true);
      console.log(error);
    }
  })

  useEffect(() => {
    if (isSuccess == true) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        router.push("/userTickets");
      }, 15000);
      return () => clearTimeout(timer);

    }
  }, [isSuccess]);



  //search user
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);

  function handleOptionClick(user) {
    if (!user.walletAddress) {
      setError("The selected user has no wallet connected")
    }
    setSearchQuery(user.email);
    setDropdownOptions([]);
    setUserSel(user);
  };

  const fetchDropdownOptions = async (searchQuery) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users?search=${searchQuery}`);
      const eventData = await response.json();
      const filteredOptions = eventData
        .filter((user) => user.email.toLowerCase().startsWith(searchQuery.toLowerCase()))
        .map((user) => ({
          id: user.id,
          email: user.email,
          walletAddress: user.walletAddress
        }));
      setDropdownOptions(filteredOptions);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (value.length > 0) {
      fetchDropdownOptions(value);
    } else {
      setSearchQuery('');
      setDropdownOptions([]);
    }
  };

  return (
    <Container>
      {isLoading ? (
        <>
          <h2 className="text-center">Sending the ticket to your friend...</h2>
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status"></div>
          </div>
        </>
      ) : (
        <div>
          <Modal show={showModal} onHide={() => { setShowModal(false); }}>
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
              <p>{error}</p>
            </Modal.Body>
          </Modal>
          <Card className="shadow-lg" style={{ marginTop: "4rem" }}>
            <Card.Img style={{ objectFit: "cover", objectPosition: "center", height: "33rem" }} variant="top" src={imgSrc} />
            <Card.Body>
              <Card style={{ padding: "1rem" }} className="shadow-lg">
                <Card.Title><b>{title}</b></Card.Title>
                <Card.Subtitle style={{ marginTop: "0.6rem" }} >{location + " | " + date}</Card.Subtitle>
                <Card.Text>Select your friend with their email</Card.Text>
                <Form className="d-flex">
                  <div style={{ position: 'relative' }} >
                    <Form.Control
                      type="search"
                      placeholder="Search"
                      className="me-2 shadow-lg"
                      size="sm"
                      aria-label="Search"
                      value={searchQuery}
                      style={{ minWidth: '35vw', height: '35px', boxShadow: 'none' }}
                      onChange={handleSearchInputChange}
                    />
                    {dropdownOptions.length > 0 && (
                      <div className="shadow-lg" style={{ position: 'absolute', top: '100%', left: 0, zIndex: 10, minWidth: '35.5vw' }}>
                        <Card style={{ minWidth: '100%' }}>
                          <Card.Body style={{ padding: '1rem', fontSize: '1rem' }}>
                            {dropdownOptions.map((option) => (
                              <Card.Text
                                style={{ color: '#000', marginBottom: '0.5rem' }}
                                onClick={() => handleOptionClick(option)}
                              >
                                {option.email}
                              </Card.Text>
                            ))}
                          </Card.Body>
                        </Card>
                      </div>
                    )}
                  </div>
                </Form>
              </Card>
              {isConnected && userSel.email != '' && (
                <div style={{ paddingTop: "1.5rem", paddingBottom: "0.5rem" }} className="d-flex flex-column align-items-center">
                  <Button variant="dark" size="sm" className="mb-4" onClick={() => { write?.(); setShowModal(true); }}>
                    Send your ticket to {userSel.email}
                  </Button>
                </div>
              )}
              {!isConnected && (
                <div style={{ paddingTop: "1.5rem", paddingBottom: "0.5rem" }} className="d-flex flex-column align-items-center">
                  <p style={{ paddingBottom: "1.5rem" }}>To send a ticket to your friend please connect your wallet.</p>
                  <Web3Button />
                </div>)}
            </Card.Body>
          </Card>
        </div>
      )}

    </Container>
  )
}