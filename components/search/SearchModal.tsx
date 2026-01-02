'use client'

import { useMemo, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { useParams } from 'next/navigation'
import { useTranslation } from 'app/[locale]/i18n/client'
import { LocaleTypes } from 'app/[locale]/i18n/settings'
import { fallbackLng } from 'app/[locale]/i18n/locales'
import { SearchIcon } from './icons'

export interface SearchItem {
  id: string
  name: string
  subtitle?: string
  keywords?: string
  perform?: () => void
}

interface SearchModalProps {
  open: boolean
  setOpen: (value: boolean) => void
  items: SearchItem[]
  isLoading: boolean
}

const SearchModal = ({ open, setOpen, items, isLoading }: SearchModalProps) => {
  const locale = (useParams()?.locale as LocaleTypes) || fallbackLng
  const { t } = useTranslation(locale, 'common')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return items
    return items.filter((item) => {
      const haystack = `${item.name} ${item.subtitle ?? ''} ${item.keywords ?? ''}`.toLowerCase()
      return haystack.includes(term)
    })
  }, [items, query])

  const close = () => {
    setQuery('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={close} className="fixed inset-0 z-50">
      <div className="flex min-h-full items-start justify-center bg-gray-300/50 p-4 backdrop-blur backdrop-filter dark:bg-black/50">
        <Dialog.Panel className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 text-left shadow-xl transition-all dark:border-gray-800 dark:bg-[#1c1c1c]">
          <div className="flex items-center space-x-4 p-4">
            <span className="block w-5">
              <SearchIcon className="text-gray-400 dark:text-gray-300" />
            </span>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchplaceholder')}
              className="h-8 w-full bg-transparent text-gray-600 placeholder-gray-400 focus:outline-none dark:text-gray-200 dark:placeholder-gray-500"
            />
            <kbd className="inline-block whitespace-nowrap rounded border border-gray-400 px-1.5 align-middle text-xs font-medium leading-4 tracking-wide text-gray-400">
              ESC
            </kbd>
          </div>
          <div className="max-h-[420px] overflow-y-auto border-t border-gray-100 dark:border-gray-800">
            {isLoading && (
              <div className="px-4 py-6 text-center text-gray-400 dark:text-gray-600">
                {t('loading')}
              </div>
            )}
            {!isLoading && filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-400 dark:text-gray-600">
                {t('noresults')}
              </div>
            )}
            {!isLoading &&
              filtered.map((item) => (
                <button
                  key={item.id}
                  className="flex w-full cursor-pointer justify-between px-4 py-3 text-left text-gray-700 hover:bg-primary-50 dark:text-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    item.perform?.()
                    close()
                  }}
                >
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    {item.subtitle ? (
                      <span className="text-xs text-gray-400 dark:text-gray-500">{item.subtitle}</span>
                    ) : null}
                  </div>
                </button>
              ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default SearchModal
