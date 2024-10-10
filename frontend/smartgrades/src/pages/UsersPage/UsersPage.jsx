import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import Avatar from 'react-avatar'
import UserCard from '../../components/UserCard/user_card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'

//Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCheck } from '@fortawesome/free-solid-svg-icons'
import { AuthAPI } from '../../api/auth-api'
import { HttpStatus } from '../../api/default'
import { useAuthContext } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import './UsersPage.css'
import { UserAPI } from '../../api/users'


function UsersPage() {
  const [usersData, setUsersData] = useState({})
  const [isFetched, setIsFetched] = useState(false)
  const [searchData, setSearchData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [listStudents, setListStudents] = useState(false)

  const { logged, user, token } = useAuthContext()

  const handleSwitchChange = (e) => {
    setListStudents(e.target.checked);
  }

  const getUsers = async (e) => {
    let response;
    if(listStudents){
      response = await UserAPI.listStudents(token);
    }else{
      response = await UserAPI.listUsers(token);
    }
    //console.log(responseCourses);
    if (response.status === HttpStatus.OK) {
      setUsersData(response.data)
      setIsFetched(true)
    }
  }

  const handleSearch = (e) => {
    setSearchValue(e.target.value)
    const filteredData = usersData.results.filter((curso) =>
      curso.title.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setSearchData(filteredData)
  }

  useEffect(() => {
    getUsers()
  }, [listStudents])



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
                <Form.Check // prettier-ignore
                  type="switch"
                  id="usersSwitch"
                  label="Only Students"
                  onChange={handleSwitchChange}
                />
              </Form>

              <div className="mb-3 container-input" onChange={(e) => handleSearch(e)}>
                <input placeholder="Buscar cursos" className='input-search' />
                <FontAwesomeIcon icon={faMagnifyingGlass} className='icon-search' />
              </div>


              {isFetched ? (
                <>
                  {searchValue ? (
                    searchData.length > 0 ? (
                      <Row className="g-4">
                        {searchData.map((course) => (
                          <Col xs={12} lg={4} key={course.id}>
                            <Link to={`/courses/${course.id}`}>
                              <UserCard teste={course} />
                            </Link>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <p>Nenhum curso encontrado com o termo de busca.</p>
                    )
                  ) : usersData ? (
                    <Row className="g-4">
                      {usersData.map((course) => (
                        <Col xs={12} lg={4} key={course.id}>
                          <Link to={`/courses/${course.name}`}>
                            <UserCard user={course} />
                          </Link>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <p>Não há cursos disponíveis.</p>
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
  )
}

export default UsersPage
