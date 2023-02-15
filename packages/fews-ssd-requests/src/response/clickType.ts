export const ClickType = {
  LEFTSINGLECLICK: 'LEFTSINGLECLICK',
  LEFTDOUBLECLICK: 'LEFTDOUBLECLICK'
} as const

export type ClickType = keyof typeof ClickType
