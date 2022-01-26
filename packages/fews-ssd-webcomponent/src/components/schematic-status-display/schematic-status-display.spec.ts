import { newSpecPage } from '@stencil/core/testing';
import { SchematicStatusDisplay } from './schematic-status-display';

describe('schematic-status-display', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [SchematicStatusDisplay],
      html: '<schematic-status-display></schematic-status-display>',
    });
    expect(root).toEqualHtml(`
      <schematic-status-display>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </schematic-status-display>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [SchematicStatusDisplay],
      html: `<schematic-status-display first="Stencil" last="'Don't call me a framework' JS"></schematic-status-display>`,
    });
    expect(root).toEqualHtml(`
      <schematic-status-display first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </schematic-status-display>
    `);
  });
});
