// Every @repobit/dex-system-design module resolves here in tests (see
// vitest.config.js): the loader loads nothing, so the bd-* elements stay
// undefined and tests check the markup the blocks build, not the components'
// rendering.
export const load = async () => {};
export const autoload = () => () => {};
