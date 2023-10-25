import './CreateChannel.css'
import { API_URL } from '../../Constants/Constants';
import { useState } from 'react';
import { useData } from '../../Context/DataProvider';
import axios from 'axios';

function CreateChannel() {
    const [ channelName, setChannelName ] = useState('');
    const [ userIds, setUserIds ] = useState([]);
    const [ idInput, setIdInput ] = useState('');
    const { userHeaders, userBase, user } = useData();

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
            } else {
                alert(`${response.data.errors}`)
            }
        } catch (error) {
            alert(`${error.response.data.errors}`)
        }
    }

    const doesUserExist = () => {
        if (idInput !== '') {
            const acc = userBase.find((accUser) =>
            parseInt(idInput) === accUser.id)

            if (acc) {
                if (userIds.includes(idInput)){
                    return `User is already on the list`
                } else if (acc.id !== user.data.id) {
                    return acc.email;
                }
                return 'This is you omegalul'
            }
        }
        return 'User does not exist.'
    }

    const returnEmail = (id) => {
        const email = userBase.find((acc) => acc.id === parseInt(id))

        return email.email
    }

    return (
        <div className='create-channel-box'>
            <form className='channel-add-form'
            onSubmit={handleSubmit}>
                <fieldset className='channel-field'>
                    <legend>Channel Name</legend>
                    <input type='text'
                    value={channelName}
                    placeholder='CH name'
                    maxLength={15}
                    onChange={(e) => setChannelName(e.target.value)}
                    required/>
                </fieldset>
                <fieldset className='addID-field'>
                    <legend>Add Channel Users</legend>
                    <div className='addID-inputBox'>
                        <input 
                        type='text'
                        value={idInput}
                        maxLength={4}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            if (/^[0-9]*$/.test(inputValue)){
                            setIdInput(e.target.value)
                            }
                        }}
                        placeholder='Enter a user ID'
                        pattern="[0-9]*"/>
                        <span class={`material-symbols-outlined ${
                            idInput === '' || 
                            parseInt(idInput) === user.data.id ||
                            doesUserExist() === 'User does not exist.'||
                            userIds.includes(idInput) 
                            ? 'disabled' : ''
                        }`} 
                        onClick={handleAddId}>
                            add</span>
                        <span className='addID-checker'>
                            {idInput !== '' && doesUserExist()}
                            </span>
                    </div>
                    <div className='users-to-add'>
                    {userIds.map((userId) => (
                        <div key={userId}>
                            <span>{returnEmail(userId)}</span>
                            <span class='material-symbols-outlined'
                            onClick={() => handleDelId(userId)}>
                                remove</span>
                        </div>
                    ))}
                    </div>
                </fieldset>
                <input type='submit'
                className='create-channel-button'
                value='Create Channel'/>
            </form>
            {/* <button>Back</button> */}
        </div>
    )
}

export default CreateChannel;