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

    return (
        <DataContext.Provider value={
            {isLoggedIn, handleLogin, handleLogout,
            handleAddNewUser, setLoginUser,
            userData, user}}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => {
    return useContext(DataContext);
}

export default DataProvider