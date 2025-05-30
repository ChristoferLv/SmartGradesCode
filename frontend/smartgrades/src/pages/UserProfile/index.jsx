import React, { useEffect, useState } from 'react'
import { Col, Container, Navbar, Row, Card, Button, Dropdown } from 'react-bootstrap'
import Avatar from 'react-avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { HttpStatus } from "../../api/default";
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ProfileAPI } from '../../api/profile';
import './style.css'
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu'
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle'
import { toast } from 'react-toastify'
import { UserAPI } from '../../api/users'

const UserProfileScreen = () => {
  const navigate = useNavigate()
  const [editando, setEditando] = useState(false)
  const [aboutText, setAboutText] = useState();
  const [newName, setNewName] = useState();
  const [newLink, setNewLink] = useState(undefined);
  const [formErrors, setFormErrors] = useState({});
  const { logged, user, token, refreshUserOnContext } = useAuthContext();
  const [imagesToUpdate, setImagesToUpdate] = useState()

  const notifyError = (texto) => toast.error(texto, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
  const notifySuccess = (texto) => toast.success(texto, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });


  useEffect(() => {
    const fetchFunction = async () => {
      if (imagesToUpdate && imagesToUpdate.length) {
        const response = await UserAPI.uploadProfilePicture(imagesToUpdate[0], token);
        if (response.status !== HttpStatus.OK) {
          notifyError("Falha na alteração da foto de perfil.")
        } else {
          refreshUserOnContext()
        }
      }
    }
    fetchFunction()
  }, [imagesToUpdate])


  const date = (dateString) => {
    const dateObj = new Date(dateString);
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    const formattedDate = `Aluno desde: ${month}/${year}`;
    return formattedDate // saída: "23/4/2023"

  }

  const changePass = () => {
    navigate('/alterar-senha')
  }

  const seeCertificates = () => {
    navigate('/user/certificates')
  }

  const seeReportCards = () => {
    navigate('/user/see-report-cards')
  }

  const editar = () => {
    setNewName(user.name)
    setAboutText(user.about)
    setNewLink(user.contactLink === "https://www.exemplo.com" ? "" : user.contactLink)
    setEditando(true)
  }

  const salvarAlteracoes = async () => {
    if (Object.keys(validateEditing()).length === 0 && editando) {
      var link = "";
      if (newLink) {
        if (newLink.length === 0) {
          link = "https://www.exemplo.com";
        } else {
          link = newLink;
          if (!link.includes("https")) {
            link = "https://" + newLink;
          }
        }
      } else {
        link = "https://www.exemplo.com";
      }
      if (user.name !== newName || aboutText !== user.about || newLink !== user.contactLink) {
        const response = await ProfileAPI.fetchEdit(newName, aboutText, link, user.id)
        if (response.status !== HttpStatus.OK) {
          notifyError("Falha na edição de perfil.");
        } else {
          notifySuccess("Perfil alterado com sucesso.");
          setEditando(false);
          refreshUserOnContext();
        }
      }
    }
  }

  const cancelEditing = () => {
    setFormErrors({})
    setEditando(false)
  }

  const validateEditing = () => {

    const errors = {};
    if (newName.length < 3) {
      errors.newName = "Digite um nome válido!";
    } else if (newName.length > 50) {
      errors.newName = "O nome não deve ter mais do que 50 caracteres!";
    }

    if (aboutText.length === 0) {
      errors.about = "Digite algo sobre você!";
    } else if (aboutText.length > 150) {
      errors.about = "Texto 'sobre' é muito longo!";
    }

    if (newLink && newLink.length > 150) {
      errors.about = "O link é muito longo!";
    }

    setFormErrors(errors)
    return errors;
  }

  const FileListToFileArray = (fileList) => {
    var files = []
    for (let idx = 0; idx < fileList.length; idx++) {
      files.push(fileList[idx])
    }
    return files
  }

  const InvisibleInputFile = () => (
    <input id='input-files-user-photo-update'
      type="file"
      style={{ display: 'none' }}
      onChange={(e) => {
        setImagesToUpdate(FileListToFileArray(e.target.files ?? new FileList()))
      }}
      accept='.png,.jpeg,.jpg,.webp'
    />
  );


  return logged && user ? (
    <>
      <Navbar style={{ marginBottom: '50px' }}>
        <Container fluid>
          <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
            &#128075;&nbsp; Hey, {user.name.split(' ')[0]}!
          </p>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Row className='align-items-center'>
              <Col>
                <Navbar.Text>
                  <Dropdown>
                    <DropdownToggle className='gear'>
                      <FontAwesomeIcon
                        icon={faPen}
                      />
                    </DropdownToggle>
                    <DropdownMenu>
                      <Dropdown.Item className="dropdown-item-no-highlight" onClick={() => editar()}>Editar Perfil</Dropdown.Item>
                      <Dropdown.Item className="dropdown-item-no-highlight" onClick={() => changePass()}>Alterar Senha</Dropdown.Item>
                      {/* <Dropdown.Item className="dropdown-item-no-highlight" onClick={() => seeReportCards()}>Meus Boletins</Dropdown.Item> */}
                      {/* <Dropdown.Item className="dropdown-item-no-highlight" onClick={() => seeCertificates()}>Meus Certificados</Dropdown.Item> */}
                    </DropdownMenu>
                  </Dropdown>
                </Navbar.Text>
              </Col>
              <Col>
                <Navbar.Text className='pb-1'>
                  <Avatar
                    name={user.name}
                    color="#0f5b7a"
                    size={34}
                    textSizeRatio={2}
                    round={true}
                  />
                </Navbar.Text>
              </Col>
            </Row>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Row className="d-flex justify-content-center gap-4">
          <Col className='pe-0' xs={3}>
            <Card
              style={{
                paddingTop: '16px', width: '90%'
              }}
            >
              <Row>
                <Col className="d-flex justify-content-center align-items-center flex-column">
                  <div style={{ position: 'relative' }}>
                    <InvisibleInputFile />
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip>Mudar foto de Perfil</Tooltip>}
                    >
                      <label className='d-flex justify-content-center' htmlFor="input-files-user-photo-update" >
                        {user.profilePicture ? <img
                          src={`data:image/jpeg;base64,${user.profilePicture}`} // Ajuste o tipo de imagem conforme necessário
                          style={{ width: '70%', aspectRatio: 1, borderRadius: '50%', objectFit: 'fill', objectPosition: 'center', cursor: 'pointer', paddingTop: '10px' }}
                          alt="profile"
                        />
                          : <Avatar
                            name={user.name && user.name.split(' ')[0]}
                            color="#0f5b7a"
                            size={150}
                            textSizeRatio={2}
                            round={true}
                            style={{ cursor: 'pointer', paddingTop: '10px' }}
                          />}
                      </label>
                    </OverlayTrigger>
                  </div>
                  <Col className="d-flex align-items-center gap-1">

                    {editando ? (
                      <div className="mt-4 mb-4 ms-1">
                        <input
                          type="text"
                          className="form-control"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="d-flex justify-content-between align-items-center">
                        <h1
                          className="fw-bold fs-4 mt-4 mb-4 ms-1"
                          style={{ color: '#727273' }}
                        >
                          {user.name}
                        </h1>
                      </div>
                    )}



                  </Col>
                </Col>
              </Row>
              <Card.Footer className="d-flex justify-content-center align-items-center">
                <p className="mt-0 mb-0 fs-6" style={{ color: '#727273' }}>
                  {date(user.createdAt)}
                </p>
              </Card.Footer>
            </Card>
          </Col>
          <Col>
            <Row>
              <Col className='d-flex justify-content-between pe-0 ps-0'>
                {editando && <Button onClick={() => cancelEditing()} className='btn btn-danger mb-1'>
                  Cancelar
                </Button>}
                {editando && <Button onClick={() => salvarAlteracoes()} className='btn btn-success mb-1'>
                  Salvar
                </Button>}
              </Col>
            </Row>
            <Row className="mb-4">
              {Object.keys(formErrors).length !== 0 && editando && <> <p className="ps-2 mb-1" style={{ color: "red" }}>{formErrors.newName}</p><p className="ps-2 mb-1" style={{ color: "red" }}>{formErrors.about}</p></>}
              <Card
                style={{
                  padding: '16px',
                }}
              >
                <Row className="mb-3">
                  <Col className="d-flex justify-content-between align-items-center">
                    <h1 className="fw-bold fs-5" style={{ color: '#727273' }}>
                      Sobre mim
                    </h1>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {editando ? (
                      <div className="mb-3">
                        <textarea
                          rows={4}
                          className="form-control"
                          value={aboutText}
                          onChange={(e) => setAboutText(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="mb-3 d-flex justify-content-between align-items-center">
                        <p className="mt-0 mb-0 fs-6" style={{ color: '#727273' }}>
                          {user.about}
                        </p>
                      </div>
                    )}
                  </Col>
                </Row>
              </Card>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  ) : <></>
}

export default UserProfileScreen
