import { useState } from 'react'
import { GripVertical, Trash2, ChevronDown, ChevronUp, Check, HelpCircle, Type, ImageIcon, Clock, Trophy, Palette, GitBranch, Repeat } from 'lucide-react'
import { getCategoryMeta, BLOCK_TYPES } from '../../data/builderBlocks'

const ICON_MAP = {
  HelpCircle,
  Type,
  ImageIcon,
  Clock,
  Trophy,
  Palette,
  GitBranch,
  Repeat,
}

// ---- Field Renderers ----

function QuestionFields({ data, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[10px] text-text-muted mb-1 uppercase tracking-wide">Frage</label>
        <input
          type="text"
          value={data.questionText}
          onChange={(e) => onChange({ ...data, questionText: e.target.value })}
          placeholder="Deine Frage eingeben..."
          className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {data.answers.map((answer, i) => (
          <div key={i} className="relative">
            <input
              type="text"
              value={answer}
              onChange={(e) => {
                const newAnswers = [...data.answers]
                newAnswers[i] = e.target.value
                onChange({ ...data, answers: newAnswers })
              }}
              placeholder={`Antwort ${i + 1}`}
              className={`w-full bg-bg-secondary border rounded-lg pl-3 pr-8 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none transition-colors ${
                data.correctAnswer === i
                  ? 'border-green-500/50 bg-green-500/5'
                  : 'border-gray-700 focus:border-accent/50'
              }`}
            />
            <button
              onClick={() => onChange({ ...data, correctAnswer: i })}
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                data.correctAnswer === i
                  ? 'bg-green-500 text-white'
                  : 'bg-bg-hover text-text-muted hover:text-text-primary'
              }`}
              title={data.correctAnswer === i ? 'Richtige Antwort' : 'Als richtig markieren'}
            >
              <Check size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function TimerFields({ data, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[10px] text-text-muted mb-1 uppercase tracking-wide">Zeitlimit (Sekunden)</label>
        <select
          value={data.duration}
          onChange={(e) => onChange({ ...data, duration: Number(e.target.value) })}
          className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-accent/50"
        >
          <option value={10}>10 Sekunden</option>
          <option value={15}>15 Sekunden</option>
          <option value={20}>20 Sekunden</option>
          <option value={30}>30 Sekunden</option>
          <option value={45}>45 Sekunden</option>
          <option value={60}>60 Sekunden</option>
          <option value={90}>90 Sekunden</option>
          <option value={120}>2 Minuten</option>
          <option value={300}>5 Minuten</option>
        </select>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.showTimer}
            onChange={(e) => onChange({ ...data, showTimer: e.target.checked })}
            className="w-3.5 h-3.5 rounded accent-red-500"
          />
          <span className="text-xs text-text-secondary">Timer anzeigen</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.autoSubmit}
            onChange={(e) => onChange({ ...data, autoSubmit: e.target.checked })}
            className="w-3.5 h-3.5 rounded accent-red-500"
          />
          <span className="text-xs text-text-secondary">Auto-Weiter bei Ablauf</span>
        </label>
      </div>
    </div>
  )
}

function ScoreFields({ data, onChange }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] text-text-muted mb-1 uppercase tracking-wide">Punkte (richtig)</label>
          <input
            type="number"
            value={data.pointsPerCorrect}
            onChange={(e) => onChange({ ...data, pointsPerCorrect: Number(e.target.value) })}
            min={0}
            max={1000}
            className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-accent/50"
          />
        </div>
        <div>
          <label className="block text-[10px] text-text-muted mb-1 uppercase tracking-wide">Punkte (falsch)</label>
          <input
            type="number"
            value={data.pointsPerWrong}
            onChange={(e) => onChange({ ...data, pointsPerWrong: Number(e.target.value) })}
            min={-100}
            max={0}
            className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-accent/50"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={data.showScore}
          onChange={(e) => onChange({ ...data, showScore: e.target.checked })}
          className="w-3.5 h-3.5 rounded accent-orange-500"
        />
        <span className="text-xs text-text-secondary">Punktestand anzeigen</span>
      </label>
    </div>
  )
}

function DesignBgFields({ data, onChange }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] text-text-muted mb-1 uppercase tracking-wide">Hintergrundfarbe</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={data.backgroundColor}
              onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })}
              className="w-8 h-8 rounded border border-gray-700 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={data.backgroundColor}
              onChange={(e) => onChange({ ...data, backgroundColor: e.target.value })}
              className="flex-1 bg-bg-secondary border border-gray-700 rounded-lg px-2 py-1 text-xs text-text-primary font-mono focus:outline-none focus:border-accent/50"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-text-muted mb-1 uppercase tracking-wide">Textfarbe</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={data.textColor}
              onChange={(e) => onChange({ ...data, textColor: e.target.value })}
              className="w-8 h-8 rounded border border-gray-700 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={data.textColor}
              onChange={(e) => onChange({ ...data, textColor: e.target.value })}
              className="flex-1 bg-bg-secondary border border-gray-700 rounded-lg px-2 py-1 text-xs text-text-primary font-mono focus:outline-none focus:border-accent/50"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-[10px] text-text-muted mb-1 uppercase tracking-wide">Schriftart</label>
        <select
          value={data.fontFamily}
          onChange={(e) => onChange({ ...data, fontFamily: e.target.value })}
          className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-accent/50"
        >
          <option value="sans-serif">Sans-Serif (Standard)</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
          <option value="'Segoe UI', sans-serif">Segoe UI</option>
          <option value="Georgia, serif">Georgia</option>
        </select>
      </div>
    </div>
  )
}

function TextFields({ data, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[10px] text-text-muted mb-1 uppercase tracking-wide">Text-Inhalt</label>
        <textarea
          value={data.content}
          onChange={(e) => onChange({ ...data, content: e.target.value })}
          placeholder="Text oder Anweisungen eingeben..."
          rows={3}
          className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 resize-none"
        />
      </div>
      <div className="flex items-center gap-4">
        <div>
          <label className="block text-[10px] text-text-muted mb-1 uppercase tracking-wide">Schriftgroesse</label>
          <input
            type="number"
            value={data.fontSize}
            onChange={(e) => onChange({ ...data, fontSize: e.target.value })}
            min={10}
            max={48}
            className="w-20 bg-bg-secondary border border-gray-700 rounded-lg px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent/50"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer mt-3">
          <input
            type="checkbox"
            checked={data.bold}
            onChange={(e) => onChange({ ...data, bold: e.target.checked })}
            className="w-3.5 h-3.5 rounded accent-blue-500"
          />
          <span className="text-xs text-text-secondary">Fett</span>
        </label>
      </div>
    </div>
  )
}

function ImageFields({ data, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[10px] text-text-muted mb-1 uppercase tracking-wide">Bild-URL</label>
        <input
          type="url"
          value={data.imageUrl}
          onChange={(e) => onChange({ ...data, imageUrl: e.target.value })}
          placeholder="https://beispiel.de/bild.jpg"
          className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] text-text-muted mb-1 uppercase tracking-wide">Alt-Text</label>
          <input
            type="text"
            value={data.altText}
            onChange={(e) => onChange({ ...data, altText: e.target.value })}
            placeholder="Bildbeschreibung"
            className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
          />
        </div>
        <div>
          <label className="block text-[10px] text-text-muted mb-1 uppercase tracking-wide">Breite (%)</label>
          <input
            type="number"
            value={data.width}
            onChange={(e) => onChange({ ...data, width: e.target.value })}
            min={10}
            max={100}
            className="w-full bg-bg-secondary border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent/50"
          />
        </div>
      </div>
      {data.imageUrl && (
        <div className="bg-bg-secondary rounded-lg p-2">
          <img
            src={data.imageUrl}
            alt={data.altText || 'Vorschau'}
            className="max-h-24 mx-auto rounded"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
      )}
    </div>
  )
}

function IfElseFields({ data, onChange }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-text-secondary">Wenn</span>
        <select
          value={data.condition}
          onChange={(e) => onChange({ ...data, condition: e.target.value })}
          className="bg-bg-secondary border border-gray-700 rounded-lg px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent/50"
        >
          <option value="score">Punkte</option>
          <option value="question">Fragenummer</option>
        </select>
        <select
          value={data.operator}
          onChange={(e) => onChange({ ...data, operator: e.target.value })}
          className="bg-bg-secondary border border-gray-700 rounded-lg px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent/50"
        >
          <option value=">=">groesser/gleich</option>
          <option value=">">groesser als</option>
          <option value="<=">kleiner/gleich</option>
          <option value="<">kleiner als</option>
          <option value="===">gleich</option>
        </select>
        <input
          type="number"
          value={data.value}
          onChange={(e) => onChange({ ...data, value: Number(e.target.value) })}
          className="w-16 bg-bg-secondary border border-gray-700 rounded-lg px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent/50"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-2">
          <label className="block text-[10px] text-green-400 mb-1 font-semibold">DANN</label>
          <input
            type="text"
            value={data.thenValue}
            onChange={(e) => onChange({ ...data, thenValue: e.target.value })}
            placeholder="Nachricht..."
            className="w-full bg-bg-secondary border border-gray-700 rounded px-2 py-1 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green-500/50"
          />
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2">
          <label className="block text-[10px] text-red-400 mb-1 font-semibold">SONST</label>
          <input
            type="text"
            value={data.elseValue}
            onChange={(e) => onChange({ ...data, elseValue: e.target.value })}
            placeholder="Nachricht..."
            className="w-full bg-bg-secondary border border-gray-700 rounded px-2 py-1 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-500/50"
          />
        </div>
      </div>
    </div>
  )
}

function LoopFields({ data, onChange }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={data.shuffleQuestions}
          onChange={(e) => onChange({ ...data, shuffleQuestions: e.target.checked })}
          className="w-3.5 h-3.5 rounded accent-green-500"
        />
        <span className="text-xs text-text-secondary">Fragen zufaellig mischen</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={data.repeatOnWrong}
          onChange={(e) => onChange({ ...data, repeatOnWrong: e.target.checked })}
          className="w-3.5 h-3.5 rounded accent-green-500"
        />
        <span className="text-xs text-text-secondary">Falsche Fragen wiederholen</span>
      </label>
    </div>
  )
}

// ---- Field Renderer Map ----
const FIELD_RENDERERS = {
  question: QuestionFields,
  timer: TimerFields,
  score: ScoreFields,
  designBg: DesignBgFields,
  text: TextFields,
  image: ImageFields,
  ifElse: IfElseFields,
  loop: LoopFields,
}

// ---- Main Block Component ----

export default function BuilderBlock({
  block,
  index,
  totalBlocks,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
  isDragTarget,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const categoryMeta = getCategoryMeta(block.category)
  const blockDef = BLOCK_TYPES[block.type]
  const Icon = ICON_MAP[blockDef?.icon] || HelpCircle
  const FieldRenderer = FIELD_RENDERERS[block.type]

  const handleDataChange = (newData) => {
    onUpdate(block.id, newData)
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`group relative rounded-xl overflow-hidden transition-all duration-200 ${
        isDragTarget
          ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-primary'
          : 'hover:ring-1 hover:ring-gray-600'
      }`}
    >
      {/* Top connector nub */}
      {index > 0 && (
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-3 rounded-b-lg z-10"
          style={{ backgroundColor: categoryMeta.color, opacity: 0.6 }}
        />
      )}

      {/* Block header */}
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-grab active:cursor-grabbing"
        style={{ backgroundColor: categoryMeta.color }}
      >
        <GripVertical size={14} className="text-white/70 flex-shrink-0" />
        <Icon size={14} className="text-white flex-shrink-0" />
        <span className="text-xs font-bold text-white flex-1 truncate">
          {blockDef?.label || block.type}
        </span>
        <span className="text-[10px] text-white/60 mr-1">#{index + 1}</span>

        <button
          onClick={() => setIsCollapsed(prev => !prev)}
          className="text-white/70 hover:text-white transition-colors cursor-pointer p-0.5"
          title={isCollapsed ? 'Aufklappen' : 'Zuklappen'}
        >
          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>

        <button
          onClick={() => onDelete(block.id)}
          className="text-white/50 hover:text-white transition-colors cursor-pointer p-0.5"
          title="Block loeschen"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Block body (fields) */}
      {!isCollapsed && (
        <div
          className="bg-bg-card p-3 border-l-2 border-r-2 border-b-2 rounded-b-xl"
          style={{ borderColor: `${categoryMeta.color}44` }}
        >
          {FieldRenderer ? (
            <FieldRenderer data={block.data} onChange={handleDataChange} />
          ) : (
            <p className="text-xs text-text-muted italic">Keine Konfiguration verfuegbar</p>
          )}
        </div>
      )}

      {/* Bottom connector nub */}
      {index < totalBlocks - 1 && (
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-3 rounded-t-lg z-10"
          style={{ backgroundColor: categoryMeta.color, opacity: 0.6 }}
        />
      )}
    </div>
  )
}
