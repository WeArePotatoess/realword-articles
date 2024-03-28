import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";
import { Link } from "react-router-dom";
import './Reference.css'

const Reference = () => {
    return (
        <div className="reference text-center py-3 position-fixed bottom-0 w-100">
            <FontAwesomeIcon className="me-2 text-light" icon={faGithub} />
            <Link className="text-light" to={"https://github.com/gothinkster/angularjs-realworld-example-app"}>Fork on GitHub</Link>
        </div>
    );
}

export default memo(Reference);