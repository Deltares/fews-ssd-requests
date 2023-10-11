import { newSpecPage } from '@stencil/core/testing';
import { SchematicStatusDisplay } from '../../src/components/schematic-status-display/schematic-status-display';

describe('schematic-status-display', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [SchematicStatusDisplay],
      html: '<schematic-status-display ></schematic-status-display>',
    });
    expect(root).toEqualHtml(`
      <schematic-status-display>
      </schematic-status-display>
    `);
  });

});

