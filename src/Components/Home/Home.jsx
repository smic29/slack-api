import { useEffect, useState } from "react";
import { useData } from "../../Context/DataProvider"
import './Home.css'
import axios from "axios";
import { API_URL, formatTimestamp } from "../../Constants/Constants";

function Home() {
    const { user, userHeaders, userBase, messages, setMessages } = useData();
    const [ channelData, setChannelData ] = useState([]);
    const [ selectedChannel, setSelectedChannel ] = useState('');
    const [ channelMembers, setChannelMembers ] = useState('');

    const handleChannelSelect = (e) => {
        setSelectedChannel(e.target.value);
    }

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const url = `${API_URL}/channels`
                const response = await axios.get(url, {headers: userHeaders})

                setChannelData(response.data.data)
                // console.log(response.data)

                if (selectedChannel) {
                    const membersUrl = `${API_URL}/channels/${selectedChannel}}`;
                    const membersResponse = await axios.get(membersUrl, { headers: userHeaders })

                    setChannelMembers(membersResponse.data.data.channel_members.length);
                }

            } catch (error) {
                alert(`Failed: ${error.response.errors}`)
                // console.log(userHeaders)
            }
        }

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
        }
        fetchChannels();
        fetchMsgs();
    }, [selectedChannel])

    return (
        <div className="home-container">
            <h1>Welcome to your home page! </h1>
            <fieldset className="information-box">
                <legend>Information</legend>
                <p>You are signed in as: {user.data.email}</p>
                <p>User ID: {user.data.id}</p>
            </fieldset>
            <fieldset>
                <legend>Channels</legend>
                {channelData && channelData.length > 0 ? (
                <div className="channel-list">
                    <p>You have {channelData.length} Channels: </p>
                    <select value={selectedChannel} 
                    onChange={handleChannelSelect}>
                    <option value='' 
                    disabled>
                        Select a channel to display details</option>
                    {channelData.map((channel) => (
                        <option key={channel.id} value={channel.id}>
                            {channel.name}
                        </option>
                    ))}
                    </select>
                </div>
                ) : ( 
                    <p>No Channels to display. Create or Join one.</p>
                )}
                <div>
                    {selectedChannel !== '' && (
                        <div>
                            <p>Channel ID: {selectedChannel}</p>
                            {channelData.map((channel) => {
                                if (channel.id === parseInt(selectedChannel)) {
                                    return (
                                        <div key={channel.id}>
                                            <p>Created: {formatTimestamp(channel.created_at)}</p>
                                            <p>Last Update: {formatTimestamp(channel.updated_at)}</p>
                                            <p>Total Members: {channelMembers}</p>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    )}
                </div>
            </fieldset>
            <fieldset>
                <legend>Messages</legend>
                <div>
                    {messages.length > 0 ? messages.filter((msg) => msg.sender.id !== user.data.id)
                    .map((msg) =>( 
                        <>
                        <p key={msg.id}><strong>{msg.body}</strong> from {msg.sender.email}</p>
                        <span>{formatTimestamp(msg.created_at)}</span>
                        </>
                        )) : 'No Messages yet'}
                </div>
            </fieldset>
        </div>
    )
}

export default Home