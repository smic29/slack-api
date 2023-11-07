import './ChannelMemberList.css';
import { useData } from '../Context/DataProvider';

function ChannelMemberList(props) {
    const { 
         
        isAddingUser, 
        setNewChMemberId, 
        newChMemberId, 
        handleAddNewChMember,
        handleAddUserClick,
    } = props;
    const { userBase, memberList } = useData();

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