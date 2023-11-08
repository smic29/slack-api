import './Channels.css'
import { useData } from '../../Context/DataProvider'
import { useEffect, useState } from 'react';
import { API_URL } from '../../Constants/Constants';
import axios from 'axios';
import ChannelMsgBox from '../ChannelMsgBox';

function Channels() {
    const { userHeaders,
    setModalPosition, setIsModalOpen, setMobileModal, memberList, setMemberList,
    currentChannel, setIsCurrentChannel, hasSentAMsg, setHasSentAMsg,
    channelOnScreen, setChannelOnScreen 
    } = useData();
    const [ channelData, setChannelData ] = useState([]);
    const [ messages, setMessages ] = useState([]);
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

    const handleModalClickMembers = (e) => {
        const buttonRect = e.target.getBoundingClientRect();
        const position = {
            top: buttonRect.top + 30 + 'px',
            left: buttonRect.left - 290 + 'px',
        };

        setMobileModal('channelMembers');
        setModalPosition(position);
        setIsModalOpen(true);
    }

    return (
        <div className='channel-page-container'>
            <div className='channelpage-one'>
                <nav className='msg-box-nav'>
                    <h1>{channelOnScreen !== '' ? `CH ID: ${channelOnScreen}` : 'Channels'}</h1>
                    {channelOnScreen !== '' && 
                    <div className='channel-headerbox'
                    onClick={handleModalClickMembers}>
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
                                chevron_right
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
        </div>
    )
}

export default Channels