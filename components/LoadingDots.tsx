import styles from "styles/loading-dots.module.css";

const LoadingDots = ({color = "#808080"}: { color?: string }) => {
  return (
    <span className={styles.loading}>
      <span style={{backgroundColor: color}}/>
      <span style={{backgroundColor: color}}/>
      <span style={{backgroundColor: color}}/>
    </span>
  );
};

export default LoadingDots;
