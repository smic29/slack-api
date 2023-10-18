import { useEffect, useState } from "react";
import { useData } from "../../Context/DataProvider"
import './Home.css'
import axios from "axios";
import { API_URL, formatTimestamp } from "../../Constants/Constants";

function Home() {
    const { user, userHeaders } = useData();
    const [ channelData, setChannelData ] = useState([]);
    const [ selectedChannel, setSelectedChannel ] = useState('');

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
            } catch (error) {
                alert(`Failed: ${error.response.errors}`)
                // console.log(userHeaders)
            }
        }
        fetchChannels();
    }, [])

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
            </fieldset>
        </div>
    )
}

export default Home