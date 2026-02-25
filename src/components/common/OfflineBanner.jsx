import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function OfflineBanner() {
  const { t } = useTranslation();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  const handleOffline = useCallback(() => {
    setIsOffline(true);
    setShowReconnected(false);
  }, []);

  const handleOnline = useCallback(() => {
    setIsOffline(false);
    setShowReconnected(true);
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  useEffect(() => {
    if (showReconnected) {
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showReconnected]);

  const bannerVariants = {
    hidden: { y: -80, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { y: -80, opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          key="offline-banner"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-0 left-0 right-0 z-[90] flex items-center justify-center gap-3 bg-amber-500 px-4 py-3 text-white shadow-lg"
          role="alert"
          aria-live="assertive"
        >
          <WifiOff className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">
            {t('offline.banner', 'Du bist offline. Einige Funktionen sind nicht verfügbar.')}
          </span>
        </motion.div>
      )}

      {showReconnected && !isOffline && (
        <motion.div
          key="online-banner"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-0 left-0 right-0 z-[90] flex items-center justify-center gap-3 bg-emerald-500 px-4 py-3 text-white shadow-lg"
          role="status"
          aria-live="polite"
        >
          <Wifi className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">
            {t('offline.reconnected', 'Wieder online!')}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
