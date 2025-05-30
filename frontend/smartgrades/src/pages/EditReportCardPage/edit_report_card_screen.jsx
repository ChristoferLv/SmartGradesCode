import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { ClassesAPI } from '../../api/studentClasses';
import { useAuthContext } from '../../contexts/AuthContext';
import { HttpStatus } from '../../api/default';
import { ReportCardAPI } from '../../api/reportCard';
import { notify } from '../../toasts/toasts';

const EditReportCard = () => {
    const [studentId, setStudentId] = useState(''); // Selected student
    const [studentClassId, setStudentClassId] = useState(''); // Selected class
    const [evaluationType, setEvaluationType] = useState('FIRST_EVALUATION'); // Evaluation type
    const [assessments, setAssessments] = useState([
        { skill: 'Speaking', rating: '' },
        { skill: 'Listening', rating: '' },
        { skill: 'Reading', rating: '' },
        { skill: 'Writing/grammar', rating: '' },
        { skill: 'Effort', rating: '' },
        { skill: 'Attendance', rating: '' },
        { skill: 'Content Retention ', rating: '' },
        { skill: 'Homework', rating: '' }
    ]); // List of assessments
    const [OT, setOT] = useState(''); // Oral Test grade
    const [WT, setWT] = useState(''); // Written Test grade
    const [comments, setComments] = useState(''); // Comments
    const { reportCardId } = useParams();
    const { token } = useAuthContext();
    const [evaluations, setEvaluations] = useState([]);


    // Fetch report card data
    useEffect(() => {
        const fetchReportCard = async () => {
            const response = await ReportCardAPI.getReportCard(reportCardId, token);
            if (response.status === HttpStatus.OK) {
                //console.log('Report card data: ', response.data);
                const reportCard = response.data;
                const temp = reportCard.evaluation;
                //console.log('temp', temp);
                setStudentId(reportCard.studentId);
                setStudentClassId(reportCard.studentClassId);
                setEvaluationType(reportCard.evaluationType);
                setAssessments(reportCard.assessments);
                setEvaluations(reportCard.evaluation);
                setOT(reportCard.evaluationType === 0 ? temp[0].ot : temp[1].ot);//
                setWT(reportCard.evaluationType === 0 ? temp[0].wt : temp[1].wt);//
                setComments(reportCard.comments);
            } else {
                console.error('Error fetching report card data');
            }
        };
        fetchReportCard();
    }, [token]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (evaluationType == 0) {
            evaluations[0].ot = OT;
            evaluations[0].wt = WT;
        } else {
            evaluations[1].ot = OT;
            evaluations[1].wt = WT;
        }

        const reportCardDTO = {
            studentId,
            reportCardId,
            studentClassId,
            evaluationType,
            assessments,
            evaluation: evaluations,
            comments
        };

        //console.log('reportCardDTO', JSON.stringify(reportCardDTO));

        const response = await ReportCardAPI.updateReportCard(reportCardId, reportCardDTO, token);
        if (response.status === HttpStatus.OK) {
            notify.notifySuccess('Report card updated successfully');
        } else {
            notify.notifyError('Error updating report card');
        }
    };

    // Handle change in assessments
    const handleAssessmentChange = (index, field, value) => {
        const updatedAssessments = [...assessments];
        updatedAssessments[index][field] = value;
        setAssessments(updatedAssessments);
    };

    return (
        //console.log('EditReportCard'),

        <Card className='mb-2' style={{ padding: '20px', marginTop: '20px' }}>
            <Link to={`/user/see-report-cards/${studentId}`} style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <Button variant="secondary">Back</Button>
            </Link>
            <Form onSubmit={handleSubmit}>
                <h1>Edit Report Card</h1>

                {/* Select Student */}


                {/* Evaluation Type */}
                <Form.Group controlId="evaluationType" className="mb-3">
                    <Form.Label>Evaluation Type</Form.Label>
                    <Form.Control
                        type="text"
                        value={evaluationType === 0 ? 'First Evaluation' : 'Final Evaluation'}
                        readOnly
                    />
                </Form.Group>

                {/* Assessments */}
                <h5>Assessments</h5>
                {assessments.map((assessment, index) => (
                    <Row key={index} className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId={`skill-${index}`}>
                                <Form.Label>Skill</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={assessment.skill}
                                    readOnly
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId={`rating-${index}`}>
                                <Form.Label>Rating</Form.Label>
                                <Form.Select
                                    value={assessment.rating}
                                    onChange={(e) => handleAssessmentChange(index, 'rating', e.target.value)}
                                    required
                                >
                                    <option value="">Select a rating...</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Good">Good</option>
                                    <option value="Satisfactory">Satisfactory</option>
                                    <option value="Poor">Poor</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                ))}

                {/* Grades */}
                <Form.Group controlId="OT" className="mb-3">
                    <Form.Label>Oral Test Grade (OT)</Form.Label>
                    <Form.Control
                        type="number"
                        value={OT}
                        onChange={(e) => setOT(e.target.value)}
                        required
                        min={0}
                        max={100}
                    />
                </Form.Group>

                <Form.Group controlId="WT" className="mb-3">
                    <Form.Label>Written Test Grade (WT)</Form.Label>
                    <Form.Control
                        type="number"
                        value={WT}
                        onChange={(e) => setWT(e.target.value)}
                        required
                        min={0}
                        max={100}
                    />
                </Form.Group>

                <Form.Group controlId="comments" className="mb-3">
                    <Form.Label>Comments</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Edit Report Card
                </Button>
            </Form>
        </Card>
    );
};

export default EditReportCard;