import AuthInputField from '../../components/AuthInputField';
import { useAuthStore } from '../../store/authStore';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import emailIcon from '../../pictures/email.png';
import styles from './VerifyEmailPage.module.css';

const VerifyEmailPage = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false); 

    const navigate = useNavigate();
    const { error, verifyEmail } = useAuthStore();

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await verifyEmail(code);
            navigate("/"); 
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleVerifyEmail}>
                <a href="/"> <div className={styles.logo} /></a>
                <h1>Verify e-mail</h1>
                <AuthInputField
                    iconSrc={emailIcon}
                    type='text'
                    placeholder='Enter verification code'
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <button type='submit' disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify Email!'}
                </button>
                {error && <p className={styles.errorText}>{error}</p>}
            </form>
        </div>
    );
};

export default VerifyEmailPage;
