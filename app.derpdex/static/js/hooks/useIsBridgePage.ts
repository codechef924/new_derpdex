import { useLocation } from 'react-router-dom'

// eslint-disable-next-line import/no-unused-modules
export function useIsBridgePage() {
  const { pathname } = useLocation()
  return pathname.startsWith('/bridge')
}
