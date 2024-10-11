import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './register_student_screen.css'
import { Form, Spinner } from "react-bootstrap";
import { HttpStatus } from "../../api/default";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthAPI } from "../../api/auth-api";
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { UserAPI } from '../../api/users';
import { useAuthContext } from '../../contexts/AuthContext';


export default function RegisterStudentScreen() {
  const intialValues = {
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    about: 'Conte algo sobre você!',
    role: [1],
    dateOfBirth: '',
  }

  const initialConfirmPassword = '';
  const [formValues, setFormValues] = useState({ ...intialValues, confirmPassword: initialConfirmPassword })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmit, setIsSubmit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { logged, user, token } = useAuthContext()

  const notifySuccess = (texto) =>
    toast.success(texto, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })

  const notifyError = (texto) =>
    toast.error(texto, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })

  function formatPhoneNumber(number) {
    const formattedValue = number.replace(/\D/g, '')
    if (!number) return '';
    if (formattedValue.length === 11) {
      return formattedValue.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2$3-$4');
    } 
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
        if (value.length > 15) {
            return;
        }
        const formattedValue = value.replace(/\D/g, '');

        setFormValues({ ...formValues, [name]: formattedValue });
    } else if (name === 'confirmPassword') {
      setFormValues({ ...formValues, confirmPassword: value });
    } else {
        setFormValues({ ...formValues, [name]: value });
    }
  }

  useEffect(() => {
    const fetchFunction = async () => {
      if (Object.keys(formErrors).length === 0 && isSubmit) {
        setIsLoading(true)
         // Create a new object with roles added
         const userWithRoles = {
          ...formValues,
          username:formValues.email,
          roles: [
            {
              name: "STUDENT" // Adjust this based on your logic if you need different roles
            }
          ]
        };

        const response = await UserAPI.registerUser(userWithRoles, token);
        if (response.status === HttpStatus.OK) {
            notifySuccess("Registrado com sucesso!");
            setIsLoading(false)
        } else {
          setIsLoading(false)
          notifyError("Falha ao cadastrar novo usuário. " + response.data.error + ".");
        }
    }
  }
  fetchFunction();
  }, [isSubmit]);

  useEffect(() => {
    if (isSubmit) setFormErrors(validate(formValues))
  }, [formValues])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    setIsLoading(true);
    console.log(formErrors)
    if (Object.keys(formErrors).length === 0 && isSubmit) {
        const response = await AuthAPI.fetchRegister(formValues);
        if (response.status === HttpStatus.OK) {
            notifySuccess("Registrado com sucesso!");
        } else {
            notifyError("Falha ao cadastrar novo usuário. " + response.data.error + ".");
        }
      }
      setIsLoading(false)
  }

  const validate = (values) => {
        //console.log("Validade date:", values.birth)
        const errors = {};
        const regexemail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const regexphone = /^\(\d{2}\) \d{4,5}-\d{4}$/;

        if (!values.name) {
            errors.name = "Type a name!";
        }

        if (!values.email && isSubmit) {
            errors.email = "Type an e-mail!";
        } else if (!regexemail.test(values.email)) {
            errors.email = "Type an e-mail with valid format!";
        }

        if (!values.password) {
            errors.password = "Type a password!";
        } else if (values.password.length < 4) {
            errors.password = "Password need to have more than 4 characteres!";
        } else if (values.password.length > 16) {
            errors.password = "Password can not have more than 16 characteres!";
        }

        if (!values.confirmPassword) {
          errors.confirmPassword = 'Type the password again!';
        } else if (values.confirmPassword !== values.password) {
          errors.confirmPassword = 'The passwords are not the same!';
        }

        if (!values.dateOfBirth) {
            errors.dateOfBirth = "Select a date!"; 
        }

        //Validate phone number
        if (!values.phoneNumber) {
            errors.phoneNumber = "Type a phone number!";
        } else if (values.phoneNumber.length < 11) {
            errors.phoneNumber = "Invalid phone number!1";
        } else if (values.phoneNumber.length > 15) {
            errors.phoneNumber = "Invalid phone number!2";
        } else if (!regexphone.test(formatPhoneNumber(values.phoneNumber))) {
            errors.phoneNumber = "Invalid phone number!3";
        }

        setIsLoading(false)
        return errors;
    }

  return (
    <>
      <div className="container-fluid p-5 col-sm-7 col-md-8 col-lg-10">
        <div className="row">
          <div className="col">
            <img
              style={{ width: '11em' }}
              onClick={() => {
                window.location.href = '/'
              }}
              src="https://i.ibb.co/r3QPmSt/logo.png"
              alt="logo"
              border="0"
            />
          </div>
          <p className="fw-bold fs-4 ms-1 mt-5">Register new user</p>
        </div>

        <div className="row ps-1 mt-2">
          <Form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name and Surname"
              className="form-control"
              value={formValues.name}
              onChange={handleChange}
            />
            <p className="ps-2" style={{ color: 'red' }}>
              {formErrors.name}
            </p>

            <div className="mt-3">
              <input
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
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-control"
                value={formValues.password}
                onChange={handleChange}
              />
            </div>
            <p className="ps-2" style={{ color: 'red' }}>
              {formErrors.password}
            </p>
            <div className="mt-3">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="form-control"
                value={formValues.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <p className="ps-2" style={{ color: 'red' }}>
              {formErrors.confirmPassword}
            </p>
            <div className="mt-3">
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                className="form-control"
                value={formatPhoneNumber(formValues.phoneNumber)}
                onChange={handleChange}
              />
            </div>
            <p className="ps-2" style={{ color: 'red' }}>
              {formErrors.cpf}
            </p>
            <div className="mt-3">
              <input
                type="date"
                name="dateOfBirth"
                className="form-control"
                value={formValues.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <p className="ps-2" style={{ color: 'red' }}>
              {formErrors.dateOfBirth}
            </p>

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
                  CRIAR CONTA
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}
