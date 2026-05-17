export default function AppLoading() {
  return (
    <main className="max-w-md mx-auto px-4 py-16 flex flex-col items-center text-center gap-3">
      <div
        role="status"
        aria-label="로딩 중"
        className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#8B2635] animate-spin"
      />
      <h1 className="text-lg font-bold">불러오는 중이에요</h1>
      <p className="text-sm text-gray-500">
        잠시만 기다려 주세요. 화면을 준비하고 있어요.
      </p>
    </main>
  )
}
