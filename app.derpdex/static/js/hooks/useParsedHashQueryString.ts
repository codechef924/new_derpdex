import { parse, ParsedQs } from 'qs'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

function parsedHashQueryString(search?: string): ParsedQs {
  if (!search) {
    // react-router-dom places search string in the hash
    const hash = window.location.href
    search = hash.substr(hash.indexOf('?'))
  }
  return search && search.length > 1 ? parse(search, { parseArrays: false, ignoreQueryPrefix: true }) : {}
}

export default function useParsedHashQueryString(): ParsedQs {
  const { search } = useLocation()
  return useMemo(() => parsedHashQueryString(search), [search])
}
