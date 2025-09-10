import { TextField, MenuItem } from '@mui/material';

type LetterSelectFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
};

const LETTER_OPTIONS = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

export default function GradeSelector({
  label,
  value,
  onChange,
  disabled,
}: LetterSelectFieldProps) {
  return (
    <TextField
      label={label}
      select
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {LETTER_OPTIONS.map((opt) => (
        <MenuItem key={opt} value={opt}>
          {opt}
        </MenuItem>
      ))}
    </TextField>
  );
}
