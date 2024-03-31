import axios from "axios";
import { getArticlesLimit } from "../../constances";
import Article from "../Article";
import Paging from "../Paging";
import { useEffect, useState } from "react";

const ArticlesList = ({ articles, articlesCount, handleChangePage, offset, loading }) => {
    const [currentArticles, setCurrentArticles] = useState(articles);
    useEffect(() => {
        setCurrentArticles(articles)
    }, [articles])
    const handleToggleFavorite = (index, slug, favorited) => {
        if (favorited) {
            const updatedArticles = currentArticles.map((article, i) => {
                if (i === index) return { ...article, favorited: false, favoritesCount: article.favoritesCount - 1 };
                else return article;
            })
            setCurrentArticles(updatedArticles);
            axios.delete('/articles/' + slug + '/favorite')
                .catch(err => {
                    const updatedArticles = currentArticles.map((article, i) => {
                        if (i === index) return { ...article, favorited: true, favoritesCount: article.favoritesCount + 1 };
                        else return article;
                    })
                    setCurrentArticles(updatedArticles);
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
                .catch(err => {
                    const updatedArticles = currentArticles.map((article, i) => {
                        if (i === index) return { ...article, favorited: false, favoritesCount: article.favoritesCount - 1 };
                        else return article;
                    })
                    setCurrentArticles(updatedArticles);
                    console.log(err)
                });
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