import { useData } from '../../Context/DataProvider'
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../Constants/Constants';
import { useEffect } from 'react';

function NewUserForm() {
    const { handleActiveModal } = useData();
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ confirmPw, setConfirmPw ] = useState('')
    const [ showPw, setShowPw ] = useState(false);

    const handleCheckboxSwitch = () => {
        setShowPw(!showPw);
    }
    
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

    useEffect (() => {
        'use strict'

        const forms = document.querySelectorAll('.needs-validation');

        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
    })

    return (
        <form className="p-3 needs-validation" noValidate
        onSubmit={handleFormSubmit}>    
            <h1 className='h4'>Sign Up Sheet</h1>
            <div className='input-group mb-3'>
                <span className='material-symbols-outlined input-group-text user-select-none'>
                    alternate_email
                </span>
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
                    <div className="invalid-feedback">
                        Please enter a valid email address
                    </div>
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
                    type={showPw ? 'text' : 'password'} 
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
                    type={showPw ? 'text' : 'password'} 
                    value={confirmPw}
                    placeholder='confirm password'
                    onChange={(e) => setConfirmPw(e.target.value)}
                    required/>
                    <label htmlFor='confirmInput'>Confirm Password</label>
                </div>
            </div>
            <div className="form-check form-switch d-flex justify-content-start mb-2">
                <input 
                type="checkbox" 
                className="form-check-input"
                id='NewUsercheckbox'
                checked={showPw}
                onChange={handleCheckboxSwitch}/>
                <label htmlFor="NewUsercheckbox" 
                className="form-check-label user-select-none ms-1"> 
                Show Password</label>
            </div>
            <div className='d-flex align-items-center justify-content-between'>
                <button
                className='material-symbols-outlined pe-auto border-0 bg-transparent' 
                data-testid='backButton'
                onClick={() => handleActiveModal('')}>
                    arrow_back_ios</button>
                <input 
                disabled={email === '' || password === '' || password !== confirmPw || password.length < 8}
                className={`btn 
                ${email !== '' && password !== '' && password === confirmPw && password.length >= 8 ?
                    'btn-success' : 'btn-secondary'}`}
                type="submit" 
                value={'Create'}
                data-testid='createButton'/>
            </div>
        </form>
    )
}

export default NewUserForm