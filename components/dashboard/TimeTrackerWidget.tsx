"use client"

import { useTimer } from '@/hooks/useTimer'
import { Play, Pause, Square } from 'lucide-react'
import { useState } from 'react'

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function TimeTrackerWidget() {
  const { isActive, isPaused, elapsedSeconds, skillName, pauseTimer, resumeTimer, stopTimer } = useTimer()
  const [showStopModal, setShowStopModal] = useState(false)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  if (!isActive) return null

  const handleStop = async () => {
    setSaving(true)
    await stopTimer(notes)
    setSaving(false)
    setShowStopModal(false)
    setNotes('')
  }

  return (
    <>
      <div 
        className="fixed bottom-6 right-6 z-50 bg-[#E8EAF0] shadow-neu-lg rounded-2xl p-4 min-w-[280px] flex flex-col gap-3 animate-fade-slide-up"
        style={{ border: '1px solid rgba(255,255,255,0.5)' }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold text-[#A8ABBE] uppercase tracking-wider">Active Session</h3>
            <p className="text-sm font-bold text-[#3B3F5C]">{skillName}</p>
          </div>
          <div className="text-2xl font-[900] tracking-tight bg-gradient-to-br from-[#9D93F9] to-[#5B51E0] bg-clip-text text-transparent">
            {formatTime(elapsedSeconds)}
          </div>
        </div>
        
        <div className="flex gap-3 mt-1">
          {isPaused ? (
            <button 
              onClick={resumeTimer}
              className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-[#E8EAF0] shadow-neu hover:shadow-neu-hover active:shadow-neu-inset text-[#5EC8A0] transition-all"
            >
              <Play size={16} /> Resume
            </button>
          ) : (
            <button 
              onClick={pauseTimer}
              className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-[#E8EAF0] shadow-neu hover:shadow-neu-hover active:shadow-neu-inset text-[#F7A97C] transition-all"
            >
              <Pause size={16} /> Pause
            </button>
          )}

          <button 
            onClick={() => setShowStopModal(true)}
            className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-[#E8EAF0] shadow-neu hover:shadow-neu-hover active:shadow-neu-inset text-[#F07A7A] transition-all"
          >
            <Square size={16} fill="currentColor" /> Stop
          </button>
        </div>
      </div>

      {showStopModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#E8EAF0] w-full max-w-sm rounded-[24px] p-6 shadow-neu-lg" style={{ border: '1px solid rgba(255,255,255,0.5)' }}>
            <h3 className="text-lg font-[900] text-[#3B3F5C]">End Session</h3>
            <p className="text-sm font-medium text-[#7B80A0] mt-1 mb-5">
              You logged <strong className="text-[#3B3F5C]">{Math.max(1, Math.round(elapsedSeconds / 60))} minutes</strong> of {skillName}.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE] mb-1.5">
                  Session Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What did you get done?"
                  className="neu-input w-full px-3 py-2.5 text-sm text-[#3B3F5C] font-semibold resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowStopModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#7B80A0] hover:text-[#3B3F5C] bg-[#E8EAF0] shadow-neu-sm hover:shadow-neu-inset transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleStop}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #9D93F9, #7C6FF7, #5B51E0)",
                    boxShadow: "4px 4px 10px rgba(92,81,224,0.3), -2px -2px 6px rgba(255,255,255,0.6)",
                  }}
                >
                  {saving ? 'Saving...' : 'Save & Log'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
