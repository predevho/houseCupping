type CircleFill = 'full' | 'half' | 'empty'

interface Props {
  label: string
  value: number
  sizeClassName?: string
  className?: string
  labelClassName?: string
  circlesClassName?: string
}

function getCircleFill(value: number, index: number): CircleFill {
  const remaining = value - index
  if (remaining >= 1) return 'full'
  if (remaining >= 0.5) return 'half'
  return 'empty'
}

function getCircleClassName(fill: CircleFill) {
  if (fill === 'full') return 'border-[#8B2635] bg-[#8B2635] dark:border-[#D46A7A] dark:bg-[#D46A7A]'
  if (fill === 'half') return 'border-[#8B2635] bg-gray-100 dark:border-[#D46A7A] dark:bg-gray-800'
  return 'border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900'
}

function formatScore(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1)
}

export function CircleRatingIcon({
  fill,
  sizeClassName = 'h-4 w-4',
}: {
  fill: CircleFill
  sizeClassName?: string
}) {
  return (
    <span
      data-testid={`circle-${fill}`}
      data-fill={fill}
      className={`relative inline-flex ${sizeClassName} overflow-hidden rounded-full border ${getCircleClassName(fill)}`}
    >
      {fill === 'half' && (
        <span className="absolute inset-y-0 left-0 w-1/2 bg-[#8B2635] dark:bg-[#D46A7A]" />
      )}
    </span>
  )
}

export default function CircleRatingDisplay({
  label,
  value,
  sizeClassName,
  className,
  labelClassName,
  circlesClassName,
}: Props) {
  return (
    <div
      aria-label={`${label} ${formatScore(value)}점`}
      className={`flex items-center gap-2 ${className ?? ''}`.trim()}
    >
      <span className={`text-xs font-medium text-gray-500 dark:text-gray-400 ${labelClassName ?? ''}`.trim()}>
        {label}
      </span>
      <div className={`flex items-center gap-1 ${circlesClassName ?? ''}`.trim()}>
        {Array.from({ length: 5 }, (_, index) => (
          <CircleRatingIcon
            key={`${label}-${index + 1}`}
            fill={getCircleFill(value, index)}
            sizeClassName={sizeClassName}
          />
        ))}
      </div>
    </div>
  )
}

export { formatScore, getCircleFill }
