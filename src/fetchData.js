import axios from "axios";

export function getArticles({ tag, author, favorited, offset = 0, limit = 10 }) {
    return axios.get(`/articles?${tag ? 'tag=' + tag + '&' : ''}${author ? 'author=' + author + '&' : ""}${favorited ? 'favorited=' + favorited + '&' : ''}offset=${offset}&limit=${limit}`)
        .then(res => res.data)
        .catch(err => console.log(err))
}