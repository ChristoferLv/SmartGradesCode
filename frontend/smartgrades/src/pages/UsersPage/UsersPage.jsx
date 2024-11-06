import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import Avatar from 'react-avatar';
import UserCard from '../../components/UserCard/user_card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { AuthAPI } from '../../api/auth-api';
import { HttpStatus, Roles } from '../../api/default';
import { useAuthContext } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import './UsersPage.css';
import { UserAPI } from '../../api/users';

function UsersPage() {
  const [usersData, setUsersData] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [listStudents, setListStudents] = useState(false);

  const { logged, user, token } = useAuthContext();

  const handleSwitchChange = (e) => {
    setListStudents(e.target.checked);
  };

  const getUsers = async () => {
    let response;
    if (listStudents) {
      response = await UserAPI.listStudents(token);
    } else {
      response = await UserAPI.listUsers(token);
    }
    if (response.status === HttpStatus.OK) {
      setUsersData(response.data);
      setIsFetched(true);
    }
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, [listStudents, token]);

  const hasRole = (roleName) => {
    return user.roles.some(role => role.name === roleName);
  };

  useEffect(() => {
    if (!hasRole(Roles.TEACHER) && !hasRole(Roles.ADMIN)) {
      navigate('/user/see-report-cards/');
    }
  }, [user]);

  const filteredUsers = usersData.filter((user) =>
    user.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <Container fluid className='mb-2'>
        <Col>
          <Navbar>
            {logged && user && (
              <p style={{ color: '#0f5b7a' }} className="mt-3 fs-6 fw-bold">
                &#128075;&nbsp; Hey, {user?.name?.split(' ')[0]}!
              </p>
            )}

            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                {user && (
                  <Avatar
                    name={user.name}
                    color="#0f5b7a"
                    size={30}
                    textSizeRatio={2}
                    round={true}
                  />
                )}
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>
          <Row className="home-card">
            <div className="col">
              <h1 className="mt-3 mb-3 fs-5 fw-bold">Users List</h1>
              <Form>
                <Form.Check
                  type="switch"
                  id="usersSwitch"
                  label="Only Students"
                  onChange={handleSwitchChange}
                />
              </Form>

              <div className="mb-3 container-input">
                <input
                  style={{ color: "black" }}
                  placeholder="Buscar usuários"
                  className='input-search'
                  value={searchValue}
                  onChange={handleSearch}
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} className='icon-search' />
              </div>

              {isFetched ? (
                <>
                  {filteredUsers.length > 0 ? (
                    <Row className="g-4">
                      {filteredUsers.map((user) => (
                        <Col xs={12} lg={4} key={user.id}>
                          <Link to={`/teacher/user-profile/${user.id}`}>
                            <UserCard user={user} />
                          </Link>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <p>Nenhum usuário encontrado com o termo de busca.</p>
                  )}
                </>
              ) : (
                <p>Carregando...</p>
              )}
            </div>
          </Row>
        </Col>
      </Container>
    </>
  );
}

export default UsersPage;