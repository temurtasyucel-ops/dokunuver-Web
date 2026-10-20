import styles from './loyalty.module.css';
export const metadata={title:'Dijital Sadakat',robots:{index:false,follow:false}};
export default function Layout({children}){return <div className={styles.root}>{children}</div>;}
