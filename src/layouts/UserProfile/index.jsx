import { Button, Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import './UserProfile.css';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPlus } from "@fortawesome/free-solid-svg-icons";
import { getArticles } from "../../actions/fetchData";
import ArticlesNavigator from "../../components/ArticlesNavigator";
import { getArticlesLimit } from "../../constances";
import ArticlesList from "../../components/ArticlesList";
import { followUser, unFollowUser } from "../../actions/userActions";

const UserProfile = ({ user }) => {
    const { username } = useParams();
    const [profile, setProfile] = useState();
    const [articles, setArticles] = useState([]);
    const [articlesCount, setArticlesCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const [loadingArticles, setLoadingArticles] = useState(false);
    const followButton = useRef();

    useEffect(() => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        axios.get(`/profiles/${username}`, { cancelToken: source.token })
            .then(res => res.data)
            .then(data => {
                setProfile(data.profile);
            })
            .catch(err => console.log(err));
        return () => {
            source.cancel('Request canceled');
        }
    }, [username])

    useEffect(() => {
        setLoadingArticles(true);
        getArticles({ author: username })
            .then(data => {
                setArticles(data.articles);
                setArticlesCount(data.articlesCount);
                setLoadingArticles(false);
            })
            .catch(err => {
                console.log(err)
                setLoadingArticles(false)
            })
    }, [username])

    const handleFollow = () => {
        followButton.current.setAttribute('disabled', true);
        if (profile.following)
            unFollowUser(profile.username)
                .then(data => {
                    setProfile(data.profile);
                    followButton.current.removeAttribute('disabled');
                })
                .catch(err => console.log(err));
        else followUser(profile.username).then(data => {
            setProfile(data.profile);
            followButton.current.removeAttribute('disabled');
        }).catch(err => console.log(err));
    }

    const handleViewArticles = (eventKey) => {
        // console.log(eventKey)
        setLoadingArticles(true);
        getArticles({ favorited: eventKey === 'Favorited Articles' ? profile.username : undefined, author: eventKey === 'My Articles' ? profile.username : undefined })
            .then(data => {
                setArticlesCount(data.articlesCount);
                setArticles(data.articles);
                setLoadingArticles(false);
            })
            .catch(err => {
                console.log(err)
                setLoadingArticles(false)
            })
    }

    const handleChangePage = (page) => {
        setLoadingArticles(true);
        setOffset((page - 1) * getArticlesLimit);
        setArticles([]);
        getArticles({ author: profile.username, offset: (page - 1) * getArticlesLimit })
            .then(data => {
                setArticles(data.articles)
                setLoadingArticles(false)
            })
            .catch(err => {
                console.log(err)
                setLoadingArticles(false)
            });
    }

    return <>
        {
            profile ?
                (<>
                    <div className="profile-banner mb-4">
                        <Container className="align-items-center py-3 d-flex flex-column w-75 g-5">
                            <img src={profile.image} alt="user avatar" className="user-avatar mb-3" />
                            <h4 className="fw-bold">{profile?.username}</h4>
                            {profile?.username === user?.username ?
                                <Link to={'/settings'} className="btn btn-outline-secondary p-1 align-self-end go-to-settings text-decoration-none text-secondary">
                                    <FontAwesomeIcon icon={faGear} /> Edit Profile Settings
                                </Link>
                                :
                                <Button ref={followButton} onClick={handleFollow} className="p-1 align-self-end" variant="outline-secondary">
                                    <FontAwesomeIcon icon={faPlus} className="me-1" />
                                    {!profile.following ? `Follow ${profile.username}` : `Unfollow ${profile.username}`}
                                </Button>
                            }
                        </Container>
                    </div>
                    <Container className="flex-grow-1 articles w-75 g-5">
                        <ArticlesNavigator handleViewArticles={handleViewArticles} tabs={['My Articles', 'Favorited Articles']} />
                        <ArticlesList loading={loadingArticles} articles={articles} handleChangePage={handleChangePage} articlesCount={articlesCount} offset={offset} />
                    </Container>
                </>)
                : <Container className="flex-grow-1 h5">Loading...</Container>
        }
    </>
}

export default UserProfile;