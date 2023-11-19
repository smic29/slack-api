import './ModalTemplate.css'
import LoginPage from '../Components/Landing Page/LoginPage';
import NewUserForm from '../Components/Landing Page/NewUserForm';
import { useData } from '../Context/DataProvider';
import Info from '../Components/Info';

function ModalTemplate(props) {
    const { navigate } = props;
    const { activeModal } = useData();
    const error = 'github has an error with this file';

    function RenderModal() {
        switch (activeModal) {
            case 'newUser':
                return <NewUserForm />
            default:
                return <LoginPage navigate={navigate} />
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
            src={process.env.PUBLIC_URL + '/Assets/Slack_icon_2019.png'}
            alt='slack logo'></img>
            <Info />
        </div>
    )
}

export default ModalTemplate;