import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import './Navigation.css'
import { useData } from "../../Context/DataProvider";
import ModalTemplate from "../../Modals/ModalTemplate";
import MobileModal from "../../Modals/MobileModal";
import FunctionService from "../../Services/FunctionService";

function Navigation() {
    const { isLoggedIn, isModalOpen,
    setIsModalOpen, setModalPosition, setMobileModal,
    } = useData();
    const navigate = useNavigate();
    const location = useLocation();
    const pathName = location.pathname;
    const currentPage = FunctionService.determineCurrentPage(pathName);

    const handleModalClicks = (e) => {
    
        const buttonRect = e.target.getBoundingClientRect();
        const position = {
            top: buttonRect.top - 105 + 'px',
            left: buttonRect.left + 52.5 + 'px',
        }
        
        setMobileModal('userIcon')
        setModalPosition(position)
        setIsModalOpen(true)
    }

    return (
        <div className="navigation">
            <header className="navbar-header">
                {isLoggedIn ? (<nav>
                    <NavLink className={`item ${currentPage === 'home' ? 'nav-selected' : ''}`} 
                    to='/'>
                        <div className="nav-iconbox">
                        <span class="material-symbols-outlined">
                        home_app_logo
                        </span>
                        <span>Home</span>
                        </div>
                        </NavLink>
                    <NavLink className={`item ${currentPage === 'channels' ? 'nav-selected' : ''}`} 
                    to='channels'>
                    <div className="nav-iconbox">
                        <span class="material-symbols-outlined">
                        chat
                        </span>
                        <span>Ch</span>
                        </div>
                        </NavLink>
                    <NavLink className={`item ${currentPage === 'dms' ? 'nav-selected' : ''}`} 
                    to='dms'>
                    <div className="nav-iconbox">
                        <span class="material-symbols-outlined">
                        forum
                        </span>
                        <span>DMs</span>
                        </div>
                        </NavLink>
                </nav>) : ''}
                <div className="user-box">
                    <span class="material-symbols-outlined"
                    onClick={handleModalClicks}>
                    account_box
                    </span>
                </div>
            </header>
            <div className="outlet">
            {isLoggedIn ? (<Outlet />) : (<ModalTemplate navigate={navigate}/>)}
            </div>
            {isModalOpen ? <MobileModal /> : null}
        </div>
    )
}

export default Navigation