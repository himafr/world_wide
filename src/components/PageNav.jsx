import { NavLink } from "react-router-dom";
import Logo from "./Logo"
import styles from "./PageNav.module.css"
function Header() {
  return (
    <nav className={styles.nav}>
    <Logo />
      <ul>
        <li>
          <NavLink to="/product" >Product </NavLink>
        </li>
        <li>
          <NavLink to="/pricing" >Pricing </NavLink>
        </li>
        <li>
          <NavLink to="/login" >Login </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
