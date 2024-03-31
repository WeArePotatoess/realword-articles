import axios from "axios";
import { getArticlesLimit } from "../constances";

export function getArticles({ tag, author, favorited, offset = 0, limit = getArticlesLimit }) {
    return axios.get(`/articles?${tag ? 'tag=' + tag + '&' : ''}${author ? 'author=' + author + '&' : ""}${favorited ? 'favorited=' + favorited + '&' : ''}offset=${offset}&limit=${limit}`)
        .then(res => res.data)
        .catch(err => console.log(err))
}
