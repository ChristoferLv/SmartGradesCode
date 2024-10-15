import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Spinner, ListGroup } from 'react-bootstrap';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClassesAPI } from '../../api/studentClasses';
import { UserAPI } from '../../api/users';
import { useAuthContext } from '../../contexts/AuthContext';
import "./enroll_student_screen.css";

export default function EnrollStudentsScreen() {
    const { id } = useParams();
    const [classInfo, setClassInfo] = useState({ level: '', period: { name: '' }, classGroup: '' });
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuthContext();
    const navigate = useNavigate();

    // Fetch class info on load
    useEffect(() => {
        const fetchClassData = async () => {
            const response = await ClassesAPI.getClassById(id, token);
            if (response.status === 200) {
                setClassInfo(response.data);
            } else {
                toast.error("Error fetching class data", { autoClose: 5000 });
            }
        };
        fetchClassData();
    }, [id, token]);

    // Fetch list of active students
    useEffect(() => {
        const fetchStudents = async () => {
            const response = await UserAPI.getActiveUsers(token);
            if (response.status === 200) {
                setStudents(response.data);
            } else {
                toast.error("Error fetching students", { autoClose: 5000 });
            }
        };
        fetchStudents();
    }, [token]);

    // Enroll a student into the class
    const enrollStudent = async (studentId) => {
        setIsLoading(true);
        const enrollmentDTO = {
            studentId: studentId,
            classId: id,
        };

        const response = await ClassesAPI.enrollStudentInClass(enrollmentDTO, token);
        if (response.status === 200) {
            toast.success("Student enrolled successfully", { autoClose: 5000 });
            setStudents(students.filter(student => student.id !== studentId));
        } else {
            toast.error("Error enrolling student", { autoClose: 5000 });
        }
        setIsLoading(false);
    };

    return (
        <div className="container-fluid p-5 col-sm-7 col-md-8 col-lg-10">
            <div className="row">
                <div className="col">
                    <img
                        style={{ width: '11em' }}
                        onClick={() => navigate('/')}
                        src="https://i.ibb.co/r3QPmSt/logo.png"
                        alt="logo"
                    />
                </div>
                <div className="row d-flex align-items-center justify-content-between">
                    <div className="col">
                        <p className="fw-bold fs-4 ms-1 mt-5">Enroll Students in Class</p>
                    </div>
                </div>
            </div>

            <div className="row ps-1 mt-2">
                <div className="class-details mb-4">
                    <p><strong>Level:</strong> {classInfo.level}</p>
                    <p><strong>Period:</strong> {classInfo.period.name}</p>
                    <p><strong>Class Group:</strong> {classInfo.classGroup}</p>
                </div>

                <h5>Active Students</h5>
                <ListGroup className="mb-3">
                    {students.length > 0 ? students.map((student) => (
                        <ListGroup.Item key={student.id} className="d-flex justify-content-between align-items-center">
                            {student.name}
                            <Button
                                variant="success"
                                onClick={() => enrollStudent(student.id)}
                                disabled={isLoading}
                            >
                                {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" /> : 'Enroll'}
                            </Button>
                        </ListGroup.Item>
                    )) : <p>No active students available</p>}
                </ListGroup>

                <div className="row mt-3">
                    <div className="col-auto text-end">
                        <Button variant="danger" onClick={() => navigate('/')}>Cancel</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
