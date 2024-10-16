import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Pagination } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL, HttpResponse, HttpStatus } from '../../api/default'
import { useAuthContext } from '../../contexts/AuthContext';
import CardCourses from '../../components/CardCourses'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons'
import { ClassesAPI } from '../../api/studentClasses';
import CardStudentClass from '../../components/CardStudentClass/card_student_class';

const ClassesListPage = () => {
    const [userData, setUserData] = useState({ name: "" });
    const [data, setData] = useState({});
    const [isFetched, setIsFetched] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [amountPages, setAmountPages] = useState(6);
    const navigate = useNavigate();
    const { token } = useAuthContext();


    const getClasses = async (e) => {
        setIsFetched(false)
        try {
            const responseCourses = await ClassesAPI.getClasses(token)
            if (responseCourses.status === HttpStatus.OK) {
                setData(responseCourses.data)
                //const pages = Math.ceil(responseCourses.data.count / pageSize)
                //setAmountPages(pages)
                setIsFetched(true)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const userData = localStorage.getItem('userData')
        if (userData != null)
            setUserData(JSON.parse(userData))
    }, [])


    useEffect(() => {
        getClasses();
    }, [userData])

    return (
        <Row>
            <Row className="home-card mt-5">
                <div className="col">
                    <h1 className="mb-3 fs-5 fw-bold">Classes</h1>

                    {isFetched ? (
                        data.length ? (
                            <Row className="g-4">
                                {data.map((course) => (
                                    <Col xs={12} lg={4} key={course.id}>
                                        <Link to={`/teacher/class-details/${course.id}`}>
                                            <CardStudentClass data={course} />
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Container fluid>
                                <div class="d-flex align-items-center justify-content-center" style={{ "height": "350px" }}>
                                    <span><h1>Nenhuma turma cadastrada.</h1>
                                       </span>
                                </div>
                            </Container>
                        )
                    ) : (
                        <p>Carregando...</p>
                    )}
                </div>
            </Row>
        </Row>
    )
}

export default ClassesListPage;