import Link from 'next/link';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="The page you're looking for doesn't exist."
      icon={<SentimentDissatisfiedIcon sx={{ fontSize: 48 }} />}
      action={
        <Link href="/">
          <Button>Browse destinations</Button>
        </Link>
      }
    />
  );
}
