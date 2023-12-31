import './ChannelMsgBox.css';
import FunctionService from '../Services/FunctionService';
import { API_URL } from '../Constants/Constants';
import axios from 'axios';
import TypeBox from './Textarea';
import { useData } from '../Context/DataProvider';
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ChannelMsgBox(props) {
    const { messages, channelOnScreen,
    selectedDM
    } = props;
    const { user, userHeaders, userBase, setIsLoadingMsgs,
    setHasSentAMsg } = useData();
    const [ body, setBody ] = useState('');
    const msgContainerRef = useRef(null);
    const location = useLocation();
    const pathName = location.pathname;
    const currentPage = FunctionService.determineCurrentPage(pathName);
    const isInitialMount = useRef(true);

    const handleSend = async() => {
        try {
            const url = `${API_URL}/messages`
            const convertID = userBase.find((user) => selectedDM === user.email);
            const sendData = {
                'receiver_id': currentPage === 'dms'? convertID.id : channelOnScreen,
                'receiver_class': currentPage === 'dms'? "User" : "Channel",
                'body': body,
            }
            const response = await axios.post(url, sendData, {headers:userHeaders})

            setBody('')
            setIsLoadingMsgs(true)
            setHasSentAMsg(true)
            // alert(`Message sent`)
        } catch(error) {
            alert(error)
        }
        
        
    }

    useEffect(() => {
        if (msgContainerRef.current) {
            msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight
        } 
    }, [messages])

    const groupedMessages = messages && FunctionService.groupMessagesByDate(messages);

    return (
        <div className='row max-height'>
            <div className='msg-box height-80' ref={msgContainerRef}>
                {/* <button onClick={() => console.log(messages)}>Debug</button> */}
                {messages && Object.entries(groupedMessages).map(([date, messages]) => (
                <fieldset key={date} className='chatbox-fieldset'>
                        <legend className={
                            FunctionService.formatDate(date) === 'Today' ? 
                            'date today'
                            :'date'}>
                            {FunctionService.formatDate(date)}
                        </legend>
                {currentPage === 'dms' ?
                messages
                .filter((msg) => msg.sender.email === selectedDM || msg.receiver.email === selectedDM)
                .map((message) => (
                    <div key={message.id}
                    className={
                        message.body.includes('..:') 
                        ? 'system-msg'
                        : message.sender.id === user.data.id 
                        ? 'user' 
                        : 'other'
                        }>
                        {message.body.includes("..:") ? (
                            <>
                            {message.body.replace('..:','')}
                            </>
                        ) : (
                        <>
                            {message.body}
                            <span>{message.sender.email}</span>
                        </>
                        )}
                    </div>
                ))
                :messages.map((message) => (
                    <div key={message.id}
                    className={
                        message.body.includes('..:') 
                        ? 'system-msg'
                        : message.sender.id === user.data.id 
                        ? 'user' 
                        : 'other'
                        }>
                        {message.body.includes("..:") ? (
                            <>
                            {message.body.replace('..:','')}
                            </>
                        ) : (
                        <>
                            {message.body}
                            <span>{message.sender.email}</span>
                        </>
                        )}
                    </div>
                ))}
                </fieldset>
                ))}
            </div>
            <div className='row height-20'>
                {messages && <TypeBox 
                body={body}
                setBody={setBody}
                handleSend={handleSend}/>}
            </div>
        </div>
    )
}

export default ChannelMsgBox;