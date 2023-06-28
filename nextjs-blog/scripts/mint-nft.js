//import dotenv from 'dotenv'

//dotenv.config()
const API_URL = "https://eth-sepolia.g.alchemy.com/v2/e_-YaL8gmwwok_l8WSmLUcZIRAMSyLfc"
const PUBLIC_KEY = "0xc08DbB5C09Eab748F1F487F5A080FcfDD833D858"
const PRIVATE_KEY = "6066ee9e2ae9ca3df272ca11d2363259bea21639a4eebb8bf7104e56346b6761"

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/EventNFT.sol/EventNFT.json")
const contractAddress = "0x94ba4ca7f3f316a579b5cc2cb8a9928203db4fb6"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

export default async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce

  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mintNFT(tokenURI).encodeABI(),
  }

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
          }
        }
      )
    })
    .catch((err) => {
      console.log(" Promise failed:", err)
    })
}
mintNFT("ipfs://QmYKnuwUX8D8ajYFeii6E5EfgwxMKwNF3rLr1odLJud5i6")

