import { newE2EPage } from '@stencil/core/testing';

describe('schematic-status-display', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<schematic-status-display></schematic-status-display>');
    const element = await page.find('schematic-status-display');
    expect(element).toHaveClass('hydrated');
  });
});
