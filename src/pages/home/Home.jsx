import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            <NavLink
              to="/home"
              end
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Chat
            </NavLink>
          </li>

          <li className={styles.menuItem}>
            <NavLink
              to="/home/profile"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Profile
            </NavLink>
          </li>
        </ul>
      </aside>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
