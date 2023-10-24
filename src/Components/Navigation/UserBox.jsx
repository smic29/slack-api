import './UserBox.css'
import { useData } from '../../Context/DataProvider'

function UserBox() {
    const { user, handleLogout, setIsModalOpen } = useData();

    return (
        <div className='userbox-container'>
            <div className='userbox-login-info'>
                <span class="material-symbols-outlined">
                account_circle
                </span>
                <span>{user.data.email}</span>
                <span>{user.data.id}</span>
            </div>
            <div className='userbox-logoutBox'>
                <span className='userbox-logoutbtn'
                onClick={() =>{ 
                setIsModalOpen(false)
                handleLogout()}}>
                    Sign Out of Slack</span>
            </div>
        </div>
    )
}

export default UserBox;