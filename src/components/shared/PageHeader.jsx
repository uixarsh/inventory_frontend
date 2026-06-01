import { Button } from "@/components/ui/button";

export default function PageHeader({ title, actionLabel, onAction, actionIcon: ActionIcon }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105"
        >
          {ActionIcon && <ActionIcon className="w-4 h-4 mr-2" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
