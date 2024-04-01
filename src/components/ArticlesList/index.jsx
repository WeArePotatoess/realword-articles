import axios from "axios";
import { getArticlesLimit } from "../../constances";
import Article from "../Article";
import Paging from "../Paging";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ArticlesList = ({ articles, articlesCount, handleChangePage, offset, loading }) => {
    const user = useSelector(state => state.user.value)
    const [currentArticles, setCurrentArticles] = useState(articles);
    const navigator = useNavigate();

    useEffect(() => {
        setCurrentArticles(articles)
    }, [articles])
    const handleToggleFavorite = (e, index, slug, favorited) => {
        if (!user) navigator('/register')
        else {
            e.target.setAttribute('disabled', true);
            if (favorited) {
                const updatedArticles = currentArticles.map((article, i) => {
                    if (i === index) return { ...article, favorited: false, favoritesCount: article.favoritesCount - 1 };
                    else return article;
                })
                setCurrentArticles(updatedArticles);
                axios.delete('/articles/' + slug + '/favorite')
                    .then(() => e.target.removeAttribute('disabled'))
                    .catch(err => {
                        const updatedArticles = currentArticles.map((article, i) => {
                            if (i === index) return { ...article, favorited: true, favoritesCount: article.favoritesCount + 1 };
                            else return article;
                        })
                        setCurrentArticles(updatedArticles);
                        e.target.removeAttribute('disabled')
                        console.log(err)
                    });
            }
            else {
                const updatedArticles = currentArticles.map((article, i) => {
                    if (i === index) return { ...article, favorited: true, favoritesCount: article.favoritesCount + 1 };
                    else return article;
                })
                setCurrentArticles(updatedArticles);
                axios.post('/articles/' + slug + '/favorite')
                    .then(() => e.target.removeAttribute('disabled'))
                    .catch(err => {
                        const updatedArticles = currentArticles.map((article, i) => {
                            if (i === index) return { ...article, favorited: false, favoritesCount: article.favoritesCount - 1 };
                            else return article;
                        })
                        setCurrentArticles(updatedArticles);
                        e.target.removeAttribute('disabled')
                        console.log(err)
                    });
            }
        }
    }
    return (
        loading ? <div className="mt-2">Loading articles...</div> :
            (currentArticles.length > 0 ?
                <div >
                    {
                        currentArticles.map((articles, index) => {
                            return <Article article={articles} index={index} key={articles.title} handleToggleFavorite={handleToggleFavorite} />
                        })
                    }
                    {
                        articlesCount > getArticlesLimit &&
                        <Paging
                            total={articlesCount}
                            limit={getArticlesLimit}
                            offset={offset}
                            onSelect={handleChangePage}
                        />
                    }
                </div > : <div className="mt-2">No articles are here... yet.</div>
            )

    );
}

export default ArticlesList;