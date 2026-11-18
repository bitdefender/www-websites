import { describe, it, expect } from 'vitest';
import { getBuyLinkRef } from '../../scripts/utils/utils.js';

describe('getBuyLinkRef', () => {
  it('names the campaign the API applied, not the one requested', () => {
    expect(getBuyLinkRef({ campaign: 'MCWEBBF26', requestedCampaign: 'spring' })).toBe('WEBSITES_MCWEBBF26');
  });

  it('is N/A for a product requested with ignore, whatever the API applied', () => {
    expect(getBuyLinkRef({ campaign: 'MCWEBBF26', requestedCampaign: 'ignore' })).toBe('N/A');
  });

  it('is N/A without a campaign', () => {
    expect(getBuyLinkRef({ campaign: '', requestedCampaign: '' })).toBe('N/A');
    expect(getBuyLinkRef({})).toBe('N/A');
  });

  it('names the campaign the API applied when none was requested', () => {
    expect(getBuyLinkRef({ campaign: 'MCWEBBF26', requestedCampaign: '' })).toBe('WEBSITES_MCWEBBF26');
  });
});
