import { instance } from "../../axios";

async function getAllPegawai() {
    try {
        const response = await instance.get(`/pegawai/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function createPegawai(formData) {
    try {
        const response = await instance.post(`/pegawai/new`, formData);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function deletePegawai(id) {
    try {
        const response = await instance.delete(`/pegawai/delete/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}


export {
 getAllPegawai,
 createPegawai,
 deletePegawai
}