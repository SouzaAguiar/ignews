import { signIn, useSession } from "next-auth/react";
import { api } from "../../services/api";
import styles from "./styles.module.scss";
import { getStripejs } from "../../services/getStripejs";
import { useRouter } from "next/router";

export const SubscribButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!session) {
      signIn("github");
      return;
    }

    if (session.activeSubscription) {
      router.push("/posts");
      return;
    }
    try {
      const response = await api.post(`/subscribe`);
      const { sessionId } = response.data;
      const stripe = await getStripejs();
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <button
      type="button"
      className={styles.SubscribButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
};
