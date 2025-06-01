import { instance } from "../../axios";

async function createUser(formData) {
    try {
        const response = await instance.post('/user/new', formData);
        return response.data;
    } catch (error) {
        throw new Error(error.message.data.message || "Something went wrong");
    }
}

async function getAllUser() {
    try {
        const response = await instance.get('/user/all');
        return response.data;
    } catch (error) {
        throw new Error(error.message.data.message || "Something went wrong");
    }
}

async function getUserName() {
    try {
        const response = await instance.get('/user/allname');
        return response.data;
    } catch (error) {
        throw new Error(error.message.data.message || "Something went wrong");
    }
}

async function getUserById(id) {
    try {
        const response = await instance.get(`/user/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message.data.message || "Something went wrong");
    }
}

async function updateUser(id, formData) {
    try {
        const response = await instance.patch(`/user/edit/${id}`, formData);
        return response.data;
    } catch (error) {
        throw new Error(error.message.data.message || "Something went wrong");
    }
}

async function deleteUser(id) {
    try {
        const response = await instance.delete(`/user/delete/${id}`);     
        return response.data;   
    } catch (error) {
        throw new Error(error.message.data.message || "Something went wrong");
    }
}

async function Login(formData) {
    try {
        const response = await instance.post('/user/login', formData);
        return response.data;
    } catch (error) {
        throw new Error(error.message.data.message || "Something went wrong");
    }
}

async function getProfile() {
    try {
        const response = await instance.get('/user/me');
        return response.data;
    } catch (error) {
        throw new Error(error.message.data.message || "Something went wrong")
    }
}

export {
    Login,
    createUser,
    getAllUser,
    getUserName,
    getUserById,
    updateUser,
    deleteUser,
    getProfile
}