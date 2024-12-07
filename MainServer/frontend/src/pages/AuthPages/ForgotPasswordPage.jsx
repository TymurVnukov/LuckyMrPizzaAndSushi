import { useAuthStore } from "../../store/authStore";
import { useState } from 'react';
import AuthInputField from '../../components/AuthInputField';
import styles from './ForgotPasswordPage.module.css';
import emailIcon from '../../pictures/email.png';
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
    const { forgotPassword, error, message } = useAuthStore();

    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false); 

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPassword(email);
            setIsSubmitted(true);
            navigate('/login');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <a href="/"> <div className={styles.logo} /></a>
                <h1>Reset password</h1>
                <div className={styles.inputs}>
                    <AuthInputField
                        iconSrc={emailIcon}
                        type='email'
                        placeholder='E-mail'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
                {error && <p className={styles.errorText}>{error}</p>}
            </form>
        </div>
    );
};

export default ForgotPasswordPage;
