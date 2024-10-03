import { BASE_URL, AUTH_DEBUG, HttpStatus, HttpResponse } from './default';

const listUsers = async() => {
    const url = `${BASE_URL}/api/v1/user`;
    try {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                // jwt: jwt,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }

        const response = await fetch(url, options);

        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::getStudentCourses(): ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else throw new Error("Error on getStudentCourses()");
     } catch (error) {
            console.warn(error)
            return new HttpResponse(HttpStatus.ERROR, null);
     }
}

export const UserAPI = {
    listUsers
}