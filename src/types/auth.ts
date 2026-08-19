export type AuthMode = 'login' | 'signup'
export type LoginRequest = { email: string; password: string }
export type SignupRequest = LoginRequest & { name: string }
export type AuthResponse = { accessToken?: string; data?: { accessToken?: string }; message?: string }
