import { instance } from "../../axios";

async function getAllTujuan() {
    try {
        const response = await instance.get(`/tujuan/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function createTujuan(formData) {
    try {
        const response = await instance.post(`/tujuan/new`, formData);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function deleteTujuan(id) {
    try {
        const response = await instance.delete(`/tujuan/delete/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}


export {
 getAllTujuan,
 createTujuan,
 deleteTujuan
}