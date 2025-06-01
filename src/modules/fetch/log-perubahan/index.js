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
        await instance.patch(`/log/${logId}/read`);
        
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

export {
 getAllLog,
 markAsRead
}