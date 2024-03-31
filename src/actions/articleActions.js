import axios from "axios";

export function favorite(slug) {
    return axios.post(`/articles/${slug}/favorite`).then(res => res.data);
}

export function unFavorite(slug) {
    return axios.delete(`/articles/${slug}/favorite`).then(res => res.data);
}