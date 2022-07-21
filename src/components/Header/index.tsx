import ActiveLink from "../ActiveLink";
import { SinginButton } from "../SinginButton";
import styles from "./styles.module.scss";

export const Header: React.FC = () => {
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a>Postes</a>
          </ActiveLink>
        </nav>
        <SinginButton />
      </div>
    </header>
  );
};
