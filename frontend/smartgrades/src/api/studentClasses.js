import { BASE_URLv1, HttpResponse, HttpStatus } from "./default"

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
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

export const ClassesAPI = {
    createClass
}