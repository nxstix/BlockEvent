import { React, useState } from 'react';
import { Button, Collapse } from "react-bootstrap";
// import { useAccount, useContractWrite } from 'wagmi';
// import contractABI from "../artifacts/contracts/EventNFT.sol/EventNFT.json"
//import { getServerSideProps } from '../pages/events/[eventid]';
// import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import Link from 'next/link';

export function NFTCard({ nft }) {
  const router = useRouter()
  const [isVisible, initHs] = useState(false);
  // const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  // const { address, isConnected } = useAccount();

  // const { write, isSuccess } = useContractWrite({
  //   address: contractAddress,
  //   abi: contractABI.abi,
  //   functionName: 'sendToFriend',
  //   args: [address, "0x0f47a66EB2B6Fc3AA1EB585b2611B77fd8D99c4F", nft.id.tokenId],
  // })
  // console.log(typeof(nft.id.tokenId))
  const invokeCollapse = () => {
    return initHs(!isVisible)
  }
  return (
    <div style={{ maxWidth: "13vw" }}>
      <div className="shadow-lg" style={{ width: '13vw', height: '35vh', backgroundColor: '#FFF', boxShadow: '0px 0px 25px rgba(0, 0, 0, 0.1)', backgroundPosition: 'center', overflow: 'hidden', position: 'relative', margin: '10px auto', cursor: 'pointer', borderRadius: '10px' }}>
        <img style={{ objectFit: "cover", objectPosition: "center", height: "35vh", filter: "brightness(70%)" }} src={nft.media[0].gateway} className="img img-responsive" />
        <div style={{ position: 'absolute', left: '15px', bottom: '65px', fontSize: '1.3rem', color: '#FFF', textShadow: '0px 0px 20px rgba(0, 0, 0, 0.5)', fontWeight: 'bold', transition: 'all linear 0.25s' }}>{nft.title}</div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems:"center" }}>
          <Button variant="secondary" size="sm" className="mb-4" onClick={invokeCollapse}>
            Ticket info
          </Button>
          {/* <Link href={{pathname: `/sendToFriend/`}}> */}
          <Button variant="dark" size="sm" className="mb-4" onClick={()=> {router.push({pathname:`/sendToFriend`,query:{imgsrc:nft.media[0].gateway,date:nft.metadata.date,tokenid:nft.id.tokenId,title:nft.title,location: nft.metadata.location}})}}>
            Send to friend
          </Button>
          {/* </Link> */}
        </div>
        <Collapse in={isVisible}>
          <div id="collapsePanel">
            <div>
              <p style={{ fontWeight: "bold" }}>Duration:</p>
              <p>{nft.metadata.duration} hours</p>
              <p style={{ fontWeight: "bold" }}>Date:</p>
              <p>{nft.metadata.date}</p>
              <p style={{ fontWeight: "bold" }}>Location:</p>
              <p>{nft.metadata.location}</p>
              <br />
              <p style={{ fontWeight: "bold" }}>To display the NFT-Ticket in your wallet copy the NFT Id and Address:</p>
              <p style={{ fontWeight: "bold" }}>NFT Id:</p>
              <p style={{ wordWrap: 'break-word' }}>{nft.id.tokenId}</p>
              <p style={{ fontWeight: "bold" }}>Address:</p>
              <p style={{ wordWrap: 'break-word' }}>{nft.contract.address}</p>
            </div>
          </div>
        </Collapse>
      </div>
    </div >
  );
}

// export async function getServerSideProps(context){
//   const session = getSession(context);
//   try{
//     const response = await fetch(`http://localhost:3000/api/users/${session.session.user._id}`);
//     if(!response.ok){
//       throw new Error("Failed to fetch events here");
//     }
//     const user = await response.json();
//         return {
//             props: {
//                 user,
//             },
//         };
//     } catch (error) {
//         console.error(error.message);
//         return {
//             props: {
//                 event: null,
//             },
//         };
//     }
// }
