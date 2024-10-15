import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ClassesAPI } from '../../api/studentClasses';
import { useAuthContext } from '../../contexts/AuthContext';
import { HttpStatus } from '../../api/default';

const ReportCardForm = ({ teacherId, studentClassId }) => {
    const [students, setStudents] = useState([]); // List of students in the class
    const [studentId, setStudentId] = useState(''); // Selected student
    const [evaluationType, setEvaluationType] = useState('FIRST_EVALUATION'); // Evaluation type
    const [assessments, setAssessments] = useState([{ skill: 'Speaking', rating: '' }, { skill: 'Listening', rating: '' },
    { skill: 'Reading', rating: '' }, { skill: 'Writing/grammar', rating: '' }, { skill: 'Effort', rating: '' },
     { skill: 'Attendance', rating: '' }, { skill: 'Content Retention ', rating: '' },{ skill: 'Homework', rating: '' }
    ]); // List of assessments
    const [OT, setOT] = useState(''); // Oral Test grade
    const [WT, setWT] = useState(''); // Written Test grade
    const classID = useParams();
    const {token} = useAuthContext();


    // Fetch students in the selected class
    useEffect(() => {
        const fetchStudents = async () => {
            const response = await ClassesAPI.listStudentsInClass(classID, token);
            if (response.status === HttpStatus.OK) {
                setStudents(response.data);
            } else {
                console.error('Error fetching students in class');
            }
        };
        fetchStudents();
    }, [token]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const reportCardDTO = {
            studentId,
            studentClassId,
            evaluationType,
            assessments,
            OT: parseInt(OT, 10),
            WT: parseInt(WT, 10),
        };

        axios.post('/api/report-cards', reportCardDTO)
            .then(response => {
                alert('Report card created successfully!');
                // Clear form after submission
                setStudentId('');
                setEvaluationType('FIRST_EVALUATION');
                setAssessments([{ skill: '', rating: '' }]);
                setOT('');
                setWT('');
            })
            .catch(error => {
                console.error('Error creating report card', error);
                alert('Failed to create report card.');
            });
    };

    // Handle change in assessments
    const handleAssessmentChange = (index, field, value) => {
        const newAssessments = [...assessments];
        newAssessments[index][field] = value;
        setAssessments(newAssessments);
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
                        <option value="FIRST_EVALUATION">First Evaluation</option>
                        <option value="FINAL_EVALUATION">Final Evaluation</option>
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

                <Button variant="primary" type="submit">
                    Submit Report Card
                </Button>
            </Form>
        </Card>
    );
};

export default ReportCardForm;
