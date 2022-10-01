import { useApi } from '@/hooks'
import { getInstanceList } from '@/api/instance'

export function useInstanceList() {
  const { loading, error, result, fetchResource } = useApi(getInstanceList)
  return {
    loading,
    error,
    list: result,
    fetchResource
  }
}
