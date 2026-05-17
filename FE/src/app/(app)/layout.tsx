import Header from '@/components/layout/Header'
import SideNav from '@/components/layout/SideNav'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f5f7fb] dark:bg-gray-950">
      <Header />
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <SideNav />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
