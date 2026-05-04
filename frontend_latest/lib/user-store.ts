// Server-side shared user store
// Uses global object to share the same Map instance across API routes

declare global {
  // eslint-disable-next-line no-var
  var __userStore: Map<string, UserRecord> | undefined
}

export interface UserRecord {
  email: string
  passwordHash: string
  fullName: string
  createdAt: string
}

function getUserStore(): Map<string, UserRecord> {
  if (!global.__userStore) {
    global.__userStore = new Map<string, UserRecord>()
  }
  return global.__userStore
}

export function getUser(email: string): UserRecord | undefined {
  return getUserStore().get(email.toLowerCase())
}

export function setUser(email: string, record: UserRecord): void {
  getUserStore().set(email.toLowerCase(), record)
}

export function hasUser(email: string): boolean {
  return getUserStore().has(email.toLowerCase())
}
