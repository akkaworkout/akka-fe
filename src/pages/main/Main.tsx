import styles from './Main.module.css'
import SideNav from '../../components/sideNav/SideNav'

const Main = () => {
  return (
    <div className={styles.wrap}>
      <SideNav />

      <main className={styles.main}>
        <div className={styles.mainInner}>
          메인 내용
        </div>
      </main>
    </div>
  )
}

export default Main