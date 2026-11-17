import { render } from '@stencil/vitest'
import { describe, expect, it } from 'vite-plus/test'
import '../../src/components/schematic-status-display/schematic-status-display'

describe('schematic-status-display', () => {
  it('renders', async () => {
    const { root } = await render('<schematic-status-display></schematic-status-display>')
    expect(root).toHaveClass('hydrated')
  })
})
