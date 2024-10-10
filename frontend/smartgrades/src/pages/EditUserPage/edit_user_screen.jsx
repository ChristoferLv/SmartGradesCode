import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Spinner, Button, Col, Row } from "react-bootstrap";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { UserAPI } from '../../api/users';
import { useAuthContext } from '../../contexts/AuthContext';

export default function EditUserScreen() {
    const { id } = useParams(); // Assuming the user id comes from the route params
    const initialValues = {
        name: '',
        email: '',
        phoneNumber: '',
        username: '',
        state: 0,
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();
    const { token } = useAuthContext();

    const notifySuccess = (text) =>
        toast.success(text, {
            position: 'top-right',
            autoClose: 5000,
            theme: 'light',
        });

    const notifyError = (text) =>
        toast.error(text, {
            position: 'top-right',
            autoClose: 5000,
            theme: 'light',
        });

    // Fetch user data on page load
    useEffect(() => {
        const fetchUserData = async () => {
            const response = await UserAPI.getUserById(id, token);
            if (response.status === 200) {
                setFormValues(response.data);
            } else {
                notifyError("Error fetching user data");
            }
        };
        fetchUserData();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);
        setIsLoading(true);

        if (Object.keys(formErrors).length === 0) {
            const response = await UserAPI.updateUser(id, formValues, token);
            if (response.status === 200) {
                notifySuccess("User updated successfully");
                navigate('/users'); // Redirect after successful update
            } else {
                notifyError("Error updating user");
            }
        }
        setIsLoading(false);
    };

    const handleResetPassword = async () => {
        const response = await UserAPI.resetPassword(id, token);
        if (response.status === 200) {
            setNewPassword(response.data.newPassword);
            notifySuccess("Password reset successfully");
        } else {
            notifyError("Error resetting password");
        }
    };

    const validate = (values) => {
        const errors = {};
        const regexEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const regexPhone = /^\(\d{2}\) \d{4,5}-\d{4}$/;

        if (!values.name) {
            errors.name = "Name is required";
        }

        if (!values.email) {
            errors.email = "Email is required";
        } else if (!regexEmail.test(values.email)) {
            errors.email = "Invalid email format";
        }

        if (!values.phoneNumber) {
            errors.phoneNumber = "Phone number is required";
        } else if (!regexPhone.test(values.phoneNumber)) {
            errors.phoneNumber = "Invalid phone number format";
        }

        return errors;
    };

    return (
        <div className="container-fluid p-5 col-sm-7 col-md-8 col-lg-10">
            <div className="row">
                <div className="col">
                    <img
                        style={{ width: '11em' }}
                        onClick={() => navigate('/')}
                        src="https://i.ibb.co/r3QPmSt/logo.png"
                        alt="logo"
                        border="0"
                    />
                </div>
                <div className="row">
                    <div className="col">
                        <p className="fw-bold fs-4 ms-1 mt-5">Edit User</p>
                    </div>
                    <div className="col d-flex justify-content-end">
                        <Button
                            className="ms-3 mt-5"
                            variant="success"
                            onClick={handleResetPassword}
                            style={{ padding: '0.25rem 0.5rem' }} // Ajuste o padding conforme necessário
                        >
                            Reset Password
                        </Button>
                    </div>
                </div>
            </div>

            <div className="row ps-1 mt-2">
                <Form onSubmit={handleSubmit}>
                    <p className='m-0 ms-1'>Name</p>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="form-control"
                        value={formValues.name}
                        onChange={handleChange}
                    />
                    <p className="ps-2" style={{ color: 'red' }}>
                        {formErrors.name}
                    </p>

                    <div className="mt-3">
                        <p className='m-0 ms-1'>Email</p>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="form-control"
                            value={formValues.email}
                            onChange={handleChange}
                        />
                    </div>
                    <p className="ps-2" style={{ color: 'red' }}>
                        {formErrors.email}
                    </p>

                    <div className="mt-3">
                        <p className='m-0 ms-1'>Phone Number</p>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            className="form-control"
                            value={formValues.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <p className="ps-2" style={{ color: 'red' }}>
                        {formErrors.phoneNumber}
                    </p>
                    <div className="mt-3">
                        <p className='m-0 ms-1'>Username</p>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="form-control"
                            value={formValues.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-3">
                        <p className='m-0 ms-1'>State</p>
                        <select
                            name="state"
                            className="form-control"
                            value={formValues.state}
                            onChange={handleChange}
                        >
                            <option value={0}>INACTIVE</option>
                            <option value={1}>ACTIVE</option>
                            <option value={2}>ENROLLED</option>
                            <option value={3}>FINISHED</option>
                        </select>
                    </div>

                    <div className="row mt-3">
                        <div className="col text-start">
                            <button className="fbtn btn btn-success" disabled={isLoading}>
                                {isLoading ? (
                                    <Spinner
                                        className="me-2"
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={faCheck} className="me-2" />
                                )}
                                Update User
                            </button>
                        </div>
                    </div>
                </Form>
                {newPassword && (
                    <div className="mt-3">
                        <p className="fw-bold">New Password: {newPassword}</p>
                    </div>
                )}
            </div>
        </div>
    );
}