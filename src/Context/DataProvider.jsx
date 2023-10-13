import { useState, createContext, useContext } from "react";

const DataContext = createContext();

const DataProvider = ({children}) => {
    //Login Related
    const [ isLoggedIn, setisLoggedIn ] = useState(false);

    const handleLogin = (user) => {
        setisLoggedIn(true);
        setUser(user);
    }

    const handleLogout = () => {
        setisLoggedIn(false);
        setUser('');
    }

    //User Related
    const [ user, setUser ] = useState('');
    const [ userData, setUserData ] = useState([
        {
            username: 'Spicy',
            password: 'mikpot',
            email: 'ic@spicy.com',
            firstName: 'Ian',
            lastName: 'Sibulo',
            nickName: 'Spicy',
            createdChannels: [],
            joinedChannels: [],
            messages: [],
        }
    ])

    const setLoginUser = (user) => {
        setUser(user);
    } 

    const handleAddNewUser = (newUser) => {
        setUserData((prevData) => [...prevData, newUser])
    }

    
    //Modal Switch
    const [ activeModal, setActiveModal ] = useState('');

    const handleActiveModal = (modalName) => {
        setActiveModal(modalName)
    }


    return (
        <DataContext.Provider value={
            {isLoggedIn, handleLogin, handleLogout,
            handleAddNewUser, setLoginUser,
            userData, user,
            activeModal, handleActiveModal}}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => {
    return useContext(DataContext);
}

export default DataProvider