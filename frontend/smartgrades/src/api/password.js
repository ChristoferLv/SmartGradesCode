import { AUTH_DEBUG, BASE_URL, BASE_URLv1, HttpResponse, HttpStatus } from "./default";

const fetchChange = async (oldPassword, newPassword, jwt) => {
    const url = `${BASE_URLv1}/user/change-password`
    var errorMessage;
    try {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json', 
                "Authorization": `Bearer ${jwt}`
            },
            body: JSON.stringify({ oldPassword: oldPassword, newPassword: newPassword })
        }

        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::ChangePassword(): ", data.token);
            return new HttpResponse(HttpStatus.OK, data);
        } else{ 
            errorMessage =  await response.json();
            throw new Error("Error on ChangePassword()");
        }
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

const fetchRecovery = async (email) => {
    const url = `${BASE_URL}/generate-password`
    var errorMessage;
    try {
        const options = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({ email: email})
        }

        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::RecoverPassword(): ", data.token);
            return new HttpResponse(HttpStatus.OK, data);
        } else{
            errorMessage =  await response.json();
            throw new Error("Error on RecoverPassword()");
        }
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}

export const PasswordAPI = {
   fetchChange,
   fetchRecovery
}