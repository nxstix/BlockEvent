import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';



export default function LoginModal() {
    const [show, setShow] = useState(true);
    
    const handleClose = () => {
        setShow(false)
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {"Sign up"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Hallo
                </Modal.Body>
            </Modal>
            
        </>
    )
}