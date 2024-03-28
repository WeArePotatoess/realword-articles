import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import './Footer.css'

const Footer = () => {
    return (
        <footer className="py-4">
            <Container className="d-flex align-items-center gap-2 ">
                <Link className="logo text-decoration-none" to={"#/"}>conduit</Link>
                <span className="attribution text-black-50">
                    © 2024. An interactive learning project from <Link to="https://thinkster.io" className=" text-decoration-none text-black-50">Thinkster</Link>.
                    Code licensed under MIT.
                </span>
            </Container>
        </footer>
    );
}

export default Footer;