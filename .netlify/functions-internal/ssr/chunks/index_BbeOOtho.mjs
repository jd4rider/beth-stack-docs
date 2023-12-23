import { e as createAstro, f as createComponent, r as renderTemplate, m as maybeRenderHead, n as renderComponent, u as unescapeHTML, p as renderSlot, h as addAttribute, F as Fragment, s as spreadAttributes, _ as __astro_tag_component__, w as createVNode } from './astro_0DgGDWr4.mjs';
import { b as $$Icon, c as $$Image } from './pages/404_eUNJpEM5.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                                            */
/* empty css                                                                */
import { select } from 'hast-util-select';
import { rehype } from 'rehype';
import { visit, CONTINUE, SKIP } from 'unist-util-visit';
/* empty css                                                            */
/* empty css                                                                */

const $$Astro$4 = createAstro();
const $$Card = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Card;
  const { icon, title } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="card sl-flex astro-v5tidmuc"> <p class="title sl-flex astro-v5tidmuc"> ${icon && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": icon, "class": "icon astro-v5tidmuc", "size": "1.333em" })}`} <span class="astro-v5tidmuc">${unescapeHTML(title)}</span> </p> <div class="body astro-v5tidmuc">${renderSlot($$result, $$slots["default"])}</div> </article> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/user-components/Card.astro", void 0);

const $$Astro$3 = createAstro();
const $$CardGrid = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$CardGrid;
  const { stagger = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute([["card-grid", { stagger }], "astro-zntqmydn"], "class:list")}>${renderSlot($$result, $$slots["default"])}</div> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/user-components/CardGrid.astro", void 0);

const TabItemTagname = "starlight-tab-item";
const focusableElementSelectors = [
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "a[href]",
  "area[href]",
  "summary",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]",
  "[tabindex]:not([disabled])"
].map((selector) => `${selector}:not([hidden]):not([tabindex="-1"])`).join(",");
let count = 0;
const getIDs = () => {
  const id = count++;
  return { panelId: "tab-panel-" + id, tabId: "tab-" + id };
};
const tabsProcessor = rehype().data("settings", { fragment: true }).use(function tabs() {
  return (tree, file) => {
    file.data.panels = [];
    let isFirst = true;
    visit(tree, "element", (node) => {
      if (node.tagName !== TabItemTagname || !node.properties) {
        return CONTINUE;
      }
      const { dataLabel } = node.properties;
      const ids = getIDs();
      file.data.panels?.push({
        ...ids,
        label: String(dataLabel)
      });
      delete node.properties.dataLabel;
      node.tagName = "section";
      node.properties.id = ids.panelId;
      node.properties["aria-labelledby"] = ids.tabId;
      node.properties.role = "tabpanel";
      const focusableChild = select(focusableElementSelectors, node);
      if (!focusableChild) {
        node.properties.tabindex = 0;
      }
      if (isFirst) {
        isFirst = false;
      } else {
        node.properties.hidden = true;
      }
      return SKIP;
    });
  };
});
const processPanels = (html) => {
  const file = tabsProcessor.processSync({ value: html });
  return {
    /** Data for each tab panel. */
    panels: file.data.panels,
    /** Processed HTML for the tab panels. */
    html: file.toString()
  };
};

const $$Astro$2 = createAstro();
const $$Tabs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Tabs;
  const panelHtml = await Astro2.slots.render("default");
  const { html, panels } = processPanels(panelHtml);
  return renderTemplate`${renderComponent($$result, "starlight-tabs", "starlight-tabs", { "class": "astro-esqgolmp" }, { "default": () => renderTemplate` ${panels && renderTemplate`${maybeRenderHead()}<div class="tablist-wrapper not-content astro-esqgolmp"> <ul role="tablist" class="astro-esqgolmp"> ${panels.map(({ label, panelId, tabId }, idx) => renderTemplate`<li role="presentation" class="tab astro-esqgolmp"> <a role="tab"${addAttribute("#" + panelId, "href")}${addAttribute(tabId, "id")}${addAttribute(idx === 0 && "true", "aria-selected")}${addAttribute(idx !== 0 ? -1 : 0, "tabindex")} class="astro-esqgolmp"> ${label} </a> </li>`)} </ul> </div>`} ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(html)}` })} ` })}  `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/user-components/Tabs.astro", void 0);

const $$Astro$1 = createAstro();
const $$TabItem = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$TabItem;
  const { label } = Astro2.props;
  if (!label) {
    throw new Error("Missing prop `label` on `<TabItem>` component.");
  }
  return renderTemplate`${renderComponent($$result, "TabItemTagname", TabItemTagname, { "data-label": label }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` })}`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/user-components/TabItem.astro", void 0);

const $$Astro = createAstro();
const $$LinkCard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LinkCard;
  const { title, description, ...attributes } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="astro-mf7fz2mj"> <span class="sl-flex stack astro-mf7fz2mj"> <a${spreadAttributes(attributes, void 0, { "class": "astro-mf7fz2mj" })}> <span class="title astro-mf7fz2mj">${unescapeHTML(title)}</span> </a> ${description && renderTemplate`<span class="description astro-mf7fz2mj">${unescapeHTML(description)}</span>`} </span> ${renderComponent($$result, "Icon", $$Icon, { "name": "right-arrow", "size": "1.333em", "class": "icon rtl:flip astro-mf7fz2mj" })} </div> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/user-components/LinkCard.astro", void 0);

const frontmatter = {
  "title": "Welcome to BETH",
  "description": "Get started building your site with The BETH.",
  "template": "splash",
  "hero": {
    "tagline": "Let's get started on a new BETH (Bun, ElysiaJS, Turso, HTMX) project!",
    "image": {
      "file": "../../assets/Beth.webp"
    },
    "actions": [{
      "text": "Getting Started",
      "link": "/start_here/getting_started/",
      "icon": "right-arrow",
      "variant": "primary"
    }]
  }
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "beth-bun-elysiajs-turso-htmx",
    "text": "BETH (Bun, ElysiaJS, Turso, HTMX)"
  }];
}
const __usesAstroImage = true;
function _createMdxContent(props) {
  const _components = {
    a: "a",
    h2: "h2",
    p: "p",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "beth-bun-elysiajs-turso-htmx",
      children: "BETH (Bun, ElysiaJS, Turso, HTMX)"
    }), "\n", createVNode($$CardGrid, {
      children: [createVNode($$Card, {
        title: "BUN",
        icon: "pencil",
        children: createVNode(_components.p, {
          children: [createVNode(_components.a, {
            href: "https://bun.sh",
            children: "Learn more about Bun"
          }), "."]
        })
      }), createVNode($$Card, {
        title: "ELYSIAJS",
        icon: "add-document",
        children: createVNode(_components.p, {
          children: [createVNode(_components.a, {
            href: "https://elysiajs.com",
            children: "Learn more about ElysiaJS"
          }), "."]
        })
      }), createVNode($$Card, {
        title: "TURSO",
        icon: "setting",
        children: createVNode(_components.p, {
          children: [createVNode(_components.a, {
            href: "https://turso.tech",
            children: "Learn more about Turso"
          }), "."]
        })
      }), createVNode($$Card, {
        title: "HTMX",
        icon: "open-book",
        children: createVNode(_components.p, {
          children: [createVNode(_components.a, {
            href: "https://htmx.org",
            children: "Learn more about HTMX"
          }), "."]
        })
      })]
    })]
  });
}
function MDXContent(props = {}) {
  const {
    wrapper: MDXLayout
  } = props.components || {};
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
__astro_tag_component__(getHeadings, "astro:jsx");
__astro_tag_component__(MDXContent, "astro:jsx");
const url = "src/content/docs/index.mdx";
const file = "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/src/content/docs/index.mdx";
const Content = (props = {}) => MDXContent({
											...props,
											components: { Fragment, ...props.components, "astro-image":  props.components?.img ?? $$Image },
										});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/src/content/docs/index.mdx";

export { Content, __usesAstroImage, Content as default, file, frontmatter, getHeadings, url };
