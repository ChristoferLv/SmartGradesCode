import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Form, Spinner } from 'react-bootstrap';
import { AuthAPI } from '../../api/auth-api';
import { HttpStatus } from '../../api/default';

// Style
import './style.css';

import { useAuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setToken } = useAuthContext();
  const intialValues = { email: '', password: '' };
  const [formValues, setFormValues] = useState(intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  var errorsC = 0;
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
    });

  const saveTokenOnLocalStorage = (token) => {
    localStorage.setItem('token', token);
  };

  const saveUserDataOnLocalStorage = () => {
    const jwt = localStorage.getItem('token');
    AuthAPI.getUserInfo(jwt).then((response) => {
      if (response.status === HttpStatus.OK) {
        localStorage.setItem('userData', JSON.stringify(response.data));
      }
    });
  };

  useEffect(() => {
    if (isSubmit) setFormErrors(validate(formValues));
  }, [formValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    setIsLoading(true);
    if (errorsC === 0) {
      const responseLogin = await AuthAPI.login(
        formValues.email,
        formValues.password
      );
      if (responseLogin.status === HttpStatus.OK) {
        saveTokenOnLocalStorage(responseLogin.data.token);
        const ok = await setToken(responseLogin.data.token);
        if (ok) {
          saveUserDataOnLocalStorage();
          toast.dismiss();
          navigate('/');
        }
        setIsLoading(false);
      } else {
        notifyError('Falha ao executar login. ' + responseLogin.data.error);
      }
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const validate = (values) => {
    const errors = {};
    errorsC = 0;

    if (!values.email) {
      errors.email = 'Digite um e-mail!';
    }

    if (!values.password) {
      errors.password = 'Digite uma senha!';
    } else if (values.password.length < 4) {
      errors.password = 'A senha precisa ter mais do que 3 caracteres!';
    } else if (values.password.length > 16) {
      errors.password = 'A senha pode ter no máximo 16 caracteres!';
    }
    errorsC = Object.keys(errors).length;
    return errors;
  };

  return (
    <>
      <div className="container p-5 col-7">
        <div className="row">
          <div className="col mb-5">
            <div className="row">
              <div className="col">
                <img
                  style={{ width: '7em', borderRadius: '15px' }}
                  onClick={() => {
                    window.location.href = '/';
                  }}
                  src="https://i.ibb.co/RjNZH1H/logo.png"
                  alt="logo"
                  border="0"
                />
              </div>
            </div>
          </div>
          <p className="fs-6 mb-1 ms-1">
            Bem-vindo(a) a plataforma da Fluentia Academy.
          </p>
          <p className="fw-bold fs-4 ms-1">
            Entre para acompanhar seu rendimento!
          </p>
        </div>
        <div className="row ps-1 mt-2">
          <Form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="email"
                placeholder="Email"
                className="form-control"
                value={formValues.username}
                onChange={handleChange}
                style={{ borderColor: '#e24046' }}
              />
            </div>
            <p className="mb-3 ps-1" style={{ color: '#e24046' }}>
              {formErrors.email}
            </p>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Senha"
                className="form-control"
                value={formValues.password}
                onChange={handleChange}
                style={{ borderColor: '#e24046' }}
              />
            </div>
            <p className="mb-3 ps-1" style={{ color: '#e24046' }}>
              {formErrors.password}
            </p>
            <div className="row mt-3">
              <div className="col text-start">
                <button
                  className="btn"
                  style={{ backgroundColor: 'goldenrod', color: '#000' }}
                  disabled={isLoading}
                >
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
                  Entrar
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;