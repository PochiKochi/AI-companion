import React, { useEffect, useState } from 'react';

export default function Layout({ children, currentPageName }) {
  const [isDark, setIsDark] = useState(false);

  // Auto night mode after 9pm
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      const shouldBeDark = hour >= 21 || hour < 6;
      setIsDark(shouldBeDark);
    };
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // No layout wrapper for chat (it handles its own full-screen layout)
  if (currentPageName === 'Chat') {
    return <>{children}</>;
  }

  return <>{children}</>;
}