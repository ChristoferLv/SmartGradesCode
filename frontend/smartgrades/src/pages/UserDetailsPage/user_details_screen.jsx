import React, { useEffect, useState } from 'react'
import { Col, Container, Navbar, Row, Card, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Avatar from 'react-avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { HttpStatus } from "../../api/default";
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { UserAPI } from '../../api/users'
import './user_details_screen.css'
import { toast } from 'react-toastify'
import { notify } from '../../toasts/toasts'
import { ClassesAPI } from '../../api/studentClasses'

const UserDetailsScreen = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const { logged, user, token, refreshUserOnContext } = useAuthContext();
    const [userInfo, setUserInfo] = useState(null);  // For storing fetched user information
    const [enroledClasses, setEnroledClasses] = useState(null);

    const notifyError = (texto) => toast.error(texto, { ...notifyError });
    const notifySuccess = (texto) => toast.success(texto, { ...notifySuccess });

    useEffect(() => {
        // Fetch user data on component mount
        const fetchUserData = async () => {
            const response = await UserAPI.getUserById(id, token);
            if (response.status === HttpStatus.OK) {
                setUserInfo(response.data);
            } else {
                notifyError("Error fetching user information.");
            }
        };
        fetchUserData();
    }, [token, user]);

    useEffect(() => {
        console.log("CHAMADO");
        const fetchEnroledClasses = async () => {
            const response = await ClassesAPI.getEnroledClassesOfStudent(id, token);
            console.log(response);
            if (response.status === HttpStatus.OK) {
                setEnroledClasses(response.data);
            } else {
                notifyError("Error fetching enroled classes.");
            }
        };
        fetchEnroledClasses();
    }, [userInfo]);

    const handleEditClick = () => {
        navigate(`/teacher/edit-user/${id}`);  // Navigate to the edit screen
    }

    const handleEmitCertificate = async () => {
        // Example logic to emit a certificate
        const response = await UserAPI.emitCertificate(id, token);
        if (response.status === HttpStatus.OK) {
            notifySuccess("Certificate emitted successfully.");
        } else {
            notifyError("Failed to emit certificate.");
        }
    }

    const date = (dateString) => {
        const dateObj = new Date(dateString);
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        return `Member since: ${month}/${year}`;
    }

    return logged && userInfo ? (
        <>
            <Navbar style={{ marginBottom: '50px' }}>
                <Container fluid>
                    <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
                        &#128075;&nbsp; Hello, {user.name.split(' ')[0]}!
                    </p>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Row className='align-items-center'>
                            <Col>
                                <Navbar.Text className='pb-1'>
                                    <Avatar
                                        name={userInfo.name}
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
                        <Card style={{ paddingTop: '16px', width: '90%' }}>
                            <Row>
                                <Col className="d-flex justify-content-center align-items-center flex-column">
                                    <div style={{ position: 'relative' }}>
                                        {userInfo.profilePicture ? (
                                            <img
                                                src={`data:image/jpeg;base64,${userInfo.profilePicture}`}
                                                style={{ width: '70%', aspectRatio: 1, borderRadius: '50%', objectFit: 'fill' }}
                                                alt="profile"
                                            />
                                        ) : (
                                            <Avatar
                                                name={userInfo.name && userInfo.name.split(' ')[0]}
                                                color="#0f5b7a"
                                                size={150}
                                                textSizeRatio={2}
                                                round={true}
                                            />
                                        )}
                                    </div>
                                    <Col className="d-flex align-items-center gap-1">
                                        <h1 className="fw-bold fs-4 mt-4 mb-4 ms-1" style={{ color: '#727273' }}>
                                            {userInfo.name}
                                        </h1>
                                    </Col>
                                </Col>
                            </Row>
                            <Card.Footer className="d-flex justify-content-center align-items-center">
                                <p className="mt-0 mb-0 fs-6" style={{ color: '#727273' }}>
                                    {date(userInfo.createdAt)}
                                </p>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col>
                        <Row>
                            <Col className='d-flex justify-content-between pe-0 ps-0'>
                                {/* Buttons for teachers only */}
                                <Button onClick={handleEditClick} className='btn btn-primary mb-1'>
                                    Edit User Info
                                </Button>
                                <Button onClick={handleEmitCertificate} className='btn btn-secondary mb-1'>
                                    Emit Certificate
                                </Button>
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Card style={{ padding: '16px' }}>
                                <Row className="mb-3">
                                    <Col className="d-flex justify-content-between align-items-center">
                                        <h1 className="fw-bold fs-5" style={{ color: '#727273' }}>
                                            Enrolled Classes
                                        </h1>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {enroledClasses && enroledClasses.length > 0 ? (
                                            <ul>
                                                {enroledClasses.map((studentClass) => (
                                                    <li key={studentClass.id} style={{ color: '#727273' }}>
                                                        <p className="mb-1">
                                                            <strong>Level:</strong> {studentClass.level}
                                                        </p>
                                                        <p className="mb-1">
                                                            <strong>Period:</strong> {studentClass.period.name}
                                                        </p>
                                                        <p className="mb-1">
                                                            <strong>Class Group:</strong> {studentClass.classGroup}
                                                        </p>
                                                        <hr />
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="mt-0 mb-0 fs-6" style={{ color: '#727273' }}>
                                                Not enrolled in any classes.
                                            </p>
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

export default UserDetailsScreen;
