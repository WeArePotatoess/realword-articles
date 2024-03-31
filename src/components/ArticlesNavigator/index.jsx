import { useRef } from "react";
import { Nav } from "react-bootstrap";
import './ArticlesNavigator.css';


const ArticlesNavigator = ({ tabs, handleViewArticles }) => {
    const navRef = useRef();

    return (
        <Nav
            ref={navRef}
            variant="underline"
            className="gap-0"
            defaultActiveKey={tabs[0]}
            onSelect={(eventKey) => {
                handleViewArticles(eventKey);
            }}
        >
            {tabs.map(tab => {
                return (
                    <Nav.Link className="text-secondary" key={tab} eventKey={tab}>{tab}</Nav.Link>
                )
            })}

            {/* <Nav.Link className="text-secondary" eventKey={'favorited articles'}>Favorited Articles</Nav.Link> */}
        </Nav>
    );
}

export default ArticlesNavigator;