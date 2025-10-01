export type Settings = {
  email: {
    weeklyEmails: boolean
    singles: boolean
  }
}

export const defaultSettings: Settings = {
  email: {
    weeklyEmails: true,
    singles: true
  }
}