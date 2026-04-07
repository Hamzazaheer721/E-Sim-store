'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

import { useDebounce } from '@/hooks/useDebounce';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('search') ?? '');
  const debouncedValue = useDebounce(value);

  useEffect(() => {
    const currentSearch = searchParams.get('search') ?? '';
    if (debouncedValue === currentSearch) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedValue) {
      params.set('search', debouncedValue);
    } else {
      params.delete('search');
    }
    router.replace(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, router]);

  return (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search destinations..."
      fullWidth
      sx={{ maxWidth: 512 }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
          sx: { borderRadius: 9999 },
        },
      }}
    />
  );
}
