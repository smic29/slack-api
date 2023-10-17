import { useEffect, useState } from "react";
import { useData } from "../../Context/DataProvider"
import './Home.css'
import axios from "axios";

function Home() {
    const { user, userHeaders } = useData();
    const [ channelData, setChannelData ] = useState([]);

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const url = 'http://206.189.91.54/api/v1/channels'
                const response = await axios.get(url, {headers: userHeaders})

                setChannelData(response.data.data)
                // console.log(response.data.data)
            } catch (error) {
                alert(`Failed: ${error}`)
                // console.log(userHeaders)
            }
        }
        fetchChannels();
    }, [])

    return (
        <div className="home-container">
            <h1>Welcome to your home page, {user.name}!</h1>
            <fieldset className="information-box">
                <legend>Information</legend>
            </fieldset>
            <fieldset>
                <legend>Channels</legend>
                {channelData.length > 0 ? (
                <>
                <p>Total number of Channels: {channelData.length}</p>
                {channelData.map(channel => (
                    <div key={channel.id}>
                    <p>Channel: {channel.name}</p>
                    <span>Channel ID: {channel.id}</span>
                    <span>Created: {channel.created_at}</span>
                    <span>Last Update: {channel.updated_at}</span>
                    </div>
                ))}
                </>
                ):(
                    <p>Page is Loading...</p>
                )
                }
            </fieldset>
            <fieldset>
                <legend>Messages</legend>
            </fieldset>
        </div>
    )
}

export default Home