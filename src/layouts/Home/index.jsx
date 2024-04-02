import { Button, Col, Container, Row } from "react-bootstrap";
import Banner from "../../components/Banner";
import { useEffect, useState } from "react";
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
    const [tags, setTags] = useState();
    const [currentFeed, setCurrentFeed] = useState();
    const [cancelToken, setCancelToken] = useState(null);
    const [tagFilter, setTagFilter] = useState();

    const handleViewArticles = (eventKey) => {
        setOffset(0);
        setCurrentFeed(eventKey);
        const selectedTag = eventKey.replace('#', '');
        if (cancelToken) cancelToken.cancel('canceled previous request');
        const newCancelToken = axios.CancelToken.source();
        setCancelToken(newCancelToken);
        setArticles([]);
        setLoadingArticles(true);
        if (eventKey === 'Your Feed') {
            axios.get('/articles/feed')
                .then(res => res.data)
                .then(data => {
                    setArticlesCount(data.articlesCount);
                    setArticles(data.articles);
                    setLoadingArticles(false);
                })
                .catch(err => { console.log(err); setLoadingArticles(false) })
        }
        else
            getArticles({ tag: tags?.includes(selectedTag) ? selectedTag : '' }, newCancelToken.token)
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
        if (cancelToken) cancelToken.cancel('canceled previous request');
        const newCancelToken = axios.CancelToken.source();
        setCancelToken(newCancelToken);
        setLoadingArticles(true);
        setOffset((page - 1) * getArticlesLimit);
        setArticles([]);
        if (currentFeed === 'Your Feed') {
            axios.get(`/articles/feed?offset=${(page - 1) * getArticlesLimit}&limit=${getArticlesLimit}`, { cancelToken: newCancelToken.token })
                .then(res => res.data)
                .then(data => {
                    setArticlesCount(data.articlesCount);
                    setArticles(data.articles);
                    setLoadingArticles(false);
                })
                .catch(err => { console.log(err); setLoadingArticles(false) })
        } else
            getArticles({ offset: (page - 1) * getArticlesLimit, tag: currentFeed.replace('#', '') === tagFilter ? tagFilter : undefined }, newCancelToken.token)
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
    const viewArticlesWithTag = (tag) => {
        setTagFilter(tag);
        setCurrentFeed(`#${tag}`);
        handleViewArticles(`#${tag}`);
    }

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        if (!user) setCurrentFeed('Global Feed')
        else setCurrentFeed('Your Feed')
        setLoadingArticles(true);
        if (user) {
            axios.get('/articles/feed')
                .then(res => res.data)
                .then(data => {
                    setArticlesCount(data.articlesCount);
                    setArticles(data.articles);
                    setLoadingArticles(false);
                })
                .catch(err => { console.log(err); setLoadingArticles(false) })
        }
        else
            getArticles({}, cancelToken.token)
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
    }, [user])

    return (<>
        {!user && <Banner />}
        <Container className="flex-grow-1 articles w-75 g-5">
            <Row className="align-items-start">
                <Col xs={9}>{user ?
                    <ArticlesNavigator handleViewArticles={handleViewArticles}
                        tabs={!tagFilter ? ['Your Feed', 'Global Feed'] : ['Your Feed', 'Global Feed', `#${tagFilter}`]} activeKey={currentFeed} /> :
                    <ArticlesNavigator handleViewArticles={handleViewArticles}
                        tabs={!tagFilter ? ['Global Feed'] : ['Global Feed', `#${tagFilter}`]} activeKey={currentFeed} />
                }
                    <ArticlesList loading={loadingArticles} articles={articles} handleChangePage={handleChangePage} articlesCount={articlesCount} offset={offset} /></Col>
                <Col className="tag-list border rounded-2 p-2">
                    <h6>Popular tags</h6>
                    <div className="d-flex gap-2 flex-wrap">
                        {tags?.map(tag => {
                            return (
                                <Button onClick={() => viewArticlesWithTag(tag)} key={tag} variant="secondary" className="rounded-5">
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