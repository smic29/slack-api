import './Dms.css'
import { useData } from '../../Context/DataProvider'
import { useState, useRef, useEffect } from 'react';
import TypeBox from '../Textarea';
import { API_URL } from '../../Constants/Constants';
import axios from 'axios';

function Dms() {
    const [ selectedDM, setSelectedDM ] = useState('');
    const [ body, setBody ] = useState('');
    const { userBase, userHeaders, setIsLoadingMsgs } = useData();

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
            <h1>{selectedDM !== '' ? `${IdDisplay.id}: ${selectedDM}`:'Direct Messages'}</h1>
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
    const { messages, user, userBase } = useData();
    const { selectedDM, handleDMSelect } = props;

    const uniqueSenders = Array.from(
        new Set(messages
            .flatMap((msg) => [
            msg.sender.email === user.data.email ? '' : msg.sender.email,
            msg.receiver.email === user.data.email ? '' : msg.receiver.email])
            .filter((email) => email !== ''))
    )
    
    return (
        <div className='dms-renderlist'>
            <div className='msg-list'>
                {uniqueSenders
                .map((user,index) => (
                    <p key={index}
                    onClick={() => handleDMSelect(user)}
                    className={user === selectedDM ? 'selected' : ''}>{user}</p>
                ))}
            </div>
            <div className='buttons'>
                {/* <button onClick={() => handleDMSelect('')}>Erase</button> */}
                <button
                onClick={() => handleDMSelect('newMsg')}
                >Send to New</button>
            </div>
        </div>
    )
}

function RenderDMBox(props) {
    const { messages, user } = useData();
    const { selectedDM, body, setBody, handleSend } = props
    const msgContainerRef = useRef(null);

    useEffect(() => {
        if (msgContainerRef.current) {
            msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight
        }
    }, [selectedDM, messages])
    
    return (
        <div className='dm-msgbox-Container'>
        <div className='dm-msgbox' ref={msgContainerRef}>
            {messages
            .filter((msgObj) => msgObj.sender.email === selectedDM || msgObj.receiver.email === selectedDM)
            .map((msg) => (
                <div key={msg.id}
                className={msg.sender.email === user.data.email ? 'dm-user' : 'dm-other'}>
                <p>{msg.body}</p>
                <span>{msg.sender.email}</span>
                </div>
            ))}
        </div>
        <TypeBox body={body} setBody={setBody} handleSend={handleSend}/>
        </div>
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