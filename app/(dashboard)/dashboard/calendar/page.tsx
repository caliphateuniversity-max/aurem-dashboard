'use client'
import { useState } from 'react'
import useSWR from 'swr'
import { contentApi } from '../../../../lib/api'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { CONTENT_TYPE_ICONS } from '../../../../lib/utils'

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
  const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd')

  const { data } = useSWR(
    `calendar-${start}-${end}`,
    () => contentApi.getCalendar(start, end),
    { refreshInterval: 30000 }
  )

  const events = (data as any)?.data?.events || []
  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) })

  // Pad to start on correct weekday
  const firstDayOfWeek = startOfMonth(currentMonth).getDay()
  const paddedDays = Array(firstDayOfWeek).fill(null).concat(days)

  function getEventsForDay(day: Date) {
    return events.filter((e: any) => {
      try { return isSameDay(parseISO(e.scheduled_at), day) } catch { return false }
    })
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A5048', marginBottom: 6 }}>Content</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(212,168,83,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={18} color="#D4A853" />
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#F0EAE0' }}>Content Calendar</h1>
        </div>
      </div>

      {/* Month Nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          style={{ width: 36, height: 36, borderRadius: 9, background: '#13100A', border: '1px solid rgba(232,115,26,0.15)', color: '#8A7D6A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft size={16} />
        </button>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#F0EAE0' }}>
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          style={{ width: 36, height: 36, borderRadius: 9, background: '#13100A', border: '1px solid rgba(232,115,26,0.15)', color: '#8A7D6A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div style={{ background: '#13100A', border: '1px solid rgba(232,115,26,0.1)', borderRadius: 12, overflow: 'hidden' }}>
        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid rgba(232,115,26,0.1)' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{ padding: '10px 0', textAlign: 'center', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5A5048' }}>{d}</div>
          ))}
        </div>

        {/* Days */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {paddedDays.map((day, i) => {
            const dayEvents = day ? getEventsForDay(day) : []
            const isToday = day && isSameDay(day, new Date())
            return (
              <div
                key={i}
                style={{
                  minHeight: 90,
                  padding: 8,
                  borderRight: (i + 1) % 7 !== 0 ? '1px solid rgba(232,115,26,0.06)' : 'none',
                  borderBottom: '1px solid rgba(232,115,26,0.06)',
                  background: isToday ? 'rgba(232,115,26,0.05)' : 'transparent',
                }}
              >
                {day && (
                  <>
                    <div style={{
                      fontSize: 12,
                      color: isToday ? '#E8731A' : '#8A7D6A',
                      fontWeight: isToday ? 600 : 400,
                      marginBottom: 4,
                    }}>
                      {format(day, 'd')}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {dayEvents.slice(0, 3).map((e: any) => (
                        <div
                          key={e.id}
                          title={e.caption}
                          style={{
                            fontSize: 10,
                            padding: '2px 5px',
                            borderRadius: 4,
                            background: e.status === 'published' ? 'rgba(102,204,136,0.12)' : 'rgba(232,115,26,0.12)',
                            color: e.status === 'published' ? '#66CC88' : '#E8731A',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {CONTENT_TYPE_ICONS[e.content_type]} {e.content_type}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div style={{ fontSize: 10, color: '#5A5048' }}>+{dayEvents.length - 3} more</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 16, fontSize: 11, color: '#8A7D6A' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(232,115,26,0.3)', display: 'inline-block' }} /> Scheduled
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(102,204,136,0.3)', display: 'inline-block' }} /> Published
        </span>
      </div>
    </div>
  )
}
