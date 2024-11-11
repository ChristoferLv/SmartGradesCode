import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Spinner, Table } from "react-bootstrap";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClassesAPI } from '../../api/studentClasses';
import { useAuthContext } from '../../contexts/AuthContext';
import "./class_details_screen.css";
import { notify } from '../../toasts/toasts';
import { CertificateAPI } from '../../api/certificate';

export default function ClassDetailsScreen() {
    const { id } = useParams();
    const [classDetails, setClassDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuthContext();
    const navigate = useNavigate();

    const handleUnenroll = async (studentId, id, token) => {
        const enrollmentDTO = {
            studentId: studentId,
            classId: id,
        };

        const response = await ClassesAPI.unenrollStudentInClass(enrollmentDTO, token);
        if (response.status === 200) {
            notify.notifySuccess("Student unenrolled successfully.");
            setClassDetails({
                ...classDetails,
                students: classDetails.students.filter(student => student.id !== studentId),
            });
        } else {
            notify.notifyError("Error unenrolling student.");
        }
    };

    const handleIssueCertificate = async (studentId) => {
        const response = await CertificateAPI.generateCertificate(studentId, token);
        console.log(response);
        if (response.status === 200) {
            notify.notifySuccess("Certificate issued successfully.");
        } else {
            notify.notifyError("Error issuing certificate: " + response.data.message);
        }
    };

    // Fetch class data and enrolled students
    useEffect(() => {
        const fetchClassData = async () => {
            setIsLoading(true);
            const response = await ClassesAPI.getClassById(id, token);
            if (response.status === 200) {
                setClassDetails(response.data);
            } else {
                notify.notifyError("Error fetching class data");
            }
            setIsLoading(false);
        };
        fetchClassData();
    }, [id, token]);

    if (isLoading || !classDetails) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" role="status" />
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    return (
        <div className="container-fluid p-5 col-sm-7 col-md-8 col-lg-10">
            <div className="row mb-3">
                <div className="col">
                    <img
                        style={{ width: '7em', borderRadius: "15px" }}
                        onClick={() => navigate('/')}
                        src="https://i.ibb.co/RjNZH1H/logo.png"
                        alt="logo"
                        border="0"
                    />
                </div>
                <div className="col-auto">
                    <Button
                        style={{ backgroundColor: "#FFD700", color: "black", border: "none" }}
                        className="ms-3"
                        variant="success"
                        onClick={() => navigate(`/teacher/edit-class/${id}`)}
                    >
                        Edit Class
                    </Button>
                    <Button
                        style={{ backgroundColor: "#FFD700", color: "black", border: "none" }}
                        className="ms-3"
                        variant="success"
                        onClick={() => navigate(`/teacher/aulas/${id}`)}
                    >
                        View Lectures
                    </Button>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col">
                    <h2>Class Details</h2>
                    <p><strong>Level:</strong> {classDetails.level}</p>
                    <p><strong>Period:</strong> {classDetails.period.name}</p>
                    <p><strong>Class Group:</strong> {classDetails.classGroup}</p>
                    <p><strong>State:</strong> {classDetails.state === 1 ? 'ACTIVE' : 'FINISHED'}</p>
                    <div className="col-auto">
                        <Button
                            className='ms-2'
                            variant="primary"
                            onClick={() => navigate(`/teacher/enroll-student/${id}`)}
                        >
                            Enroll Students
                        </Button>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <h3>Enrolled Students</h3>
                    <Link to={`/teacher/report-card-form/${id}`}>
                        <Button variant="primary" className="ms-2 mb-3">
                            Submit Report Card
                        </Button>
                    </Link>
                    <Link to={`/teacher/attendance-form/${id}`}>
                        <Button variant="primary" className="ms-2 mb-3">
                            Take Attendances
                        </Button>
                    </Link>

                    {classDetails.students && classDetails.students.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classDetails.students.map((student, index) => (
                                    <tr key={student.id}>
                                        <td>{index + 1}</td>
                                        <td><Link to={`/teacher/user-profile/${student.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                            {student.name}
                                        </Link></td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleUnenroll(student.id, id, token)}
                                                className="me-2"
                                            >
                                                Unenroll
                                            </Button>
                                            <Button
                                                variant="primary"
                                                onClick={() => handleIssueCertificate(student.id)}
                                            >
                                                Issue Certificate
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No students enrolled yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}