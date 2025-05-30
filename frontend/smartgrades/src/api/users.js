import { BASE_URL, AUTH_DEBUG, HttpStatus, HttpResponse, BASE_URLv1 } from './default';
import Compressor from 'compressorjs';

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
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}

const updateUser = async (id, formValues, jwt) => {
    const url = `${BASE_URLv1}/user/update-user/${id}`;
    try {
        const options = {
            method: 'PUT',
            body: JSON.stringify(formValues),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Authorization: `Bearer ${jwt}`
            }
        }
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::updateUser(): ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else throw new Error("Error on updateUser()");
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}

const resetPassword = async (id, jwt) => {
    const url = `${BASE_URLv1}/user/change-password-of/${id}`;
    try {
        const options = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${jwt}`,
                Accept: 'application/json'
            }
        }
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::resetPassword(): ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else throw new Error("Error on resetPassword()");
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}

const getActiveUsers = async (jwt) => {
    const url = `${BASE_URLv1}/user/list-active-users`;
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

const getTeachers = async (jwt) => {
    const url = `${BASE_URLv1}/user/list-teachers`;
    try {
        const options = {
            method: 'GET',
            headers: { "Authorization": `Bearer ${jwt}` },
        }
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::getTeachers(): ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else throw new Error("Error on getTeachers()");
    }
    catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}

const updateUserRoles = async (id, formValues, jwt) => {
    const url = `${BASE_URLv1}/user/change-role/${id}`;
    try {
        const options = {
            method: 'PUT',
            body: JSON.stringify(formValues),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Authorization: `Bearer ${jwt}`
            }
        }
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("AuthAPI::updateUserRoles(): ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else throw new Error("Error on updateUserRoles()");
    } catch (error) {
        console.warn(error)
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}

const uploadProfilePicture = async (imageFile, jwt) => {
    const url = `${BASE_URLv1}/user/upload-profile-picture`;
    var errorMessage;

   //Compress imageFile and convert to base64
    const compressImage = async (imageFile) => {
        return new Promise((resolve, reject) => {
            new Compressor(imageFile, {
                quality: 0.6,
                success(result) {
                    const reader = new FileReader();
                    reader.readAsDataURL(result);
                    reader.onload = () => resolve(reader.result);
                },
                error(error) {
                    console.warn(error);
                    reject(error);
                },
            });
        });
    };


    try {
        // Convert the image file to Base64
        const toBase64 = file =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });

        const base64Image = await compressImage(imageFile);

        // Prepare the profile picture object
        const profilePictureDTO = {
            image: base64Image,
        };

        const options = {
            method: 'POST',
            body: JSON.stringify(profilePictureDTO),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Authorization: `Bearer ${jwt}`,
            },
        };

        // Send the request to upload the profile picture
        const response = await fetch(url, options);

        if (response.ok) {
            const data = await response.json();
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            errorMessage = await response.json();
            throw new Error("Error uploading profile picture");
        }
    } catch (error) {
        console.warn(error);
        return new HttpResponse(HttpStatus.ERROR, errorMessage);
    }
}


export const UserAPI = {
    listUsers,
    registerUser,
    listStudents,
    getUserById,
    updateUser,
    resetPassword,
    getActiveUsers,
    getTeachers,
    updateUserRoles,
    uploadProfilePicture,
}