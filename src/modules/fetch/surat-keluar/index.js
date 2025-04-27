import { instance } from "../../axios";

async function createSuratKeluar(formData) {
    try {
        const response = await instance.post('/surat-keluar/new', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }});
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getByIdSuratKeluar(id) {
    try {
        const response = await instance.get(`/surat-keluar/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getAllSuratKeluar() {
    try {
        const response = await instance.get('/surat-keluar/all');
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function editSuratKeluar(id, formData) {
    try {
        const response = await instance.patch(`/surat-keluar/edit/${id}`, formData, {
            headers: {
                "Content-Type": 'application/json',
            }});
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function deleteSuratKeluar(id) {
    try {
        const response = await instance.delete(`/surat-keluar/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getSuratKeluarByUser() {
    try {
        const response = await instance.get(`/surat-keluar/by-user/dosen`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function searchSuratKeluar(query) {
    try {
        const response = await instance.get(`/surat-keluar/?query=${query}`);
        console.log("apa isi responsee:", response)
        return response.data.results;
    } catch (error) {
        console.error("Full error object:", error.message);
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

export {
    searchSuratKeluar,
    createSuratKeluar,
    getAllSuratKeluar,
    getByIdSuratKeluar,
    editSuratKeluar,
    deleteSuratKeluar,
    getSuratKeluarByUser
}