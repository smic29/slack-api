import './ChannelMemberList.css';
import { useData } from '../Context/DataProvider';
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../Constants/Constants';

function ChannelMemberList(props) {
    const { userBase, memberList, channelOnScreen, user, userHeaders,
        setHasSentAMsg
    } = useData();
    const [ isAddingUser, setIsAddingUser ] = useState(false);
    const [ newChMemberId, setNewChMemberId ] = useState('');

    const handleAddUserClick = () => {
        setIsAddingUser(!isAddingUser)
    }

    const handleAddNewChMember = async(e) => {
        e.preventDefault();

        try {
            const newUser = {
                "id": channelOnScreen,
                "member_id": newChMemberId
            }
            const url = `${API_URL}/channel/add_member`

            const response = await axios.post(url, newUser, { headers: userHeaders })
            if (response.data.errors){    
                alert(`${response.data.errors}`)
                setNewChMemberId('');
            } else {
                alert(`User added to channel Ch ID: ${channelOnScreen}`);
                setHasSentAMsg(true);
                setIsAddingUser(false);
                setNewChMemberId('')

                try {
                    const sysMsgUrl = `${API_URL}/messages`
                    const newUserEmail = userBase.find((user) => user.id === parseInt(newChMemberId))
                    const sysMsg = {
                        'receiver_id': channelOnScreen,
                        'receiver_class': "Channel",
                        'body': `..: ${user.data.email} has added ${newUserEmail.email} to the Channel`
                    }
                    await axios.post (sysMsgUrl, sysMsg, {headers : userHeaders})
                } catch(error) {
                    alert(error)
                }
            }
        } catch(error) {
            alert(`${error}`)
        }
    }

    const doesUserExist = () => {
        if (newChMemberId !== ''){
            const user = userBase.find((user) => 
                parseInt(newChMemberId) === user.id
            )

            if(user){
                if (memberList.find(member => member.user_id === user.id)) {
                    return 'Already in this channel'
                } else {
                    return user.email;
                }
            }
        } 
        return 'Does not exist'
    }

    return (
        <div className='channel-member-list'>
            {memberList.map((member) => {
                const user = userBase.find((user) => user.id === member.user_id);

                if(user) {
                    return (
                        <div key={member.id} className='member-box'>
                            <span className='member-id'>{user.id}</span> 
                            <span class='member-email'>{user.email}</span>
                        </div>
                    )
                }
            })}
            <div className='add-member-box'>
            <button className='channel-add-btn material-symbols-outlined'
            onClick={handleAddUserClick}>
                {isAddingUser ? 'keyboard_backspace' : 'person_add'}</button>
            {isAddingUser && (
            <div className='new-channel-member-box'>
                <input type='text'
                placeholder='User ID'
                maxLength={4}
                value={newChMemberId}
                onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^[0-9]*$/.test(inputValue)){
                        setNewChMemberId(e.target.value)
                    }
                }} />
                <span className={`material-symbols-outlined 
                ${newChMemberId !== '' ? 
                doesUserExist() === 'Does not exist' ||
                doesUserExist() === 'Already in this channel' ? 
                'cantadd' : 'canadd'
                : ''
                }`}
                onClick={handleAddNewChMember}>
                add
                </span>
                <p className='add-member-isExisting'>
                    {newChMemberId !== '' && doesUserExist()}
                </p>
            </div>
            )}
            </div>
        </div>
    )
}

export default ChannelMemberList