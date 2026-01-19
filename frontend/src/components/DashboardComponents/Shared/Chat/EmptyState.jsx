import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import Logo from '../Logo/Logo';

const EmptyState = ({
  title = 'No conversation selected',
  description = 'Choose a contact or start a new conversation to begin.',
}) => {
  return (
    <Empty
      className="w-full h-full flex-1
    flex items-center justify-center bg-muted/20"
    >
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Logo showText={false} />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyState;
