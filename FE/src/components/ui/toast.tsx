'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type ToastType = 'success' | 'error'

interface ToastInput {
  message: string
  type: ToastType
}

interface ToastItem extends ToastInput {
  id: number
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextIdRef = useRef(1)

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ message, type }: ToastInput) => {
      const id = nextIdRef.current++

      setToasts((current) => [...current, { id, message, type }])

      window.setTimeout(() => {
        removeToast(id)
      }, 3000)
    },
    [removeToast]
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 left-1/2 z-50 flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={
              toast.type === 'success'
                ? 'rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 shadow-sm'
                : 'rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm'
            }
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return context
}
