import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { 
  MoreVertical, 
  Eye, 
  Edit, 
  CheckCircle2, 
  Circle, 
  Archive, 
  Trash2, 
  Share,
  Copy
} from 'lucide-react';
import { useLocalization } from '../LocalizationProvider';
import { toast } from 'sonner@2.0.3';

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  assignee?: string;
}

interface TaskCardMoreMenuProps {
  task: Task;
  onView?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onToggle?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
  onArchive?: (taskId: number) => void;
  onShare?: (task: Task) => void;
  className?: string;
}

export function TaskCardMoreMenu({
  task,
  onView,
  onEdit,
  onToggle,
  onDelete,
  onArchive,
  onShare,
  className = ''
}: TaskCardMoreMenuProps) {
  const { t } = useLocalization();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleView = () => {
    onView?.(task);
    setIsOpen(false);
  };

  const handleEdit = () => {
    onEdit?.(task);
    setIsOpen(false);
  };

  const handleToggle = () => {
    onToggle?.(task.id);
    setIsOpen(false);
    toast.success(
      task.completed 
        ? t('task.menu.markedIncomplete') 
        : t('task.menu.markedComplete')
    );
  };

  const handleDeleteConfirm = () => {
    onDelete?.(task.id);
    setShowDeleteDialog(false);
    setIsOpen(false);
    toast.success(t('task.menu.deleted'));
  };

  const handleArchiveConfirm = () => {
    onArchive?.(task.id);
    setShowArchiveDialog(false);
    setIsOpen(false);
    toast.success(t('task.menu.archived'));
  };

  const handleShare = () => {
    if (onShare) {
      onShare(task);
    } else {
      // Default share behavior - copy link to clipboard
      const shareUrl = `${window.location.origin}/task/${task.id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success(t('task.menu.linkCopied'));
      }).catch(() => {
        toast.error(t('common.error.clipboardFailed'));
      });
    }
    setIsOpen(false);
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`touch-target h-8 w-8 hover:bg-muted/50 transition-colors ${className}`}
            aria-label={t('task.menu.moreActions')}
          >
            <MoreVertical className="icon-md rtl-mirror" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          sideOffset={6}
          className="w-48"
        >
          {/* View Details */}
          {onView && (
            <DropdownMenuItem 
              onClick={handleView}
              className="cursor-pointer"
            >
              <Eye className="icon-sm mr-2" />
              {t('task.menu.view')}
            </DropdownMenuItem>
          )}

          {/* Edit */}
          {onEdit && (
            <DropdownMenuItem 
              onClick={handleEdit}
              className="cursor-pointer"
            >
              <Edit className="icon-sm mr-2" />
              {t('task.menu.edit')}
            </DropdownMenuItem>
          )}

          {(onView || onEdit) && <DropdownMenuSeparator />}

          {/* Toggle Complete */}
          {onToggle && (
            <DropdownMenuItem 
              onClick={handleToggle}
              className="cursor-pointer"
            >
              {task.completed ? (
                <>
                  <Circle className="icon-sm mr-2" />
                  {t('task.menu.markIncomplete')}
                </>
              ) : (
                <>
                  <CheckCircle2 className="icon-sm mr-2" />
                  {t('task.menu.markComplete')}
                </>
              )}
            </DropdownMenuItem>
          )}

          {/* Archive */}
          {onArchive && (
            <DropdownMenuItem 
              onClick={() => setShowArchiveDialog(true)}
              className="cursor-pointer"
            >
              <Archive className="icon-sm mr-2" />
              {t('task.menu.archive')}
            </DropdownMenuItem>
          )}

          {(onToggle || onArchive) && <DropdownMenuSeparator />}

          {/* Share */}
          {(onShare !== undefined) && (
            <DropdownMenuItem 
              onClick={handleShare}
              className="cursor-pointer"
            >
              <Share className="icon-sm mr-2" />
              {t('task.menu.share')}
            </DropdownMenuItem>
          )}

          {/* Delete */}
          {onDelete && (
            <>
              {(onShare !== undefined) && <DropdownMenuSeparator />}
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="icon-sm mr-2" />
                {t('task.menu.delete')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('task.menu.deleteConfirm.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('task.menu.deleteConfirm.description', { taskTitle: task.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('task.menu.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('task.menu.archiveConfirm.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('task.menu.archiveConfirm.description', { taskTitle: task.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchiveConfirm}
              className="bg-warning text-warning-foreground hover:bg-warning/90"
            >
              {t('task.menu.archive')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}