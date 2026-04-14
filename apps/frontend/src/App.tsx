import { useContext } from "react";
import styles from "./App.module.scss";
import useOnVisibilityChange from "./hooks/useOnVisibilityChange";
import { sound } from "./utils/soundManager";
import { SocketContext } from "./providers/SocketProvider";
import Game from "./components/Game";

const App = () => {
  const { isConnected } = useContext(SocketContext);

  useOnVisibilityChange((isVisible: boolean) => {
    sound.mute(!isVisible);
  });

  return (
    <div className={styles.app}>
      {!isConnected && (
        <div className={styles.loader}>
          <div className={styles.loader__spinner} />
        </div>
      )}
      <Game />
    </div>
  );
};

export default App;
