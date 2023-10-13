import './ModalTemplate.css'
import LoginPage from '../Components/Landing Page/LoginPage';
import NewUserForm from '../Components/Landing Page/NewUserForm';
import { useData } from '../Context/DataProvider';

function ModalTemplate() {
    const { activeModal } = useData();

    function RenderModal() {
        switch (activeModal) {
            case 'newUser':
                return <NewUserForm />
            default:
                return <LoginPage />
        }
    }

    return(
        <div className="overlay">
            <div className="content">
                <div>
                <RenderModal />
                </div>
            </div>
        </div>
    )
}

export default ModalTemplate;