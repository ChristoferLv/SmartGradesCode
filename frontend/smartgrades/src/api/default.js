// export const BASE_URL = 'https://portal-aulas-api.fly.dev';
//export const BASE_URL = 'http://localhost:8080';
export const BASE_URL = 'http://20.14.113.9:8080';
export const BASE_URLv1 = `${BASE_URL}/api/v1`;

export const AUTH_DEBUG = false

/*
  HttpStatus e HttpResponse são utilizados em várias partes
  do projeto, ao altera-ĺos verificar se as demais partes continuaram funcionando!
*/
export const HttpStatus = {
  OK: 200,
  ERROR: 400
}

export class HttpResponse {
  status = HttpStatus.ERROR;
  data = null;

  constructor(status, data) {
    this.status = status; 
    this.data = data;
  }
}

export const Roles = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  ADMIN: "ADMIN"
}
