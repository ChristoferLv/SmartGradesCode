import { AUTH_DEBUG, BASE_URLv1, HttpResponse, HttpStatus } from "./default"

const createClass = async (body, jwt) => {
    console.log("ClassesAPI::createClass() body: ", body)
    var errorMessage;
    try {
        const url = `${BASE_URLv1}/classes`
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specify JSON content type
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify(body), // Convert body to JSON
        }
        const response = await fetch(url, options)
        if (response.ok) {
            console.log("ClassesAPI::createClass() response: ", response)
            const data = await response.json()
            return new HttpResponse(HttpStatus.OK, data)
        } else {
            errorMessage = await response.json();
            throw new Error("Error on Register()")
        }
    } catch (error) {
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

const getClasses = async (jwt) => {
    const url = `${BASE_URLv1}/classes`
    var errorMessage;
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${jwt}`
            }
        }

        const response = await fetch(url, options);

        if (response.ok) {
            const data = await response.json();
            //AUTH_DEBUG && console.log("AuthAPI::getBookmarks(): ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on Register()")
        }
    } catch (error) {
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

const getClassById = async (id, jwt) => {
    const url = `${BASE_URLv1}/classes/get-class-by-id/${id}`
    var errorMessage;
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${jwt}`
            }
        }

        const response = await fetch(url, options);

        if (response.ok) {
            const data = await response.json();
            //AUTH_DEBUG && console.log("AuthAPI::getBookmarks(): ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on Register()")
        }
    } catch (error) {
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

const updateClass = async (id, formValues, jwt) => {
    const url = `${BASE_URLv1}/classes/update-class/${id}`
    var errorMessage;
    try {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify(formValues)
        }

        const response = await fetch(url, options);

        if (response.ok) {
            const data = await response.json();
            //AUTH_DEBUG && console.log("AuthAPI::getBookmarks(): ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on Register()")
        }
    } catch (error) {
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

const enrollStudentInClass = async (values, jwt) => {
    const url = `${BASE_URLv1}/classes/enroll`;
    var errorMessage;
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify(values)
        }

        const response = await fetch(url, options);

        if (response.ok) {
            const data = await response.json();
            //AUTH_DEBUG && console.log("AuthAPI::getBookmarks(): ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on Register()")
        }
    } catch (error) {
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

const unenrollStudentInClass = async (values, jwt) => {
    const url = `${BASE_URLv1}/classes/unenroll`;
    var errorMessage;
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify(values)
        }

        const response = await fetch(url, options);

        if (response.ok) {
            const data = await response.json();
            //AUTH_DEBUG && console.log("AuthAPI::getBookmarks(): ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on Register()")
        }
    } catch (error) {
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

const getEnroledClassesOfStudent = async (id, jwt) => {
    const url = `${BASE_URLv1}/classes/get-enrolled-class/${id}`
    var errorMessage;
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${jwt}`
            }
        }

        const response = await fetch(url, options);

        if (response.ok) {
            const data = await response.json();
            //AUTH_DEBUG && console.log("AuthAPI::getBookmarks(): ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error on Register()")
        }
    } catch (error) {
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

const listStudentsInClass = async (classId, jwt) => {
    const url = `${BASE_URLv1}/classes/students-enrolled/${classId}`; // Modify URL to match the backend endpoint
    try {
        const options = {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${jwt}`, // Include the JWT token
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        };

        const response = await fetch(url, options);

        if (response.ok) {
            const data = await response.json(); // Parse the response as JSON
            AUTH_DEBUG && console.log("listStudentsInClass: ", data); // Debugging log to check the response
            return new HttpResponse(HttpStatus.OK, data); // Assuming you have HttpResponse to handle responses
        } else {
            throw new Error("Error fetching students in the class");
        }
    } catch (error) {
        console.warn("listStudentsInClass Error: ", error);
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}





export const ClassesAPI = {
    createClass,
    getClasses,
    getClassById,
    updateClass,
    enrollStudentInClass,
    unenrollStudentInClass,
    getEnroledClassesOfStudent,
    listStudentsInClass,
}