import axios from "axios";

export function followUser(username) {
    return axios.post(`/profiles/${username}/follow`).then(res => res.data);
}
export function unFollowUser(username) {
    return axios.delete(`/profiles/${username}/follow`).then(res => res.data);
}