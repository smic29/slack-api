import './LoginPage.css'
import { useData } from '../../Context/DataProvider'
import { useState } from 'react';
import axios from 'axios';

function LoginPage() {
    const { handleLogin, handleActiveModal, handleHeaders } = useData();
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ visibility, setVisibility ] = useState(false);

    const toggleVisibility = () => {
        setVisibility(!visibility)
    }

    const handleFormSubmit = async(e) => {
        e.preventDefault();

        
        try {
            const response = await axios.post('http://206.189.91.54/api/v1/auth/sign_in', { 
                email, password,
            })

            handleLogin(response.data);
            handleHeaders(response.headers)
            // console.table(response.headers)
        } catch (error) {
            alert(`Login failed`)
        }
    }

    return (
        <form className='login-form'
        onSubmit={handleFormSubmit}>
            <fieldset>
                <legend className='user-legend'>
                    Email
                </legend>
                <input type='email' 
                value={email}
                placeholder='Enter email'
                onChange={(e) => setEmail(e.target.value)}/>
            </fieldset>
            <fieldset className='pw-field'>
                <legend className='pass-legend'>
                    Password
                </legend>
                <input type={visibility ? 'text' : 'password'} 
                value={password}
                placeholder='Enter password'
                onChange={(e) => setPassword(e.target.value)}/>
                <span class="material-symbols-outlined"
                onMouseEnter={toggleVisibility}
                onMouseLeave={toggleVisibility}>
                {visibility ? 'visibility': 'visibility_off'}
                </span>
            </fieldset>
            <p
            onClick={() => handleActiveModal('newUser')}>Create a new account!</p>
            <input type='submit' 
            value='Login'
            data-testid='loginButton'/>
        </form>
    )
}

export default LoginPage