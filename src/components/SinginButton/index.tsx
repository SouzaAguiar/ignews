import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.scss";
export const SinginButton: React.FC = () => {
  const [user, setUser] = useState("sing with github");
  const isUserLogedIn = true;
  return (
    <button className={styles.singinButton} type="button">
      <FaGithub color={isUserLogedIn ? "#04b361" : "#eba417"} />
      {user}
      {isUserLogedIn && <FiX color="#737380" className={styles.closeIcon} />}
    </button>
  );
};
