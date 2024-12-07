import { useAuthStore } from "../store/authStore"
import styles from './HomePage.module.css';

import Header from "./Header.jsx"

const HomePage = () => {
    const { user } = useAuthStore();
    

    return (
        <div className="HomePage">
            <Header/>
            <div className="underHeader"></div>

            <main className={styles.mainbody}>
                <div className={styles.textContent}>
                    
                {user ? (
                    <>
                            <h1>Welcome back to Lucky Mr Pizza and Sushi Website!</h1>
                            <h2>"It’s where flavors come to life — enjoy every moment!"</h2>
                        </>
                    ) : (
                        <div>
                            <h1>Welcome to Lucky Mr Pizza and Sushi Website!</h1>
                            <h2>"It’s where flavors come to life — enjoy every moment!"</h2>
                            <div className={styles.links}>
                                <a href="/login">Login</a>
                                <a href="/signup">Sign Up</a>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
export default HomePage