import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form'
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { dateToDashString } from '../backend/utils/dateToString';


export default function UpdateUserModal({ user, updateUser }) {
    const { data: session } = useSession();
    const schema = yup.object({
        email: yup.string().email("Email is not valid"),
        password: yup.string().min(5, "Password must be at least 5 characters").optional(),
        confirmPassword: yup.string().when("password", (password, schema) => {
            return password
                ? schema.oneOf([yup.ref('password')], 'Passwords do not match').required('You have to confirm your password')
                : schema.optional();
        }),
        firstName: yup.string().matches(/^[A-Za-z\s]+$/, "First Name must contain only letters").optional(),
        lastName: yup.string().matches(/^[A-Za-z\s]+$/, "Surname must contain only letters").optional(),
        birthdate: yup.date().min(new Date("1900-01-01"), "You must be be alive").optional()
    })
    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = (data) => {
        handleSubmit((data) => updateUser(data, user))(data);
    };

    const [buttonColor, setButtonColor] = useState("dark");
    return (
        <>
            <Form noValidate onSubmit={onSubmit}>
                <Form.Group className='mb-3'>
                    <Form.Label>Email adress</Form.Label>
                    <Form.Control
                        required
                        size="sm"
                        type="email"
                        placeholder={user.email}
                        autoFocus
                        {...register("email")} />
                    <p style={{ fontSize: "0.8rem", color: "red", marginTop: "0.5rem", paddingLeft: "0.5rem" }}>{errors.email?.message}</p>
                </Form.Group>
                {session.session.user.id === user.id &&
                    <>
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
                    </>
                }
                <Form.Group className='mb-3'>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        required
                        size="sm"
                        type="text"
                        placeholder={user.firstName}
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
                        placeholder={user.lastName}
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
                        defaultValue={dateToDashString(user.birthdate)}
                        min="2001-02-01"
                        {...register("birthdate")} />
                    <p style={{ fontSize: "0.8rem", color: "red", marginTop: "0.5rem", paddingLeft: "0.5rem" }}>{errors.birthdate?.message}</p>
                </Form.Group>
                {session.session.user.id !== user.id &&
                    <>
                        <Form.Check
                            inline
                            label="isAdministrator"
                            name="group1"
                            type="radio"
                            value="isAdministrator"
                            defaultChecked={user.isAdministrator}
                            {...register("role")}
                        />
                        <Form.Check
                            inline
                            label="isEventmanager"
                            name="group1"
                            type="radio"
                            value="isEventmanager"
                            defaultChecked={user.isEventmanager}
                            {...register("role")}
                        />
                        <Form.Check
                            inline
                            label="None"
                            name="group1"
                            type="radio"
                            value="none"
                            defaultChecked={!user.isEventmanager && !user.isAdministrator}
                            {...register("role")}
                        />
                    </>
                }
                {session.session.user.id === user.id &&
                    <>
                        <div>
                            <Form.Text muted>
                                Your password will be changed in the backend
                            </Form.Text>
                        </div>
                    </>}
                <div style={{ display: "flex", justifyContent: "right", paddingTop: "2rem", paddingRight: "1rem" }}>
                    <Button variant={buttonColor} type='submit' size='sm'>Save Changes</Button>
                </div>
            </Form >
        </>
    )
}