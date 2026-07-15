import { newSpecPage } from '@stencil/core/testing';
import { SchematicStatusDisplay } from '../../src/components/schematic-status-display/schematic-status-display';

describe('schematic-status-display', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [SchematicStatusDisplay],
      html: '<schematic-status-display></schematic-status-display>',
    });
    expect(root.tagName.toLowerCase()).toBe('schematic-status-display');
    expect(root.innerHTML).toBeDefined();
  });

  it('emits selectTopologyNode when topology action result is returned', async () => {
    const { root, rootInstance } = await newSpecPage({
      components: [SchematicStatusDisplay],
      html: '<schematic-status-display></schematic-status-display>',
    });

    rootInstance.panelId = 'panel-1';
    rootInstance.ssdProvider = {
      getAction: async () => ({
        results: [
          {
            type: 'SELECT_TOPOLOGY_NODE_BY_ID',
            requests: [{ request: 'node-123' }],
          },
        ],
      }),
    } as any;

    const received: Array<{ nodeId: string }> = [];
    root.addEventListener('selectTopologyNode', ((event: Event) => {
      const customEvent = event as CustomEvent;
      received.push(customEvent.detail);
    }) as EventListener);

    await (rootInstance as any).handleAction({
      panelId: 'panel-1',
      objectId: 'object-1',
      clickType: 'LEFTSINGLECLICK',
      config: true,
    });

    expect(received).toHaveLength(1);
    expect(received[0].nodeId).toBe('node-123');
  });

  it('does not emit selectTopologyNode when node id is absent', async () => {
    const { root, rootInstance } = await newSpecPage({
      components: [SchematicStatusDisplay],
      html: '<schematic-status-display></schematic-status-display>',
    });

    rootInstance.panelId = 'panel-1';
    rootInstance.ssdProvider = {
      getAction: async () => ({
        results: [
          {
            type: 'SELECT_TOPOLOGY_NODE_BY_ID',
            requests: [],
          },
        ],
      }),
    } as any;

    let called = 0;
    const handler = () => {
      called += 1;
    };
    root.addEventListener('selectTopologyNode', handler);

    await (rootInstance as any).handleAction({
      panelId: 'panel-1',
      objectId: 'object-1',
      clickType: 'LEFTSINGLECLICK',
      config: true,
    });

    expect(called).toBe(0);
  });
});
