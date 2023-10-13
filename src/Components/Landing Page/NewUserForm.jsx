import './NewUserForm.css'
import { useData } from '../../Context/DataProvider'
import { useState } from 'react';

function NewUserForm() {
    const { handleAddNewUser, userData, handleActiveModal } = useData();
    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ nickName, setNickName ] = useState('')
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ email, setEmail ] = useState('')
    
    const handleFormSubmit = (e) => {
        e.preventDefault();

        const isUnique = () => {
            const userNameExists = userData.some((user) => user.username.toLowerCase() === username.toLowerCase())
            const emailExists = userData.some((user) => user.email.toLowerCase() === email.toLowerCase())

            return !userNameExists && !emailExists;
        }

        const newUser = {
            username: username,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName,
            nickName, nickName,
            createdChannels: [],
            joinedChannels: [],
            messages: []
        }
        if (isUnique()) {
        handleAddNewUser(newUser);
        alert(`Account Created. Welcome ${firstName}. Please Login to continue`)
        setFirstName('');
        setLastName('');
        setNickName('');
        setUsername('');
        setPassword('');
        setEmail('');
        handleActiveModal('');
        console.table(userData);
        } else {
            alert(`Username and/or Email is already taken`);
            setEmail('');
            setUsername('')
        }
    }

    return (
        <form className="newUser-form"
        onSubmit={handleFormSubmit}>
            <div className='field-box'>
                <fieldset>
                    <legend>Personal Information</legend>
                    <label>First Name</label>
                    <input type='text'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)} 
                    required/>
                    <label>Last Name</label>
                    <input type='text'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required/>
                    <label>Nick Name</label>
                    <input type='text' 
                    value={nickName}
                    onChange={(e) => setNickName(e.target.value)}
                    required/>
                </fieldset>
                <fieldset>
                    <legend>Login Information</legend>
                    <label>Username</label>
                    <input type='text' 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required />
                    <label>Password</label>
                    <input type='text' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required/>
                    <label>Email Address</label>
                    <input type='email' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required/>
                </fieldset>
            </div>
            <input type="submit" />
            <button onClick={() => handleActiveModal('')}>back</button>
        </form>
    )
}

export default NewUserForm