import App from "./App";
import SocketProvider from "./providers/SocketProvider";

const AppContainer = () => {
  return (
    <SocketProvider>
      <App />
    </SocketProvider>
  );
};

export default AppContainer;
