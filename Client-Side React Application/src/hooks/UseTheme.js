import { useEffect, useState } from 'react';

const useTheme = () => {
  const [enabledTheme, setEnabled] = useState(null);

  useEffect(() => {
    let storedTheme = localStorage.getItem('darkMode');
    if (storedTheme === null) {
      const devicePreferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      localStorage.setItem('darkMode', devicePreferredTheme);
      storedTheme = localStorage.getItem('darkMode');
    }

    if (storedTheme === 'true') {
      window.document.body.classList.add('dark');
    }
    setEnabled(storedTheme === 'true');
  }, []);

  const setTheme = (set) => {
    const className = 'dark';
    const bodyClass = window.document.body.classList;
    set ? bodyClass.add(className) : bodyClass.remove(className);

    localStorage.setItem('darkMode', set);
    setEnabled(set);
  };

  return [enabledTheme, setTheme];
};

export default useTheme;
