import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ComboAdd({
  placeholder,
  options,
  onAdd,
}: {
  placeholder: string;
  options: string[];
  onAdd: (value: string) => void;
}) {
  const [value, setValue] = useState('');
  return (
    <div className="flex w-full items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
          list={placeholder}
        />
        <datalist id={placeholder}>
          {options.map((opt) => (
            <option key={opt} value={opt} />
          ))}
        </datalist>
      </div>
      <Button onClick={() => (onAdd(value.trim()), setValue(''))} type="button" className="gap-2">
        Add
      </Button>
    </div>
  );
}
