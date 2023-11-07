import './ChannelMsgBox.css';
import FunctionService from '../Services/FunctionService';
import { API_URL } from '../Constants/Constants';
import axios from 'axios';
import TypeBox from './Textarea';
import { useData } from '../Context/DataProvider';
import { useState, useRef, useEffect } from 'react';

function ChannelMsgBox(props) {
    const { messages, setHasSentAMsg, channelOnScreen } = props;
    const { user, userHeaders } = useData();
    const [ body, setBody ] = useState('');
    const msgContainerRef = useRef(null);

    const handleSend = async() => {
        try {
            const url = `${API_URL}/messages`
            const sendData = {
                'receiver_id': channelOnScreen,
                'receiver_class': "Channel",
                'body': body,
            }
            const response = await axios.post(url, sendData, {headers:userHeaders})

            setBody('')
            setHasSentAMsg(true);
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

    const groupedMessages = FunctionService.groupMessagesByDate(messages);

    return (
        <div className='channel-chatbox'>
            <div className='msg-box' ref={msgContainerRef}>
                {/* <button onClick={() => console.log(messages)}>Debug</button> */}
                {Object.entries(groupedMessages).map(([date, messages]) => (
                    <fieldset key={date} className='chatbox-fieldset'>
                        <legend className={
                            FunctionService.formatDate(date) === 'Today' ? 
                            'date today'
                            :'date'}>
                            {FunctionService.formatDate(date)}
                        </legend>
                {messages.map((message) => (
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
            <TypeBox 
            body={body}
            setBody={setBody}
            handleSend={handleSend}/>
        </div>
    )
}

export default ChannelMsgBox;