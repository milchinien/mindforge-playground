import { useState } from 'react'
import { Gift, Send, User, MessageSquare, Clock, Check, ChevronRight, Search, Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import MindCoinIcon from '../components/common/MindCoinIcon'
import { usePremiumStore } from '../stores/premiumStore'
import useEscapeKey from '../hooks/useEscapeKey'

// ──────────── MOCK FRIENDS ────────────

const GIFT_FRIENDS = [
  { id: 'f-1', username: 'PixelMaster', level: 47, isOnline: true },
  { id: 'f-2', username: 'BrainStorm99', level: 43, isOnline: true },
  { id: 'f-3', username: 'QuizKoenig', level: 40, isOnline: false },
  { id: 'f-4', username: 'LernFuchs', level: 37, isOnline: true },
  { id: 'f-5', username: 'WissenHeld', level: 34, isOnline: false },
  { id: 'f-6', username: 'CodeNinja42', level: 32, isOnline: false },
  { id: 'f-7', username: 'MathGenius', level: 30, isOnline: true },
  { id: 'f-8', username: 'ScienceGirl', level: 28, isOnline: false },
]

const GIFT_AMOUNTS = [
  { amount: 50, label: '50 MC', popular: false },
  { amount: 100, label: '100 MC', popular: true },
  { amount: 250, label: '250 MC', popular: false },
  { amount: 500, label: '500 MC', popular: false },
]

// ──────────── CONFIRMATION MODAL ────────────

function ConfirmGiftModal({ friend, amount, message, onClose, onConfirm, userBalance }) {
  const [sent, setSent] = useState(false)
  useEscapeKey(onClose)

  const canAfford = (userBalance || 0) >= amount

  const handleSend = () => {
    if (!canAfford) return
    onConfirm()
    setSent(true)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-bg-secondary rounded-xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {sent ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Geschenk gesendet!</h3>
            <p className="text-text-secondary mb-1">
              Du hast <span className="font-bold text-accent">{amount} MindCoins</span> an
            </p>
            <p className="text-lg font-bold text-accent mb-4">{friend.username}</p>
            {message && (
              <div className="bg-bg-card rounded-lg p-3 mb-4 border border-gray-700">
                <p className="text-sm text-text-secondary italic">"{message}"</p>
              </div>
            )}
            <button
              onClick={onClose}
              className="bg-accent hover:bg-accent-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Fertig
            </button>
          </div>
        ) : (
          <>
            {/* Gift preview card */}
            <div className="bg-gradient-to-br from-accent/20 via-purple-500/10 to-pink-500/20 p-6 border-b border-gray-700">
              <div className="text-center">
                <Gift className="w-10 h-10 text-accent mx-auto mb-3" />
                <h3 className="text-lg font-bold text-text-primary">Geschenk bestaetigen</h3>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Preview card */}
              <div className="bg-bg-card rounded-xl p-4 border border-accent/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-muted">An:</p>
                    <p className="font-bold text-text-primary">{friend.username}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <MindCoinIcon size={24} />
                      <span className="text-xl font-bold text-accent">{amount}</span>
                    </div>
                    <p className="text-xs text-text-muted">MindCoins</p>
                  </div>
                </div>
                {message && (
                  <div className="mt-3 pt-3 border-t border-gray-700/50">
                    <p className="text-sm text-text-secondary flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-text-muted" />
                      <span className="italic">"{message}"</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Balance info */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Dein Guthaben:</span>
                <span className="font-bold text-text-primary">{(userBalance || 0).toLocaleString('de-DE')} MC</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Geschenk-Betrag:</span>
                <span className="font-bold text-accent">-{amount} MC</span>
              </div>
              <div className="flex items-center justify-between text-sm border-t border-gray-700 pt-2">
                <span className="text-text-secondary">Neues Guthaben:</span>
                <span className={`font-bold ${canAfford ? 'text-text-primary' : 'text-red-400'}`}>
                  {((userBalance || 0) - amount).toLocaleString('de-DE')} MC
                </span>
              </div>

              {!canAfford && (
                <p className="text-red-400 text-sm text-center font-medium">
                  Nicht genuegend MindCoins!
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg bg-bg-hover text-text-secondary font-semibold transition-colors cursor-pointer hover:bg-bg-card"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSend}
                  disabled={!canAfford}
                  className={`flex-1 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    canAfford
                      ? 'bg-accent hover:bg-accent-dark text-white cursor-pointer'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Senden
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ──────────── MAIN PAGE ────────────

export default function GiftMindCoins() {
  const { user } = useAuth()
  const { giftHistory, addGiftRecord } = usePremiumStore()

  const [selectedFriend, setSelectedFriend] = useState(null)
  const [selectedAmount, setSelectedAmount] = useState(100)
  const [giftMessage, setGiftMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const filteredFriends = GIFT_FRIENDS.filter(f =>
    f.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendGift = () => {
    if (!selectedFriend || !selectedAmount) return
    setShowConfirm(true)
  }

  const handleConfirmGift = () => {
    addGiftRecord({
      id: `gift-${Date.now()}`,
      recipientId: selectedFriend.id,
      recipientName: selectedFriend.username,
      amount: selectedAmount,
      message: giftMessage,
      date: new Date().toISOString(),
    })
  }

  const handleCloseConfirm = () => {
    setShowConfirm(false)
    setSelectedFriend(null)
    setSelectedAmount(100)
    setGiftMessage('')
  }

  return (
    <div className="p-6">
      <>
        <title>MindCoins verschenken | MindForge</title>
        <meta name="description" content="Verschenke MindCoins an deine Freunde auf MindForge." />
      </>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-pink-500/20 flex items-center justify-center">
          <Gift className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">MindCoins verschenken</h1>
          <p className="text-text-secondary">Mach deinen Freunden eine Freude mit MindCoins!</p>
        </div>
      </div>

      {/* Balance card */}
      <div className="bg-bg-card rounded-xl p-4 border border-gray-700 mb-8 flex items-center gap-4">
        <MindCoinIcon size={48} />
        <div>
          <p className="text-sm text-text-muted">Dein Guthaben</p>
          <p className="text-2xl font-bold text-accent">{(user?.mindCoins || 0).toLocaleString('de-DE')} MindCoins</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Friend selection + Amount */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Select friend */}
          <div className="bg-bg-card rounded-xl p-5 border border-gray-700">
            <h2 className="font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">1</span>
              Freund auswaehlen
            </h2>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Freund suchen..."
                className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary border border-gray-700 rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredFriends.length === 0 ? (
                <p className="text-text-muted text-center py-6 text-sm">Keine Freunde gefunden</p>
              ) : (
                filteredFriends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => setSelectedFriend(friend)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                      selectedFriend?.id === friend.id
                        ? 'bg-accent/15 border border-accent/40 ring-1 ring-accent/20'
                        : 'bg-bg-secondary border border-transparent hover:bg-bg-hover'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-bg-hover flex items-center justify-center">
                        <User className="w-5 h-5 text-text-muted" />
                      </div>
                      {friend.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-bg-card" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-semibold text-sm ${selectedFriend?.id === friend.id ? 'text-accent' : 'text-text-primary'}`}>
                        {friend.username}
                      </p>
                      <p className="text-xs text-text-muted">Level {friend.level}</p>
                    </div>
                    {selectedFriend?.id === friend.id && (
                      <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    )}
                    <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Step 2: Select amount */}
          <div className="bg-bg-card rounded-xl p-5 border border-gray-700">
            <h2 className="font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">2</span>
              Betrag waehlen
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GIFT_AMOUNTS.map((opt) => (
                <button
                  key={opt.amount}
                  onClick={() => setSelectedAmount(opt.amount)}
                  className={`relative py-4 rounded-xl text-center font-bold transition-all cursor-pointer border ${
                    selectedAmount === opt.amount
                      ? 'bg-accent/15 border-accent text-accent ring-2 ring-accent/20'
                      : 'bg-bg-secondary border-gray-700 text-text-primary hover:border-gray-500'
                  }`}
                >
                  {opt.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-accent text-white px-2 py-0.5 rounded-full">
                      Beliebt
                    </span>
                  )}
                  <MindCoinIcon size={28} className="mx-auto mb-1" />
                  <span className="text-lg">{opt.amount}</span>
                  <p className="text-xs text-text-muted font-normal mt-0.5">MindCoins</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Personal message */}
          <div className="bg-bg-card rounded-xl p-5 border border-gray-700">
            <h2 className="font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">3</span>
              Persoenliche Nachricht
              <span className="text-xs text-text-muted font-normal ml-1">(optional)</span>
            </h2>

            <div className="relative">
              <textarea
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value.slice(0, 100))}
                placeholder="Schreib eine kurze Nachricht..."
                maxLength={100}
                rows={3}
                className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-accent resize-none"
              />
              <span className="absolute bottom-2 right-3 text-xs text-text-muted">
                {giftMessage.length}/100
              </span>
            </div>
          </div>
        </div>

        {/* Right column - Gift preview + History */}
        <div className="space-y-6">
          {/* Gift preview card */}
          <div className="bg-gradient-to-br from-accent/10 via-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-accent/20 sticky top-20">
            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              Geschenk-Vorschau
            </h3>

            <div className="bg-bg-card/80 rounded-xl p-4 border border-gray-700/50 mb-4">
              <div className="text-center mb-3">
                <Gift className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-xs text-text-muted">Von {user?.username || 'Dir'} an</p>
                <p className="font-bold text-text-primary">
                  {selectedFriend?.username || '...'}
                </p>
              </div>

              <div className="text-center py-3 border-t border-b border-gray-700/50">
                <div className="flex items-center justify-center gap-2">
                  <MindCoinIcon size={32} />
                  <span className="text-2xl font-bold text-accent">{selectedAmount}</span>
                </div>
                <p className="text-xs text-text-muted mt-1">MindCoins</p>
              </div>

              {giftMessage && (
                <div className="mt-3">
                  <p className="text-xs text-text-muted mb-1">Nachricht:</p>
                  <p className="text-sm text-text-secondary italic">"{giftMessage}"</p>
                </div>
              )}
            </div>

            <button
              onClick={handleSendGift}
              disabled={!selectedFriend}
              className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                selectedFriend
                  ? 'bg-accent hover:bg-accent-dark text-white cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              Geschenk senden
            </button>

            {!selectedFriend && (
              <p className="text-xs text-text-muted text-center mt-2">
                Waehle zuerst einen Freund aus
              </p>
            )}
          </div>

          {/* Gift history */}
          <div className="bg-bg-card rounded-xl p-5 border border-gray-700">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-between w-full cursor-pointer"
            >
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-muted" />
                Geschenk-Verlauf
              </h3>
              <ChevronRight className={`w-4 h-4 text-text-muted transition-transform ${showHistory ? 'rotate-90' : ''}`} />
            </button>

            {showHistory && (
              <div className="mt-4 space-y-3">
                {giftHistory.length === 0 ? (
                  <p className="text-text-muted text-sm text-center py-4">
                    Noch keine Geschenke gesendet
                  </p>
                ) : (
                  giftHistory.slice(0, 10).map((gift) => (
                    <div key={gift.id} className="flex items-center gap-3 py-2 border-b border-gray-700/50 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Gift className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary font-medium truncate">
                          An {gift.recipientName}
                        </p>
                        <p className="text-xs text-text-muted">
                          {new Date(gift.date).toLocaleDateString('de-DE', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                          })}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-accent flex-shrink-0">
                        {gift.amount} MC
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && selectedFriend && (
        <ConfirmGiftModal
          friend={selectedFriend}
          amount={selectedAmount}
          message={giftMessage}
          onClose={handleCloseConfirm}
          onConfirm={handleConfirmGift}
          userBalance={user?.mindCoins || 0}
        />
      )}
    </div>
  )
}
