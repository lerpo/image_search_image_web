import { useState, useEffect, useRef } from 'react';

export default function useExpTime(expTime: number) {
  const timerRef = useRef(null);
  const [codeExpTime, setCodeExpTime] = useState(0);

  const openInterval = () => {
    closeInterval();

    timerRef.current = setInterval(() => {
      setCodeExpTime(codeExpTime => codeExpTime - 1);
    }, 1000);
  }

  const closeInterval = () => {
    if (!timerRef.current) {
      return;
    }

    clearInterval(timerRef.current);
    timerRef.current = null;
  }

  const resetInterval = () => {
    setCodeExpTime(expTime);
    openInterval();
  }

  useEffect(() => {
    if (codeExpTime < 1) {
      closeInterval();
    }
  }, [codeExpTime]);

  return {
    codeExpTime,
    reset: resetInterval,
  }
}
