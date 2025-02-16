import React from 'react';
import './nav_bar.css'
import { Navbar, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { SiBookstack } from 'react-icons/si'
import { FaBookmark, FaList, FaNotesMedical, FaRegIdCard, FaStickyNote, FaUser } from 'react-icons/fa'
import { ImBooks } from 'react-icons/im'
import { GiArchiveRegister } from 'react-icons/gi'
import { TbLogin, TbNote } from 'react-icons/tb'
import { AiFillHome } from 'react-icons/ai'
import { BsKeyFill, BsReverseListColumnsReverse } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom';
import { OnlyNotLogged, StrictRoute } from '../../contexts/StrictRoute';
import { Roles } from '../../api/default';
import { IoAdd } from 'react-icons/io5';
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons';


const NavLinkTo = ({ href, title, icon }) => (
  <ListGroup horizontal>
    <ListGroup.Item
      style={{
        paddingLeft: '5px',
        paddingRight: '0px',
      }}
      className="li"
    >
      {icon}
    </ListGroup.Item>
    <ListGroup.Item className="li">
      <Link
        className="hover-clic"
        style={{ color: '#8a9094' }}
        to={href}
      >
        {title}
      </Link>
    </ListGroup.Item>
  </ListGroup>
)

const NavText = ({ text }) => (
  <Navbar.Text
    className="fw-bold"
    style={{
      fontSize: 'x-small',
      color: '#b4bbbf',
      paddingLeft: '16px',
    }}
  >
    {text}
  </Navbar.Text>
)

const NavGroupFlush = ({ children }) => (
  <ListGroup variant="flush">
    <ListGroupItem
      className="list"
      style={{
        paddingLeft: '15px',
        paddingRight: '0px',
      }}
    >
      {children}
    </ListGroupItem>
  </ListGroup>
)

const FAIcon = ({ Icon }) => (
  <Icon style={{ color: '#8a9094', fontSize: '18' }} className="me-2" />
)

const SideNav = () => {
  const navigate = useNavigate();
  return (
      <Navbar className='home-desktop show-desktop-version'>
        <Card className='cardSide'>
        <Card.Img className="cardSide-img-top mx-auto mt-2" variant="top" onClick={()=> navigate("/")} src={'https://i.ibb.co/RjNZH1H/logo.png'} />

          <Card.Body
            style={{
              paddingLeft: '0px',
              paddingRRight: '0px',
            }}
          >
            <NavText text='GERAL' />
            <NavGroupFlush>
              <StrictRoute roles={[Roles.STUDENT, Roles.ADMIN, Roles.TEACHER]}>
              <NavLinkTo title='Home' href='/' icon={<FAIcon Icon={AiFillHome} />} />
                <NavLinkTo title='Meu Perfil' href='/perfil' icon={<FAIcon Icon={FaUser} />} />
                {/* <NavLinkTo title='Meus Boletins' href='/user/see-report-cards' icon={<FAIcon Icon={FaList} />} /> */}
                <NavLinkTo title='Meus Certificados' href='/user/certificates' icon={<FAIcon Icon={FaStickyNote} />} />
              </StrictRoute>
              <OnlyNotLogged>
                <NavLinkTo title='Logar-se' href='/login' icon={<FAIcon Icon={TbLogin} />} />
              </OnlyNotLogged>
            </NavGroupFlush>

           


            <StrictRoute roles={[Roles.TEACHER, Roles.ADMIN]}>
              <NavText text='TEACHER' />
              <NavGroupFlush>
                <NavLinkTo title='List users' href='/teacher/users' icon={<FAIcon Icon={FaUser} />} />
                <NavLinkTo title='Registrar Aluno' href='/teacher/register-student' icon={<FAIcon Icon={IoAdd} />} />
                <NavLinkTo title='Criar turma' href='/teacher/classes/create' icon={<FAIcon Icon={SiBookstack} />} />
                <NavLinkTo title='Turmas' href='/teacher/classes' icon={<FAIcon Icon={ImBooks} />} />
              </NavGroupFlush>
            </StrictRoute>

            <StrictRoute roles={[Roles.ADMIN]}>
              <NavText text='ADMIN' />
              <NavGroupFlush>
                <NavLinkTo title='Teachers List' href='/admin/list-teachers' icon={<FAIcon Icon={BsReverseListColumnsReverse} />} />
              </NavGroupFlush>
            </StrictRoute>
            
          </Card.Body>
          <StrictRoute roles={[Roles.STUDENT, Roles.ADMIN, Roles.TEACHER]}>
            <Card.Footer style={{backgroundColor: "white"}}>
              <NavLinkTo title='Sair' href='/logout' icon={<FAIcon Icon={TbLogin} />} />
            </Card.Footer>
          </StrictRoute>
        </Card>
      </Navbar>
    );
  }

  export default SideNav;