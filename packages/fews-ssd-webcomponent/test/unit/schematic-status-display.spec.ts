import { render } from '@stencil/vitest'
import { describe, expect, it, vi } from 'vite-plus/test'
import { ClickType, SsdWebserviceProvider } from '@deltares/fews-ssd-requests'
import type { ActionRequest } from '@deltares/fews-ssd-requests'
import type { SchematicStatusDisplay } from '../../src/components/schematic-status-display/schematic-status-display'
import '../../src/components/schematic-status-display/schematic-status-display'

const componentMarkup = '<schematic-status-display></schematic-status-display>'

async function handleAction(component: SchematicStatusDisplay, request: ActionRequest) {
  const instance = component as unknown as {
    handleAction: (request: ActionRequest) => Promise<void>
  }
  await instance.handleAction(request)
}

describe('schematic-status-display', () => {
  it('renders', async () => {
    const { root } = await render(componentMarkup)
    expect(root.tagName.toLowerCase()).toBe('schematic-status-display')
    expect(root.innerHTML).toBeDefined()
  })

  it('emits selectTopologyNode when topology action result is returned', async () => {
    const { root, instance } = await render(componentMarkup)
    const component = instance as SchematicStatusDisplay
    component.panelId = 'panel-1'
    const provider = new SsdWebserviceProvider('')
    const getAction = vi.spyOn(provider, 'getAction').mockResolvedValue({
      results: [
        {
          type: 'SELECT_TOPOLOGY_NODE_BY_ID',
          requests: [{ request: 'node-123' }],
        },
      ],
    })
    component.ssdProvider = provider

    const received: Array<{ nodeId: string }> = []
    root.addEventListener('selectTopologyNode', ((event: Event) => {
      const customEvent = event as CustomEvent
      received.push(customEvent.detail)
    }) as EventListener)

    await handleAction(component, {
      panelId: 'panel-1',
      objectId: 'object-1',
      clickType: ClickType.LEFTSINGLECLICK,
      config: true,
    })

    expect(getAction).toHaveBeenCalledOnce()
    expect(received).toHaveLength(1)
    expect(received[0].nodeId).toBe('node-123')
  })

  it('does not emit selectTopologyNode when node id is absent', async () => {
    const { root, instance } = await render(componentMarkup)
    const component = instance as SchematicStatusDisplay
    component.panelId = 'panel-1'
    const provider = new SsdWebserviceProvider('')
    vi.spyOn(provider, 'getAction').mockResolvedValue({
      results: [
        {
          type: 'SELECT_TOPOLOGY_NODE_BY_ID',
          requests: [],
        },
      ],
    })
    component.ssdProvider = provider

    const handler = vi.fn()
    root.addEventListener('selectTopologyNode', handler)

    await handleAction(component, {
      panelId: 'panel-1',
      objectId: 'object-1',
      clickType: ClickType.LEFTSINGLECLICK,
      config: true,
    })

    expect(handler).not.toHaveBeenCalled()
  })
})
