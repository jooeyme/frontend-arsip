import { instance } from "../../axios";

async function editDocument(id, formData) {
    try {
        const response = await instance.put(`/document/edit/${id}`, formData, { 
            headers: {
                "Content-Type": 'multipart/form-data',
            }}
        );
        return response.data;
    } catch (error) {
        console.error(error)
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function createDocument(formData) {
    try {
        const response = await instance.post(`/document/new`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getDashboardStats() {
    try {
        const response = await instance.get(`/document/stats/all`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}
export {
    editDocument,
    createDocument,
    getDashboardStats
}