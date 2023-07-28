import ErrorMessage from "../errorMessage/ErrorMessage";
import {Link} from "react-router-dom";

const Page404 = () => {
    return (
        <div>
            <ErrorMessage/>
            <p style={{'textAlign': 'center', 'fontSize': '24px'}}>This page doesn't exist</p>
            <Link style={{'display': 'block', 'textAlign': 'left', 'fontWeight': '700', 'fontSize': '24px', 'marginTop': '30px'}} to='/'>Back to main page</Link>
        </div>
    )
};

export default Page404;