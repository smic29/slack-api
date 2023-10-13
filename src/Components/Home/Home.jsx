import { useData } from "../../Context/DataProvider"
import './Home.css'

function Home() {
    const { user } = useData();

    return (
        <div className="home-container">
            <h1>Welcome to your home page, {user.username}!</h1>
            <fieldset className="information-box">
                <legend>Information</legend>
                <p>Name: {user.firstName} {user.lastName}</p>
                <p>Nickname: {user.nickName} </p>
                <p>Username: {user.username} </p>
                <p>Email: {user.email} </p>
            </fieldset>
            <fieldset>
                <legend>Channels</legend>
                <p>Created Channels: {user.createdChannels.length === 0 ? 'No Created Channels, Create one!' : user.createdChannels.length}</p>
                <p>Joined Channels: {user.joinedChannels.length === 0 ? 'No joined channels. Go and join one!' : user.joinedChannels.length}</p>
            </fieldset>
            <fieldset>
                <legend>Messages</legend>
                <p>{user.messages.length === 0 ? 'No Direct Messages yet' : user.messages.length}</p>
            </fieldset>
        </div>
    )
}

export default Home