export enum UserRole {
  USER = 'USER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export interface UserInfo {
  id: number
  email: string
  username: string
  full_name: string | null
  role: UserRole
  is_active: boolean
  is_verified: boolean
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface TokenWithUserResponse extends TokenResponse {
  user: UserInfo
} 