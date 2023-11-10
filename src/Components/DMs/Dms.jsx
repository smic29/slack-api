import './Dms.css'
import { useData } from '../../Context/DataProvider'
import { useState, useRef, useEffect } from 'react';
import TypeBox from '../Textarea';
import { API_URL } from '../../Constants/Constants';
import axios from 'axios';
import ChannelMsgBox from '../ChannelMsgBox';

function Dms() {
    const [ selectedDM, setSelectedDM ] = useState('');
    const [ body, setBody ] = useState('');
    const { userBase, userHeaders, setIsLoadingMsgs, uniqueSenders } = useData();

    const handleDMSelect = (email) => {
        setSelectedDM(email)
    }

    const handleSend = async() => {
        try {
            const url = `${API_URL}/messages`
            const convertID = userBase.find((user) => selectedDM === user.email);
            const sendData = {
                'receiver_id': parseInt(convertID.id),
                'receiver_class': "User",
                'body': body,
            }
            await axios.post(url, sendData, { headers: userHeaders })

            setIsLoadingMsgs(true)
            setTimeout(() => {
                setBody('');
            }, 1500);
        } catch(error) {
            alert(error)
        }
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
            <RenderList handleDMSelect={handleDMSelect} selectedDM={selectedDM}/>
            {selectedDM !== '' && selectedDM !== 'newMsg' ? (
            <>
            <RenderDMBox selectedDM={selectedDM}
            body={body}
            setBody={setBody}
            handleSend={handleSend}/>
            </>
            ) : selectedDM === 'newMsg' ?(
                <RenderNewDM selectedDM={selectedDM} />
            ): null}
        </div>
    )
}

function RenderList(props) {
    const { uniqueSenders, user, userBase } = useData();
    const { selectedDM, handleDMSelect } = props;
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

function RenderDMBox(props) {
    const { userHeaders, userBase, hasSentAMsg, setHasSentAMsg } = useData();
    const { selectedDM } = props;
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

function RenderNewDM(props) {
    const { userBase, userHeaders } = useData();
    const { selectedDM } = props;
    const [ id, setID ] = useState('');
    const [ body, setBody ] = useState('');
    const [ canSendMsg, setCanSendMsg ] = useState(false);

    const doesUserExist = () => {
        if (id !== ''){
            const user = userBase.find((user) => 
                parseInt(id) === user.id
            )
            if (user) {
                return user.email
            }
        } 
        return 'Does not Exist'
    }

    const handleSend = async() => {
        try {
            const url = `${API_URL}/messages`
            const sendData = {
                'receiver_id': parseInt(id),
                'receiver_class': "User",
                'body': body,
            }

            await axios.post(url, sendData, { headers: userHeaders })

            alert(`Message Sent`)
            setBody('')
            setCanSendMsg(false)
        } catch(error) {
            alert(error)
        }
    }

    return (
        <div className='dm-searchuser'>
            <input 
            type='text'
            value={id}
            maxLength={4}
            onChange={(e) => {
                const inputValue = e.target.value;
                if (/^[0-9]*$/.test(inputValue)){
                    setID(e.target.value)
                }
            }} />
            <span>
                {doesUserExist()}
            </span>
            <button
            onClick={() => setCanSendMsg(true)}
            disabled={doesUserExist() === 'Does not Exist'}>
                Send this User a message</button>
                <span>{body}</span>
            {canSendMsg ? <TypeBox body={body} setBody={setBody}
            handleSend={handleSend}/> : null}
        </div>
    )
}

export default Dms