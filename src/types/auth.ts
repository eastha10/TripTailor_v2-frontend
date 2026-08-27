import type { ApiEnvelope } from './api'

export type AuthMode = 'login' | 'signup'
export type LoginRequest = { email: string; password: string }
export type SignupRequest = LoginRequest & { phone_number: string; username: string }

export type User = {
  email: string
  phoneNumber: string
  profileImageUrl?: string | null
  userId: string
  username: string
}

export type UpdateProfileRequest = Partial<Pick<User, 'phoneNumber' | 'profileImageUrl' | 'username'>>

export type AuthPayload = {
  access?: string
  accessToken?: string
  access_token?: string
  refreshToken?: string
  refresh_token?: string
  token?: string
  user?: User
}

export type AuthResponse = AuthPayload | ApiEnvelope<AuthPayload>
export type UserResponse = User | ApiEnvelope<User>
