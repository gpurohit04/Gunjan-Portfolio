import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { useEffect } from 'react';
import './ArchitectureModal.css';

export default function ArchitectureModal({ isOpen, onClose, title, imageSrc }) {
  // Close on ESC key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="arch-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="arch-modal__content"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="arch-modal__header">
              <div className="arch-modal__header-left">
                <ZoomIn size={18} className="arch-modal__header-icon" />
                <h3 className="arch-modal__title">{title}</h3>
              </div>
              <button className="arch-modal__close" onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            {/* Diagram */}
            <div className="arch-modal__body">
              <div className="arch-modal__diagram-wrapper">
                <img
                  src={imageSrc}
                  alt={`${title} - Architecture Diagram`}
                  className="arch-modal__diagram"
                />
              </div>
            </div>

            {/* Footer hint */}
            <div className="arch-modal__footer">
              <span>Press <kbd>ESC</kbd> or click outside to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
