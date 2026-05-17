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
      className="mt-1 h-10 rounded-md bg-[#8B2635] px-4 text-sm font-semibold text-white shadow-sm
                 transition-all duration-150 hover:bg-[#6F1D2A] hover:shadow-md
                 dark:hover:bg-[#A43348] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? pendingLabel : children}
    </button>
  )
}
