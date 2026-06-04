import styles from './Spinner.module.css'

type SpinnerProps = {
  size?: number
}

const Spinner = ({ size = 30 }: SpinnerProps) => {
  return (
    <div
      className={styles.spinner}
      style={{
        width: size,
        height: size
      }}
    />
  )
}

export default Spinner