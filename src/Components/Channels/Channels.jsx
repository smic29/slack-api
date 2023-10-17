import './Channels.css'
import { useData } from '../../Context/DataProvider'
import { useState } from 'react';
import { API_URL } from '../../Constants/Constants';
import axios from 'axios';

function Channels() {
    const { user } = useData();
    const [ currentChannel, setIsCurrentChannel ] = useState('');

    function RenderChannel() {
        switch (currentChannel) {
            case 'createChannel':
                return <CreateChannel />
            default:
                return null;
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

    return (
        <div className='channel-page-container'>
            <div>
                <h1>I am the Channels Page</h1>
                <span className='create-channel'
                onClick={() => setIsCurrentChannel('createChannel')}>
                    Create a Channel
                </span>
            </div>
            <RenderChannel />
        </div>
    )
}

function ChannelMsgBox() {
    return (
        <div className='channel-chatbox'>
                <div className='msg-box'>

                </div>
                <input type='textarea' />
            </div>
    )
}

export default Channels