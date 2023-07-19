import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import UpdateUser from '../components/updateUser';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useRouter } from 'next/router';
import { dateToString } from '../backend/utils/dateToString';
import { getSession } from 'next-auth/react';
import bcrypt from "bcryptjs"

export async function getServerSideProps(context) {
    const session = await getSession(context)
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        let users = await response.json();
        users = users.filter(user => user.id !== session.session.user.id);
        return {
            props: {
                users,
            },
        };
    } catch (error) {
        console.error(error.message);
        return {
            props: {
                users: null
            },
        };
    }
}


function UserManagement({ users }) {
    const router = useRouter();
    const [showUpdate, setShowUpdate] = useState(false);

    const handleShowUpdate = () => setShowUpdate(true);
    const handleCloseUpdate = () => setShowUpdate(false)

    const [showDelete, setShowDelete] = useState(false);

    const handleShowDelete = () => setShowDelete(true);
    const handleCloseDelete = () => setShowDelete(false)

    const [userSel, setUserSel] = useState(users[0]);

    async function onUpdate(data, user) {
        let { email, password, firstName, lastName, birthdate, role } = data;

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'PUT',
                body: JSON.stringify({
                    id: user.id,
                    firstName,
                    lastName,
                    birthdate,
                    email,
                    password,
                    isAdministrator: role === 'isAdministrator',
                    isEventmanager: role === 'isEventmanager'
                }),
            });
            if (response.ok) {
                // update successfull
                handleCloseUpdate()
                router.push('/userManagement');
            } else {
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function onDelete(userid) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userid}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'DELETE',
        })
        handleCloseDelete()
        router.push('/userManagement');
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
            <Modal show={showDelete} onHide={() => setShowDelete(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete {userSel?.firstName}?</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: "flex", justifyContent: "right" }}>
                    <Button style={{ marginRight: "1rem" }} onClick={() => setShowDelete(false)} size="sm" variant="dark">Cancel</Button>
                    <Button onClick={() => { onDelete(userSel?.id); setShowDelete(false); }} size="sm" variant="danger">Delete</Button>
                </Modal.Body>
            </Modal>
            <Modal show={showUpdate} onHide={handleCloseUpdate}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User {userSel?.firstName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UpdateUser user={userSel} updateUser={onUpdate} />
                </Modal.Body>
            </Modal>
            <Card border="light" className="shadow-lg" style={{ width: '80%', color: 'rgb(0,0,0)', marginTop: '1rem' }}>
                <Card.Body>
                    <h4><b style={{ marginLeft: "2rem", paddingTop: "1rem" }}>User management</b></h4>
                    <div style={{ position: "relative", maxWidth: "100%" }}>
                        <div style={{ display: "flex", flexFlow: "row wrap", scrollBehavior: "smooth", WebkitOverflowScrolling: "touch", paddingBottom: "4rem", display: 'flex', justifyContent: 'center' }}>
                            {users.length !== 0 ? (
                                users.map((user) => (
                                    <Card key={user.id} border="light" className="shadow-lg" style={{ fontSize: "0.8rem", width: '20%', color: 'rgb(0,0,0)', margin: '1rem' }}>
                                        <Card.Body>
                                            <p ><strong>Email:</strong> {user.email}</p>
                                            <p ><strong>Firstname:</strong> {user.firstName}</p>
                                            <p ><strong>Surname:</strong> {user.lastName}</p>
                                            <p ><strong>Birthdate:</strong> {dateToString(user.birthdate)}</p>
                                            <p ><strong>Admin:</strong> {user.isAdministrator ? 'yes' : 'no'}</p>
                                            <p ><strong>Eventmanager:</strong> {user.isEventmanager ? 'yes' : 'no'}</p>
                                        </Card.Body>
                                        <div style={{ display: 'flex', justifyContent: 'right', padding: "0.5rem" }}>
                                            <Button style={{ marginRight: "0.5rem" }} size="sm" variant="warning" onClick={() => { setShowUpdate(true); setUserSel(user); }}>
                                                Edit
                                            </Button>
                                            <Button onClick={() => { setShowDelete(true); setUserSel(user); }} size="sm" variant="danger">
                                                Delete
                                            </Button>
                                        </div>
                                    </Card>
                                )))
                                :
                                (
                                    <div>No users found</div>
                                )}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default UserManagement;


