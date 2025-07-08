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

async function uploadSuratKeluarArchived(formData) {
    try {
        const response = await instance.post('/surat-keluar/archive', formData, {
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

async function getAllSuratKeluar(page, limit) {
    try {
        const response = await instance.get('/surat-keluar/all', {
            params: {page, limit}
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function editSuratKeluar(id, formData) {
    try {
        const response = await instance.put(`/surat-keluar/edit/${id}`, formData, {
            headers: {
                "Content-Type": 'application/json',
            }});
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function updateStatusSuratKeluar(id, status) {
    try {
        const response = await instance.put(`/surat-keluar/edit/status/${id}`, status);
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
        return response.data.results;
    } catch (error) {
        console.error("Full error object:", error.message);
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getTrackSuratKeluar(id) {
    try {
        const response = await instance.get(`/surat-keluar/${id}/track`);
        return response.data;
    } catch (error) {
        console.error("Full error object:", error.message);
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function uploadSigned(id, formData) {
    try {
        const response = await instance.post(`/surat-keluar/${id}/upload-signed`, formData);
        return response;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function archiveSuratKeluar(id, no_folder) {
    try {
        const response = await instance.put(`/surat-keluar/${id}/arsip`, no_folder);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function generateNumber(id) {
    try {
        const response = await instance.put(`/surat-keluar/generate-nomor/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function downloadArchivedSuratKeluar() {
    try {
        const res = await instance.get(`surat-keluar/download`, {
        responseType: 'blob',
        headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

        }});

        const blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        const url = window.URL.createObjectURL(blob)

        // Buat elemen <a> dan trigger click
        const link = document.createElement('a')
        link.href = url

        // Nama file: arsip_surat_masuk_YYYY-MM-DD.xlsx
        const date = new Date().toISOString().slice(0, 10)
        link.setAttribute('download', `arsip_surat_keluar_${date}.xlsx`)

        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getDashboardSuratKeluar() {
    try {
        const response = await instance.get(`/surat-keluar/dashboard`);
        return response.data;
    } catch (error) {
        console.error("Full error object:", error.message);
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getArchivedSuratKeluar(page, limit) {
    try {
        const response = await instance.get('/surat-keluar/archived', {
            params: {page, limit}
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

export {
    getArchivedSuratKeluar,
    getDashboardSuratKeluar,
    archiveSuratKeluar,
    searchSuratKeluar,
    uploadSuratKeluarArchived,
    createSuratKeluar,
    getAllSuratKeluar,
    getByIdSuratKeluar,
    editSuratKeluar,
    deleteSuratKeluar,
    getSuratKeluarByUser,
    updateStatusSuratKeluar,
    getTrackSuratKeluar,
    uploadSigned,
    downloadArchivedSuratKeluar,
    generateNumber
}