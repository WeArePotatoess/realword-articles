import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import './ArticleDetail.css';
import { format } from "date-fns";


const ArticleDetail = () => {
    const [article, setArticle] = useState();
    const params = useParams();

    const getArticle = (slug) => {
        return axios.get('/articles/' + slug)
            .then(res => res.data)
            .then(data => data.article)
            .catch(err => console.log(err))
    }
    useEffect(() => {
        getArticle(params.slug)
            .then(article => setArticle(article))
            .catch(err => console.log(err));
    }, [])

    return (
        <>
            {article && <>
                <div className="article-banner text-white">
                    <Container className="w-75">
                        <Row><h1 className="p-4">
                            {article.title}
                        </h1></Row>
                        <Row>
                            <Col className="d-flex align-items-center gap-2">
                                <img src={article.author.image} alt="author avatar" className="rounded-circle" />
                                <div >
                                    <Link className="author text-white" to={"/@" + article.author.username}>{article.author.username}</Link>
                                    <div className="created text-white-50">{format(new Date(article.createdAt), 'MMMM d, yyyy')}</div>
                                </div>
                            </Col>
                        </Row>

                    </Container>
                </div>
                <Container className="flex-grow-1">
                    <Row>
                    </Row>
                    article detail
                </Container>
            </>}

        </>
    );
}

export default ArticleDetail;