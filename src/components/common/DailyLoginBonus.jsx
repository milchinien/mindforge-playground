import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Star, Gift, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'mindforge_daily_login';

const XP_REWARDS = [50, 75, 100, 125, 150, 175, 200];

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function getStoredData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function isYesterday(dateStr) {
  if (!dateStr) return false;
  const last = new Date(dateStr);
  const today = new Date(getTodayString());
  const diff = today.getTime() - last.getTime();
  return diff === 86400000; // exactly one day in ms
}

function calculateStreakState() {
  const stored = getStoredData();
  const today = getTodayString();

  if (!stored) {
    return {
      currentStreak: 0,
      totalDaysLoggedIn: 0,
      lastLoginDate: null,
      alreadyClaimedToday: false,
    };
  }

  const { lastLoginDate, currentStreak, totalDaysLoggedIn } = stored;

  if (lastLoginDate === today) {
    return {
      currentStreak,
      totalDaysLoggedIn,
      lastLoginDate,
      alreadyClaimedToday: true,
    };
  }

  if (isYesterday(lastLoginDate)) {
    return {
      currentStreak,
      totalDaysLoggedIn,
      lastLoginDate,
      alreadyClaimedToday: false,
    };
  }

  // Streak broken (more than 1 day gap)
  return {
    currentStreak: 0,
    totalDaysLoggedIn,
    lastLoginDate,
    alreadyClaimedToday: false,
  };
}

export default function DailyLoginBonus({ onXPGain }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [streakState, setStreakState] = useState(null);

  useEffect(() => {
    const state = calculateStreakState();
    if (!state.alreadyClaimedToday) {
      setStreakState(state);
      setVisible(true);
    }
  }, []);

  const handleClaim = useCallback(() => {
    if (!streakState) return;

    const newStreak = (streakState.currentStreak % 7) + 1;
    const xpReward = XP_REWARDS[newStreak - 1];
    const today = getTodayString();

    const updatedData = {
      lastLoginDate: today,
      currentStreak: newStreak,
      totalDaysLoggedIn: streakState.totalDaysLoggedIn + 1,
    };

    saveData(updatedData);

    if (onXPGain) {
      onXPGain(xpReward);
    }

    setVisible(false);
  }, [streakState, onXPGain]);

  if (!visible || !streakState) return null;

  const claimDay = (streakState.currentStreak % 7) + 1;
  const xpReward = XP_REWARDS[claimDay - 1];

  const tt = (key, fallback) => {
    const result = t(key, { defaultValue: '__MISSING__' });
    return result === '__MISSING__' ? fallback : result;
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.1 }}
          >
            {/* Gradient background */}
            <div className="bg-gradient-to-br from-accent to-primary-light p-6 sm:p-8">
              {/* Top icon */}
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.3 }}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Flame className="w-9 h-9 text-white" strokeWidth={2.5} />
                  </div>
                </motion.div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white text-center mb-1">
                {tt('dailyLogin.title', 'Täglicher Login-Bonus')}
              </h2>
              <p className="text-white/80 text-center text-sm mb-6">
                {tt('dailyLogin.subtitle', 'Komm jeden Tag vorbei und sammle XP!')}
              </p>

              {/* Day + XP display */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-white/70 text-sm font-medium uppercase tracking-wider mb-1">
                    {tt('dailyLogin.dayLabel', 'Tag')} {claimDay}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-7 h-7 text-yellow-300 fill-yellow-300" />
                    <span className="text-4xl font-extrabold text-white">
                      {xpReward} XP
                    </span>
                    <Star className="w-7 h-7 text-yellow-300 fill-yellow-300" />
                  </div>
                </motion.div>
              </div>

              {/* Streak visualization - 7 circles */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
                {XP_REWARDS.map((dayXP, index) => {
                  const dayNum = index + 1;
                  const isCollected = dayNum < claimDay;
                  const isCurrent = dayNum === claimDay;
                  const isFuture = dayNum > claimDay;

                  return (
                    <motion.div
                      key={dayNum}
                      className="flex flex-col items-center gap-1"
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.35 + index * 0.06 }}
                    >
                      <div
                        className={`
                          w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                          transition-all duration-200 border-2
                          ${isCollected
                            ? 'bg-white/30 border-white/50'
                            : isCurrent
                              ? 'bg-white border-yellow-300 ring-2 ring-yellow-300/50 shadow-lg shadow-yellow-300/30'
                              : 'bg-white/10 border-white/20'
                          }
                        `}
                      >
                        {isCollected ? (
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        ) : isCurrent ? (
                          <Gift className="w-4 h-4 text-accent" strokeWidth={2.5} />
                        ) : (
                          <span className="text-white/40 text-xs font-bold">{dayNum}</span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-medium ${
                          isCurrent
                            ? 'text-yellow-300'
                            : isCollected
                              ? 'text-white/60'
                              : 'text-white/30'
                        }`}
                      >
                        {dayXP}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Streak info */}
              {streakState.currentStreak > 0 && (
                <motion.p
                  className="text-center text-white/70 text-xs mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Flame className="w-3 h-3 inline mr-1 text-orange-300" />
                  {tt('dailyLogin.streakInfo', 'Aktuelle Serie')}: {streakState.currentStreak}{' '}
                  {streakState.currentStreak === 1
                    ? tt('dailyLogin.day', 'Tag')
                    : tt('dailyLogin.days', 'Tage')}
                </motion.p>
              )}

              {/* Claim button */}
              <motion.button
                onClick={handleClaim}
                className="w-full py-3 rounded-xl bg-white text-accent font-bold text-lg
                  hover:bg-white/90 active:scale-[0.97] transition-all duration-150
                  shadow-lg shadow-black/20 cursor-pointer"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                {tt('dailyLogin.claimButton', 'Einsammeln!')}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
