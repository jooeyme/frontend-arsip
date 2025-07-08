import { instance } from "../../axios";

async function getAllTembusan() {
    try {
        const response = await instance.get(`/tembusan/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function createTembusan(formData) {
    try {
        const response = await instance.post(`/tembusan/new`, formData);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function deleteTembusan(id) {
    try {
        const response = await instance.delete(`/tembusan/delete/${id}` );
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

export {
 getAllTembusan,
 createTembusan,
 deleteTembusan
}