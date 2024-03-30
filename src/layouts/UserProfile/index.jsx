import { Button, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import './UserProfile.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getArticles } from "../../fetchData";
import Article from "../../components/Article";
import ArticlesNavigator from "../../components/ArticlesNavigator";
import Paging from "../../components/Paging";
import { getArticlesLimit } from "../../constances";

const UserProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(undefined);
    const [articles, setArticles] = useState([]);
    const [articlesCount, setArticlesCount] = useState(0);



    useEffect(() => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        axios.get(`/profiles/${username.replace('@', '')}`, { cancelToken: source.token })
            .then(res => res.data)
            .then(data => {
                console.log(data)
                setProfile(data.profile)
            })
            .catch(err => console.log(err));
        return () => {
            source.cancel();
        }
    }, [username])
    useEffect(() => {
        if (profile)
            getArticles({ author: profile.username })
                .then(data => {
                    setArticles(data.articles);
                    setArticlesCount(data.articlesCount);
                })
                .catch(err => console.log(err))
    }, [profile])

    const handleFollow = () => {
        console.log('follow ' + profile.username);
    }

    const handleViewArticles = (eventKey) => {
        console.log(eventKey)
        // getArticles({ author: profile.username })
        //     .then(data => console.log(data))
        //     .catch(err => console.log(err))
    }
    const handleToggleFavorite = (index, slug, favorited) => {
        if (favorited) {
            const updatedArticles = articles.map((article, i) => {
                if (i === index) return { ...article, favorited: false };
                else return article;
            })
            setArticles(updatedArticles);
            axios.delete('/articles/' + slug + '/favorite')
                .then(res => res.data)
                .then(data => {
                    console.log(data)
                }
                )
                .catch(err => {
                    const updatedArticles = articles.map((article, i) => {
                        if (i === index) return { ...article, favorited: true };
                        else return article;
                    })
                    setArticles(updatedArticles);
                    console.log(err)
                });
        }
        else {
            const updatedArticles = articles.map((article, i) => {
                if (i === index) return { ...article, favorited: true };
                else return article;
            })
            setArticles(updatedArticles);
            axios.post('/articles/' + slug + '/favorite')
                .then(res => res.data)
                .then(data => {

                    console.log(data);
                })
                .catch(err => {
                    const updatedArticles = articles.map((article, i) => {
                        if (i === index) return { ...article, favorited: false };
                        else return article;
                    })
                    setArticles(updatedArticles);
                    console.log(err)
                });
        }
    }

    return (<>
        {profile ?
            <>
                <div className="profile-banner mb-4">
                    <Container className="align-items-center py-3 d-flex flex-column w-75 g-5">
                        <img src={profile.image} alt="user avatar" className="user-avatar mb-3" />
                        <h4 className="fw-bold">{profile.username}</h4>
                        <Button onClick={handleFollow} className="p-1 align-self-end" variant="outline-secondary">
                            <FontAwesomeIcon icon={faPlus} className="me-1" />
                            Follow {profile.username}
                        </Button>
                    </Container>
                </div>
                <Container className="flex-grow-1 articles w-75 g-5">
                    <ArticlesNavigator handleViewArticles={handleViewArticles} tabs={['My Articles', 'Favorited Articles']} />
                    {articles.length > 0 ?
                        <>
                            {articles.map((articles, index) => {
                                return <Article article={articles} index={index} key={articles.title} handleToggleFavorite={handleToggleFavorite} />
                            })}
                            {articlesCount > getArticlesLimit &&
                                <Paging
                                    total={articlesCount}
                                    limit={getArticlesLimit}
                                    onSelect={(page) => console.log(page)}
                                />}
                        </>
                        : <div className="mt-2">Loading articles...</div>}
                </Container>
            </> : <Container className="flex-grow-1 h5">Loading...</Container>}
    </>
    );
}

export default UserProfile;