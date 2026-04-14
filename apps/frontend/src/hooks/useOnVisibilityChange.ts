import { useEffect, useEffectEvent } from "react";

const useOnVisibilityChange = (onChange: (isVisible: boolean) => void) => {
  const handleVisibilityChange = useEffectEvent(() => {
    onChange(document.visibilityState === "visible");
  });

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
};

export default useOnVisibilityChange;
