import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Spinner, Button, Col, Row } from "react-bootstrap";
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ClassesAPI } from '../../api/studentClasses';
import { useAuthContext } from '../../contexts/AuthContext';
import "./edit_class_screen.css";

export default function EditClassScreen() {
    const { id } = useParams();
    const initialValues = {
        level: '',
        period: {
            name: '',
        },
        classGroup: '',
        state: 1,
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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

    // Fetch class data on page load
    useEffect(() => {
        const fetchClassData = async () => {
            const response = await ClassesAPI.getClassById(id, token);
            if (response.status === 200) {
                setFormValues(response.data);
            } else {
                notifyError("Error fetching class data");
            }
        };
        fetchClassData();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('period')) {
            setFormValues({
                ...formValues,
                period: {
                    ...formValues.period,
                    name: value
                }
            });
        } else if (name === 'state') {
            setFormValues({ ...formValues, state: parseInt(value) });
        } else {
            setFormValues({ ...formValues, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);
        setIsLoading(true);

        if (Object.keys(formErrors).length === 0) {
            const response = await ClassesAPI.updateClass(id, formValues, token);
            console.log(formValues)
            if (response.status === 200) {
                notifySuccess("Class updated successfully");
            } else {
                notifyError("Error updating class");
            }
        }
        setIsLoading(false);
    };

    const validate = (values) => {
        const errors = {};

        if (!values.level) {
            errors.level = "Level is required";
        }

        if (!values.period.name) {
            errors.period = "Period name is required";
        }

        if (!values.classGroup) {
            errors.classGroup = "Class group is required";
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
                <div className="row d-flex align-items-center justify-content-between">
                    <div className="col">
                        <p className="fw-bold fs-4 ms-1 mt-5">Edit Class</p>
                    </div>
                    <div className="col-auto">
                        <Button
                            className="ms-3 mt-5"
                            variant="success"
                            onClick={() => navigate(`/teacher/enroll-student/${id}`)}
                            style={{ padding: '0.25rem 0.5rem' }} // Ajuste o padding conforme necessário
                        >
                            Enrol Students
                        </Button>
                    </div>
                </div>
            </div>

            <div className="row ps-1 mt-2">
                <Form onSubmit={handleSubmit}>
                    <p className='m-0 ms-1'>Level</p>
                    <input
                        type="text"
                        name="level"
                        placeholder="Level"
                        disabled={true}
                        className="form-control"
                        value={formValues.level}
                        onChange={handleChange}
                    />
                    <p className="ps-2" style={{ color: 'red' }}>
                        {formErrors.level}
                    </p>

                    <div className="mt-3">
                        <p className='m-0 ms-1'>Period Name</p>
                        <input
                            type="text"
                            name="period.name"
                            placeholder="Period Name"
                            disabled={true}
                            className="form-control"
                            value={formValues.period.name}
                            onChange={handleChange}
                        />
                    </div>
                    <p className="ps-2" style={{ color: 'red' }}>
                        {formErrors.period}
                    </p>

                    <div className="mt-3">
                        <p className='m-0 ms-1'>Class Group</p>
                        <input
                            type="text"
                            name="classGroup"
                            placeholder="Class Group"
                            className="form-control"
                            value={formValues.classGroup}
                            onChange={handleChange}
                        />
                    </div>
                    <p className="ps-2" style={{ color: 'red' }}>
                        {formErrors.classGroup}
                    </p>

                    <div className="mt-3">
                        <p className='m-0 ms-1'>State</p>
                        <Form.Select
                            name="state"
                            className="form-control"
                            value={formValues.state}
                            onChange={handleChange}
                        >
                            <option value={0}>FINISHED</option>
                            <option value={1}>ACTIVE</option>
                        </Form.Select>
                    </div>

                    <div className="row mt-3">
                        <div className="col text-start">
                            <button className="btn btn-success" disabled={isLoading}>
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
                                Update Class
                            </button>
                        </div>
                        <div className="col-auto text-end">
                            <button className="btn btn-danger" onClick={() => navigate('/')}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}
