import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.scss";
import { signIn, signOut, useSession } from "next-auth/react";

export const SinginButton: React.FC = () => {
  const { data: session } = useSession();

  return (
    <button
      className={styles.singinButton}
      type="button"
      onClick={
        session
          ? () => {
              signOut();
            }
          : () => {
              signIn("github");
            }
      }
    >
      <FaGithub color={session ? "#04b361" : "#eba417"} />
      {session ? session.user.name : "sing with github"}
      {session && <FiX color="#737380" className={styles.closeIcon} />}
    </button>
  );
};
