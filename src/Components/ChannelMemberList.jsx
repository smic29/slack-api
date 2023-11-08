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
            <button className='channel-add-btn'
            onClick={handleAddUserClick}>
                {isAddingUser ? 'Back' : 'Add a User'}</button>
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
                <span class="material-symbols-outlined"
                onClick={handleAddNewChMember}>
                add
                </span>
            </div>
            )}
        </div>
    )
}

export default ChannelMemberList