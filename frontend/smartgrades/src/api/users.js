import { BASE_URL, AUTH_DEBUG, HttpStatus, HttpResponse, BASE_URLv1 } from './default';

const registerUser = async (formValues, jwt) => {
    const url = `${BASE_URLv1}/user`
    var errorMessage;
    try {
        const options = {
            method: 'POST',
            body: JSON.stringify(
                formValues
            ),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Authorization: `Bearer ${jwt}`
            }
        }

        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::Register(): ", data.token);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on Register()")
        }
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

const listUsers = async (jwt) => {
    const url = `${BASE_URLv1}/user`;
    try {
        const options = {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${jwt}`,
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

const listStudents = async (jwt) => {
    const url = `${BASE_URLv1}/user/list-students`;
    try {
        const options = {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${jwt}`,
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

const getUserById = async (id, jwt) => {
    const url = `${BASE_URLv1}/user/get-user-by-id/${id}`;
    try {
        const options = {
            method: 'GET',
            headers: { "Authorization": `Bearer ${jwt}` },
        }
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::getUserById(): ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else throw new Error("Error on getUserById()");
    }catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}

export const UserAPI = {
    listUsers,
    registerUser,
    listStudents,
    getUserById
}