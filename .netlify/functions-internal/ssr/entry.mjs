import * as adapter from '@astrojs/netlify/ssr-function.js';
import { renderers } from './renderers.mjs';
import { manifest } from './manifest_oo7YEFML.mjs';

const _page0  = () => import('./chunks/styles_TE0WWpOc.mjs');
const _page1  = () => import('./chunks/scripts_CSLvFh7T.mjs');
const _page2  = () => import('./chunks/generic_yEAwbsXo.mjs');
const _page3  = () => import('./chunks/404_gsQcbjye.mjs');
const _page4  = () => import('./chunks/index_VR5NfhWi.mjs');const pageMap = new Map([["node_modules/astro-expressive-code/routes/styles.ts", _page0],["node_modules/astro-expressive-code/routes/scripts.ts", _page1],["node_modules/astro/dist/assets/endpoint/generic.js", _page2],["node_modules/@astrojs/starlight/404.astro", _page3],["node_modules/@astrojs/starlight/index.astro", _page4]]);
const _manifest = Object.assign(manifest, {
	pageMap,
	renderers,
});
const _args = undefined;

const _exports = adapter.createExports(_manifest, _args);
const _default = _exports['default'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { _default as default, pageMap };
