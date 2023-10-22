import { useState, createContext, useContext, useEffect } from "react";
import { API_URL } from "../Constants/Constants";
import axios from 'axios';

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
    const [ isLoadingUB, setIsLoadingUB ] = useState(true);
    
    //Message Storage
    const [ messages, setMessages ] = useState([]);
    const [ isLoadingMsgs, setIsLoadingMsgs] = useState(false);

    useEffect(() => {
        const fetchMsgs = async () => {
            const dmsUrl = `${API_URL}/messages?`
                const generateUrl = (userId) => {
                    return `${dmsUrl}receiver_id=${userId}&receiver_class=User`
                }

                const accumulatedMessages = [];
                const myId = parseInt(user.data.id);
                
                await Promise.all(
                userBase
                .filter((user) => user.id > 4000 && user.id !== myId)
                .map(async (user) => {
                    try {
                        const response = await axios.get(generateUrl(user.id),{headers:userHeaders})

                        if (response.data.data.length > 0 && !response.data.errors) {
                            accumulatedMessages.push(...response.data.data);
                        } 
                    } catch (error) {
                        console.error(error)
                    }
                }))

                setMessages(accumulatedMessages);
                setIsLoadingMsgs(false)
        }

        if (isLoadingMsgs) {
            fetchMsgs()
        }
    }, [isLoadingMsgs])

    return (
        <DataContext.Provider value={
            {isLoggedIn, handleLogin, handleLogout,
            handleHeaders, setLoginUser,
            userHeaders, user,
            activeModal, handleActiveModal,
            userBase, setUserBase,
            messages, setMessages,
            isLoadingUB, setIsLoadingUB,
            isLoadingMsgs, setIsLoadingMsgs}}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => {
    return useContext(DataContext);
}

export default DataProvider