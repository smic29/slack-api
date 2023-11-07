import './Channels.css'
import { useData } from '../../Context/DataProvider'
import { useEffect, useRef, useState } from 'react';
import { API_URL } from '../../Constants/Constants';
import axios from 'axios';
import TypeBox from '../Textarea';
import FunctionService from '../../Services/FunctionService';

function Channels() {
    const { userHeaders, userBase, user,
    setModalPosition, setIsModalOpen, setMobileModal } = useData();
    const [ currentChannel, setIsCurrentChannel ] = useState('');
    const [ channelOnScreen, setChannelOnScreen ] = useState('');
    const [ channelData, setChannelData ] = useState([]);
    const [ messages, setMessages ] = useState([]);
    const [ hasSentAMsg, setHasSentAMsg ] = useState(false);
    const [ memberList, setMemberList ] = useState([]);
    const [ isExpanded, setIsExpanded ] = useState(false);

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

    const handleModalClicks = (e) => {
        const position = {
            top: 30 + '%',
            left: 30 + '%',
        }

        setMobileModal('createChannel');
        setModalPosition(position);
        setIsModalOpen(true);
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
                setNewChMemberId('');
            } else {
                alert(`User added to channel Ch ID: ${channelOnScreen}`);
                setHasSentAMsg(true);
                setIsAddingUser(false);
                setNewChMemberId('')

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
            <div className='channelpage-one'>
                <nav className='msg-box-nav'>
                    <h1>{channelOnScreen !== '' ? `CH ID: ${channelOnScreen}` : 'Channels'}</h1>
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
                    <div className='create-channel'
                    onClick={() => setIsExpanded(!isExpanded)}>
                        <span class='material-symbols-outlined'>
                            {isExpanded ? 'expand_circle_down' : 'expand_circle_right'}
                        </span>
                        <span 
                        >Your Channels ({channelData.length})</span>
                    </div>
                    {isExpanded && channelData.map((channel) => (
                        <div key={channel.id} value={channel.id}
                        onClick={() => handleChannelSelect(channel.id)}
                        className={channelOnScreen === channel.id ? 'ch-list selected' : 'ch-list'}>
                            <span class={channelOnScreen === channel.id ? 'material-symbols-outlined show' : 'material-symbols-outlined'}>
                                check_circle
                            </span>
                            <span>{channel.name}</span>
                        </div>
                    ))}
                    <div className='create-channel two'
                    onClick={handleModalClicks}>
                        <span class="material-symbols-outlined">
                        add_circle
                        </span>
                        <span>Add a Channel</span>
                    </div>
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

export default Channels