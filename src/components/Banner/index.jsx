import './Banner.css'
import { memo } from "react";


const Banner = () => {
    return (
        <div className="text-center banner py-4 mb-4">
            <h1 className="logo text-white ">conduit</h1>
            <h3 className='fw-lighter text-white'>A place to share your knowledge</h3>
        </div>
    );
}

export default memo(Banner);