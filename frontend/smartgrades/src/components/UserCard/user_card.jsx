import React from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { CiUser } from "react-icons/ci";

function UserCard({ user }) {
  return (
    <Card className="user-card d-flex flex-row" style={{ width: '100%' }}>
      {user.imageUrl ? (
        <Card.Img
          className="user-card-img-left"
          variant="left"
          style={{ width: '150px' }} // Adjust the size of the image
          src={user.imageUrl}
          alt={user.name}
        />
      ) : (
        <div
          className="user-card-img-placeholder"
          style={{ width: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <CiUser size={64} /> {/* Display icon if no image is available */}
        </div>
      )}
      
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title>{user.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{user.username}</Card.Subtitle>

          <ListGroup className="list-group-flush">
            <ListGroupItem><strong>Date of Birth: </strong>{user.dateOfBirth}</ListGroupItem>
            <ListGroupItem><strong>Phone: </strong>{user.phoneNumber}</ListGroupItem>
            <ListGroupItem><strong>Email: </strong>{user.email}</ListGroupItem>
          </ListGroup>
        </div>

        <Card.Text className="mt-2">
          <strong>Roles:</strong> {user.roles.map((role) => role.name).join(', ')}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default UserCard;
