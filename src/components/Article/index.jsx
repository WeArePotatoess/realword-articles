import { format } from "date-fns";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import './Article.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";


const Article = ({ handleToggleFavorite, article, index }) => {
    return (
        <Container className="article py-3 border-top">
            <Row>
                <Col className="d-flex align-items-center gap-2">
                    <img src={article.author.image} alt="author avatar" className="rounded-circle" />
                    <div >
                        <Link className="author" to={"/" + article.author.username}>{article.author.username}</Link>
                        <div className="created text-black-50">{format(new Date(article.createdAt), 'MMMM d, yyyy')}</div>
                    </div>
                </Col>
                <Col className="text-end">
                    <Button variant={article.favorited ? 'success' : "outline-success"} className="favorite-article p-1" onClick={() => handleToggleFavorite(index, article.slug, article.favorited)} >
                        <FontAwesomeIcon icon={faHeart} className="me-1" />
                        {article.favoritesCount}
                    </Button>
                </Col>
            </Row>
            <Row className="pt-3">
                <Link className="text-dark text-decoration-none" to={'/article/' + article.slug}>
                    <h4 className="article-title">
                        {article.title}
                    </h4>
                    <p className="text-black-50">
                        {article.description}
                    </p>
                </Link>
            </Row>
            <Row className="article-footer text-black-50">
                <Col><span>Read more...</span></Col>
                <Col className="text-end">
                    {article.tagList.map((tag) => {
                        return (<span key={tag} className="border rounded-5 p-1 mx-1">
                            {tag}
                        </span>)
                    })}
                </Col>
            </Row>
        </Container>
    );
}

export default Article;