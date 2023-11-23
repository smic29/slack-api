import { useEffect, useState } from "react";
import { useData } from "../../Context/DataProvider"
import './Home.css'
import axios from "axios";
import { API_URL, timeSince } from "../../Constants/Constants";
import Loading, { LoadingLine } from "../Loading";
import { useNavigateContext } from "../Navigation/Navigation";

function Home() {
    const { user, userHeaders, messages, isLoadingMsgs,
        setIsExpanded, setChannelOnScreen, setIsCurrentChannel, setSelectedDM,
        isLoadingUB 
     } = useData();
    const navigate = useNavigateContext();
    const [ channelData, setChannelData ] = useState([]);
    const [ selectedChannel, setSelectedChannel ] = useState('');
    const [ channelMembers, setChannelMembers ] = useState('');
    const [ selectedBox, setSelectedBox ] = useState('');

    const handleBoxClick = (id) => {
        setSelectedBox(id);
    }

    const handleGotoConvo = (email) => {
        setSelectedDM(email);
        navigate('dms');
    }

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
        <div className="container-fluid" 
        id="Home-container">
            <div className="row text-start" id="Home-navbar">
                <h1 className="mt-1">Dashboard </h1>
                {isLoadingMsgs && <LoadingLine />}
            </div>
            <div className="row p-5 g-0">
                <div className="col-6 border p-3 rounded text-start">
                    <h4 className="mb-3 border rounded-pill text-center">Information</h4>
                    <p className="d-flex justify-content-between">You are signed in as: <strong className="me-3">{user.data.email}</strong></p>
                    <p className="d-flex justify-content-between">User ID: <strong className="me-3">{user.data.id}</strong></p>
                </div>
                <div className="col-6 border p-3 rounded">
                    <h4 className="mb-3 border rounded-pill text-center">Channels</h4>
                    {channelData && channelData.length > 0 ? (
                    <div className="row mb-2">
                        <p className="">You have 
                            <span className="badge text-bg-success">{channelData.length}</span> 
                            Channels: </p>
                        <select className="form-select text-center"
                        value={selectedChannel} 
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
                            <div className="text-start">
                                <p className="m-0">Channel ID: {selectedChannel}</p>
                                {channelData.map((channel) => {
                                    if (channel.id === parseInt(selectedChannel)) {
                                        return (
                                            <div key={channel.id}>
                                                <p className="m-0">Created: {timeSince(channel.created_at)}</p>
                                                <p>Total Members: {channelMembers}</p>
                                                <span 
                                                onClick={() => handleGotoChannel(channel.id)}
                                                className="go-to-channel-btn text-center border rounded-pill">
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
                </div>
                <div className="home-recentmsg-box border p-3 rounded mt-2">
                    <h4 className="text-start border rounded-pill mb-3 text-center">Recent Messages</h4>
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
                            <div className="home-rmMsgBox" key={msg.id}
                            onMouseEnter={() => handleBoxClick(msg.sender.email)}
                            onMouseLeave={() => handleBoxClick('')}>
                            <legend className="rmMsgBox-legend">{msg.sender.email}</legend>
                            <p>{msg.body}</p>
                            <span>{timeSince(msg.created_at)}</span>
                            {selectedBox === msg.sender.email && 
                            <button
                            onClick={() => handleGotoConvo(msg.sender.email)} 
                            className="go-to-convo-btn">
                                Go to Conversation</button>}
                            </div>
                        ))
                            : 'No Messages yet'}
                    </div>
                </div>
            </div>             
        </div>
    )
}

export default Home