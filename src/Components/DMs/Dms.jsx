import './Dms.css'
import { useData } from '../../Context/DataProvider'
import { useState, useEffect } from 'react';
import { API_URL } from '../../Constants/Constants';
import axios from 'axios';
import ChannelMsgBox from '../ChannelMsgBox';

function Dms() {
    const { userBase, uniqueSenders, selectedDM, setSelectedDM } = useData();

    const handleDMSelect = (email) => {
        setSelectedDM(email)
    }

    const IdDisplay = userBase.find((user) => selectedDM === user.email);

    return (
        <div className='Dms-CONTAINER'>
            <nav className='dms-navbox'>
            <h1>{selectedDM !== '' && selectedDM !== 'newMsg' 
            ? `${!uniqueSenders.find((email) => email === selectedDM) 
                ? `New Message to `: IdDisplay.id}: ${selectedDM}`
            :'Direct Messages'}</h1>
            </nav>
            <RenderList handleDMSelect={handleDMSelect}/>
            {selectedDM !== '' &&  (
            <RenderDMBox/>
            )}
        </div>
    )
}

function RenderList(props) {
    const { uniqueSenders, user, userBase, selectedDM } = useData();
    const { handleDMSelect } = props;
    const [ isSendingNew, setIsSendingNew ] = useState(false);
    const [ id, setID ] = useState('');

    useEffect(() => {
        setIsSendingNew(false)
    },[selectedDM])

    const doesUserExist = () => {
        if (id !== ''){
            const userTarget = userBase.find((user) => 
                parseInt(id) === user.id
            )
            if (userTarget) {
                if (userTarget.id === user.data.id) {
                    return 'This is you lol'
                }
                return userTarget.email
            }
        } 
        return 'Does not Exist'
    }

    const handleNewMsg = () => {
        const newMsgUser = userBase.find((user) => parseInt(id) === user.id)
        handleDMSelect(newMsgUser.email)
    }
    
    return (
        <div className='dms-renderlist'>
            {isSendingNew === true ? 
                <div className='dm-user-search'>
                    <span className='material-symbols-outlined search-static'>
                        search
                    </span>
                    <input 
                    className='dm-search-input'
                    placeholder='User ID'
                    type='text'
                    autoFocus
                    value={id}
                    maxLength={4}
                    onChange={(e) => {
                        const inputValue = e.target.value;
                        if (/^[0-9]*$/.test(inputValue)){
                            setID(e.target.value)
                        }
                    }}/>
                    <span className={`search-exist 
                    ${id === '' ? 'blank-input' : ''}
                    `}>{id !== '' && doesUserExist()}</span>
                    <span 
                    onClick={handleNewMsg}
                    className={`material-symbols-outlined go-button
                    ${doesUserExist() !== 'Does not Exist' && doesUserExist() !== 'This is you lol'
                     ? '' : 'cannot-send'}
                    ${id === '' ? 'blank-input' : ''}`}>
                        {doesUserExist() !== 'Does not Exist' && doesUserExist() !== 'This is you lol' ? 'keyboard_arrow_right'
                        : 'block' }
                    </span>
                </div>
            : <div className='buttons'>
                <button
                className='sendToNewUser'
                onClick={() => setIsSendingNew(true)}
                >
                    <span className='material-symbols-outlined'>
                            person_search
                    </span>
                    Send to New</button>
            </div>}
            <div className='msg-list'>
                {uniqueSenders
                .map((user,index) => (
                    <div key={index}
                    onClick={() => handleDMSelect(user)}
                    className={user === selectedDM ? 'selected' : ''}>
                        {user === selectedDM && 
                        <span class='material-symbols-outlined'>
                                chevron_right
                        </span>}
                        <p>{user}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function RenderDMBox() {
    const { userHeaders, userBase, hasSentAMsg, setHasSentAMsg,
    selectedDM } = useData();
    const [ messages, setMessages ] = useState([]);

    useEffect(() => {
        const fetchDMs = async () => {
            try {
                const convertID = userBase.find((user) => selectedDM === user.email); 
                const url = `${API_URL}/messages?receiver_id=${convertID.id}&receiver_class=User`

                const response = await axios.get(url, {headers:userHeaders})

                setMessages(response.data.data);
            } catch(error) {
                console.error(error)
            }

            setHasSentAMsg(false);
            console.log(`this code ran`)
        }
        if (hasSentAMsg) {
            fetchDMs();
        }

        fetchDMs();
        // setInterval(() => fetchDMs(), 2000);
    }, [selectedDM, hasSentAMsg])
    
    return (
        <ChannelMsgBox messages={messages} selectedDM={selectedDM}/>
    )
}

export default Dms