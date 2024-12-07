import { useAuthStore } from "../../store/authStore";
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import AuthInputField from '../../components/AuthInputField';
import styles from './ResetPasswordPage.module.css';
import passwordIcon from '../../pictures/password.png';

const ResetPasswordPage = () => {
    const { resetPassword, error } = useAuthStore();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false); 

    const { token } = useParams();
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        setLoading(true); 
        
        try {
            await resetPassword(token, password);
            navigate('/login');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleResetPassword}>
                <a href="/"> <div className={styles.logo} /></a>
                <h1>Reset password</h1>
                <AuthInputField
                    iconSrc={passwordIcon}
                    type='password'
                    placeholder='New password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <AuthInputField
                    iconSrc={passwordIcon}
                    type='password' 
                    placeholder='Confirm password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
                {error && <p className={styles.errorText}>{error}</p>}
            </form>
        </div>
    );
}

export default ResetPasswordPage;
