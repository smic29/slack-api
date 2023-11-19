import { useData } from '../../Context/DataProvider'
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../Constants/Constants';

function LoginPage(props) {
    const { navigate } = props;
    const { 
        handleLogin, 
        handleActiveModal, 
        handleHeaders, 
        setUserBase, 
        setIsLoadingMsgs,
        setIsLoadingUB
    } = useData();
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ visibility, setVisibility ] = useState(false);

    const toggleVisibility = () => {
        setVisibility(!visibility)
    }

    const handleFormSubmit = async(e) => {
        e.preventDefault();

        
        try {
            const response = await axios.post(`${API_URL}/auth/sign_in`, { 
                email, password,
            })

            navigate('/');
            handleLogin(response.data);
            handleHeaders(response.headers)

            const allUserResponse = await axios.get(`${API_URL}/users`, { headers : response.headers})
            setIsLoadingUB(false)
            setUserBase(allUserResponse.data.data);
            setIsLoadingMsgs(true);
        } catch (error) {
            if (error.response){
            alert(`${error.response.data.errors}`)
            }
            alert(error);
        }
    }

    return (
        <form className='login-form'
        onSubmit={handleFormSubmit}>
            <div className='input-group mb-3 form-floating'>
                <i className='material-symbols-outlined input-group-text user-select-none'>
                    alternate_email</i>
                <div className='form-floating'>
                <input 
                id="emailInput"
                className='form-control'
                type='email' 
                value={email}
                placeholder='Email Address'
                onChange={(e) => setEmail(e.target.value)}/>
                <label htmlFor="emailInput">Email Address</label>
                </div>
            </div>
            <div className='input-group mb-3'>
                <i className='material-symbols-outlined input-group-text user-select-none'>
                    key
                </i>
                <div className='form-floating'>
                <input 
                id="pwInput"
                className='form-control'
                type={visibility ? 'text' : 'password'} 
                value={password}
                placeholder='Enter password'
                onChange={(e) => setPassword(e.target.value)}/>
                <label 
                htmlFor="pwInput"
                className='form-label'>
                    Password
                </label>
                </div>
                <span 
                className="material-symbols-outlined input-group-text user-select-none"
                onMouseEnter={toggleVisibility}
                onMouseLeave={toggleVisibility}>
                {visibility ? 'visibility': 'visibility_off'}
                </span>
            </div>
            <p>
                No account yet? 
                <a
                className='link-success pe-auto link-offset-2 link-underline-opacity-100-hover ms-1
                link-underline-opacity-25 user-select-none'
                href='#'
                onClick={() => handleActiveModal('newUser')}
                >Sign Up here!</a>
            </p>
            <button type='submit' 
            className={`btn ${email === '' || password === '' ? 'btn-secondary' : 'btn-primary'}`}
            data-testid='loginButton'
            disabled={email === '' || password === ''}>
                Sign In 
            </button>
        </form>
    )
}

export default LoginPage