import { instance } from "../../axios";

async function getReviewsBySuratId(id) {
    try {
        const response = await instance.get(`/review/${id}/reviews`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function createReview(id, formData) {
    try {
        const response = await instance.post(`/review/reviews/${id}`, formData);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function updateReview(suratId, reviewId, payload) {
    try {
        const response = await instance.put(`/review/${suratId}/reviews/${reviewId}`, payload);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

async function completeRevision(id) {
    try {
        const response = await instance.put(`/review/complete/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || "Something went wrong");
    }
}

export {
 getReviewsBySuratId,
 createReview,
 updateReview,
 completeRevision
}