import AuthInputField from '../../components/AuthInputField';
import emailIcon from '../../pictures/email.png';
import passwordIcon from '../../pictures/password.png';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import styles from './LoginPage.module.css';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login, error } = useAuthStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleLogin}>
                <a href="/"> <div className={styles.logo} /></a>
                <h1>Login</h1>
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
                    {loading ? 'Logging in...' : 'Login!'}
                </button>
                {error && <p className={styles.errorText}>{error}</p>}
            </form>
            <div className={styles.infoBlock}>
                <p>Forgot password?</p>
                <a href="/forgot-password">Reset password.</a>
            </div>
            <div className={styles.infoBlock}>
                <p>Don't have an account?</p>
                <a href="/signup">Sign up!</a>
            </div>
        </div>
    );
};

export default LoginPage;
