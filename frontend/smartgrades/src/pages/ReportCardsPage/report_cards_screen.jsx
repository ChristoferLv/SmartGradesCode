import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Card, Spinner, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { ReportCardAPI } from '../../api/reportCard';
import { toast } from 'react-toastify';
import { HttpStatus } from '../CreateCourse/api';

const StudentReportCardsScreen = () => {
    const { id } = useParams(); // Assuming you pass student ID via URL
    const { token } = useAuthContext(); // Auth context to get the token
    const [reportCards, setReportCards] = useState(null);
    const [loading, setLoading] = useState(true);

    const notifyError = (texto) => toast.error(texto);

    useEffect(() => {
        const fetchReportCards = async () => {
            try {
                const response = await ReportCardAPI.getReportCardsOfStudent(id, token);
                if (response.status === HttpStatus.OK) {
                    setReportCards(response.data);
                } else {
                    notifyError("Error fetching report cards.");
                }
            } catch (error) {
                notifyError("Failed to load report cards.");
            } finally {
                setLoading(false);
            }
        };
        fetchReportCards();
    }, [id, token]);



    return (
        <section className="box-course pb-1 pt-1">
            <Container fluid className="container-new-course container-course mb-5 col-12">
                <Card className="p-4">
                    <h1 className="fw-bold fs-4 mb-4" style={{ color: '#727273' }}>
                        Your Report Cards
                    </h1>
                    {loading ? (
                        <Spinner animation="border" variant="primary" />
                    ) : reportCards && reportCards.length > 0 ? (
                        <Row className="g-3">
                            {reportCards.map((reportCard) => (
                                <Col key={reportCard.id} className="mb-4">
                                    <Card className="p-4" style={{ maxWidth: '800px', margin: 'auto' }}>
                                        <h2 className="text-center mb-4" style={{ color: 'black' }}>REPORT CARD</h2>

                                        {/* Student Information */}
                                        <div className="mb-4">
                                            <p><strong>Name:</strong> {reportCard.student.name}</p>
                                            <p><strong>Period:</strong> {reportCard.studentClass.period.name}</p>
                                            <p><strong>Level:</strong> {reportCard.studentClass.level}</p>
                                            <p><strong>Group:</strong> {reportCard.studentClass.classGroup}</p>

                                        </div>

                                        {/* Language Assessment Table */}
                                        <Table bordered className="table-responsive w-100" style={{ tableLayout: 'fixed' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '20%' }}>Language Assessment</th>
                                                    <th style={{ width: '16%' }}>Excellent</th>
                                                    <th style={{ width: '16%' }}>Very Good</th>
                                                    <th style={{ width: '16%' }}>Good</th>
                                                    <th style={{ width: '16%' }}>Satisfactory</th>
                                                    <th style={{ width: '16%' }}>Poor</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportCard.assessments.map((assessment) => (
                                                    <tr key={assessment.id}>
                                                        <td>{assessment.skill}</td>
                                                        <td>{assessment.rating === 'Excellent' ? '✓' : ''}</td>
                                                        <td>{assessment.rating === 'Very Good' ? '✓' : ''}</td>
                                                        <td>{assessment.rating === 'Good' ? '✓' : ''}</td>
                                                        <td>{assessment.rating === 'Satisfactory' ? '✓' : ''}</td>
                                                        <td>{assessment.rating === 'Poor' ? '✓' : ''}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>

                                        {/* Grades Table */}
                                        <Table bordered className="table-responsive w-100" style={{ tableLayout: 'fixed' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '25%' }}></th>
                                                    <th style={{ width: '25%' }}>OT</th>
                                                    <th style={{ width: '25%' }}>WT</th>
                                                    <th style={{ width: '25%' }}>Final Grade</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>First Evaluation</td>
                                                    <td>{reportCard.ot || '-'}</td>
                                                    <td>{reportCard.wt}</td>
                                                    <td>{reportCard.finalGrade}</td>
                                                </tr>
                                            </tbody>
                                        </Table>

                                        {/* Placeholder for teacher comment or other additional information */}
                                        <p className="mb-4">{reportCard.comments}</p>

                                        {/* Signature */}
                                        <p className="text-end"><strong>Teacher {reportCard.teacherName}</strong></p>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <p style={{ color: '#727273' }}>
                            You do not have any report cards available.
                        </p>
                    )}
                </Card>
            </Container>
        </section>
    );
};

export default StudentReportCardsScreen;