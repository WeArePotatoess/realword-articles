import { Nav } from "react-bootstrap";

const ArticlesNavigator = ({ tabs, handleViewArticles }) => {
    return (
        <Nav
            variant="underline"
            className="gap-0"
            defaultActiveKey={tabs[0]}
            onSelect={(eventKey) => handleViewArticles(eventKey)}
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