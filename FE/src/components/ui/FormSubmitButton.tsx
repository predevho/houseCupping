interface Props {
  isPending: boolean
  pendingLabel: string
  children: React.ReactNode
}

export default function FormSubmitButton({ isPending, pendingLabel, children }: Props) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="h-10 bg-[#8B2635] hover:bg-[#7A2030] text-white rounded-md text-sm font-semibold
                 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isPending ? pendingLabel : children}
    </button>
  )
}
