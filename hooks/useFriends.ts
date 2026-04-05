"use client"

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/lib/AuthContext'
import {
  searchUsers as searchUsersQuery,
  sendFriendRequest,
  respondToFriendRequest,
  getFriendRequests,
  getFriendsList,
} from '@/lib/queries'
import type { Profile } from '@/types/user'

export interface FriendEntry {
  id: string
  friendshipId: string
  username: string
  avatar_url: string | null
  xp: number
}

export interface PendingRequest {
  id: string
  requester: {
    id: string
    username: string
    avatar_url: string | null
    xp: number
  }
  created_at: string
}

export function useFriends() {
  const { user } = useAuth()
  const [friends, setFriends] = useState<FriendEntry[]>([])
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<Profile[]>([])
  const [searching, setSearching] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const userId = user?.id ?? null

  const refresh = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    console.log('[Friends] refreshing...')

    const [friendsData, requestsData] = await Promise.all([
      getFriendsList(userId),
      getFriendRequests(userId),
    ])

    setFriends(friendsData)
    setPendingRequests(
      requestsData.map((r: any) => ({
        id: r.id,
        requester: r.requester
          ? { id: r.requester.id, username: r.requester.username, avatar_url: r.requester.avatar_url, xp: r.requester.xp ?? 0 }
          : { id: r.requester_id, username: 'Unknown', avatar_url: null, xp: 0 },
        created_at: r.created_at,
      }))
    )

    setLoading(false)
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const searchFriends = useCallback(
    async (query: string) => {
      if (!userId || query.length < 2) {
        setSearchResults([])
        return
      }
      setSearching(true)
      const results = await searchUsersQuery(query, userId)
      setSearchResults(results)
      setSearching(false)
    },
    [userId]
  )

  const sendRequest = useCallback(
    async (receiverId: string) => {
      if (!userId) return
      setActionLoading(receiverId)
      const { error } = await sendFriendRequest(userId, receiverId)
      if (error) {
        console.error('[Friends] send request error:', error.message)
      } else {
        // Remove from search results to prevent double-send
        setSearchResults((prev) => prev.filter((u) => u.id !== receiverId))
      }
      setActionLoading(null)
    },
    [userId]
  )

  const acceptRequest = useCallback(
    async (friendshipId: string) => {
      setActionLoading(friendshipId)
      await respondToFriendRequest(friendshipId, true)
      await refresh()
      setActionLoading(null)
    },
    [refresh]
  )

  const rejectRequest = useCallback(
    async (friendshipId: string) => {
      setActionLoading(friendshipId)
      await respondToFriendRequest(friendshipId, false)
      setPendingRequests((prev) => prev.filter((r) => r.id !== friendshipId))
      setActionLoading(null)
    },
    []
  )

  return {
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
    refresh,
  }
}
