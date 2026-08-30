import { useElementSize } from 'utils/hooks/useElementSize'

export const useElementHeight = <T extends HTMLElement>() => {
  const { ref, height } = useElementSize<T>()
  return { ref, height }
}
