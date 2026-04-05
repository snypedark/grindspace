export type FriendshipStatus = 'pending' | 'accepted'

export type Friendship = {
  id: string
  requester_id: string
  receiver_id: string
  status: FriendshipStatus
  created_at: string
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
