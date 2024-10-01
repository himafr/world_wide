import AppNav from './AppNav'
import styles from './Sidebar.module.css'
import Logo from "../components/Logo"
import { Outlet } from 'react-router-dom'
function Sidebar() {
    return (
        <div className={styles.sidebar}>
        <Logo />
        <AppNav />
        <Outlet />
        <footer className={styles.footer}>
           <p className={styles.copy}>
            &copy; { new Date().getFullYear()} WorldWide. All rights reserved.</p>

             {/* Designed by <a href="https://github.com/fuhema">fuhema</a> and <a href="https://github.com/Mohamed-Ahmad">Mohamed-Ahmad</a>
           </p> */}
        </footer>
            
        </div>
    )
}

export default Sidebar
