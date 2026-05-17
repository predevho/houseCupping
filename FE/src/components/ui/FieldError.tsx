interface Props {
  message?: string | null
}

export default function FieldError({ message }: Props) {
  if (!message) return null
  return (
    <p role="alert" className="text-[10px] text-red-600 mt-1">
      {message}
    </p>
  )
}
