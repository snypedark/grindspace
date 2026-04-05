"use client"

import { useState, useEffect, useCallback } from 'react'
import { useFriends } from '@/hooks/useFriends'
import { useAuth } from '@/lib/AuthContext'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Search, UserPlus, Check, X, Loader2, Users } from 'lucide-react'

export default function FriendsPage() {
  const { user } = useAuth()
  const {
    friends,
    pendingRequests,
    loading,
    searchResults,
    searching,
    actionLoading,
    searchFriends,
    sendRequest,
    acceptRequest,
    rejectRequest,
  } = useFriends()

  const [searchQuery, setSearchQuery] = useState('')

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) return
    const timeout = setTimeout(() => {
      searchFriends(searchQuery)
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchQuery, searchFriends])

  if (!user) return null

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-slide-up">
      <div>
        <h2 className="text-[22px] font-[900] text-[#3B3F5C] tracking-[-0.03em]">Friends</h2>
        <p className="text-[13px] font-medium text-[#7B80A0] mt-0.5">Your accountability squad 👥</p>
      </div>

      {/* Search Bar */}
      <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-5">
        <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE] mb-2">
          Find Users
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username..."
            className="neu-input w-full pl-10 pr-4 py-2.5 text-sm font-semibold text-[#3B3F5C] placeholder:text-[#A8ABBE]"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8ABBE]" />
          {searching && <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[#A8ABBE]" />}
        </div>

        {/* Search Results */}
        {searchQuery.length >= 2 && searchResults.length > 0 && (
          <div className="mt-3 space-y-2">
            {searchResults.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 bg-[#E8EAF0] rounded-xl p-3"
                style={{ boxShadow: "inset 3px 3px 8px #C5C8D6, inset -3px -3px 8px #FFFFFF" }}
              >
                <Avatar src={u.avatar_url} name={u.username} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#3B3F5C] truncate">{u.username}</p>
                  <p className="text-[10px] font-semibold text-[#A8ABBE]">{(u.xp ?? 0).toLocaleString()} XP</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => sendRequest(u.id)}
                  disabled={actionLoading === u.id}
                  className="gap-1"
                >
                  {actionLoading === u.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <UserPlus size={12} />
                  )}
                  Add
                </Button>
              </div>
            ))}
          </div>
        )}
        {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
          <p className="text-xs font-semibold text-[#A8ABBE] mt-3">No users found</p>
        )}
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-5">
          <h3 className="text-sm font-bold text-[#3B3F5C] mb-3">
            Pending Requests
            <span className="ml-1.5 text-[10px] font-bold text-[#7C6FF7] bg-[#E8EAF0] shadow-neu-sm px-2 py-0.5 rounded-full">
              {pendingRequests.length}
            </span>
          </h3>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center gap-3 bg-[#E8EAF0] rounded-xl p-3"
                style={{ boxShadow: "inset 3px 3px 8px #C5C8D6, inset -3px -3px 8px #FFFFFF" }}
              >
                <Avatar src={req.requester.avatar_url} name={req.requester.username} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#3B3F5C] truncate">{req.requester.username}</p>
                  <p className="text-[10px] font-semibold text-[#A8ABBE]">{req.requester.xp.toLocaleString()} XP</p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => acceptRequest(req.id)}
                    disabled={actionLoading === req.id}
                    className="flex items-center justify-center w-8 h-8 rounded-[10px] bg-[#E8EAF0] shadow-neu-sm hover:shadow-neu-inset transition-all duration-200 text-[#5EC8A0]"
                  >
                    {actionLoading === req.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  </button>
                  <button
                    onClick={() => rejectRequest(req.id)}
                    disabled={actionLoading === req.id}
                    className="flex items-center justify-center w-8 h-8 rounded-[10px] bg-[#E8EAF0] shadow-neu-sm hover:shadow-neu-inset transition-all duration-200 text-[#F07A7A]"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-5">
        <h3 className="text-sm font-bold text-[#3B3F5C] mb-3">
          Your Friends
          {friends.length > 0 && (
            <span className="ml-1.5 text-[10px] font-bold text-[#7C6FF7]">({friends.length})</span>
          )}
        </h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={24} className="animate-spin text-[#7B80A0]" />
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-8">
            <Users size={32} className="mx-auto text-[#A8ABBE] mb-2" />
            <p className="text-sm font-semibold text-[#7B80A0]">No friends yet</p>
            <p className="text-xs font-medium text-[#A8ABBE] mt-0.5">Search for users above to add friends</p>
          </div>
        ) : (
          <div className="space-y-2">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-3 bg-[#E8EAF0] rounded-xl p-3 shadow-neu-sm hover:-translate-y-0.5 hover:shadow-neu transition-all duration-220"
              >
                <Avatar src={friend.avatar_url} name={friend.username} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#3B3F5C] truncate">{friend.username}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-[900] text-[#3B3F5C]">{friend.xp.toLocaleString()}</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE]">XP</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
