import { AUTH_DEBUG, BASE_URLv1, HttpResponse, HttpStatus } from "./default";


const generateCertificate = async (id, jwt) => {
    const url = `${BASE_URLv1}/certificate/generate/${id}`;
    try {
        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
        };
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            AUTH_DEBUG && console.log("ReportCardsAPI::getReportCards ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            throw new Error("Error getting certificates");
        }
    } catch (error) {
        console.log("getReportCards Error: ", error);
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}

const getCertificates = async (id, jwt) => {
    const url = `${BASE_URLv1}/certificate/list/${id}`;
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
            AUTH_DEBUG && console.log("ReportCardsAPI::getReportCards ", data);
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            throw new Error("Error getting certificates");
        }
    } catch (error) {
        console.log("getReportCards Error: ", error);
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}


export const CertificateAPI = {
    generateCertificate,
    getCertificates
}