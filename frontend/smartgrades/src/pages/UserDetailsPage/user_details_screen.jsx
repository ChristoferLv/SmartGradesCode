import React, { useEffect, useState } from 'react'
import { Col, Container, Navbar, Row, Card, Button } from 'react-bootstrap'
import Avatar from 'react-avatar'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import { UserAPI } from '../../api/users'
import { ReportCardAPI } from '../../api/reportCard' // New import for fetching report cards
import { toast } from 'react-toastify'
import { notify } from '../../toasts/toasts'
import './user_details_screen.css'
import { HttpStatus } from '../../api/default'
import { ClassesAPI } from '../../api/studentClasses'

const UserDetailsScreen = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const { logged, user, token } = useAuthContext()
    const [userInfo, setUserInfo] = useState(null) // For storing fetched user information
    const [enroledClasses, setEnroledClasses] = useState(null)
    const [reportCards, setReportCards] = useState(null) // State to store report cards

    const notifyError = (texto) => toast.error(texto)
    const notifySuccess = (texto) => toast.success(texto)

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await UserAPI.getUserById(id, token)
            if (response.status === HttpStatus.OK) {
                setUserInfo(response.data)
            } else {
                notifyError("Error fetching user information.")
            }
        }
        fetchUserData()
    }, [token, user])

    useEffect(() => {
        const fetchEnroledClasses = async () => {
            const response = await ClassesAPI.getEnroledClassesOfStudent(id, token)
            if (response.status === HttpStatus.OK) {
                setEnroledClasses(response.data)
            } else {
                notifyError("Error fetching enroled classes.")
            }
        }
        fetchEnroledClasses()
    }, [userInfo])

    useEffect(() => {
        const fetchReportCards = async () => {
            const response = await ReportCardAPI.getReportCardsOfStudent(id, token); // Fetch report cards
            if (response.status === HttpStatus.OK) {
                const sortedReportCards = response.data.sort((a, b) => b.id - a.id); // Sort in descending order by ID
                setReportCards(sortedReportCards);
            } else {
                if (response.dara == null) {
                    return;
                }
                notifyError("Error fetching report cards.");
            }
        };
        fetchReportCards();
    }, [userInfo]);

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
                                    Member since: {new Date(userInfo.createdAt).toLocaleDateString()}
                                </p>
                            </Card.Footer>
                        </Card>
                    </Col>

                    <Col>
                        <Col className="d-flex justify-content-end mb-3 mt-0">
                            <Button
                                variant="warning"
                                onClick={() => navigate(`/teacher/edit-user/${id}`)}
                            >
                                Edit User
                            </Button>
                        </Col>
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
                                                        <p className="mb-1"><strong>Level:</strong> {studentClass.level}</p>
                                                        <p className="mb-1"><strong>Period:</strong> {studentClass.period.name}</p>
                                                        <p className="mb-1"><strong>Class Group:</strong> {studentClass.classGroup}</p>
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

                        {/* New section for displaying report cards */}
                        <Row className="mb-4">
                            <Card style={{ padding: '16px' }}>
                                <Row className="mb-3">
                                    <Col className="d-flex justify-content-between align-items-center">
                                        <h1 className="fw-bold fs-5" style={{ color: '#727273' }}>
                                            Report Cards
                                        </h1>
                                        <Button
                                            className='ms-2'
                                            variant='secondary'
                                            onClick={() => navigate(`/user/see-report-cards/${id}`)}
                                        >
                                            See all report cards
                                        </Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {reportCards && reportCards.length > 0 ? (
                                            <ul>
                                                {reportCards.map((reportCard) => (
                                                    <li key={reportCard.id} style={{ color: '#727273' }}>
                                                        <p className="mb-1"><strong>Evaluation Type:</strong> {reportCard.evaluationType == 0 ? "First Evaluation" : "Final Evaluation"}</p>
                                                        <p className="mb-1"><strong>Final Grade:</strong> {reportCard.evaluation.at(-1).finalGrade}</p>
                                                        <p className="mb-1"><strong>OT:</strong> {reportCard.evaluation.at(-1).ot}</p>
                                                        <p className="mb-1"><strong>WT:</strong> {reportCard.evaluation.at(-1).wt}</p>
                                                        <hr />
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="mt-0 mb-0 fs-6" style={{ color: '#727273' }}>
                                                No report cards available.
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
    ) : null;
};


export default UserDetailsScreen
