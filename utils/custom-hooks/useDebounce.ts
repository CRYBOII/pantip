import { useEffect } from 'react'
import useTimeout from './useTimeout'

export default function useDebounce(
  callback: Function,
  delay: Number,
  dependencies: any
) {
  const { reset, clear } = useTimeout(callback, delay)
  useEffect(reset, [...dependencies, reset])
  useEffect(clear, [])
}
