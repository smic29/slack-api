import { NavLink, Outlet } from "react-router-dom";
import './Navigation.css'
import { useData } from "../../Context/DataProvider";
import ModalTemplate from "../../Modals/ModalTemplate";

function Navigation() {
    const { isLoggedIn, handleLogin, handleLogout } = useData();

    return (
        <div className="navigation">
            <header className="navbar-header">
                {isLoggedIn ? (<nav>
                    <NavLink className='item' to='/'>Home</NavLink>
                    <NavLink className='item' to='channels'>Channels</NavLink>
                    <NavLink className='item' to='dms'>DMs</NavLink>
                </nav>) : ''}
                <div className="login-box">
                    <button>Login</button>
                    <button
                    onClick={() => handleLogout()}
                    >Logout</button>
                </div>
            </header>
            <div className="outlet">
            {isLoggedIn ? (<Outlet />) : (<ModalTemplate />)}
            </div>
        </div>
    )
}

export default Navigation