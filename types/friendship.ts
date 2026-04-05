export type FriendshipStatus = 'pending' | 'accepted' | 'rejected'

export type Friendship = {
  id: string
  requester_id: string
  addressee_id: string
  status: FriendshipStatus
  requested_at: string
}

// Friendship with joined profile data for display
export type FriendshipWithProfile = Friendship & {
  friend_profile: {
    id: string
    username: string
    avatar_url: string | null
    xp: number
  }
}
