import { HttpResponse, HttpStatus, BASE_URLv1 } from "./default";
import { AUTH_DEBUG } from "./default";

const getUserInfo = async (jwt) => {
    const url = `${BASE_URLv1}/user/user-info`;
    try {
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
        }

        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            /*
                        if(data.photo && data.photo.length > 0 && !data.photo.includes('http'))
                            data.photo = BASE_URL + data.photo
              */
            AUTH_DEBUG && console.log("AuthAPI::getUserInfo(): ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else throw new Error("Error on getUserInfo()");
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}

const fetchRegister = async (formValues) => {
    const url = `${BASE_URLv1}/user/`
    var errorMessage;
    try {
        const options = {
            method: 'POST',
            body: JSON.stringify(
                formValues
            ),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }

        const response = await fetch(url, options);
        console.log(response)
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

const login = async (email, password) => {
    const url = `${BASE_URLv1}/user/login`
    var errorMessage;
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({ email, password })
        }

        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::login(): ", data.token);
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



export const AuthAPI = {
    getUserInfo,
    fetchRegister,
    login,
}