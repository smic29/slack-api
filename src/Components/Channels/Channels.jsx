import './Channels.css'
import { useData } from '../../Context/DataProvider'
import { useEffect, useRef, useState } from 'react';
import { API_URL } from '../../Constants/Constants';
import axios from 'axios';
import TypeBox from '../Textarea';

function Channels() {
    const { userHeaders, userBase, user } = useData();
    const [ currentChannel, setIsCurrentChannel ] = useState('');
    const [ channelOnScreen, setChannelOnScreen ] = useState('');
    const [ channelData, setChannelData ] = useState([]);
    const [ messages, setMessages ] = useState([]);
    const [ hasSentAMsg, setHasSentAMsg ] = useState(false);
    const [ memberList, setMemberList ] = useState([]);

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const url = `${API_URL}/channels`
                const response = await axios.get(url, {headers: userHeaders})

                setChannelData(response.data.data)
            } catch (error) {
                alert(`Failed: ${error.response.errors}`)
            }

            if (channelOnScreen || hasSentAMsg ) {
                const msgUrl = `${API_URL}/messages?receiver_id=${channelOnScreen}&receiver_class=Channel`
                const msgResponse = await axios.get(msgUrl, { headers: userHeaders})
                
                const memberUrl = `${API_URL}/channels/${channelOnScreen}`
                const memberResponse = await axios.get(memberUrl, { headers: userHeaders})


                setMemberList(memberResponse.data.data.channel_members)
                setMessages(msgResponse.data.data);
                setHasSentAMsg(false)
            }
        }
        fetchChannels();
    }, [channelOnScreen, hasSentAMsg])


    function RenderChannel() {
        switch (currentChannel) {
            case 'createChannel':
                return <CreateChannel />
            case 'displayChannel':
                return <ChannelMsgBox messages={messages} 
                setHasSentAMsg={setHasSentAMsg}
                channelOnScreen={channelOnScreen}/>
            default:
                return null;
        }
    }

    const handleChannelSelect = (chId) => {
        const newSelectedChannel = chId;
        if (newSelectedChannel !== channelOnScreen){
            setChannelOnScreen(chId);
            setIsCurrentChannel('displayChannel')
        }
    }

    function CreateChannel() {
        const [ channelName, setChannelName ] = useState('');
        const [ userIds, setUserIds ] = useState([]);
        const [ idInput, setIdInput ] = useState('');
        const { userHeaders } = useData();

        const handleAddId = () => {
            if (!userIds.includes(idInput)) {
            setUserIds([...userIds, idInput])
            setIdInput('')
            } else {
                alert(`${idInput} has already been added`)
            }
        } 

        const handleDelId = (id) => {
            setUserIds(userIds.filter(userId => userId !== id))
            // console.log(userIds)
        }

        const handleSubmit = async(e) => {
            e.preventDefault();

            try {
                const response = await axios.post(`${API_URL}/channels`, {
                    "name":channelName,
                    "user_ids":userIds
                }, {headers: userHeaders})
                
                if (!response.data.errors){
                alert(`Channel ${channelName} has been created!`)
                setIsCurrentChannel('');
                } else {
                    alert(`${response.data.errors}`)
                }
            } catch (error) {
                alert(`${error.response.data.errors}`)
            }
        }

        return (
            <div className='create-channel-box'>
                <form className='channel-add-form'
                onSubmit={handleSubmit}>
                    <fieldset className='channel-field'>
                        <legend>Channel Name:</legend>
                        <input type='text'
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        required/>
                    </fieldset>
                    <fieldset className='addID-field'>
                        <legend>Add Channel Users</legend>
                        <input 
                        type='text'
                        value={idInput}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            if (/^[0-9]*$/.test(inputValue)){
                            setIdInput(e.target.value)
                            }
                        }}
                        placeholder='Enter a user ID'
                        pattern="[0-9]*"/>
                        <button onClick={handleAddId}
                        type='button'>Add</button>
                        <ul className='users-to-add'>
                        {userIds.map((userId) => (
                            <li key={userId}>
                                {userId}
                                <button onClick={() => handleDelId(userId)}
                                type='button'>Del</button>
                            </li>
                        ))}
                        </ul>
                    </fieldset>
                    <input type='submit'
                    value='Create Channel'/>
                </form>
                <button
                    onClick={() => setIsCurrentChannel('')}
                    className='channel-box-back-button'
                >Back</button>
            </div>
        )
    }

    const [ isAddingUser, setIsAddingUser ] = useState(false);
    const [ newChMemberId, setNewChMemberId ] = useState('');

    const handleAddUserClick = () => {
        setIsAddingUser(!isAddingUser)
    }

    const handleAddNewChMember = async(e) => {
        e.preventDefault();

        try {
            const newUser = {
                "id": channelOnScreen,
                "member_id": newChMemberId
            }
            const url = `${API_URL}/channel/add_member`

            const response = await axios.post(url, newUser, { headers: userHeaders })
            if (response.data.errors){    
                alert(`${response.data.errors}`)
                // console.log(newUser)
                setNewChMemberId('');
            } else {
                alert(`User added to channel Ch ID: ${channelOnScreen}`);
                setHasSentAMsg(true);
                setIsAddingUser(false);
                setNewChMemberId('')
                // console.log(response);

                try {
                    const sysMsgUrl = `${API_URL}/messages`
                    const newUserEmail = userBase.find((user) => user.id === parseInt(newChMemberId))
                    const sysMsg = {
                        'receiver_id': channelOnScreen,
                        'receiver_class': "Channel",
                        'body': `..: ${user.data.email} has added ${newUserEmail.email} to the Channel`
                    }
                    await axios.post (sysMsgUrl, sysMsg, {headers : userHeaders})
                } catch(error) {
                    alert(error)
                }
            }
        } catch(error) {
            alert(`${error}`)
        }
    }

    return (
        <div className='channel-page-container'>
            <div>
                <nav className='msg-box-nav'>
                    <h1>{channelOnScreen !== '' ? `CH ID: ${channelOnScreen}` : 'I am the Channels Page'}</h1>
                    {channelOnScreen !== '' && <div className='channel-headerbox'>
                        <span class="material-symbols-outlined">
                        group
                        </span>
                        <span><strong>{memberList.length}</strong></span>
                    </div>}
                </nav>
                { channelData && channelData.length > 0 ?
                (
                <div className='channel-channellist'>
                    <span className='create-channel'
                onClick={() => {
                    handleChannelSelect('')
                    setIsCurrentChannel('createChannel')
                    }}>
                    Create a Channel
                </span>
                    {channelData.map((channel) => (
                        <span key={channel.id} value={channel.id}
                        onClick={() => handleChannelSelect(channel.id)}
                        className={channelOnScreen === channel.id ? 'selected' : ''}>
                            {channel.name}
                        </span>
                    ))}
                </div>
                ) : (
                    <p>You have no channels yet</p>
                )
                }
            </div>
            <RenderChannel />
            {currentChannel !== '' && (
                <div className='channel-member-list'>
                    {memberList.map((member) => {
                        const user = userBase.find((user) => user.id === member.user_id);

                        if(user) {
                            return (
                                <span key={member.id}>
                                    {user.id}: {user.email}
                                </span>
                            )
                        }
                    })}
                    <button className='channel-add-btn'
                    onClick={handleAddUserClick}>
                        {isAddingUser ? 'Back' : 'Add a User'}</button>
                    {isAddingUser && (
                    <div className='new-channel-member-box'>
                        <input type='text'
                        placeholder='User ID'
                        value={newChMemberId}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            if (/^[0-9]*$/.test(inputValue)){
                                setNewChMemberId(e.target.value)
                            }
                        }} />
                        <span class="material-symbols-outlined"
                        onClick={handleAddNewChMember}>
                        add
                        </span>
                    </div>
                    )}
                </div>
            )}
        </div>
    )
}

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

    return (
        <div className='channel-chatbox'>
                <div className='msg-box' ref={msgContainerRef}>
                    {/* <button onClick={() => console.log(messages)}>Debug</button> */}
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
                </div>
                <TypeBox 
                body={body}
                setBody={setBody}
                handleSend={handleSend}/>
            </div>
    )
}

export default Channels