import axios from "axios";
import { getArticlesLimit } from "../constances";

export function getArticles({ tag, author, favorited, offset = 0, limit = getArticlesLimit }, cancelToken) {
    return axios.get(`/articles?${tag ? 'tag=' + tag + '&' : ''}${author ? 'author=' + author + '&' : ""}${favorited ? 'favorited=' + favorited + '&' : ''}offset=${offset}&limit=${limit}`,{cancelToken: cancelToken})
        .then(res => res.data)
        .catch(err => console.log(err))
}
