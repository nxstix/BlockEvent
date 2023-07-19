async function main() {
    const MyNFT = await ethers.getContractFactory("EventNFT") // EventNFT is a factory for instances of the NFT contract

    // Start deployment, returning a promise that resolves to a contract object
    const myNFT = await MyNFT.deploy()                     
    await myNFT.deployed()
    //console.log("Contract deployed to address:", myNFT.address) // uncomment that line before runnning this script to get the smart contract address to put as value for the NEXT_PUBLIC_CONTRACT_ADDRESS variable in the .env file
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })