import './LoginPage.css'
import { useData } from '../Context/DataProvider'
import { useState } from 'react';

function LoginPage() {
    const { userData, handleLogin } = useData();
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ visibility, setVisibility ] = useState(false);

    const toggleVisibility = () => {
        setVisibility(!visibility)
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const LoginUser = userData.find((userObj) => 
        userObj.username === username &&
        userObj.password === password)

        if (LoginUser) {
            handleLogin(LoginUser);
            alert(`Welcome, ${LoginUser.username}!`)
        } else {
            alert('Incorrect Username/Password')
        }

    }

    return (
        <form className='login-form'
        onSubmit={handleFormSubmit}>
            <fieldset>
                <legend className='user-legend'>
                    Username
                </legend>
                <input type='text' 
                value={username}
                onChange={(e) => setUsername(e.target.value)}/>
            </fieldset>
            <fieldset className='pw-field'>
                <legend className='pass-legend'>
                    Password
                </legend>
                <input type={visibility ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
                <span class="material-symbols-outlined"
                onMouseEnter={toggleVisibility}
                onMouseLeave={toggleVisibility}>
                {visibility ? 'visibility': 'visibility_off'}
                </span>
            </fieldset>
            <input type='submit' 
            value='Login'/>
        </form>
    )
}

export default LoginPage