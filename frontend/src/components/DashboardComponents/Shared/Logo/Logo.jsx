import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { Brain } from 'lucide-react';

const Logo = ({
  url = '/',
  showText = true,
  imgClass = 'size-[30px]',
  textClass,
}) => (
  <Link to={url} className="flex items-center gap-2 w-fit group">
    <div className={cn('flex items-center justify-center rounded-lg bg-primary/10 p-1', imgClass)}>
      <Brain className="text-primary" />
    </div>
    {showText && (
      <span className={cn('font-bold text-lg leading-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent', textClass)}>
        Synapse.
      </span>
    )}
  </Link>
);

export default Logo;
