import { instance } from "../../axios";

async function getAllLog() {
    try {
        const response = await instance.get(`/log/all`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function markAsRead(logId) {
    try {
        const response = await instance.patch(`/log/${logId}/read`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

export {
 getAllLog,
 markAsRead
}