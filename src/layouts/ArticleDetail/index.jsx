import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import './ArticleDetail.css';
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { followUser, unFollowUser } from "../../actions/userActions";
import { useSelector } from "react-redux";


const ArticleDetail = () => {
    const user = useSelector(state => state.user.value);
    const [article, setArticle] = useState();
    const params = useParams();
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState();
    const followButton = useRef();
    const [author, setAuthor] = useState();
    const [favorite, setFavorite] = useState();
    const favoriteButton = useRef();
    const commentButton = useRef();
    const navigator = useNavigate();

    const getArticle = (slug) => {
        return axios.get('/articles/' + slug)
            .then(res => res.data)
            .then(data => {
                setAuthor(data.article.author);
                setFavorite({ favorited: data.article.favorited, favoritesCount: data.article.favoritesCount });
                setArticle(data.article);
            })
            .catch(err => console.log(err))
    }

    const getComments = (slug) => {
        axios.get('/articles/' + slug + '/comments')
            .then(res => res.data)
            .then(data => setComments(data.comments))
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getArticle(params.slug);
        getComments(params.slug);
    }, [params.slug])




    const handlePostComment = () => {
        commentButton.current.setAttribute('disabled', true);
        axios.post('/articles/' + params.slug + '/comments', { comment: { body: newComment } })
            .then(() => {
                getComments(params.slug);
                setNewComment('');
                commentButton.current.removeAttribute('disabled');
            })
            .catch(err => {
                commentButton.current.removeAttribute('disabled');
                console.log(err)
            })
    }

    const handleDeleteComment = (e, id) => {
        e.target.parentNode.parentNode.parentNode.classList.add('opacity-25')
        axios.delete('/articles/' + params.slug + '/comments/' + id)
            .then(() => getComments(params.slug))
            .catch(err => console.log(err))
    }

    const handleFollow = () => {
        if (!user) navigator('/register')
        else {
            followButton.current.setAttribute('disabled', true);
            if (author.following)
                unFollowUser(author.username)
                    .then(data => {
                        setAuthor(data.profile);
                        followButton.current.removeAttribute('disabled');
                    })
                    .catch(err => {
                        followButton.current.removeAttribute('disabled');
                        console.log(err)
                    });
            else followUser(author.username)
                .then(data => {
                    setAuthor(data.profile);
                    followButton.current.removeAttribute('disabled');
                }).catch(err => {
                    followButton.current.removeAttribute('disabled');
                    console.log(err);
                });
        }
    }

    const handleToggleFavorite = () => {
        if (!user) navigator('/register')
        else {
            favoriteButton.current.setAttribute('disabled', true);
            if (favorite.favorited) {
                axios.delete('/articles/' + params.slug + '/favorite')
                    .then(res => res.data)
                    .then(data => {
                        setFavorite({ favorited: data.article.favorited, favoritesCount: data.article.favoritesCount });
                        favoriteButton.current.removeAttribute('disabled');
                    })
                    .catch(err => {
                        favoriteButton.current.removeAttribute('disabled');
                        console.log(err)
                    });
            }
            else {
                axios.post('/articles/' + params.slug + '/favorite')
                    .then(res => res.data)
                    .then(data => {
                        setFavorite({ favorited: data.article.favorited, favoritesCount: data.article.favoritesCount });
                        favoriteButton.current.removeAttribute('disabled');
                    })
                    .catch(err => {
                        favoriteButton.current.removeAttribute('disabled');
                        console.log(err)
                    });
            }
        }
    }

    return (
        <>
            {article && <>
                <div className="article-banner text-white">
                    <Container className="w-75 pb-4">
                        <Row>
                            <h1 className="p-4">
                                {article.title}
                            </h1>
                        </Row>
                        <Row>
                            <Col xs={2} className="d-flex align-items-center gap-2">
                                <img src={author.image} alt="author avatar" className="rounded-circle" />
                                <div >
                                    <Link className="author text-white" to={"/" + author.username}>{author.username}</Link>
                                    <div className="created text-white-50">{format(new Date(article.createdAt), 'MMMM d, yyyy')}</div>
                                </div>
                            </Col>
                            <Col className="d-flex align-items-center gap-2">
                                <Button ref={followButton} onClick={handleFollow} variant={`${author.following ? 'secondary' : 'outline-secondary'} border-light`} className="d-flex align-items-center gap-1">
                                    <FontAwesomeIcon icon={faPlus} />
                                    {author.following ? "Unfollow" : "Follow"}  {author.username}
                                </Button>
                                <Button ref={favoriteButton} onClick={handleToggleFavorite} variant={`${favorite.favorited ? 'success' : 'outline-success'} border-success`} className="d-flex align-items-center gap-1">
                                    <FontAwesomeIcon icon={faHeart} />
                                    {favorite.favorited ? 'Unfavorite' : 'Favorite'} Article ({favorite.favoritesCount})
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <Container className="flex-grow-1 w-75 p-4 fs-5">
                    <Row className="mb-4 flex-column gap-3 border-bottom pb-5">
                        <Col>
                            {article.description}
                        </Col>
                        <Col>
                            {article.body}
                        </Col>
                        <Col className="tags d-flex gap-2 text-black-50">
                            {article.tagList.map(tag => {
                                return (<div key={tag} className="border p-2 rounded-5">
                                    {tag}
                                </div>)
                            })}
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        {user ?
                            <div className="w-50">
                                <div className="w-100 d-flex flex-column">
                                    <textarea className="border w-100" value={newComment} onChange={e => setNewComment(e.target.value)}>

                                    </textarea>
                                    <div className=" bg-light border w-100 d-flex align-items-center justify-content-between p-2">
                                        <img src={user.image} alt="" className="rounded-circle" />
                                        <Button ref={commentButton} variant="success fw-bold" onClick={handlePostComment}>Post comment</Button>
                                    </div>
                                </div>
                                {comments?.map(comment => {
                                    return (
                                        <div key={comment.id} className="comment w-100 d-flex flex-column my-3">
                                            <div className="border w-100 p-2 fs-6">
                                                {comment.body}
                                            </div>
                                            <div className=" bg-light border w-100 d-flex align-items-center justify-content-between p-2">
                                                <div className="d-flex gap-1">
                                                    <img src={user.image} alt="" className="rounded-circle" />
                                                    <Link className="text-black-50" to={`/${comment.author.username}`}>{comment.author.username}</Link>
                                                    <span className="text-black-50">{format(new Date(comment.createdAt), 'MMMM d, yyyy')}</span>
                                                </div>
                                                {comment.author.username === user.username &&
                                                    <FontAwesomeIcon className="delete-comment-btn text-black-50" icon={faTrash} onClick={(e) => handleDeleteComment(e, comment.id)} />}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            : <div className="user-not-loggedin fs-6 w-auto"><Link to={'/login'} className="text-success">Sign in </Link>or<Link className="text-success" to={'/register'}> Sign up</Link>  to add comments on this article.</div>}
                    </Row>
                </Container>
            </>}

        </>
    );
}

export default ArticleDetail;