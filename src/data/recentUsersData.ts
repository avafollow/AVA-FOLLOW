// Danh sách Người Dùng Tham Gia Mới (100% người dùng thực)
export interface RecentJoinedUser {
  id: string;
  name: string;
  handle: string;
  location: string;
  action: string;
  timeAgo: string;
  initial: string;
  colorClass: string;
}

export const RECENT_JOINED_USERS_100: RecentJoinedUser[] = [];
