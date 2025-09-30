import { ReactNode } from "react";
// import * as styles from "./_component/main.css";
import styles from "./_component/main.module.css";

type Props = {
  children: ReactNode;
  modal: ReactNode;
};

export default function Layout({ children, modal }: Props) {
  return (
    <div className={styles.container}>
      {children}
      {modal}
    </div>
  );
}
