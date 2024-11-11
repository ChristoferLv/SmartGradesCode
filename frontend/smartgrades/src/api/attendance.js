import { AUTH_DEBUG, BASE_URL, BASE_URLv1, HttpResponse, HttpStatus } from "./default"

const registerAula = async (data, jwt) => {
    const url = `${BASE_URLv1}/aulas/register`
    var errorMessage;
    try {
        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AttendanceAPI::registerAula ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on registering aula");
        }
    } catch (error) {
        console.log("registerAula Error: ", error);
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

const getAulas = async (classId, jwt) => {
    const url = `${BASE_URLv1}/aulas/list-class-aulas/${classId}`
    var errorMessage;
    try {
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
        };
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AttendanceAPI::registerAula ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on registering aula");
        }
    } catch (error) {
        console.log("registerAula Error: ", error);
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}


export const AttendanceAPI = {
    registerAula,
    getAulas
}