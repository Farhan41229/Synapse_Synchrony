import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const AvatarWithBadge = ({
  name,
  src,
  isOnline,
  isGroup = false,
  size = 'w-9 h-9',
  className,
}) => {
  const fallbackInitial = name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="relative shrink-0">
      <Avatar className={cn(size, 'ring-1 ring-border')}>
        <AvatarImage src={src || ''} alt={name || 'avatar'} />
        <AvatarFallback
          className={cn(
            `bg-primary/10
         text-primary font-semibold
        `,
            className && className
          )}
        >
          {fallbackInitial}
        </AvatarFallback>
      </Avatar>

      {isOnline && !isGroup && (
        <span
          className="absolute
          bottom-0
          right-0
          h-2.5 w-2.5 rounded-full
          border-2
          border-background
          bg-green-500
          "
        />
      )}
    </div>
  );
};

export default AvatarWithBadge;
