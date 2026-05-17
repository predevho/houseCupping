import Link from 'next/link'
import CircleRatingDisplay from './CircleRatingDisplay'

export interface CuppingFeedItem {
  id: number
  aroma: number
  acidity: number
  body: number
  roast_date: string | null
  memo: string | null
  created_at: string
  profiles: { username: string; display_name: string | null } | null
  beans: { id: number; bean_name: string; cafe_name: string } | null
  likes: [{ count: number }] | null
  comments: [{ count: number }] | null
}

interface Props {
  notes: CuppingFeedItem[]
  emptyMessage: string
}

export default function CuppingFeedList({ notes, emptyMessage }: Props) {
  if (notes.length === 0) {
    return <p className="text-sm text-gray-400 dark:text-gray-500">{emptyMessage}</p>
  }

  return (
    <ul className="flex flex-col gap-4">
      {notes.map((note) => {
        const likeCount = note.likes?.[0]?.count ?? 0
        const commentCount = note.comments?.[0]?.count ?? 0
        return (
          <li key={note.id}>
            <Link
              href={`/cupping/${note.id}`}
              className="flex cursor-pointer flex-col gap-2 rounded-lg border border-gray-100 bg-white px-4 py-3 transition-all duration-150 hover:border-[#8B2635]/30 hover:bg-[#8B2635]/[0.06] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B2635]/20 active:scale-[0.99] dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#A43348]/50 dark:hover:bg-[#A43348]/10 dark:focus-visible:ring-[#A43348]/30"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {note.beans ? `${note.beans.bean_name} - ${note.beans.cafe_name}` : '알 수 없는 원두'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  <span>{note.profiles?.display_name ?? note.profiles?.username ?? '알 수 없음'}</span>
                  <span> · </span>
                  <span>{new Date(note.created_at).toLocaleDateString('ko-KR')}</span>
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 overflow-hidden">
                <CircleRatingDisplay
                  label="향미"
                  value={note.aroma}
                  className="shrink-0 gap-1"
                  labelClassName="text-[11px]"
                  sizeClassName="h-3.5 w-3.5"
                />
                <CircleRatingDisplay
                  label="산미"
                  value={note.acidity}
                  className="shrink-0 gap-1"
                  labelClassName="text-[11px]"
                  sizeClassName="h-3.5 w-3.5"
                />
                <CircleRatingDisplay
                  label="바디"
                  value={note.body}
                  className="shrink-0 gap-1"
                  labelClassName="text-[11px]"
                  sizeClassName="h-3.5 w-3.5"
                />
              </div>
              {note.roast_date && <p className="text-xs text-gray-400 dark:text-gray-500">로스팅일 {note.roast_date}</p>}
              {note.memo && <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{note.memo}</p>}
              <p className="text-xs text-gray-400 dark:text-gray-500">♥ {likeCount}  💬 {commentCount}</p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
