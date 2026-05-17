'use client'

import { useEffect, useRef, useState } from 'react'
import { CircleRatingIcon, formatScore, getCircleFill } from './CircleRatingDisplay'

interface Props {
  name: string
  label: string
  value: number | null
  required?: boolean
  onChange: (value: number) => void
}

export default function CircleRatingInput({ name, label, value, required, onChange }: Props) {
  const currentValue = value ?? 0
  const areaRef = useRef<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const shortLabel = label.split(' (')[0]

  useEffect(() => {
    if (!isDragging) return

    const stopDragging = () => setIsDragging(false)

    window.addEventListener('pointerup', stopDragging)
    window.addEventListener('pointercancel', stopDragging)

    return () => {
      window.removeEventListener('pointerup', stopDragging)
      window.removeEventListener('pointercancel', stopDragging)
    }
  }, [isDragging])

  function getDragValue(clientX: number) {
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect || rect.width <= 0) return null

    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
    const steps = Math.max(1, Math.ceil(ratio * 10))

    return steps / 2
  }

  function updateFromPointer(clientX: number) {
    if (!Number.isFinite(clientX)) return
    const nextValue = getDragValue(clientX)
    if (nextValue == null) return
    onChange(nextValue)
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={value?.toString() ?? ''} required={required} readOnly />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        <span className="text-xs font-semibold text-[#8B2635] dark:text-[#D46A7A]">
          {value ? `${formatScore(value)}점` : '선택'}
        </span>
      </div>
      <div
        ref={areaRef}
        aria-label={`${shortLabel} 점수 선택 영역`}
        className="flex items-center gap-2 touch-none"
        onPointerDown={(event) => {
          setIsDragging(true)
          updateFromPointer(event.clientX)
        }}
        onPointerMove={(event) => {
          if (!isDragging) return
          updateFromPointer(event.clientX)
        }}
        onPointerUp={() => setIsDragging(false)}
        onMouseDown={(event) => {
          setIsDragging(true)
          updateFromPointer(event.clientX)
        }}
        onMouseMove={(event) => {
          if (!isDragging) return
          updateFromPointer(event.clientX)
        }}
        onMouseUp={() => setIsDragging(false)}
      >
        {Array.from({ length: 5 }, (_, index) => {
          const baseValue = index + 1

          return (
            <div key={`${name}-${baseValue}`} className="relative h-7 w-7">
              <CircleRatingIcon fill={getCircleFill(currentValue, index)} sizeClassName="h-7 w-7" />
              <button
                type="button"
                aria-label={`${shortLabel} ${formatScore(baseValue - 0.5)}점 선택`}
                onClick={() => onChange(baseValue - 0.5)}
                className="absolute inset-y-0 left-0 z-10 w-1/2 cursor-pointer rounded-l-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2635]/30 active:scale-[0.96]"
              />
              <button
                type="button"
                aria-label={`${shortLabel} ${formatScore(baseValue)}점 선택`}
                onClick={() => onChange(baseValue)}
                className="absolute inset-y-0 right-0 z-10 w-1/2 cursor-pointer rounded-r-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2635]/30 active:scale-[0.96]"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
