import { SinginButton } from "../SinginButton";
import styles from "./styles.module.scss";

export const Header: React.FC = () => {
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <a className={styles.active} href="/">
            Home
          </a>
          <a href="/">Postes</a>
        </nav>
        <SinginButton />
      </div>
    </header>
  );
};
