import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import './Navigation.css'
import { useData } from "../../Context/DataProvider";
import ModalTemplate from "../../Modals/ModalTemplate";
import MobileModal from "../../Modals/MobileModal";
import FunctionService from "../../Services/FunctionService";
import { createContext, useContext } from "react";

const NavigateContext = createContext();

export const useNavigateContext = () => useContext(NavigateContext);

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
        <div className="container-fluid g-0" id="main-container">
            <NavigateContext.Provider value={navigate}>
                <div className="row g-0 flex-wrap-none">
                    <nav className="navbar-vertical col-1 d-flex flex-column py-2"
                    id="main-navbar">
                        {isLoggedIn ? (<nav className="mt-5">
                            <NavLink className={`item
                            ${currentPage === 'home' ? 'nav-selected' : ''}`} 
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
                                <span className="material-symbols-outlined">
                                chat
                                </span>
                                <span>Ch</span>
                                </div>
                                </NavLink>
                            <NavLink className={`item ${currentPage === 'dms' ? 'nav-selected' : ''}`} 
                            to='dms'>
                            <div className="nav-iconbox">
                                <span className="material-symbols-outlined">
                                forum
                                </span>
                                <span>DMs</span>
                                </div>
                                </NavLink>
                        </nav>) : ''}
                        <div className="user-box align-self-center mt-auto">
                            <span className="material-symbols-outlined"
                            onClick={handleModalClicks}
                            data-testid='user-modalTrigger'>
                            account_box
                            </span>
                        </div>
                    </nav>
                    <div className="col-11 g-0 flex-grow-1"
                    id="main-outlet">
                    {isLoggedIn ? (<Outlet />) : (<ModalTemplate navigate={navigate}/>)}
                    </div>
                    {isModalOpen ? <MobileModal /> : null}
                </div>
            </NavigateContext.Provider>
        </div>
    )
}

export default Navigation