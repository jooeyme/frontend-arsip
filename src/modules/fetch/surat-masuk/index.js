import { instance } from "../../axios";

async function createSuratMasuk(formData) {
    try {
        const response = await instance.post('/surat-masuk/new', formData);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function downloadArchivedSuratMasuk() {
    try {
        const res = await instance.get(`surat-masuk/download`, {
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
        link.setAttribute('download', `arsip_surat_masuk_${date}.xlsx`)

        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
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

async function getAllSuratMasuk(page, limit, status="", jenis="") {
    try {
        const response = await instance.get(`/surat-masuk/all`, {
            params: { page, limit, status, jenis },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function editSuratMasuk(id, formData) {
    try {
        const response = await instance.put(`/surat-masuk/edit/${id}`, formData);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function updateStatusSuratMasuk(id, status) {
    try {
        const response = await instance.put(`/surat-masuk/edit/status/${id}`, status);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}


async function archiveSuratMasuk(id, no_folder) {
    try {
        const response = await instance.put(`/surat-masuk/${id}/arsip`, no_folder);
        return response.data;
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
        return response.data.results;
    } catch (error) {
        console.error("Full error object:", error.message);
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getRecentLetters() {
    try {
        const response = await instance.get(`/surat-masuk/recent/all`);
        return response.data;
    } catch (error) {
        console.error("Full error object:", error.message);
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getTrackSuratMasuk(id) {
    try {
        const response = await instance.get(`/surat-masuk/${id}/track`);
        return response.data;
    } catch (error) {
        console.error("Full error object:", error.message);
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getAdminArchive() {
    try {
        const response = await instance.get(`/surat-masuk/dashboard/admin`);
        return response.data;
    } catch (error) {
        console.error("Full error object:", error.message);
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getKadepList() {
    try {
        const response = await instance.get(`/surat-masuk/dashboard/kadep`);
        return response.data;
    } catch (error) {
        console.error("Full error object:", error.message);
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getDisposisiList() {
    try {
        const response = await instance.get(`/surat-masuk/dashboard/disposisi`);
        return response.data;
    } catch (error) {
        console.error("Full error object:", error.message);
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getDashboardSuratMasuk() {
    try {
        const response = await instance.get(`/surat-masuk/dashboard`);
        return response.data;
    } catch (error) {
        console.error("Full error object:", error.message);
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getArchivedSuratMasuk(page, limit) {
    try {
        const response = await instance.get('/surat-masuk/archived', {
            params: {page, limit}
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}


export {
    getArchivedSuratMasuk,
    getDashboardSuratMasuk,
    getAdminArchive,
    getKadepList,
    getDisposisiList,
    archiveSuratMasuk,
    searchSuratMasuk,
    createSuratMasuk,
    getAllSuratMasuk,
    getByIdSuratMasuk,
    editSuratMasuk,
    deleteSuratMasuk,
    updateStatusSuratMasuk,
    getRecentLetters,
    getTrackSuratMasuk,
    downloadArchivedSuratMasuk
}