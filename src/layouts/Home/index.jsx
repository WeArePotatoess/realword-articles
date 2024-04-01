import { Button, Col, Container, Row } from "react-bootstrap";
import Banner from "../../components/Banner";
import { useEffect, useMemo, useState } from "react";
import ArticlesNavigator from "../../components/ArticlesNavigator";
import ArticlesList from "../../components/ArticlesList";
import { getArticles } from "../../actions/fetchData";
import { getArticlesLimit } from "../../constances";
import axios from "axios";
import './Home.css'
import { useSelector } from "react-redux";

const Home = () => {
    const user = useSelector(state => state.user.value);
    const [loadingArticles, setLoadingArticles] = useState(false);
    const [articles, setArticles] = useState(true);
    const [articlesCount, setArticlesCount] = useState();
    const [offset, setOffset] = useState(0);
    const [articleTab, setArticleTab] = useState('Your Feed');
    const [tags, setTags] = useState();
    const [articleTag, setArticleTag] = useState();
    const [cancelToken, setCancelToken] = useState(null);


    const handleViewArticles = (eventKey) => {
        setArticleTab(eventKey);
        if (cancelToken) cancelToken.cancel('canceled previous request');
        const newCancelToken = axios.CancelToken.source();
        setCancelToken(newCancelToken);
        setArticles([]);
        setLoadingArticles(true);
        getArticles({ author: eventKey === 'Your Feed' ? user.username : undefined, tag: tags?.includes(eventKey.replace('#', '')) ? eventKey : undefined }, newCancelToken.token)
            .then(data => {
                setArticles(data.articles);
                setArticlesCount(data.articlesCount);
                setLoadingArticles(false);
            })
            .catch(err => {
                if (!axios.isCancel(err))
                    console.log(err)
                setLoadingArticles(false)
            })
    }

    const handleChangePage = (page) => {
        // console.log(articleTab)
        if (cancelToken) cancelToken.cancel('canceled previous request');
        const newCancelToken = axios.CancelToken.source();
        setCancelToken(newCancelToken);
        setLoadingArticles(true);
        setOffset((page - 1) * getArticlesLimit);
        setArticles([]);
        getArticles({ author: articleTab === 'Your Feed' ? user.username : undefined, offset: (page - 1) * getArticlesLimit }, newCancelToken.token)
            .then(data => {
                setArticles(data.articles)
                setLoadingArticles(false)
            })
            .catch(err => {
                if (!axios.isCancel(err))
                    console.log(err)
                setLoadingArticles(false)
            });
    }

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        if (!user) setArticleTab('Global Feed');
        setLoadingArticles(true);
        getArticles({ author: articleTab === 'Your Feed' ? user?.username : undefined }, cancelToken.token)
            .then(data => {
                setArticles(data.articles);
                setArticlesCount(data.articlesCount);
                setLoadingArticles(false);
            })
            .catch(err => {
                if (!axios.isCancel(err))
                    console.log(err)
                setLoadingArticles(false);
            })
        axios.get('/tags', { cancelToken: cancelToken.token })
            .then(res => res.data)
            .then(data => setTags(data.tags))
            .catch(err => { if (!axios.isCancel(err)) console.log(err) })
        return () => cancelToken.cancel();
    }, [])

    return (<>
        {!user && <Banner />}
        <Container className="flex-grow-1 articles w-75 g-5">
            <Row className="align-items-start">
                <Col xs={9}>{user ?
                    <ArticlesNavigator handleViewArticles={handleViewArticles}
                        tabs={['Your Feed', 'Global Feed']} /> :
                    <ArticlesNavigator handleViewArticles={handleViewArticles}
                        tabs={['Global Feed']} />
                }
                    <ArticlesList loading={loadingArticles} articles={articles} handleChangePage={handleChangePage} articlesCount={articlesCount} offset={offset} /></Col>
                <Col className="tag-list border rounded-2 p-2">
                    <h6>Popular tags</h6>
                    <div className="d-flex gap-2 flex-wrap">
                        {tags?.map(tag => {
                            return (
                                <Button key={tag} variant="secondary" className="rounded-5">
                                    {tag}
                                </Button>
                            )
                        })}
                    </div>
                </Col>
            </Row>

        </Container>
    </>
    );
}

export default Home;