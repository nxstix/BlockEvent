import { React, useState } from 'react';
import { Button, Modal } from "react-bootstrap";
import { useRouter } from 'next/navigation'

export function NFTCard({ nft }) {
  const router = useRouter()
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };


  return (
    <div style={{ maxWidth: "13vw" }}>
      <div className="shadow-lg" style={{ width: '13vw', height: '35vh', backgroundColor: '#FFF', boxShadow: '0px 0px 25px rgba(0, 0, 0, 0.1)', backgroundPosition: 'center', overflow: 'hidden', position: 'relative', margin: '10px auto', cursor: 'pointer', borderRadius: '10px' }}>
        <img style={{ objectFit: "cover", objectPosition: "center", height: "35vh", filter: "brightness(70%)" }} src={nft.media[0].gateway} className="img img-responsive" />
        <div style={{ position: 'absolute', left: '15px', bottom: '65px', fontSize: '1.3rem', color: '#FFF', textShadow: '0px 0px 20px rgba(0, 0, 0, 0.5)', fontWeight: 'bold', transition: 'all linear 0.25s' }}>{nft.title}</div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button variant="secondary" size="sm" className="mb-4" onClick={handleShow}>
            Ticket info
          </Button>
          <Button variant="dark" size="sm" className="mb-4" onClick={() => { router.push({ pathname: `/sendToFriend`, query: { imgsrc: nft.media[0].gateway, date: nft.metadata.date, tokenid: nft.id.tokenId, title: nft.title, location: nft.metadata.location } }) }}>
            Send to friend
          </Button>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{nft.metadata.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{fontSize:"0.85rem"}} >
              <p style={{ fontWeight: "bold" }}>Duration:</p>
              <p>{nft.metadata.duration} hours</p>
              <br />
              <p style={{ fontWeight: "bold" }}>Date:</p>
              <p>{nft.metadata.date}</p>
              <br />
              <p style={{ fontWeight: "bold" }}>Location:</p>
              <p>{nft.metadata.location}</p>
              <br />
              <p style={{ fontWeight: "bold" }}>To display the NFT-Ticket in your wallet copy the NFT Id and Address:</p>
              <p style={{ fontWeight: "bold" }}>NFT Id:</p>
              <p style={{ wordWrap: 'break-word' }}>{nft.id.tokenId}</p>
              <br />
              <p style={{ fontWeight: "bold" }}>Address:</p>
              <p style={{ wordWrap: 'break-word' }}>{nft.contract.address}</p>
          </Modal.Body>
        </Modal>
    </div >
  );
}