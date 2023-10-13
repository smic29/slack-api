import './ModalTemplate.css'
import LoginPage from '../Components/LoginPage';

function ModalTemplate() {
    return(
        <div className="overlay">
            <div className="content">
                <div>
                <LoginPage />
                </div>
            </div>
        </div>
    )
}

export default ModalTemplate;