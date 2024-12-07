import AuthInputField from '../../components/AuthInputField';
import { useAuthStore } from '../../store/authStore';
import styles from './SignUpPage.module.css';

import userIcon from '../../pictures/profile.png';
import emailIcon from '../../pictures/email.png';
import passwordIcon from '../../pictures/password.png';

import { useState } from 'react';

import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { signup, error } = useAuthStore();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signup(email, password);
            navigate('/verify-email');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSignUp}>
                <a href="/"> <div className={styles.logo} /></a>
                <h1>Sign up</h1>
                <div className={styles.inputs}>
                    <AuthInputField
                        iconSrc={emailIcon}
                        type='email'
                        placeholder='E-mail'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <AuthInputField
                        iconSrc={passwordIcon}
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type='submit' disabled={loading}>
                    {loading ? 'Signing Up...' : 'Sign Up!'}
                </button>
                {error && <p className={styles.errorText}>{error}</p>}
            </form>
            <div className={styles.infoBlock}>
                <p>Already have an account?</p>
                <a href="/login">Login now!</a>
            </div>
        </div>
    );
};

export default SignUpPage;
