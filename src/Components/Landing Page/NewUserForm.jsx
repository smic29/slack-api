import './NewUserForm.css'
import { useData } from '../../Context/DataProvider'
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../Constants/Constants';

function NewUserForm() {
    const { handleActiveModal } = useData();
    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ nickName, setNickName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ confirmPw, setConfirmPw ] = useState('')
    
    const handleFormSubmit = async(e) => {
        e.preventDefault();

        const newUser = {
            name: firstName + '' + lastName,
            nickname: nickName,
            email: email,
            password: password,
            password_confirmation: confirmPw
        }
        
        const url = `${API_URL}/auth/`

        try {
            const response = await axios.post(
                url, newUser
            )

            alert(`Account Successfully created. Welcome ${nickName}!`)
        } catch (error) {
            const errorMsg = error.response.data;
            alert(`${errorMsg.errors.full_messages}`)
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
                    <label>Email</label>
                    <input type='email' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />
                    <label>Password</label>
                    <input type='text' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required/>
                    <label>Confirm Password</label>
                    <input type='text' 
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    required/>
                </fieldset>
            </div>
            <input type="submit" />
            <button onClick={() => handleActiveModal('')}>back</button>
        </form>
    )
}

export default NewUserForm