async function main() {
    const MyNFT = await ethers.getContractFactory("EventNFT") // MyNFT is a factory for instances of the NFT contract

    // Start deployment, returning a promise that resolves to a contract object
    const myNFT = await MyNFT.deploy()                     // starting deployment
    await myNFT.deployed()
    console.log("Contract deployed to address:", myNFT.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })