/* eslint-disable no-unused-vars */

import { BrowserRouter, Route, Routes, Outlet, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LoginPage from "../pages/Login";
import SideNav from '../components/NavBar/nav_bar';
import { AuthProvider, useAuthContext } from '../contexts/AuthContext';
import { StrictRoute } from '../contexts/StrictRoute';
import { Roles } from '../api/default';

import "../global.css"
import PasswordRecoveryPage from '../pages/RecoverPassword';
import ChangePasswordPage from '../pages/ChangePassword';
import UsersPage from '../pages/UsersPage/UsersPage';
import NewClassScreen from '../pages/CreateClass/create_class';
import ClassesListPage from '../pages/ClassesList/classes_list';
import RegisterStudentScreen from '../pages/RegisterStudent/register_student_screen';
import EditUserScreen from '../pages/EditUserPage/edit_user_screen';
import EditClassScreen from '../pages/EditClassPage/edit_class_screen';
import EnrollStudentsScreen from '../pages/EnrollStudentPage/enroll_student_screen';
import TeachersPage from '../pages/ListTeachersPage/list_teachers_page';
import UserDetailsScreen from '../pages/UserDetailsPage/user_details_screen';
import ClassDetailsScreen from '../pages/ClassDetailsPage/class_details_screen';
import ReportCardForm from '../pages/CreateReportCardPage/create_report_card_screen';
import EditReportCard from '../pages/EditReportCardPage/edit_report_card_screen';
import StudentReportCardsScreen from '../pages/ReportCardsPage/report_cards_screen';
import CertificatesPage from '../pages/CertificatesPage/certificates_screen';
import RegisterAttendancesScreen from '../pages/RegisterAttendancesPage/register_attendances_screen';

const SidebarLayout = () => (
  <>
    <SideNav />
    <Container>
      <Row>
        <div className="col-2" />
        <Col>
          <Outlet />
        </Col>
      </Row>
    </Container>
  </>
)

const CSSBaseline = () => (
  <>
    <div className="baseline" />
  </>
)

function DefaultRoutes() {
  const authContext = useAuthContext();

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/recuperar-senha' element={<PasswordRecoveryPage />} />
          <Route path='/alterar-senha' element={<ChangePasswordPage />} />
          <Route element={<SidebarLayout />}>
            <Route path='/' element={<StrictRoute roles={[Roles.TEACHER, Roles.ADMIN]}><UsersPage /></StrictRoute>} />
       


            <Route path='/user/see-report-cards/:id?' element={<StrictRoute roles={[Roles.STUDENT, Roles.TEACHER, Roles.ADMIN]}><StudentReportCardsScreen /></StrictRoute>} />
            <Route path='/user/certificates' element={<StrictRoute roles={[Roles.STUDENT, Roles.TEACHER, Roles.ADMIN]}><CertificatesPage /></StrictRoute>} />

            <Route path='/teacher/classes' element={<StrictRoute roles={[Roles.TEACHER, Roles.ADMIN]}><ClassesListPage /></StrictRoute>} />
            <Route path='/teacher/classes/create' element={<StrictRoute roles={[Roles.TEACHER, Roles.ADMIN]}><NewClassScreen /></StrictRoute>} />
            <Route path='/teacher/register-student' element={<StrictRoute roles={[Roles.TEACHER, Roles.ADMIN]}><RegisterStudentScreen /></StrictRoute>} />
            <Route path='/teacher/users' element={<StrictRoute roles={[Roles.TEACHER, Roles.ADMIN]}><UsersPage /></StrictRoute>} />
            <Route path='/teacher/edit-user/:id' element={<StrictRoute roles={[Roles.TEACHER, Roles.ADMIN]}><EditUserScreen /></StrictRoute>} />
            <Route path="/teacher/edit-class/:id" element={<StrictRoute roles={[Roles.TEACHER, Roles.ADMIN]}><EditClassScreen /></StrictRoute>} />
            <Route path='/teacher/enroll-student/:id' element={<StrictRoute roles={[Roles.TEACHER, Roles.ADMIN]}><EnrollStudentsScreen /></StrictRoute>} />
            <Route path='/teacher/user-profile/:id' element={<StrictRoute roles={[Roles.TEACHER, Roles.ADMIN]}><UserDetailsScreen /></StrictRoute>} />
            <Route path='/teacher/class-details/:id' element={<StrictRoute roles={[Roles.TEACHER, Roles.ADMIN]}><ClassDetailsScreen /></StrictRoute>} />
            <Route path='/teacher/report-card-form/:classId' element={<StrictRoute roles={[Roles.TEACHER, Roles.ADMIN]}><ReportCardForm /></StrictRoute>} />
            <Route path='/teacher/edit-report-card/:reportCardId' element={<StrictRoute roles={[Roles.TEACHER, Roles.ADMIN]}><EditReportCard /></StrictRoute>} />
            <Route path='/teacher/attendance-form/:classId' element={<StrictRoute roles={[Roles.TEACHER, Roles.ADMIN]}><RegisterAttendancesScreen /></StrictRoute>} />

            <Route path='/admin/list-teachers' element={<StrictRoute roles={[Roles.ADMIN]}><TeachersPage /></StrictRoute>} />


            <Route path='/logout' element={<StrictRoute roles={[Roles.STUDENT, Roles.TEACHER, Roles.ADMIN]} children={<Logout />} />} />
            <Route path="*" element={< h2 className="w-100 vh-100 d-flex flex-row justify-content-center align-items-center font-weight-bold-important">Ops! Você está perdido ?!<br />Esta rota não existe ;(</h2>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default DefaultRoutes

const Logout = () => {
  const { setToken } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const exec = async () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      await setToken(null);
      navigate('/');
    }
    exec();
  }, [])

  return <></>
}
