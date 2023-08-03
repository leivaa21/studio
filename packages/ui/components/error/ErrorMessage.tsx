export function ErrorMessage({message}: {message: string}) {
  return <span style={{ color: 'red', padding: '.5rem' }}>{message}</span>
}