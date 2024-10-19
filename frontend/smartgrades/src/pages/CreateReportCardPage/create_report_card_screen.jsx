import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ClassesAPI } from '../../api/studentClasses';
import { useAuthContext } from '../../contexts/AuthContext';
import { HttpStatus } from '../../api/default';
import { ReportCardAPI } from '../../api/reportCard';
import { notify } from '../../toasts/toasts';

const ReportCardForm = () => {
    const [students, setStudents] = useState([]); // List of students in the class
    const [studentId, setStudentId] = useState(''); // Selected student
    const [evaluationType, setEvaluationType] = useState(0); // Evaluation type
    const [assessments, setAssessments] = useState([{ skill: 'Speaking', rating: '' }, { skill: 'Listening', rating: '' },
    { skill: 'Reading', rating: '' }, { skill: 'Writing/grammar', rating: '' }, { skill: 'Effort', rating: '' },
    { skill: 'Attendance', rating: '' }, { skill: 'Content Retention ', rating: '' }, { skill: 'Homework', rating: '' }
    ]); // List of assessments
    const [OT, setOT] = useState(''); // Oral Test grade
    const [WT, setWT] = useState(''); // Written Test grade
    const [comments, setComments] = useState(''); // Comments
    const { classId } = useParams();
    const { user, token } = useAuthContext();


    // Fetch students in the selected class
    useEffect(() => {
        const fetchStudents = async () => {
            const response = await ClassesAPI.listStudentsInClass(classId, token);
            if (response.status === HttpStatus.OK) {
                setStudents(response.data);
            } else {
                console.error('Error fetching students in class');
            }
        };
        fetchStudents();
    }, [token]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Map OT and WT to the evaluation structure
        const evaluation = [{
            OT: parseInt(OT, 10),
            WT: parseInt(WT, 10),
            evaluationType, // Pass the current evaluation type
        }];

        // Create the report card DTO according to the new structure
        const reportCardDTO = {
            studentId,
            studentClassId: classId,
            evaluationType, // FIRST_EVALUATION or FINAL_EVALUATION
            assessments, // List of assessments
            evaluation, // List of evaluations (contains OT, WT, etc.)
            comments,
            teacherId: user.id
        };

        try {
            // Submit the report card to the API
            const response = await ReportCardAPI.submitReportCard(reportCardDTO, token);
            console.log("teacherId:", reportCardDTO.teacherId);
            console.log("ReportCardAPI.submitReportCard:", JSON.stringify(reportCardDTO));

            if (response.status === HttpStatus.OK) {
                notify.notifySuccess('Report card submitted successfully');
            } else {
                notify.notifyError('Error submitting report card');
            }
        } catch (error) {
            console.error('Error:', error);
            notify.notifyError('An unexpected error occurred');
        }
    };


    // Handle change in assessments
    const handleAssessmentChange = (index, field, value) => {
        const updatedAssessments = [...assessments];
        updatedAssessments[index][field] = value;
        setAssessments(updatedAssessments);
    };



    return (
        <Card className='mb-2' style={{ padding: '20px', marginTop: '20px' }}>
            <Form onSubmit={handleSubmit}>
                <h1>Create Report Card</h1>

                {/* Select Student */}
                <Form.Group controlId="studentSelect" className="mb-3">
                    <Form.Label>Select Student</Form.Label>
                    <Form.Select value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
                        <option value="">Select a student...</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>
                                {student.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* Evaluation Type */}
                <Form.Group controlId="evaluationType" className="mb-3">
                    <Form.Label>Evaluation Type</Form.Label>
                    <Form.Select value={evaluationType} onChange={(e) => setEvaluationType(e.target.value)} required>
                        <option value={0}>First Evaluation</option>
                        <option value={1}>Final Evaluation</option>
                    </Form.Select>
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
                    Submit Report Card
                </Button>
            </Form>
        </Card>
    );
};

export default ReportCardForm;
