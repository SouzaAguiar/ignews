import styles from "./styles.module.scss";

interface SubscribButtonProps {
  priceid: string;
}
export const SubscribButton: React.FC<SubscribButtonProps> = ({ priceid }) => {
  return (
    <button type="button" className={styles.SubscribButton}>
      Subscribe now
    </button>
  );
};
