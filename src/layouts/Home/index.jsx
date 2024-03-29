import { Container } from "react-bootstrap";
import Banner from "../../components/Banner";

const Home = () => {
    return (<>
        <Banner />
        <Container className="flex-grow-1 w-75">
            Home
        </Container>
    </>
    );
}

export default Home;