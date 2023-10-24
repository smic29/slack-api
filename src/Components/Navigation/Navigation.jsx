import { NavLink, Outlet } from "react-router-dom";
import './Navigation.css'
import { useData } from "../../Context/DataProvider";
import ModalTemplate from "../../Modals/ModalTemplate";
import { useState } from "react";

function Navigation() {
    const { isLoggedIn, handleLogin, handleLogout } = useData();
    const [ currentPage, setCurrentPage ] = useState('home');

    return (
        <div className="navigation">
            <header className="navbar-header">
                {isLoggedIn ? (<nav>
                    <NavLink className={`item ${currentPage === 'home' ? 'nav-selected' : ''}`} 
                    to='/'
                    onClick={() => setCurrentPage('home')}>
                        <div className="nav-iconbox">
                        <span class="material-symbols-outlined">
                        home_app_logo
                        </span>
                        <span>Home</span>
                        </div>
                        </NavLink>
                    <NavLink className={`item ${currentPage === 'channels' ? 'nav-selected' : ''}`} 
                    to='channels'
                    onClick={() => setCurrentPage('channels')}>
                    <div className="nav-iconbox">
                        <span class="material-symbols-outlined">
                        chat
                        </span>
                        <span>Channels</span>
                        </div>
                        </NavLink>
                    <NavLink className={`item ${currentPage === 'dms' ? 'nav-selected' : ''}`} 
                    to='dms'
                    onClick={() => setCurrentPage('dms')}>
                    <div className="nav-iconbox">
                        <span class="material-symbols-outlined">
                        forum
                        </span>
                        <span>DMs</span>
                        </div>
                        </NavLink>
                </nav>) : ''}
                <div className="user-box">
                    <span class="material-symbols-outlined">
                    account_box
                    </span>
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