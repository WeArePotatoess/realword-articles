import { Col, Nav, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import './Header.css';
import { memo, useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
const Header = () => {
    const location = useLocation();
    const [user, setUser] = useState();

    useEffect(() => {
        const cancelToken = axios.CancelToken;
        const source = cancelToken.source();
        axios.get('/user', { cancelToken: source.token })
            .then(res => res.data)
            .then(data => setUser(data.user))
            .catch(err => console.log(err));
        return () => { source.cancel(); }
    }, [])



    return (
        <header className="py-2">
            <Row>
                <Col xs={3} xl={6} className="d-flex align-items-center">
                    <Link className="text-decoration-none fs-5 logo" to={'#/'}>conduit</Link>
                </Col>
                <Col>
                    <Nav className="justify-content-end ">
                        <Nav.Item>
                            <Link className={`nav-link text-black-50 ${location.pathname === '/' ? 'active' : ""}`} to="/">Home</Link>
                        </Nav.Item>
                        {!user && <>
                            <Nav.Item>
                                <Link className={`nav-link text-black-50 ${location.pathname === '/login' ? 'active' : ""}`} to="/login">Sign in</Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link className={`nav-link text-black-50 ${location.pathname === '/register' ? 'active' : ""}`} to="/register">Sign up</Link>
                            </Nav.Item>
                        </>}
                        {user && <>
                            <Nav.Item>
                                <Link className="nav-link text-black-50">
                                    <FontAwesomeIcon icon={faPenToSquare} className="me-1" />
                                    New Article
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link className="nav-link text-black-50">
                                    <FontAwesomeIcon icon={faGear} className="me-1" />
                                    Settings
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link className="nav-link text-black-50">
                                    {user.username}
                                </Link>
                            </Nav.Item>

                        </>}
                    </Nav>
                </Col>
            </Row>
        </header>
    );
}

export default memo(Header);