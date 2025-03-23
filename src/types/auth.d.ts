export type Providers = 'github' | 'google' | 'apple'

export interface Credentials {
  email: string
  password: string
}

export interface User {
  email: string
  id: string
}
