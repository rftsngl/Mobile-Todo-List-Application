import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from './utils';

// Overlay Context
interface OverlayContextType {
  showModal: (content: React.ReactNode, options?: ModalOptions) => void;
  showBottomSheet: (content: React.ReactNode, options?: BottomSheetOptions) => void;
  showToast: (message: string, options?: ToastOptions) => void;
  hideModal: () => void;
  hideBottomSheet: () => void;
  hideToast: (id: string) => void;
}

const OverlayContext = createContext<OverlayContextType | null>(null);

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
}

// Modal Component
interface ModalOptions {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  backdrop?: boolean;
  onClose?: () => void;
}

interface ModalProps extends ModalOptions {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ 
  isOpen, 
  onClose, 
  children, 
  size = 'md', 
  closable = true, 
  backdrop = true 
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg', 
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          {backdrop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={closable ? onClose : undefined}
            />
          )}
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ 
                duration: 0.2, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className={cn(
                'w-full bg-card rounded-2xl shadow-xl border border-border overflow-hidden',
                sizeClasses[size]
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              {closable && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted transition-smooth z-10"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Bottom Sheet Component
interface BottomSheetOptions {
  height?: 'auto' | 'sm' | 'md' | 'lg' | 'full';
  closable?: boolean;
  backdrop?: boolean;
  onClose?: () => void;
}

interface BottomSheetProps extends BottomSheetOptions {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function BottomSheet({ 
  isOpen, 
  onClose, 
  children, 
  height = 'auto', 
  closable = true, 
  backdrop = true 
}: BottomSheetProps) {
  const [dragY, setDragY] = useState(0);
  
  const heightClasses = {
    auto: 'max-h-[80vh]',
    sm: 'h-1/4',
    md: 'h-1/2',
    lg: 'h-3/4',
    full: 'h-full'
  };

  const handleDragEnd = (_, info: any) => {
    if (info.offset.y > 100 && closable) {
      onClose();
    }
    setDragY(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          {backdrop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={closable ? onClose : undefined}
            />
          )}
          
          {/* Bottom Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: dragY }}
              exit={{ y: '100%' }}
              transition={{ 
                duration: 0.3, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              drag={closable ? "y" : false}
              dragConstraints={{ top: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              onDrag={(_, info) => setDragY(info.offset.y)}
              className={cn(
                'w-full max-w-md bg-card rounded-t-2xl shadow-xl border border-border border-b-0 overflow-hidden',
                heightClasses[height]
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Handle */}
              {closable && (
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-8 h-1 bg-muted-foreground/30 rounded-full" />
                </div>
              )}
              
              {/* Close button */}
              {closable && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted transition-smooth z-10"
                  aria-label="Close bottom sheet"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              <div className="overflow-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Toast Component
interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface Toast extends ToastOptions {
  id: string;
  message: string;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastComponent({ toast, onRemove }: ToastProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/50 dark:border-green-800 dark:text-green-200',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/50 dark:border-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-200'
  };

  const Icon = icons[toast.type || 'info'];

  React.useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => onRemove(toast.id), toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex items-center gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm',
        styles[toast.type || 'info']
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 text-sm">{toast.message}</p>
      
      {toast.action && (
        <button
          onClick={toast.action.onClick}
          className="text-sm font-medium hover:underline"
        >
          {toast.action.label}
        </button>
      )}
      
      <button
        onClick={() => onRemove(toast.id)}
        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/10 transition-smooth"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// Toast Container
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastComponent toast={toast} onRemove={onRemove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Overlay Provider
interface OverlayProviderProps {
  children: React.ReactNode;
}

export function OverlayProvider({ children }: OverlayProviderProps) {
  const [modal, setModal] = useState<{ content: React.ReactNode; options: ModalOptions } | null>(null);
  const [bottomSheet, setBottomSheet] = useState<{ content: React.ReactNode; options: BottomSheetOptions } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showModal = useCallback((content: React.ReactNode, options: ModalOptions = {}) => {
    setModal({ content, options });
  }, []);

  const hideModal = useCallback(() => {
    setModal(null);
  }, []);

  const showBottomSheet = useCallback((content: React.ReactNode, options: BottomSheetOptions = {}) => {
    setBottomSheet({ content, options });
  }, []);

  const hideBottomSheet = useCallback(() => {
    setBottomSheet(null);
  }, []);

  const showToast = useCallback((message: string, options: ToastOptions = {}) => {
    const id = Date.now().toString();
    const toast: Toast = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration || 4000,
      action: options.action
    };
    setToasts(prev => [...prev, toast]);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const contextValue: OverlayContextType = {
    showModal,
    hideModal,
    showBottomSheet,
    hideBottomSheet,
    showToast,
    hideToast
  };

  return (
    <OverlayContext.Provider value={contextValue}>
      {children}
      
      {/* Modal */}
      <Modal
        isOpen={!!modal}
        onClose={modal?.options.onClose || hideModal}
        {...modal?.options}
      >
        {modal?.content}
      </Modal>
      
      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={!!bottomSheet}
        onClose={bottomSheet?.options.onClose || hideBottomSheet}
        {...bottomSheet?.options}
      >
        {bottomSheet?.content}
      </BottomSheet>
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={hideToast} />
    </OverlayContext.Provider>
  );
}

// Export individual components for direct use
export { Modal, BottomSheet, ToastComponent as Toast };