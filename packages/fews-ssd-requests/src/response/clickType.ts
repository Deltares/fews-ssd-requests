export const ClickType = {
  LEFTSINGLECLICK: 'LEFTSINGLECLICK',
  LEFTDOUBLECLICK: 'LEFTDOUBLECLICK',
  WEBOCDASHBOARD: 'WEBOCDASHBOARD',
} as const

export type ClickType = keyof typeof ClickType
