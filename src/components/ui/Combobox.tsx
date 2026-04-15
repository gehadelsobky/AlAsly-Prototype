'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'

interface ComboboxOption {
  value: string
  label: string
  [key: string]: any
}

interface ComboboxProps {
  options: ComboboxOption[]
  onSelect: (option: ComboboxOption) => void
  onSearch: (query: string) => Promise<ComboboxOption[]>
  placeholder?: string
  isLoading?: boolean
  value?: ComboboxOption | null
  searchDebounceMs?: number
}

export function Combobox({
  onSelect,
  onSearch,
  placeholder = 'ابحث...',
  isLoading = false,
  value = null,
  searchDebounceMs = 500,
  options: initialOptions = [],
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [options, setOptions] = React.useState<ComboboxOption[]>([])
  const [loading, setLoading] = React.useState(false)
  const [selected, setSelected] = React.useState<ComboboxOption | null>(value)
  const debounceTimerRef = React.useRef<NodeJS.Timeout>()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const onSearchRef = React.useRef(onSearch)

  // Update ref when onSearch changes
  React.useEffect(() => {
    onSearchRef.current = onSearch
  }, [onSearch])

  React.useEffect(() => {
    setSelected(value)
  }, [value])

  React.useEffect(() => {
    if (!open) {
      setSearch('')
      setOptions([])
      return
    }

    if (!search.trim()) {
      setOptions([])
      return
    }

    // Debounce search
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    setLoading(true)
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await onSearchRef.current(search)
        setOptions(Array.isArray(results) ? results : [])
      } catch (error) {
        console.error('Search error:', error)
        setOptions([])
      } finally {
        setLoading(false)
      }
    }, searchDebounceMs)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [search, open, searchDebounceMs])

  const handleSelect = React.useCallback((option: ComboboxOption) => {
    setSelected(option)
    onSelect(option)
    setOpen(false)
    setSearch('')
    setOptions([])
  }, [onSelect])

  return (
    <div className="w-full relative" ref={containerRef}>
      {open && (
        <div 
          className="fixed inset-0 z-40" 
          onMouseDown={(e) => {
            // Only close if clicking outside the container
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
              setOpen(false)
            }
          }}
          style={{ pointerEvents: 'auto' }}
        />
      )}
      
      <div className="relative z-50">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 justify-between items-center"
        >
          <span>{selected ? selected.label : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-md border border-input bg-background shadow-lg">
            <div className="p-2 border-b border-input">
              <Input
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>

            <div className="max-h-60 overflow-y-auto">
              {loading || isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : options.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  {search.trim().length < 2 ? 'اكتب 2 أحرف على الأقل للبحث' : 'لا توجد نتائج'}
                </div>
              ) : (
                <div>
                  {options.map((option, index) => (
                    <button
                      key={`${option.value}-${index}`}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleSelect(option)
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-accent cursor-pointer text-left bg-background"
                    >
                      <span className="text-right flex-1">{option.label}</span>
                      {selected?.value === option.value && (
                        <Check className="h-4 w-4 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
