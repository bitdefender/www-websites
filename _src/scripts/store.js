import { Store } from '@repobit/dex-store';
import page from './page.js';

export default new Store({
  locale: page.locale,
  provider: { name: 'vlaicu' },
});
