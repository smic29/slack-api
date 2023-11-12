import { useEffect, useState } from "react";
import { useData } from "../../Context/DataProvider"
import './Home.css'
import axios from "axios";
import { API_URL, formatTimestamp, timeSince } from "../../Constants/Constants";
import Loading from "../Loading";
import { useNavigateContext } from "../Navigation/Navigation";

function Home() {
    const { user, userHeaders, messages, isLoadingMsgs,
        setIsExpanded, setChannelOnScreen, setIsCurrentChannel 
     } = useData();
    const navigate = useNavigateContext();
    const [ channelData, setChannelData ] = useState([]);
    const [ selectedChannel, setSelectedChannel ] = useState('');
    const [ channelMembers, setChannelMembers ] = useState('');

    const handleChannelSelect = (e) => {
        setSelectedChannel(e.target.value);
    }

    const handleGotoChannel = (chID) => {
        setIsExpanded(true);
        setChannelOnScreen(chID);
        setIsCurrentChannel('displayChannel');
        navigate('channels');
    }

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const url = `${API_URL}/channels`
                const response = await axios.get(url, {headers: userHeaders})

                setChannelData(response.data.data)

                if (selectedChannel) {
                    const membersUrl = `${API_URL}/channels/${selectedChannel}}`;
                    const membersResponse = await axios.get(membersUrl, { headers: userHeaders })

                    setChannelMembers(membersResponse.data.data.channel_members.length);
                }

            } catch (error) {
                alert(`Failed: ${error.response.errors}`)
            }
        }
        fetchChannels();
    }, [selectedChannel])

    return (
        <div className="home-container">
            <div className="home-nav">
                <h1>Dashboard </h1>
            </div>
            <div className="home-info-container">
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
                        Select a channel</option>
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
                                            <p>Total Members: {channelMembers}</p>
                                            <span 
                                            onClick={() => handleGotoChannel(channel.id)}
                                            className="go-to-channel-btn">
                                                Go to Channel
                                            </span>
                                        </div>
                                    )
                                }
                                return null;
                            })}
                        </div>
                    )}
                </div>
            </fieldset>
            <fieldset className="home-recentmsg-box">
                <legend>Recent Messages</legend>
                <div className="loading-box-position">
                    {
                    isLoadingMsgs
                    ? <Loading /> 
                    :messages.length > 0 ? 
                    Object.values(
                        messages
                          .filter((msg) => msg.sender.id !== user.data.id)
                          .reduce((uniqueMessages, msg) => {
                            if (!uniqueMessages[msg.sender.email] || msg.created_at > uniqueMessages[msg.sender.email].created_at) {
                              uniqueMessages[msg.sender.email] = msg;
                            }
                            return uniqueMessages;
                          }, {})
                      ).map((msg) => (
                        <div className="home-rmMsgBox" key={msg.id}>
                          <legend className="rmMsgBox-legend">{msg.sender.email}</legend>
                          <p>{msg.body}</p>
                          <span>{timeSince(msg.created_at)}</span>
                        </div>
                      ))
                        : 'No Messages yet'}
                </div>
            </fieldset>
            </div>             
        </div>
    )
}

export default Home