import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Search as SearchIcon, SlidersHorizontal, Eye, Heart, ThumbsDown, Play } from 'lucide-react'
import { mockGames } from '../data/mockGames'
import { formatNumber } from '../utils/formatters'
import { getSubjectConfig } from '../data/subjectConfig'
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

function SearchResultItem({ game, t }) {
  const navigate = useNavigate()
  const config = getSubjectConfig(game.subject)

  return (
    <div
      onClick={() => navigate(`/game/${game.id}`)}
      className="flex gap-4 p-4 bg-bg-secondary hover:bg-bg-card rounded-xl transition-colors duration-200 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className={`hidden sm:flex w-48 h-28 flex-shrink-0 rounded-lg bg-gradient-to-br ${config.gradient} items-center justify-center overflow-hidden relative`}>
        {game.thumbnail ? (
          <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1 left-2 text-5xl">{config.icon}</div>
            </div>
            <span className="text-3xl drop-shadow-lg">{config.icon}</span>
          </>
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
          {t('game.by')}{' '}
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
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const tag = searchParams.get('tag') || ''
  const sortParam = searchParams.get('sort') || 'relevance'

  const [localQuery, setLocalQuery] = useState(query)
  const [sortBy, setSortBy] = useState(sortParam)
  const [results, setResults] = useState([])

  const SORT_OPTIONS = [
    { value: 'relevance', label: t('search.sortRelevance') },
    { value: 'popular', label: t('search.sortPopular') },
    { value: 'new', label: t('search.sortNew') },
    { value: 'mostPlayed', label: t('search.sortMostPlayed') },
  ]

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
      <Helmet>
        <title>Search | MindForge</title>
        <meta name="description" content="Search for learning games on MindForge." />
        <meta property="og:title" content="Search | MindForge" />
        <meta property="og:description" content="Search for learning games on MindForge." />
      </Helmet>

      {/* Header */}
      <div className="mb-6">
        {query && <h1 className="text-2xl font-bold">{t('search.resultsFor', { query })}</h1>}
        {tag && !query && <h1 className="text-2xl font-bold">{t('search.gamesWithTag', { tag })}</h1>}
        {!query && !tag && <h1 className="text-2xl font-bold">{t('search.title')}</h1>}
        <p className="text-text-secondary mt-1">{t('search.resultsFound', { count: results.length })}</p>
      </div>

      {/* Search input */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={handleLocalSearch}
          placeholder={t('search.searchPlaceholder')}
          className="!pl-12 !py-3 !text-lg"
        />
      </div>

      {/* Filter & Sort */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={16} className="text-text-muted hidden sm:block" />
          <span className="text-sm bg-accent/20 text-accent px-3 py-1 rounded-full font-medium">{t('search.games')}</span>
          <span className="text-sm bg-bg-card text-text-muted px-3 py-1 rounded-full cursor-not-allowed hidden sm:inline" title={t('common.comingSoon')}>{t('search.creators')}</span>
          <span className="text-sm bg-bg-card text-text-muted px-3 py-1 rounded-full cursor-not-allowed hidden sm:inline" title={t('common.comingSoon')}>{t('search.assets')}</span>
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
            <SearchResultItem key={game.id} game={game} t={t} />
          ))}
        </div>
      ) : (query || tag) ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">&#128269;</div>
          <h2 className="text-xl font-bold mb-2">{t('search.noResults')}</h2>
          <p className="text-text-secondary mb-6">
            {query
              ? t('search.noResultsForQuery', { query })
              : t('search.noResultsForTag', { tag })}
          </p>
          <p className="text-text-muted mb-6">
            {t('search.tryOther')}
          </p>
          <Link to="/browse" className="bg-accent hover:bg-accent-dark px-6 py-3 rounded-lg font-semibold inline-block text-white transition-colors">
            {t('search.toMindbrowser')}
          </Link>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">&#128269;</div>
          <h2 className="text-xl font-bold mb-2">{t('search.whatAreYouLooking')}</h2>
          <p className="text-text-secondary">
            {t('search.enterSearchTerm')}
          </p>
        </div>
      )}
    </div>
  )
}
