import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import UpdateUser from '../components/updateUser';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Modal from 'react-bootstrap/Modal';
import { getSession, signOut } from 'next-auth/react';
import { dateToDashString } from '../backend/utils/dateToString';

export async function getServerSideProps(context) {
    const session = await getSession(context);
    const user = session.session.user
    return {
        props: {
            user,
        },
    };
}

export default function Profile({ user }) {
    const [showDelete, setShowDelete] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const handleCloseUpdate = () => setShowUpdate(false)
    const handleCloseDelete = () => setShowDelete(false)
    const router = useRouter();


    async function onUpdate(data, user) {
        let { email, password, firstName, lastName, birthdate } = data;

        if (email === "") {
            email = user.email
        }
        if (password === "") {
            password = user.password
        } else if (password) {
            password = await bcrypt.hash(password, 10)
        }
        if (firstName === "") {
            firstName = user.firstName
        }
        if (lastName === "") {
            lastName = user.lastName
        }
        if (birthdate === "") {
            birthdate = user.birthdate
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${user._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'PUT',
                body: JSON.stringify({
                    id: user._id,
                    firstName,
                    lastName,
                    birthdate,
                    email,
                    password
                }),
            });
            if (response.ok) {
                // update successfull
                handleCloseUpdate()
                router.push('/profile');
            } else {
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function onDelete(userid) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userid}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'DELETE',
        })
        handleCloseDelete()
        await signOut({ callbackUrl: `${window.location.origin}` });
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
            <Modal show={showDelete} onHide={() => setShowDelete(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete your account?</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: "flex", justifyContent: "right" }}>
                    <Button style={{ marginRight: "1rem" }} onClick={() => setShowDelete(false)} size="sm" variant="dark">Cancel</Button>
                    <Button onClick={() => { onDelete(user._id); setShowDelete(false); }} size="sm" variant="danger">Delete</Button>
                </Modal.Body>
            </Modal>
            <Modal show={showUpdate} onHide={handleCloseUpdate}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User {user.firstName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UpdateUser user={user} updateUser={onUpdate} />
                </Modal.Body>
            </Modal>
            <Card className="shadow-lg" border="light" style={{ width: '80%', color: 'rgb(0,0,0)', marginTop: '2rem', padding: "1rem" }}>
                <Card.Title><b>{user.firstName} {user.lastName}</b></Card.Title>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Email adress</Form.Label>
                        <Form.Control
                            required
                            size="sm"
                            type="email"
                            placeholder={user.email}
                            autoFocus
                            disabled />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            required
                            size="sm"
                            type="text"
                            placeholder={user.firstName}
                            autoFocus
                            disabled
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Surname</Form.Label>
                        <Form.Control
                            required
                            size="sm"
                            type="text"
                            placeholder={user.lastName}
                            autoFocus
                            disabled
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Birthdate</Form.Label>
                        <Form.Control
                            required
                            size="sm"
                            type="date"
                            defaultValue={dateToDashString(user.birthdate)}
                            min="2001-02-01"
                            disabled
                        />
                    </Form.Group>
                    <Form.Check
                        inline
                        label="isAdministrator"
                        name="group1"
                        type="radio"
                        value="isAdministrator"
                        defaultChecked={user.isAdministrator}
                        disabled
                    />
                    <Form.Check
                        inline
                        label="isEventmanager"
                        name="group1"
                        type="radio"
                        value="isEventmanager"
                        defaultChecked={user.isEventmanager}
                        disabled
                    />
                    <Form.Check
                        inline
                        label="None"
                        name="group1"
                        type="radio"
                        value="none"
                        defaultChecked={!user.isEventmanager && !user.isAdministrator}
                        disabled
                    />
                    <div style={{ display: "flex", justifyContent: "right", paddingTop: "2rem", paddingRight: "1rem" }}>
                        <Button variant='dark' onClick={() => { setShowUpdate(true) }} size='sm'>
                            Edit
                        </Button>
                        <Button style={{ marginLeft: "1rem" }} onClick={() => setShowDelete(true)} size="sm" variant="danger">
                            Delete account
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
