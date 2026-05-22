import { useState, useCallback, useRef } from "react";

export function useToast(duration = 2000) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback(
    (msg: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setMessage(msg);
      setVisible(true);
      timerRef.current = setTimeout(() => setVisible(false), duration);
    },
    [duration]
  );

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  return { message, visible, show, hide };
}
