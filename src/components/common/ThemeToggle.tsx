import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem('theme-dark');
    const initial = stored ? stored === '1' : root.classList.contains('dark');
    setDark(initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', dark);
    localStorage.setItem('theme-dark', dark ? '1' : '0');
  }, [dark]);

  return (
    <Button variant="secondary" onClick={() => setDark((v) => !v)} className="rounded-full gap-2">
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {dark ? 'Uma Pastel' : 'Night Race'}
    </Button>
  );
}
