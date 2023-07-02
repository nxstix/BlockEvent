import { Web3Button } from '@web3modal/react';
import Modal from 'react-bootstrap/Modal';
import React from 'react';

export default function Web3Modal({ showConnectWallet, setShowConnectWallet }) {
    return (
        <Modal show={showConnectWallet} onHide={() => setShowConnectWallet(false)} >
            <Modal.Header closeButton>
                <Modal.Title>Connect Wallet</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <p>
                    To access all features, please connect your wallet.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '10px' }}></p>
                    <Web3Button onClick={() => { setShowConnectWallet(false) }} />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ fontSize: '0.8rem', marginRight: '10px' }}>
                        If you don't have a wallet, we recommend downloading the
                        <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer"> MetaMask </a>
                        app.
                    </p>
                </div>
            </Modal.Footer>
        </Modal>
    )
}