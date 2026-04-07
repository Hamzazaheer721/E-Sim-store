'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { REGIONS } from '@/lib/constants';

export function RegionFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeRegion = searchParams.get('region') ?? 'all';

  const handleSelect = (region: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (region === 'all') {
      params.delete('region');
    } else {
      params.set('region', region);
    }
    router.replace(`?${params.toString()}`);
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ overflowX: 'auto', pb: 1, '::-webkit-scrollbar': { display: 'none' } }}
    >
      {REGIONS.map((region) => (
        <Chip
          key={region.value}
          label={region.label}
          onClick={() => handleSelect(region.value)}
          variant={activeRegion === region.value ? 'filled' : 'outlined'}
          color={activeRegion === region.value ? 'primary' : 'default'}
          sx={{ flexShrink: 0 }}
        />
      ))}
    </Stack>
  );
}
