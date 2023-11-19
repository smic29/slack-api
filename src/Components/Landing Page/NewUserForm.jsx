// import './NewUserForm.css'
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
        <form className="p-3"
        onSubmit={handleFormSubmit}>    
            <h1 className='h4'>Sign Up Sheet</h1>
            <div className='input-group mb-3'>
                <i className='material-symbols-outlined input-group-text user-select-none'>
                    alternate_email
                </i>
                <div className='form-floating'>
                    <input
                    id="emailInput"
                    className='form-control' 
                    type='email' 
                    value={email}
                    placeholder='Email Address'
                    onChange={(e) => setEmail(e.target.value)}
                    required />
                    <label 
                    htmlFor='emailInput'>
                        Email Address
                    </label>
                </div>
            </div>

            <div className='input-group'>
                <i className='material-symbols-outlined input-group-text user-select-none'>
                    key
                </i>
                <div className='form-floating'>
                    <input 
                    id='pwInput'
                    className='form-control'
                    type='text' 
                    value={password}
                    placeholder='Enter a password'
                    onChange={(e) => setPassword(e.target.value)}
                    required/>
                    <label htmlFor='pwInput'>
                        Password
                    </label>
                </div>
            </div>
            <div className='form-text mb-2'>
                Password must be atleast 8 characters
            </div>

            <div className='input-group mb-3'>
                <i className='material-symbols-outlined input-group-text user-select-none'>
                    {password !== '' && password === confirmPw ? 'lock_open' : 'lock'}
                </i>
                <div className='form-floating'>    
                    <input 
                    id='confirmInput'
                    className={`form-control 
                    ${password !== '' && confirmPw !=='' ? 
                    password === confirmPw ? 'is-valid': 'is-invalid' : ''}`}
                    type='text' 
                    value={confirmPw}
                    placeholder='confirm password'
                    onChange={(e) => setConfirmPw(e.target.value)}
                    required/>
                    <label htmlFor='confirmInput'>Confirm Password</label>
                </div>
            </div>
            
            <input 
            className={`newUser-submit-button 
            ${email === '' || password === '' || password !== confirmPw ? 
            'disabled' : ''}`}
            type="submit" 
            value={'Create'}
            data-testid='createButton'/>
            <span
            class='material-symbols-outlined' 
            data-testid='backButton'
            onClick={() => handleActiveModal('')}>
                arrow_back_ios</span>
        </form>
    )
}

export default NewUserForm