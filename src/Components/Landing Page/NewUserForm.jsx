import './NewUserForm.css'
import { useData } from '../../Context/DataProvider'
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../Constants/Constants';

function NewUserForm() {
    const { handleActiveModal } = useData();
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ confirmPw, setConfirmPw ] = useState('')
    
    const handleFormSubmit = async(e) => {
        e.preventDefault();

        const newUser = {
            email: email,
            password: password,
            password_confirmation: confirmPw
        }
        
        const url = `${API_URL}/auth/`

        try {
            const response = await axios.post(
                url, newUser
            )

            alert(`Account Successfully created. Welcome ${email}!`)
            handleActiveModal('')
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
                    <legend>Login Information</legend>
                    <label className='newUser-label'>Email</label>
                    <input type='email' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />
                    <label className='newUser-label'>Password</label>
                    <input type='text' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required/>
                    <label className='newUser-label'>Confirm Password</label>
                    <input type='text' 
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    required/>
                </fieldset>
            </div>
            <input 
            className='newUser-submit-button'
            type="submit" 
            value={'Create'}/>
            <span
            class='material-symbols-outlined' 
            onClick={() => handleActiveModal('')}>
                arrow_back_ios</span>
        </form>
    )
}

export default NewUserForm