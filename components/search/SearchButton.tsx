import { KBarButton } from './KBarButton'
import siteMetadata from '@/data/siteMetadata'
import { SearchIcon } from './icons'

const SearchButton = () => {
  if (
    siteMetadata.search) {
    const SearchButtonWrapper = KBarButton

    return (
      <SearchButtonWrapper aria-label="Search">
        <SearchIcon className="h-6 w-6 text-gray-900 dark:text-gray-100" />
      </SearchButtonWrapper>
    )
  }
}

export default SearchButton
