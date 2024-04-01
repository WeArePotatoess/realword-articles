import { Col, Nav, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import './Header.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
const Header = () => {
    const location = useLocation();

    const user = useSelector(state => state.user.value)

    return (
        <header className="py-2">
            <Row>
                <Col xs={3} xl={6} className="d-flex align-items-center">
                    <Link className="text-decoration-none fs-5 logo" to={'/'}>conduit</Link>
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
                                <Link className="nav-link text-black-50" to={'/editor'}>
                                    <FontAwesomeIcon icon={faPenToSquare} className="me-1" />
                                    New Article
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link className={`nav-link text-black-50 ${location.pathname === '/settings' ? 'active' : ""}`} to={'/settings'}>
                                    <FontAwesomeIcon icon={faGear} className="me-1" />
                                    Settings
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link className={`nav-link text-black-50 ${location.pathname === `/${user.username}` ? 'active' : ""}`} to={`/${user.username}`}>
                                    <img src={user?.image} alt={user?.username} className="rounded-circle me-1" />
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

export default Header;