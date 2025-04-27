import { instance } from "../../axios";

async function createSuratMasuk(formData) {
    try {
        const response = await instance.post('/surat-masuk/new', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }});
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getByIdSuratMasuk(id) {
    try {
        const response = await instance.get(`/surat-masuk/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getAllSuratMasuk() {
    try {
        const response = await instance.get(`/surat-masuk/all`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function editSuratMasuk(formData) {
    try {
        
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function deleteSuratMasuk(id) {
    try {
        const response = await instance.delete(`/surat-masuk/${id}` );
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function searchSuratMasuk(query) {
    try {
        const response = await instance.get(`/surat-masuk/?query=${query}`);
        console.log("apa isi responsee:", response)
        return response.data.results;
    } catch (error) {
        console.error("Full error object:", error.message);
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

export {
    searchSuratMasuk,
    createSuratMasuk,
    getAllSuratMasuk,
    getByIdSuratMasuk,
    editSuratMasuk,
    deleteSuratMasuk
}