import { Store } from './store/store.js';
import page from './page.js';

export default new Store({
  locale: page.locale,
  provider: { name: 'vlaicu' },
});
