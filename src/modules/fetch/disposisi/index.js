import { instance } from "../../axios";

async function createDisposisi(formData) {
    try {
        const response = await instance.create(`/disposisi/new`, formData);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getByIdDisposisi(id) {
    try {
        const response = await instance.get(`/disposisi/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function getAllDisposisi() {
    try {
        const response = await instance.get(`/disposisi/all`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function deleteDisposisi(id) {
    try {
        const response = await instance.delete(`/disposisi/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function editDisposisi(id, formData) {
    try {
        const response = await instance.patch(`/disposisi/edit/${id}`, formData, { 
            headers: {
                "Content-Type": 'application/json',
            }}
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

export {
    createDisposisi,
    getAllDisposisi,
    getByIdDisposisi,
    deleteDisposisi,
    editDisposisi
}