import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ClassesAPI } from '../../api/studentClasses';
import { useAuthContext } from '../../contexts/AuthContext';
import { HttpStatus } from '../../api/default';
import { notify } from '../../toasts/toasts';
import { AttendanceAPI } from '../../api/attendance';

const RegisterAttendancesScreen = () => {
    const [students, setStudents] = useState([]); // List of students in the class
    const [attendances, setAttendances] = useState([]); // List of attendance for students
    const [description, setDescription] = useState(''); // Description of the class
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Current date
    const { classId } = useParams();
    const { token } = useAuthContext();

    // Fetch students in the selected class
    useEffect(() => {
        const fetchStudents = async () => {
            const response = await ClassesAPI.listStudentsInClass(classId, token);
            if (response.status === HttpStatus.OK) {
                setStudents(response.data);
                // Initialize attendance with all students set to 'present: false'
                const initialAttendances = response.data.map(student => ({
                    studentId: student.id,
                    present: true
                }));
                setAttendances(initialAttendances);
            } else {
                console.error('Error fetching students in class');
            }
        };
        fetchStudents();
    }, [classId, token]);

    // Handle attendance status change
    const handleAttendanceChange = (studentId, present) => {
        setAttendances(prevAttendances =>
            prevAttendances.map(attendance =>
                attendance.studentId === studentId ? { ...attendance, present } : attendance
            )
        );
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const attendanceData = {
            date,
            description,
            studentsClassId: classId,
            attendances
        };

        try {
            // Submit the report card to the API
            const response = await AttendanceAPI.registerAula(attendanceData, token);
            
            if (response.status === HttpStatus.OK) {
                notify.notifySuccess('Attendances submitted successfully');
            } else {
                notify.notifyError('Error submitting report card');
            }
        } catch (error) {
            console.error('Error:', error);
            notify.notifyError('An unexpected error occurred');
        }
    };

    return (
        <Card className='mb-2' style={{ padding: '20px', marginTop: '20px' }}>
            <Form onSubmit={handleSubmit}>
                <h1>Take Attendance</h1>

                {/* Class Date */}
                <Form.Group controlId="date" className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* Class Description */}
                <Form.Group controlId="description" className="mb-3">
                    <Form.Label>Class Description</Form.Label>
                    <Form.Control
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* Students Attendance */}
                <h5>Mark Attendance</h5>
                {students.map((student, index) => (
                    <Row key={index} className="mb-3 align-items-center">
                        <Col md={6}>
                            <Form.Label>{student.name}</Form.Label>
                        </Col>
                        <Col md={6}>
                            <Form.Check
                                type="switch"
                                id={`attendance-switch-${student.id}`}
                                label={attendances.find(a => a.studentId === student.id)?.present ? 'Present' : 'Absent'}
                                checked={attendances.find(a => a.studentId === student.id)?.present || false}
                                onChange={() =>
                                    handleAttendanceChange(student.id, !attendances.find(a => a.studentId === student.id)?.present)
                                }
                            />
                        </Col>
                    </Row>
                ))}

                <Button variant="primary" type="submit">
                    Submit Attendance
                </Button>
            </Form>
        </Card>
    );
};

export default RegisterAttendancesScreen;
