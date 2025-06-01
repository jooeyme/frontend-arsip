import { instance } from "../../axios";

async function getAllKlasifikasi() {
    try {
        const response = await instance.get(`/klasifikasi-surat/all`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function createKlasifikasi(formData) {
    try {
        const response = await instance.post(`/klasifikasi-surat/new`, formData);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

export {
 getAllKlasifikasi,
 createKlasifikasi
}