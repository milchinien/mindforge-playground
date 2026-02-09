import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Search as SearchIcon, SlidersHorizontal, Eye, Heart, ThumbsDown, Play } from 'lucide-react'
import { mockGames } from '../data/mockGames'
import { formatNumber } from '../utils/formatters'
import TagList from '../components/game/TagList'

// Search algorithm
function searchGames(query, games) {
  if (!query || query.trim() === '') return []
  const searchTerm = query.toLowerCase().trim()

  return games
    .map(game => {
      let score = 0
      if (game.title.toLowerCase().includes(searchTerm)) {
        score += 10
        if (game.title.toLowerCase().startsWith(searchTerm)) score += 5
      }
      if (game.tags.some(tag => tag.toLowerCase().includes(searchTerm))) score += 5
      if (game.creator.toLowerCase().includes(searchTerm)) score += 3
      if (game.description.toLowerCase().includes(searchTerm)) score += 1
      return { ...game, relevanceScore: score }
    })
    .filter(game => game.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
}

function searchByTag(tag, games) {
  if (!tag) return []
  return games.filter(game =>
    game.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}

function sortGames(games, sortBy) {
  switch (sortBy) {
    case 'popular':
      return [...games].sort((a, b) => b.likes - a.likes)
    case 'new':
      return [...games].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'mostPlayed':
      return [...games].sort((a, b) => b.plays - a.plays)
    case 'relevance':
    default:
      return games
  }
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevanz' },
  { value: 'popular', label: 'Beliebt' },
  { value: 'new', label: 'Neueste' },
  { value: 'mostPlayed', label: 'Meistgespielt' },
]

const subjectGradients = {
  mathematik: 'from-blue-600 to-blue-800',
  physik: 'from-purple-600 to-purple-800',
  chemie: 'from-green-600 to-green-800',
  biologie: 'from-emerald-600 to-emerald-800',
  deutsch: 'from-red-600 to-red-800',
  englisch: 'from-yellow-600 to-yellow-800',
  geschichte: 'from-amber-600 to-amber-800',
  geographie: 'from-teal-600 to-teal-800',
  informatik: 'from-cyan-600 to-cyan-800',
  kunst: 'from-pink-600 to-pink-800',
  musik: 'from-violet-600 to-violet-800'
}

function SearchResultItem({ game }) {
  const navigate = useNavigate()
  const gradient = subjectGradients[game.subject] || 'from-gray-600 to-gray-800'

  return (
    <div
      onClick={() => navigate(`/game/${game.id}`)}
      className="flex gap-4 p-4 bg-bg-secondary hover:bg-bg-card rounded-xl transition-colors duration-200 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className={`hidden sm:flex w-48 h-28 flex-shrink-0 rounded-lg bg-gradient-to-br ${gradient} items-center justify-center overflow-hidden`}>
        {game.thumbnail ? (
          <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl font-bold text-white/30">{game.title.charAt(0)}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h3 className="text-lg font-bold text-text-primary line-clamp-1">{game.title}</h3>
          {game.premium && (
            <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0">
              {game.price > 0 ? `${game.price} MC` : 'Premium'}
            </span>
          )}
        </div>

        <p className="text-text-muted text-sm mt-0.5">
          von{' '}
          <Link
            to={`/profile/${game.creator}`}
            onClick={(e) => e.stopPropagation()}
            className="text-accent hover:underline"
          >
            {game.creator}
          </Link>
        </p>

        <p className="text-text-secondary text-sm mt-1 line-clamp-2">{game.description}</p>

        <div className="mt-2">
          <TagList tags={game.tags} maxTags={5} size="sm" />
        </div>

        <div className="flex items-center gap-4 mt-2 text-text-muted text-xs">
          <span className="flex items-center gap-1"><Heart size={12} /> {formatNumber(game.likes)}</span>
          <span className="flex items-center gap-1"><ThumbsDown size={12} /> {formatNumber(game.dislikes)}</span>
          <span className="flex items-center gap-1"><Play size={12} /> {formatNumber(game.plays)}</span>
          <span className="flex items-center gap-1"><Eye size={12} /> {formatNumber(game.views)}</span>
        </div>
      </div>
    </div>
  )
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const tag = searchParams.get('tag') || ''
  const sortParam = searchParams.get('sort') || 'relevance'

  const [localQuery, setLocalQuery] = useState(query)
  const [sortBy, setSortBy] = useState(sortParam)
  const [results, setResults] = useState([])

  useEffect(() => {
    setLocalQuery(query)
  }, [query])

  useEffect(() => {
    let searchResults = []
    if (query) {
      searchResults = searchGames(query, mockGames)
    } else if (tag) {
      searchResults = searchByTag(tag, mockGames)
    }
    searchResults = sortGames(searchResults, sortBy)
    setResults(searchResults)
  }, [query, tag, sortBy])

  const handleLocalSearch = (e) => {
    if (e.key === 'Enter' && localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() })
    }
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    const params = new URLSearchParams(searchParams)
    params.set('sort', newSort)
    setSearchParams(params)
  }

  return (
    <div className="py-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        {query && <h1 className="text-2xl font-bold">Suchergebnisse fuer &quot;{query}&quot;</h1>}
        {tag && !query && <h1 className="text-2xl font-bold">Spiele mit Tag #{tag}</h1>}
        {!query && !tag && <h1 className="text-2xl font-bold">Suche</h1>}
        <p className="text-text-secondary mt-1">{results.length} Ergebnisse gefunden</p>
      </div>

      {/* Search input */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={handleLocalSearch}
          placeholder="Spiele suchen..."
          className="!pl-12 !py-3 !text-lg"
        />
      </div>

      {/* Filter & Sort */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={16} className="text-text-muted hidden sm:block" />
          <span className="text-sm bg-accent/20 text-accent px-3 py-1 rounded-full font-medium">Spiele</span>
          <span className="text-sm bg-bg-card text-text-muted px-3 py-1 rounded-full cursor-not-allowed hidden sm:inline" title="Kommt bald">Creators</span>
          <span className="text-sm bg-bg-card text-text-muted px-3 py-1 rounded-full cursor-not-allowed hidden sm:inline" title="Kommt bald">Assets</span>
        </div>

        <div className="ml-auto">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="!w-auto !py-1.5 !px-3 !text-sm"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map(game => (
            <SearchResultItem key={game.id} game={game} />
          ))}
        </div>
      ) : (query || tag) ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">&#128269;</div>
          <h2 className="text-xl font-bold mb-2">Keine Ergebnisse gefunden</h2>
          <p className="text-text-secondary mb-6">
            {query
              ? `Fuer "${query}" wurden keine Spiele gefunden.`
              : `Keine Spiele mit dem Tag #${tag} gefunden.`}
          </p>
          <p className="text-text-muted mb-6">
            Versuche einen anderen Suchbegriff oder stoebre im Mindbrowser.
          </p>
          <Link to="/browse" className="bg-accent hover:bg-accent-dark px-6 py-3 rounded-lg font-semibold inline-block text-white transition-colors">
            Zum Mindbrowser
          </Link>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">&#128269;</div>
          <h2 className="text-xl font-bold mb-2">Wonach suchst du?</h2>
          <p className="text-text-secondary">
            Gib einen Suchbegriff ein um Spiele zu finden.
          </p>
        </div>
      )}
    </div>
  )
}
