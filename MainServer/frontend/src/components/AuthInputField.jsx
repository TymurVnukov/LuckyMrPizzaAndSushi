import './AuthInputField.css';

const AuthInputField = ({ iconSrc, ...props }) => {
    return (
        <div className="input-container">
            <div className="icon">
                <img src={iconSrc} alt="icon" className="icon-size" />
            </div>
            <input className="input-field" {...props} />
        </div>
    );
};

export default AuthInputField;
