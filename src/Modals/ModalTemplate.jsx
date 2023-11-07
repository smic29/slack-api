import './ModalTemplate.css'
import LoginPage from '../Components/Landing Page/LoginPage';
import NewUserForm from '../Components/Landing Page/NewUserForm';
import { useData } from '../Context/DataProvider';

function ModalTemplate() {
    const { activeModal } = useData();
    const test = 'git error';

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
            <img className='login-logo'
            src='./Assets/Slack_icon_2019.png'></img>
        </div>
    )
}

export default ModalTemplate;