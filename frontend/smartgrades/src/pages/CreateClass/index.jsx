/* eslint-disable no-mixed-operators */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  Container,
  Col,
  Row,
  Form,
  Button,
  Spinner,
} from 'react-bootstrap'
import { ClassesAPI } from '../../api/studentClasses'
import { HttpStatus, CourseAPI } from './api'
import { useAuthContext } from '../../contexts/AuthContext'
import { cut } from '../../tools/string'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { notify } from '../../toasts/toasts'

const PostFormStatus = {
  ENVIADO: 'ENVIADO',
  ENVIANDO: 'ENVIANDO',
  ERRO: 'ERRO',
  NULL: 'NULL',
}

export const NewClassScreen = () => {
  const resetValores = () => {
    return {
      title: '',
      description: '',
      files: [],
      content: '',
    }
  }

  const { logged, user, token } = useAuthContext()

  const [estado, setEstado] = useState({
    level: undefined,
    period: undefined,
    group: undefined
  })

  const [formValores, setFormValores] = useState(resetValores())
  const [isLoadingAdd, setIsLoadingAdd] = useState(false)

  const navigate = useNavigate()

  const setLevel = (e) => {
    setEstado({ ...estado, level: undefined })
    setFormValores({
      ...formValores,
      level: cut(e?.target?.value ?? '', 256),
    })
  }

  const setPeriod = (e) => {
    setEstado({ ...estado, period: undefined })
    setFormValores({ ...formValores, period: cut(e?.target?.value ?? '', 64) })
  }

  const setGroup = (e) => {
    setEstado({ ...estado, group: undefined })
    setFormValores({
      ...formValores,
      group: cut(e?.target?.value ?? '', 1024),
    })
  }

  const sendForm = async () => {
    // Validation checks
    var estadoAux = {
      level: formValores.level.trim().length >= 3,
      period: formValores.period.trim().length >= 2,
      group: formValores.group.trim().length >= 3,
    }

    setEstado({ ...estadoAux })

    // Return if any of the fields are invalid
    for (let [, value] of Object.entries(estadoAux)) if (!value) return


    // Create JSON payload with the required format
    const post = {
      level: formValores.level,         // level as a string
      period: { name: formValores.period }, // period as an object with "name"
      classGroup: formValores.group,    // rename group to classGroup
    }

    const response = await ClassesAPI.createClass(
      post, token
    )

    if (response.status === HttpStatus.OK) {
      notify.notifySuccess("Class created successfully!")
    } else {
      console.log(response)
      notify.notifyError("Error on creating class. " + response.data.error)
    }

  }


  return logged && !!user ? (
    <section className="box-course pb-1 pt-1">
      <Container fluid className="container-new-course container-course mb-5 col-8">
        <Form>
          <Row>
            <Col lg={12} className="mt-4">
              <h2>Create new class</h2>
            </Col>
            <Col>
              <Container fluid>
                <Row>
                  <Col xs={12} className="pl0">
                    <Form.Label className="w-100 mt-4">
                      Course Level
                      <Form.Control
                        className="input-title"
                        spellCheck={false}
                        required
                        type="text"
                        value={formValores.level == undefined ? "" : formValores.level}
                        onChange={setLevel}
                        isValid={estado.level}
                        isInvalid={estado.level !== undefined ? !estado.level : undefined}
                        onBlur={() =>
                          setEstado({
                            ...estado,
                            level: formValores.level.trim().length >= 3,
                          })
                        }
                      />
                    </Form.Label>
                  </Col>
                  <Col xs={12} className="pl0">
                    <Form.Label className="w-100 mt-4">
                      Period
                      <Form.Control
                        className="input-description"
                        spellCheck="false"
                        required
                        type='text'
                        value={formValores.period == undefined ? "" : formValores.period}
                        onChange={setPeriod}
                        isValid={estado.period}
                        isInvalid={estado.period !== undefined ? !estado.period : undefined}
                        onBlur={() =>
                          setEstado({
                            ...estado,
                            period: formValores.period.trim().length >= 3,
                          })
                        }
                      />
                    </Form.Label>
                  </Col>
                  <Col xs={12} className="pl0">
                    <Form.Label className="w-100 mt-4">
                      Class Group
                      <Form.Control
                        className="input-content"
                        spellCheck="false"
                        required
                        type='text'
                        value={formValores.group == undefined ? "" : formValores.group}
                        onChange={setGroup}
                        isValid={estado.group}
                        isInvalid={estado.group !== undefined ? !estado.group : undefined}
                        onBlur={() =>
                          setEstado({
                            ...estado,
                            group: formValores.group.trim().length >= 3,
                          })
                        }
                      />
                    </Form.Label>
                    <Form.Label className="w-100 mt-4">
                      <div className="d-flex justify-content-end">
                        <Button
                          className="submit-form-learning hover-learning"
                          style={{ width: 'auto' }}
                          onClick={sendForm}
                          disabled={isLoadingAdd}
                        >
                          {isLoadingAdd ? (
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faAdd} /> Create Class
                            </>
                          )}
                        </Button>
                      </div>
                    </Form.Label>

                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Form>
      </Container>
    </section>
  ) : (
    <></>
  )
}

export default NewClassScreen
