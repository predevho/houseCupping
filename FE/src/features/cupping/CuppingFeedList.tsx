import Link from 'next/link'

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
}

interface Props {
  notes: CuppingFeedItem[]
  emptyMessage: string
}

export default function CuppingFeedList({ notes, emptyMessage }: Props) {
  if (notes.length === 0) {
    return <p className="text-sm text-gray-400">{emptyMessage}</p>
  }

  return (
    <ul className="flex flex-col gap-4">
      {notes.map((note) => (
        <li key={note.id}>
          <Link
            href={`/cupping/${note.id}`}
            className="flex flex-col gap-2 rounded-lg border border-gray-100 px-4 py-3 transition-colors hover:border-gray-300"
          >
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {note.beans ? `${note.beans.bean_name} - ${note.beans.cafe_name}` : '알 수 없는 원두'}
              </p>
              <p className="text-xs text-gray-400">
                <span>{note.profiles?.display_name ?? note.profiles?.username ?? '알 수 없음'}</span>
                <span> · </span>
                <span>{new Date(note.created_at).toLocaleDateString('ko-KR')}</span>
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <span>향미 {note.aroma}</span>
              <span>산미 {note.acidity}</span>
              <span>바디 {note.body}</span>
            </div>
            {note.roast_date && <p className="text-xs text-gray-400">로스팅일 {note.roast_date}</p>}
            {note.memo && <p className="line-clamp-2 text-sm text-gray-600">{note.memo}</p>}
          </Link>
        </li>
      ))}
    </ul>
  )
}
