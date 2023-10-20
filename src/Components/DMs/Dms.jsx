import './Dms.css'
import { useData } from '../../Context/DataProvider'
import { useState } from 'react';
import TypeBox from '../Textarea';
import { API_URL } from '../../Constants/Constants';
import axios from 'axios';

function Dms() {
    const [ selectedDM, setSelectedDM ] = useState('');
    const [ body, setBody ] = useState('');
    const { userBase, userHeaders } = useData();

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

            alert(`Message Sent`)
            setBody('');
        } catch(error) {
            alert(error)
        }
    }

    return (
        <div className='Dms-CONTAINER'>
            <h1>{selectedDM !== '' ? `Viewing messages from ${selectedDM}`:'DMs Page'}</h1>
            <RenderList handleDMSelect={handleDMSelect} selectedDM={selectedDM}/>
            {selectedDM !== '' ? (
            <>
            <RenderDMBox selectedDM={selectedDM}/>
            <TypeBox body={body} setBody={setBody} handleSend={handleSend}/>
            </>
            ) : null}
        </div>
    )
}

function RenderList(props) {
    const { messages, user, userBase } = useData();
    const { selectedDM, handleDMSelect } = props;

    const uniqueSenders = Array.from(
        new Set(messages
            .map((msg) => 
            msg.sender.email === user.data.email ? '' : msg.sender.email)
            .filter((email) => email !== ''))
    )
    
    return (
        <div>
            {uniqueSenders
            .map((user,index) => (
                <p key={index}
                onClick={() => handleDMSelect(user)}>{user}</p>
            ))}
            <button onClick={() => handleDMSelect('')}>Erase</button>
            {/* <button onClick={() => {
                const convertID = userBase.find((user) => user.email === selectedDM);

                console.log(convertID.id)
            }}>Test</button> */}
        </div>
    )
}

function RenderDMBox(props) {
    const { messages, user } = useData();
    const { selectedDM } = props
    
    return (
        <div className='dm-msgbox'>
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
    )
}

export default Dms