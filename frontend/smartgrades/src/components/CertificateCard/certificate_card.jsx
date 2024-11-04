import React, { useState } from 'react';
import { Card, Modal } from 'react-bootstrap';

// Assuming certificate data contains id, name, creationDate, level, period, and base64 image.
const CertificateCard = ({ data }) => {

    // State for managing modal visibility
    const [showModal, setShowModal] = useState(false);

    // Format the date if needed
    const formattedDate = new Date(data.createdAt).toLocaleDateString();

    // Open modal
    const handleImageClick = () => {
        setShowModal(true);
    };

    // Close modal
    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <>
            <Card className="h-100 shadow-sm">
                <Card.Img 
                    variant="top" 
                    src={`data:image/jpeg;base64,${data.certificateImage}`} 
                    alt="Certificate Image"
                    className="img-fluid"
                    onClick={handleImageClick}  // Click event to open modal
                    style={{ cursor: 'pointer' }} // Change cursor to indicate clickable image
                />
                <Card.Body>
                    <Card.Text className="text-center">
                        <strong>Issued on: </strong>{formattedDate}
                    </Card.Text>
                </Card.Body>
            </Card>

            {/* Modal for fullscreen image */}
            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Body className="p-0">
                    <img
                        src={`data:image/jpeg;base64,${data.certificateImage}`}
                        alt="Certificate Fullscreen"
                        className="w-100"
                        style={{ maxHeight: '90vh', objectFit: 'contain' }} // Ensures the image fits the screen
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CertificateCard;
