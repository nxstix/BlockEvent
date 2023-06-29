import Button from 'react-bootstrap/Button';
import { signIn, getProviders } from 'next-auth/react';
import { useSession, signOut } from "next-auth/react";
import { Web3Button } from '@web3modal/react';
import { useWeb3ModalTheme } from '@web3modal/react';
import { disconnect } from '@wagmi/core'
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form'
import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'


export default function LoginModal() {
    const [account, haveAccount] = useState(true);
    const [show, setShow] = useState(false);
    const [showConnectWallet, setShowConnectWallet] = useState(false);
    const [warningText, setWarningText] = useState("");
    const [buttonColor, setButtonColor] = useState("dark");

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false)
        setWarningText("")
        haveAccount(true)
        setButtonColor("dark")
    };

    async function handleLogin(data) {
        const { email, password } = data;
        const result = await signIn('credentials', {
            redirect: false,
            email: email.toLowerCase(),
            password,
        });
        if (result.error) {
            setButtonColor("danger");
            setWarningText("Email or password is wrong");
        } else {
            haveAccount(true);
            handleClose();
        }
    }
    const handleLogout = async () => {
        await disconnect()
        await signOut({ callbackUrl: `${window.location.origin}`});
    }

    async function handleRegistration(data) {
        const { email, password, firstName, lastName, birthdate } = data;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
            method: 'POST',
            body: JSON.stringify({
                firstName,
                lastName,
                birthdate,
                email,
                password,
                'isAdministrator': false,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            // registration successful
            await handleLogin({ email: email, password: password });
            handleClose();
            setShowConnectWallet(true)
        } else {

        }
    }

    const { theme, setTheme } = useWeb3ModalTheme();
    React.useEffect(() => {
        setTheme({
            themeMode: 'dark',
            themeVariables: {
                '--w3m-font-family': 'Roboto, sans-serif',
                '--w3m-accent-color': '#000000'
            }
        });
    }, []);

    async function switchModal() {
        if (account) {
            haveAccount(false);
            setWarningText("");
            setButtonColor("dark")
        } else {
            haveAccount(true);
            setButtonColor("dark")
        }
    }

    return (
        <>
            <LoginLogoutButton handleShow={handleShow} />
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {account ? "Login" : "Sign up"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {account ? <LoginForm changeForm={handleLogin} /> : <RegistrationForm changeForm={haveAccount} />}

                </Modal.Body>
            </Modal>
            <Web3Modal />
        </>
    )

    function Web3Modal() {
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
                        <Web3Button onClick={() => setShowConnectWallet(false)} />
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

    function LoginLogoutButton() {
        const { data: session } = useSession();
        return (
            <>
                {session ?
                    <Button onClick={handleLogout} variant='secondary' size="sm" className="me-2 shadow-lg">
                        Logout
                    </Button>
                    :
                    <Button onClick={handleShow} variant='secondary' size="sm"className="me-2 shadow-lg">
                        Login
                    </Button>
                }
            </>
        )
    }

    function LoginForm() {
        const { register, handleSubmit } = useForm()
        return (
            <>
                <Form noValidate onSubmit={handleSubmit(handleLogin)}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Email adress</Form.Label>
                        <Form.Control
                            required
                            size="sm"
                            type="email"
                            placeholder="Email adress"
                            autoFocus
                            {...register("email")} />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            required
                            size="sm"
                            type="password"
                            placeholder="Password"
                            autoFocus
                            {...register("password")} />
                    </Form.Group>
                    <p style={{ fontSize: "0.8rem", color: "rgb(255,0,0)" }}>{warningText}</p>
                    <div style={{ display: "flex", justifyContent: "right", paddingTop: "1rem", paddingRight: "1rem" }}>
                        <Button style={{ marginRight: "0.5rem" }} variant='third' onClick={switchModal}>
                            Sign Up?
                        </Button>
                        <Button variant={buttonColor} type='submit' size='sm'>Login</Button>
                    </div>
                </Form>
            </>
        )
    }

    function RegistrationForm() {
        const schema = yup.object({
            email: yup.string().required("An email is required").email("Email is not valid"),
            password: yup.string().required("A password is required").min(5, "Password must be at least 5 characters"),
            confirmPassword: yup.string().min(5, "Password must be at least 5 characters").oneOf([yup.ref("password")], "Passwords do not match").required("You have to confirm your password"),
            firstName: yup.string().required("A first name is required").matches(/^[A-Za-z\s]+$/, "First Name must contain only letters"),
            lastName: yup.string().required("A surname is required").matches(/^[A-Za-z\s]+$/, "Surname must contain only letters"),
            birthdate: yup.date().required("A birthdate is required").typeError("A birthdate is required").min(new Date("1900-01-01"), "You must be be alive")
        })
        const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
        console.log(errors)
        const onSubmit = (data) => {
            handleSubmit(handleRegistration)(data);
        };
        const password = watch("password", "");
        return (
            <>
                <Form noValidate onSubmit={onSubmit}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Email adress</Form.Label>
                        <Form.Control
                            required
                            size="sm"
                            type="email"
                            placeholder="Email adress"
                            autoFocus
                            {...register("email")} />
                        <p style={{ fontSize: "0.8rem", color: "red", marginTop: "0.5rem", paddingLeft: "0.5rem" }}>{errors.email?.message}</p>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label style={{ marginBottom: 0 }}>Password</Form.Label>
                        <div>
                            <Form.Text muted>
                                Minimum password length is 5 characters
                            </Form.Text>
                        </div>
                        <Form.Control
                            required
                            size="sm"
                            type="password"
                            placeholder="Password"
                            autoFocus
                            {...register("password")} />
                        <p style={{ fontSize: "0.8rem", color: "red", marginTop: "0.5rem", paddingLeft: "0.5rem" }}>{errors.password?.message}</p>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control
                            required
                            size="sm"
                            type="password"
                            placeholder="Confirm Password"
                            autoFocus
                            {...register("confirmPassword")} />
                        <p style={{ fontSize: "0.8rem", color: "red", marginTop: "0.5rem", paddingLeft: "0.5rem" }}>{errors.confirmPassword?.message}</p>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            required
                            size="sm"
                            type="text"
                            placeholder="First Name"
                            autoFocus
                            {...register("firstName")} />
                        <p style={{ fontSize: "0.8rem", color: "red", marginTop: "0.5rem", paddingLeft: "0.5rem" }}>{errors.firstName?.message}</p>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Surname</Form.Label>
                        <Form.Control
                            required
                            size="sm"
                            type="text"
                            placeholder="Surname"
                            autoFocus
                            {...register("lastName")} />
                        <p style={{ fontSize: "0.8rem", color: "red", marginTop: "0.5rem", paddingLeft: "0.5rem" }}>{errors.lastName?.message}</p>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Birthdate</Form.Label>
                        <Form.Control
                            required
                            size="sm"
                            type="date"
                            autoFocus
                            min="2001-02-01"
                            {...register("birthdate")} />
                        <p style={{ fontSize: "0.8rem", color: "red", marginTop: "0.5rem", paddingLeft: "0.5rem" }}>{errors.birthdate?.message}</p>
                    </Form.Group>
                    <div style={{ display: "flex", justifyContent: "right", paddingTop: "2rem", paddingRight: "1rem" }}>
                        <Button style={{ marginRight: "0.5rem" }} variant='third' onClick={switchModal}>
                            Already have an account?
                        </Button>
                        <Button variant={buttonColor} type='submit' size='sm'>Sign Up</Button>
                    </div>
                </Form>
            </>
        )
    }
}
