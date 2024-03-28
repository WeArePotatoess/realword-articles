import { Button, Container, Nav } from "react-bootstrap";
import { useParams } from "react-router-dom";
import './UserProfile.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getArticles } from "../../fetchData";
import Article from "../../components/Article";

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
            .then(data => setProfile(data.profile))
            .catch(err => console.log(err));
        return () => {
            source.cancel();
        }
    }, [])
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
        // getArticles({ author: profile.username })
        //     .then(data => console.log(data))
        //     .catch(err => console.log(err))
    }

    return (<>
        {profile ?
            <>
                <div className="profile-banner mb-4">
                    <Container className="align-items-center py-3 d-flex flex-column">
                        <img src={profile.image} alt="user avatar" className="user-avatar mb-3" />
                        <h2 className="fw-bold">{profile.username}</h2>
                        <Button onClick={handleFollow} className="p-1 align-self-end" variant="outline-secondary">
                            <FontAwesomeIcon icon={faPlus} className="me-1" />
                            Follow {profile.username}
                        </Button>
                    </Container>
                </div>
                <Container className="flex-grow-1 articles">
                    <Nav
                        variant="underline"
                        className="border-bottom gap-0"
                        defaultActiveKey={'my articles'}
                        onSelect={(eventKey) => handleViewArticles(eventKey)}
                    >
                        <Nav.Link className="text-secondary" eventKey={'my articles'}>My Articles</Nav.Link>
                        <Nav.Link className="text-secondary" eventKey={'favorited articles'}>Favorited Articles</Nav.Link>
                    </Nav>
                    {articles.length > 0 ? articles.map(articles => {
                        return <Article article={articles} key={articles.title} />
                    }) : <div className="mt-2">Loading articles...</div>}
                </Container>
            </> : <Container className="flex-grow-1 h5">Loading...</Container>}
    </>
    );
}

export default UserProfile;