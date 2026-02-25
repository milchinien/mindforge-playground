import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useOnboarding } from '../../hooks/useOnboarding';

/**
 * Arrow styles for each tooltip position.
 * The arrow is a small CSS triangle pointing toward the wrapped element.
 */
const arrowStyles = {
  top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-800',
  bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-gray-800',
  left: 'right-[-6px] top-1/2 -translate-y-1/2 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-800',
  right: 'left-[-6px] top-1/2 -translate-y-1/2 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-gray-800',
};

/**
 * Positioning classes that place the tooltip relative to its wrapper.
 * The wrapper is `position: relative` so these absolute offsets work.
 */
const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function OnboardingTooltip({
  hintId,
  text,
  position = 'bottom',
  children,
}) {
  const { t } = useTranslation();
  const { hasSeenHint, markSeen } = useOnboarding();
  const [visible, setVisible] = useState(!hasSeenHint(hintId));
  const wrapperRef = useRef(null);

  // Keep in sync when the hook's state changes (e.g. after resetAllHints)
  useEffect(() => {
    setVisible(!hasSeenHint(hintId));
  }, [hasSeenHint, hintId]);

  const dismiss = () => {
    setVisible(false);
    markSeen(hintId);
  };

  return (
    <div ref={wrapperRef} className="relative inline-block">
      {children}

      {/* Pulsing dot indicator */}
      <AnimatePresence>
        {visible && (
          <motion.span
            key={`dot-${hintId}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-1 -right-1 z-50 flex h-3 w-3"
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-purple-500" />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key={`tooltip-${hintId}`}
            initial={{ opacity: 0, y: position === 'top' ? 4 : position === 'bottom' ? -4 : 0, x: position === 'left' ? 4 : position === 'right' ? -4 : 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: position === 'top' ? 4 : position === 'bottom' ? -4 : 0, x: position === 'left' ? 4 : position === 'right' ? -4 : 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`absolute z-50 w-max max-w-xs ${positionClasses[position]}`}
          >
            <div className="relative rounded-lg bg-gray-800 px-4 py-3 text-sm text-white shadow-xl">
              <p className="mb-2 leading-snug">{text}</p>

              <button
                onClick={dismiss}
                className="rounded-md bg-purple-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 focus:ring-offset-gray-800"
              >
                {t('onboarding.dismiss', 'Verstanden!')}
              </button>

              {/* Arrow */}
              <span
                className={`absolute h-0 w-0 ${arrowStyles[position]}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default OnboardingTooltip;
