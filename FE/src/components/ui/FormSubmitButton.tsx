interface Props {
  isPending: boolean
  pendingLabel: string
  children: React.ReactNode
  onClick?: () => void
}

export default function FormSubmitButton({ isPending, pendingLabel, children, onClick }: Props) {
  return (
    <button
      type="submit"
      disabled={isPending}
      onClick={onClick}
      className="h-10 bg-[#8B2635] hover:bg-[#7A2030] text-white rounded-md text-sm font-semibold
                 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isPending ? pendingLabel : children}
    </button>
  )
}
