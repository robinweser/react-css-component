export default function isDOMReady() {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    document.head
  )
}
