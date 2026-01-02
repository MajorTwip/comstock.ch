import siteMetadata from '@/data/siteMetadata'
import { SearchIcon } from './icons'
import { useSearch } from './SearchContext'

const SearchButton = () => {
  const { toggle } = useSearch()

  if (!siteMetadata.search) return null

  return (
    <button aria-label="Search" onClick={toggle}>
      <SearchIcon className="h-6 w-6 text-gray-900 dark:text-gray-100" />
    </button>
  )
}

export default SearchButton
