import { e as createAstro, f as createComponent, r as renderTemplate, n as renderComponent } from '../astro_0DgGDWr4.mjs';
import 'kleur/colors';
import 'clsx';
import { p as paths, a as generateRouteData, $ as $$Page } from './404_eUNJpEM5.mjs';

const $$Astro = createAstro();
async function getStaticPaths() {
  return paths;
}
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const { Content, headings } = await Astro2.props.entry.render();
  const route = generateRouteData({ props: { ...Astro2.props, headings }, url: Astro2.url });
  return renderTemplate`${renderComponent($$result, "Page", $$Page, { ...route }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Content", Content, {})}` })}`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/index.astro", void 0);

const $$file = "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/index.astro";
const $$url = undefined;

export { $$Index as default, $$file as file, getStaticPaths, $$url as url };
