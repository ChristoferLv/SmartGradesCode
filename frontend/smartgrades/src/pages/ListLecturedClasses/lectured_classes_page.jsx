import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import { HttpStatus } from '../../api/default';
import { useAuthContext } from '../../contexts/AuthContext';
import './lectured_classes_page.css';
import { AttendanceAPI } from '../../api/attendance'; // Assuming you have this API to fetch lectures
import { useParams } from 'react-router-dom';

function LecturesPage() {
  const { classId } = useParams();
  const [lecturesData, setLecturesData] = useState([]);
  const [isFetched, setIsFetched] = useState(false);

  const { logged, user, token } = useAuthContext();

  const getLectures = async (id) => {
    const response = await AttendanceAPI.getAulas(id, token); // Replace with the actual API call
    if (response.status === HttpStatus.OK) {
      setLecturesData(response.data);
      setIsFetched(true);
    }
  };

  useEffect(() => {
    getLectures(classId);
  }, [classId]);

  return (
    <>
      <Container fluid className='mb-2'>
        <Col>
          <Navbar>
            {logged && user && (
              <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
                &#128075;&nbsp; Hey, {user?.name?.split(' ')[0]}!
              </p>
            )}

            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                {user && (
                  <span>{user.name}</span> // Optionally replace with Avatar if necessary
                )}
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>
          <Row className="home-card">
            <div className="col">
              <h1 className="mt-3 mb-3 fs-5 fw-bold">Lectures List</h1>

              {isFetched ? (
                <>
                  {lecturesData.length > 0 ? (
                    <Row className="g-4">
                      {lecturesData.map((lecture) => (
                        <Col xs={12} lg={4} key={lecture.id}>
                          <Card className="lecture-card">
                            <Card.Body>
                              <Card.Title>Date: {lecture.date}</Card.Title>
                              <Card.Text>Description: {lecture.description}</Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <p>No lectures available.</p>
                  )}
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </Row>
        </Col>
      </Container>
    </>
  );
}

export default LecturesPage;