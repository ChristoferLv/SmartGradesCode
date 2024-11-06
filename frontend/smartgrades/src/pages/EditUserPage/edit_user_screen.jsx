import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Spinner, Button, Col, Row } from "react-bootstrap";
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { UserAPI } from '../../api/users';
import { useAuthContext } from '../../contexts/AuthContext';
import "./edit_user_screen.css"

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
    const { token, user } = useAuthContext();
    const availableRoles = ["ADMIN", "TEACHER", "STUDENT"];
    const [selectedRoles, setSelectedRoles] = useState([]);
    const notifyNewewPasswor = (text) =>
        toast.success("New password: " + text, {
            position: "top-center",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });

    const hasRole = (roleName) => {
        return user.roles.some(role => role.name === roleName);
    };

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

        useEffect(() => {
            const fetchUserData = async () => {
                const response = await UserAPI.getUserById(id, token);
                if (response.status === 200) {
                    const userData = response.data;
        
                    // Format the phone number if it's present
                    const formattedPhoneNumber = formatPhoneNumber(userData.phoneNumber || '');
        
                    // Update the form values with the formatted phone number
                    setFormValues({
                        ...userData,
                        phoneNumber: formattedPhoneNumber
                    });
        
                    // Set selected roles based on the fetched user data
                    const userRoles = userData.roles.map(role => role.name);
                    setSelectedRoles(userRoles);
                } else {
                    notifyError("Error fetching user data");
                }
            };
            fetchUserData();
        }, [id, token]);
        
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phoneNumber") {
            if (value.length > 15) return;

            const formattedValue = value.replace(/\D/g, '');
            const formattedPhoneNumber = formatPhoneNumber(formattedValue);

            setFormValues({ ...formValues, [name]: formattedPhoneNumber });
        } else {
            setFormValues({ ...formValues, [name]: value });
        }
    };

    const handleRoleChange = (roleName) => {
        // Check if the current user is trying to remove their own ADMIN role
        if (roleName === "ADMIN" && selectedRoles.includes("ADMIN") && user.id === parseInt(id)) {
            notifyError("You cannot remove your own ADMIN role.");
            return;
        }
    
        if (selectedRoles.includes(roleName)) {
            setSelectedRoles(selectedRoles.filter(role => role !== roleName));
        } else {
            setSelectedRoles([...selectedRoles, roleName]);
        }
    };
    

    const handleRoleUpdate = async () => {
        const rolesToUpdate = selectedRoles.map(role => ({ name: role }));
        const response = await UserAPI.updateUserRoles(id, rolesToUpdate, token); // Assuming API to update roles
        if (response.status === 200) {
            notifySuccess("Roles updated successfully");
        } else {
            notifyError("Error updating roles");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);
        setIsLoading(true);

        if (Object.keys(formErrors).length === 0) {
            const unformattedPhone = formValues.phoneNumber.replace(/\D/g, '');

            const response = await UserAPI.updateUser(id, { ...formValues, "phoneNumber": unformattedPhone }, token);
            if (response.status === 200) {
                notifySuccess("User updated successfully");
            } else {
                notifyError("Error updating user");
            }
        }
        setIsLoading(false);
    };

    const handleResetPassword = async () => {
        const response = await UserAPI.resetPassword(id, token);
        if (response.status === 200) {
            notifyNewewPasswor(response.data.newPassword);
        } else {
            notifyError("Error resetting password");
        }
    };

    function formatPhoneNumber(number) {
        const formattedValue = number.replace(/\D/g, '');  // Remove all non-numeric characters
        if (!formattedValue) return '';
        
        if (formattedValue.length <= 10) {
            // Format as (XX) XXXX-XXXX for 10-digit numbers
            return formattedValue.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
        } else if (formattedValue.length === 11) {
            // Format as (XX) X XXXX-XXXX for 11-digit numbers
            return formattedValue.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, '($1) $2 $3-$4');
        }
        return formattedValue; // Return as is if not a valid length
    }
    

    const validate = (values) => {
        const errors = {};
        const regexEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const regexPhone = /^\(\d{2}\) \d{1} \d{4}-\d{4}$/; // Adjusted to match 11-digit phone numbers
    
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
                        style={{ width: '7em', borderRadius: '15px' }}
                        onClick={() => navigate('/')}
                        src="https://i.ibb.co/RjNZH1H/logo.png"
                        alt="logo"
                        border="0"
                    />
                </div>
                <div className="row d-flex align-items-center justify-content-between">
                    <div className="col">
                        <p className="fw-bold fs-4 ms-1 mt-5">Edit User</p>
                    </div>
                    <div className="col-auto">
                        <Button
                        style={{padding: '0.25rem 0.5rem',  backgroundColor: "#FFD700", color: "black", border: "none"}}
                            className="ms-3 mt-5"
                            variant="success"
                            onClick={handleResetPassword}
                          
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
                        <Form.Select
                            name="state"
                            className="form-control"
                            value={formValues.state}
                            onChange={handleChange}
                        >
                            <option value={0}>INACTIVE</option>
                            <option value={1}>ACTIVE</option>
                            <option value={2}>ENROLLED</option>
                            <option value={3}>FINISHED</option>
                        </Form.Select>

                    </div>

                    {user && hasRole("ADMIN") && (
                        <div className="mt-3">
                            <p className='m-0 ms-1'>Roles</p>
                            {availableRoles.map((role) => (
                                <Form.Check
                                    key={role}
                                    type="checkbox"
                                    label={role}
                                    checked={selectedRoles.includes(role)}
                                    onChange={() => handleRoleChange(role)}
                                />
                            ))}
                            <Button className="mt-2" onClick={handleRoleUpdate}>Update Roles</Button>
                        </div>
                    )}

                    <div className="row mt-3">
                        <div className="col text-start">
                            <button style={{backgroundColor:"#FFD700", color:"black", border:"none"}} className="fbtn btn btn-success" disabled={isLoading}>
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
                        <div className="col-auto text-end">
                            <button
                                className="btn btn-danger"

                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                </Form>
            </div>
        </div>
    );
}