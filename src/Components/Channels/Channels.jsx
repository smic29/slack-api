import './Channels.css'
import { useData } from '../../Context/DataProvider'
import { useState } from 'react';

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

    return (
        <div>
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

function CreateChannel() {
    return (
        <div>
            <form>
                User will create a channel here
            </form>
        </div>
    )
}

export default Channels