import { BASE_URLv1, HttpResponse, HttpStatus } from "./default";

const submitReportCard = async (reportCardDTO, jwt) => {
    const url = `${BASE_URLv1}/reportCard`;
    try {
        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reportCardDTO),
        };
        const response = await fetch(url, options);
        console.log("submitReportCard response: ", response)
        if (response.ok) {
            const data = await response.json();
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            throw new Error("Error submitting report card");
        }
    } catch (error) {
        console.log("submitReportCard Error: ", error);
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}

const getReportCardsOfStudent = async (studentId, jwt) => {
    const url = `${BASE_URLv1}/reportCard/list-report-cards-from/${studentId}`;
    try {
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        };
        const response = await fetch(url, options);
        console.log("getReportCardOfStudent response: ", response)
        if (response.ok) {
            const data = await response.json();
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            throw new Error("Error fetching report card");
        }
    } catch (error) {
        console.log("getReportCardOfStudent Error: ", error);
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}

const getReportCard = async (reportCardId, jwt) => {
    const url = `${BASE_URLv1}/reportCard/get-report-card/${reportCardId}`;
    try {
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        };
        const response = await fetch(url, options);
        console.log("getReportCard response: ", response)
        if (response.ok) {
            const data = await response.json();
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            throw new Error("Error fetching report card");
        }
    } catch (error) {
        console.log("getReportCard Error: ", error);
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}

const updateReportCard = async (reportCardId, reportCardDTO, jwt) => {
    const url = `${BASE_URLv1}/reportCard/update-report-card/${reportCardId}`;
    try {
        const options = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reportCardDTO),
        };
        console.log("updateReportCard options: ", options.body)
        const response = await fetch(url, options);
        console.log("updateReportCard response: ", response)
        if (response.ok) {
            const data = await response.json();
            return new HttpResponse(HttpStatus.OK, data);
        } else {
            throw new Error("Error updating report card");
        }
    } catch (error) {
        console.log("updateReportCard Error: ", error);
        return new HttpResponse(HttpStatus.ERROR, null);
    }
}


export const ReportCardAPI = {
    submitReportCard,
    getReportCardsOfStudent,
    getReportCard,
    updateReportCard,
}