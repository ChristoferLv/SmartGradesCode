import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext';
import CardCertificate from '../../components/CertificateCard/certificate_card';
import { HttpStatus } from '../../api/default';
import { CertificateAPI } from '../../api/certificate';

const CertificatesPage = () => {
    const [userData, setUserData] = useState({name:""});
    const [certificates, setCertificates] = useState([]);
    const [isFetched, setIsFetched] = useState(false);
    const { token, user } = useAuthContext();

    // Fetch user certificates
    const getCertificates = async () => {
        setIsFetched(false);
        try {
            const response = await CertificateAPI.getCertificates(user.id, token); // Assuming this API endpoint exists
            if (response.status === HttpStatus.OK) {
                const sortedCertificates = response.data.sort((a, b) => 
                    new Date(b.creationDate) - new Date(a.creationDate)
                );
                setCertificates(sortedCertificates);
                setIsFetched(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch user data from localStorage and certificates on mount
    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            setUserData(JSON.parse(userData));
        }
        getCertificates();
    }, []);

    return (
        <Row>
            <Row className="home-card mt-5">
                <div className="col">
                    <h1 className="mb-3 fs-5 fw-bold">Certificates</h1>

                    {isFetched ? (
                        certificates.length ? (
                            <Row className="g-4">
                                {certificates.map((certificate) => (
                                    <Col xs={12} lg={4} key={certificate.id}>
                                            <CardCertificate data={certificate} />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Container fluid>
                                <div className="d-flex align-items-center justify-content-center" style={{ height: "350px" }}>
                                    <span>
                                        <h1>No certificates found.</h1>
                                    </span>
                                </div>
                            </Container>
                        )
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </Row>
        </Row>
    );
}

export default CertificatesPage;
