import { Spinner } from "react-bootstrap";
import "./PageLoading.css";
const PageLoading = ({ message = "Cargando..." }) => {
    return (
        <div className="page-loading-container">
            {}
            <div className="page-loading-spinner-wrapper">
                <Spinner
                    animation="border"
                    variant="success"
                    className="page-loading-spinner"
                />
            </div>
            {}
            <p className="page-loading-message">
                {message}
            </p>
        </div>
    );
};
export default PageLoading;
