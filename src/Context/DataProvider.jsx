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
        setUserHeaders('');
        setMessages([]);
    }

    //User Related
    const [ user, setUser ] = useState('');
    const [ userHeaders, setUserHeaders ] = useState('')

    const setLoginUser = (user) => {
        setUser(user);
    } 

    const handleHeaders = (header) => {
        const updatedHeader = {
            'access-token': header['access-token'],
            uid: header.uid,
            expiry: header.expiry,
            client: header.client,
        }
        setUserHeaders(updatedHeader)
        // setUserHeaders(header)
    }

    
    //Modal Switch
    const [ activeModal, setActiveModal ] = useState('');

    const handleActiveModal = (modalName) => {
        setActiveModal(modalName)
    }

    //UserBase Storage
    const [ userBase , setUserBase ] = useState([]);
    
    //Message Storage
    const [ messages, setMessages ] = useState([]);

    return (
        <DataContext.Provider value={
            {isLoggedIn, handleLogin, handleLogout,
            handleHeaders, setLoginUser,
            userHeaders, user,
            activeModal, handleActiveModal,
            userBase, setUserBase,
            messages, setMessages}}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => {
    return useContext(DataContext);
}

export default DataProvider