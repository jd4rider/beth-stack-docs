import { A as AstroError, c as InvalidImageService, d as ExpectedImageOptions, E as ExpectedImage, e as createAstro, f as createComponent, g as ImageMissingAlt, r as renderTemplate, m as maybeRenderHead, h as addAttribute, s as spreadAttributes, i as UnknownContentCollectionError, j as renderUniqueStylesheet, k as renderScriptElement, l as createHeadAndContent, n as renderComponent, u as unescapeHTML, o as defineStyleVars, p as renderSlot, F as Fragment, q as renderHead } from '../astro_0DgGDWr4.mjs';
import 'kleur/colors';
import 'clsx';
import { i as isESMImportedImage, a as isLocalService, b as isRemoteImage, D as DEFAULT_HASH_PROPS, p as prependForwardSlash } from '../astro/assets-service__1bmmgwG.mjs';
/* empty css                          */
import * as z from 'zod';
/* empty css                                                             */
import { basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execaSync } from 'execa';

async function getConfiguredImageService() {
  if (!globalThis?.astroAsset?.imageService) {
    const { default: service } = await import(
      // @ts-expect-error
      '../astro/assets-service__1bmmgwG.mjs'
    ).then(n => n.s).catch((e) => {
      const error = new AstroError(InvalidImageService);
      error.cause = e;
      throw error;
    });
    if (!globalThis.astroAsset)
      globalThis.astroAsset = {};
    globalThis.astroAsset.imageService = service;
    return service;
  }
  return globalThis.astroAsset.imageService;
}
async function getImage$1(options, imageConfig) {
  if (!options || typeof options !== "object") {
    throw new AstroError({
      ...ExpectedImageOptions,
      message: ExpectedImageOptions.message(JSON.stringify(options))
    });
  }
  if (typeof options.src === "undefined") {
    throw new AstroError({
      ...ExpectedImage,
      message: ExpectedImage.message(
        options.src,
        "undefined",
        JSON.stringify(options)
      )
    });
  }
  const service = await getConfiguredImageService();
  const resolvedOptions = {
    ...options,
    src: typeof options.src === "object" && "then" in options.src ? (await options.src).default ?? await options.src : options.src
  };
  const clonedSrc = isESMImportedImage(resolvedOptions.src) ? (
    // @ts-expect-error - clone is a private, hidden prop
    resolvedOptions.src.clone ?? resolvedOptions.src
  ) : resolvedOptions.src;
  resolvedOptions.src = clonedSrc;
  const validatedOptions = service.validateOptions ? await service.validateOptions(resolvedOptions, imageConfig) : resolvedOptions;
  const srcSetTransforms = service.getSrcSet ? await service.getSrcSet(validatedOptions, imageConfig) : [];
  let imageURL = await service.getURL(validatedOptions, imageConfig);
  let srcSets = await Promise.all(
    srcSetTransforms.map(async (srcSet) => ({
      transform: srcSet.transform,
      url: await service.getURL(srcSet.transform, imageConfig),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    }))
  );
  if (isLocalService(service) && globalThis.astroAsset.addStaticImage && !(isRemoteImage(validatedOptions.src) && imageURL === validatedOptions.src)) {
    const propsToHash = service.propertiesToHash ?? DEFAULT_HASH_PROPS;
    imageURL = globalThis.astroAsset.addStaticImage(validatedOptions, propsToHash);
    srcSets = srcSetTransforms.map((srcSet) => ({
      transform: srcSet.transform,
      url: globalThis.astroAsset.addStaticImage(srcSet.transform, propsToHash),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    }));
  }
  return {
    rawOptions: resolvedOptions,
    options: validatedOptions,
    src: imageURL,
    srcSet: {
      values: srcSets,
      attribute: srcSets.map((srcSet) => `${srcSet.url} ${srcSet.descriptor}`).join(", ")
    },
    attributes: service.getHTMLAttributes !== void 0 ? await service.getHTMLAttributes(validatedOptions, imageConfig) : {}
  };
}

const $$Astro$A = createAstro();
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$A, $$props, $$slots);
  Astro2.self = $$Image;
  const props = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  if (typeof props.width === "string") {
    props.width = parseInt(props.width);
  }
  if (typeof props.height === "string") {
    props.height = parseInt(props.height);
  }
  const image = await getImage(props);
  const additionalAttributes = {};
  if (image.srcSet.values.length > 0) {
    additionalAttributes.srcset = image.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<img${addAttribute(image.src, "src")}${spreadAttributes(additionalAttributes)}${spreadAttributes(image.attributes)}>`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/astro/components/Image.astro", void 0);

const $$Astro$z = createAstro();
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$z, $$props, $$slots);
  Astro2.self = $$Picture;
  const defaultFormats = ["webp"];
  const defaultFallbackFormat = "png";
  const specialFormatsFallback = ["gif", "svg", "jpg", "jpeg"];
  const { formats = defaultFormats, pictureAttributes = {}, fallbackFormat, ...props } = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  const optimizedImages = await Promise.all(
    formats.map(
      async (format) => await getImage({ ...props, format, widths: props.widths, densities: props.densities })
    )
  );
  let resultFallbackFormat = fallbackFormat ?? defaultFallbackFormat;
  if (!fallbackFormat && isESMImportedImage(props.src) && specialFormatsFallback.includes(props.src.format)) {
    resultFallbackFormat = props.src.format;
  }
  const fallbackImage = await getImage({
    ...props,
    format: resultFallbackFormat,
    widths: props.widths,
    densities: props.densities
  });
  const imgAdditionalAttributes = {};
  const sourceAdditionaAttributes = {};
  if (props.sizes) {
    sourceAdditionaAttributes.sizes = props.sizes;
  }
  if (fallbackImage.srcSet.values.length > 0) {
    imgAdditionalAttributes.srcset = fallbackImage.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<picture${spreadAttributes(pictureAttributes)}> ${Object.entries(optimizedImages).map(([_, image]) => {
    const srcsetAttribute = props.densities || !props.densities && !props.widths ? `${image.src}${image.srcSet.values.length > 0 ? ", " + image.srcSet.attribute : ""}` : image.srcSet.attribute;
    return renderTemplate`<source${addAttribute(srcsetAttribute, "srcset")}${addAttribute("image/" + image.options.format, "type")}${spreadAttributes(sourceAdditionaAttributes)}>`;
  })} <img${addAttribute(fallbackImage.src, "src")}${spreadAttributes(imgAdditionalAttributes)}${spreadAttributes(fallbackImage.attributes)}> </picture>`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/astro/components/Picture.astro", void 0);

const imageConfig = {"service":{"entrypoint":"astro/assets/services/sharp","config":{}},"domains":[],"remotePatterns":[]};
					new URL("file:///Users/jonathanforrider/Documents/Programming/beth-stack-docs/dist/");
					const getImage = async (options) => await getImage$1(options, imageConfig);

function createCollectionToGlobResultMap({
  globResult,
  contentDir
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1)
      continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
const cacheEntriesByCollection = /* @__PURE__ */ new Map();
function createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport
}) {
  return async function getCollection(collection, filter) {
    let type;
    if (collection in contentCollectionToEntryMap) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap) {
      type = "data";
    } else {
      console.warn(
        `The collection **${collection}** does not exist or is empty. Ensure a collection directory with this name exists.`
      );
      return;
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap[collection] : dataCollectionToEntryMap[collection]
    );
    let entries = [];
    if (!Object.assign({"BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": true, "SITE": undefined, "ASSETS_PREFIX": undefined}, { _: process.env._ })?.DEV && cacheEntriesByCollection.has(collection)) {
      entries = [...cacheEntriesByCollection.get(collection)];
    } else {
      entries = await Promise.all(
        lazyImports.map(async (lazyImport) => {
          const entry = await lazyImport();
          return type === "content" ? {
            id: entry.id,
            slug: entry.slug,
            body: entry.body,
            collection: entry.collection,
            data: entry.data,
            async render() {
              return render({
                collection: entry.collection,
                id: entry.id,
                renderEntryImport: await getRenderEntryImport(collection, entry.slug)
              });
            }
          } : {
            id: entry.id,
            collection: entry.collection,
            data: entry.data
          };
        })
      );
      cacheEntriesByCollection.set(collection, entries);
    }
    if (typeof filter === "function") {
      return entries.filter(filter);
    } else {
      return entries;
    }
  };
}
function createGetEntry({
  getEntryImport,
  getRenderEntryImport
}) {
  return async function getEntry(collectionOrLookupObject, _lookupId) {
    let collection, lookupId;
    if (typeof collectionOrLookupObject === "string") {
      collection = collectionOrLookupObject;
      if (!_lookupId)
        throw new AstroError({
          ...UnknownContentCollectionError,
          message: "`getEntry()` requires an entry identifier as the second argument."
        });
      lookupId = _lookupId;
    } else {
      collection = collectionOrLookupObject.collection;
      lookupId = "id" in collectionOrLookupObject ? collectionOrLookupObject.id : collectionOrLookupObject.slug;
    }
    const entryImport = await getEntryImport(collection, lookupId);
    if (typeof entryImport !== "function")
      return void 0;
    const entry = await entryImport();
    if (entry._internal.type === "content") {
      return {
        id: entry.id,
        slug: entry.slug,
        body: entry.body,
        collection: entry.collection,
        data: entry.data,
        async render() {
          return render({
            collection: entry.collection,
            id: entry.id,
            renderEntryImport: await getRenderEntryImport(collection, lookupId)
          });
        }
      };
    } else if (entry._internal.type === "data") {
      return {
        id: entry.id,
        collection: entry.collection,
        data: entry.data
      };
    }
    return void 0;
  };
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function")
    throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object")
    throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function")
      throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object")
      throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

// astro-head-inject

const contentDir = '/src/content/';

const contentEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/docs/guides/example.md": () => import('../example_Meo-M3n_.mjs'),"/src/content/docs/index.mdx": () => import('../index_Gw8202dF.mjs'),"/src/content/docs/reference/example.md": () => import('../example_leVZPQQP.mjs'),"/src/content/docs/start_here/getting_started.md": () => import('../getting_started_uzl0OuCS.mjs')});
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: contentEntryGlob,
	contentDir,
});

const dataEntryGlob = /* #__PURE__ */ Object.assign({});
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: dataEntryGlob,
	contentDir,
});
const collectionToEntryMap = createCollectionToGlobResultMap({
	globResult: { ...contentEntryGlob, ...dataEntryGlob },
	contentDir,
});

let lookupMap = {};
lookupMap = {"docs":{"type":"content","entries":{"guides/example":"/src/content/docs/guides/example.md","index":"/src/content/docs/index.mdx","reference/example":"/src/content/docs/reference/example.md","start_here/getting_started":"/src/content/docs/start_here/getting_started.md"}}};

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.entries[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/docs/guides/example.md": () => import('../example_hzhOHk9f.mjs'),"/src/content/docs/index.mdx": () => import('../index_tWL1r9l9.mjs'),"/src/content/docs/reference/example.md": () => import('../example_Ry-z8dBs.mjs'),"/src/content/docs/start_here/getting_started.md": () => import('../getting_started_fqaw-_EQ.mjs')});
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const getCollection = createGetCollection({
	contentCollectionToEntryMap,
	dataCollectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
});

const getEntry = createGetEntry({
	getEntryImport: createGlobLookup(collectionToEntryMap),
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
});

const config = {"title":"The BETH Stack","social":{"github":{"label":"GitHub","url":"https://github.com/ethanniser/the-beth-stack"}},"tableOfContents":{"minHeadingLevel":2,"maxHeadingLevel":3},"editLink":{},"sidebar":[{"label":"Start Here","translations":{},"collapsed":false,"autogenerate":{"directory":"start_here"}},{"label":"Guides","translations":{},"collapsed":false,"items":[{"label":"Example Guide","translations":{},"link":"/guides/example/","attrs":{}}]},{"label":"Reference","translations":{},"collapsed":false,"autogenerate":{"directory":"reference"}}],"head":[],"customCss":[],"lastUpdated":false,"pagination":true,"favicon":{"href":"/favicon.svg","type":"image/svg+xml"},"pagefind":true,"components":{"Head":"@astrojs/starlight/components/Head.astro","ThemeProvider":"@astrojs/starlight/components/ThemeProvider.astro","SkipLink":"@astrojs/starlight/components/SkipLink.astro","PageFrame":"@astrojs/starlight/components/PageFrame.astro","MobileMenuToggle":"@astrojs/starlight/components/MobileMenuToggle.astro","TwoColumnContent":"@astrojs/starlight/components/TwoColumnContent.astro","Header":"@astrojs/starlight/components/Header.astro","SiteTitle":"@astrojs/starlight/components/SiteTitle.astro","Search":"@astrojs/starlight/components/Search.astro","SocialIcons":"@astrojs/starlight/components/SocialIcons.astro","ThemeSelect":"@astrojs/starlight/components/ThemeSelect.astro","LanguageSelect":"@astrojs/starlight/components/LanguageSelect.astro","Sidebar":"@astrojs/starlight/components/Sidebar.astro","MobileMenuFooter":"@astrojs/starlight/components/MobileMenuFooter.astro","PageSidebar":"@astrojs/starlight/components/PageSidebar.astro","TableOfContents":"@astrojs/starlight/components/TableOfContents.astro","MobileTableOfContents":"@astrojs/starlight/components/MobileTableOfContents.astro","Banner":"@astrojs/starlight/components/Banner.astro","ContentPanel":"@astrojs/starlight/components/ContentPanel.astro","PageTitle":"@astrojs/starlight/components/PageTitle.astro","FallbackContentNotice":"@astrojs/starlight/components/FallbackContentNotice.astro","Hero":"@astrojs/starlight/components/Hero.astro","MarkdownContent":"@astrojs/starlight/components/MarkdownContent.astro","Footer":"@astrojs/starlight/components/Footer.astro","LastUpdated":"@astrojs/starlight/components/LastUpdated.astro","Pagination":"@astrojs/starlight/components/Pagination.astro","EditLink":"@astrojs/starlight/components/EditLink.astro"},"titleDelimiter":"|","isMultilingual":false,"defaultLocale":{"label":"English","lang":"en","dir":"ltr"}};

const html = "";

				const frontmatter = {};
				const file = "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/EmptyMarkdown.md";
				const url = undefined;

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

const version = "0.15.1";

function ensureLeadingSlash(href) {
  if (href[0] !== "/")
    href = "/" + href;
  return href;
}
function ensureTrailingSlash(href) {
  if (href[href.length - 1] !== "/")
    href += "/";
  return href;
}
function stripLeadingSlash(href) {
  if (href[0] === "/")
    href = href.slice(1);
  return href;
}
function stripTrailingSlash(href) {
  if (href[href.length - 1] === "/")
    href = href.slice(0, -1);
  return href;
}
function stripLeadingAndTrailingSlashes(href) {
  href = stripLeadingSlash(href);
  href = stripTrailingSlash(href);
  return href;
}
function stripHtmlExtension(path) {
  const pathWithoutTrailingSlash = stripTrailingSlash(path);
  return pathWithoutTrailingSlash.endsWith(".html") ? pathWithoutTrailingSlash.slice(0, -5) : path;
}
function ensureHtmlExtension(path) {
  path = stripLeadingAndTrailingSlashes(path);
  if (!path.endsWith(".html")) {
    path = path ? path + ".html" : "/index.html";
  }
  return ensureLeadingSlash(path);
}

const base = stripTrailingSlash("/");
function pathWithBase(path) {
  path = stripLeadingSlash(path);
  return path ? base + "/" + path : base + "/";
}
function fileWithBase(path) {
  path = stripLeadingSlash(path);
  return path ? base + "/" + path : base;
}

const HeadConfigSchema = () => z.array(
  z.object({
    /** Name of the HTML tag to add to `<head>`, e.g. `'meta'`, `'link'`, or `'script'`. */
    tag: z.enum(["title", "base", "link", "style", "meta", "script", "noscript", "template"]),
    /** Attributes to set on the tag, e.g. `{ rel: 'stylesheet', href: '/custom.css' }`. */
    attrs: z.record(z.union([z.string(), z.boolean(), z.undefined()])).default({}),
    /** Content to place inside the tag (optional). */
    content: z.string().default("")
  })
).default([]);

const HeadSchema = HeadConfigSchema();
function createHead(defaults, ...heads) {
  let head = HeadSchema.parse(defaults);
  for (const next of heads) {
    head = mergeHead(head, next);
  }
  return sortHead(head);
}
function hasTag(head, entry) {
  switch (entry.tag) {
    case "title":
      return head.some(({ tag }) => tag === "title");
    case "meta":
      return hasOneOf(head, entry, ["name", "property", "http-equiv"]);
    default:
      return false;
  }
}
function hasOneOf(head, entry, keys) {
  const attr = getAttr(keys, entry);
  if (!attr)
    return false;
  const [key, val] = attr;
  return head.some(({ tag, attrs }) => tag === entry.tag && attrs[key] === val);
}
function getAttr(keys, entry) {
  let attr;
  for (const key of keys) {
    const val = entry.attrs[key];
    if (val) {
      attr = [key, val];
      break;
    }
  }
  return attr;
}
function mergeHead(oldHead, newHead) {
  return [...oldHead.filter((tag) => !hasTag(newHead, tag)), ...newHead];
}
function sortHead(head) {
  return head.sort((a, b) => {
    const aImportance = getImportance(a);
    const bImportance = getImportance(b);
    return aImportance > bImportance ? -1 : bImportance > aImportance ? 1 : 0;
  });
}
function getImportance(entry) {
  if (entry.tag === "meta" && ("charset" in entry.attrs || "http-equiv" in entry.attrs || entry.attrs.name === "viewport")) {
    return 100;
  }
  if (entry.tag === "title")
    return 90;
  if (entry.tag !== "meta") {
    if (entry.tag === "link" && "rel" in entry.attrs && entry.attrs.rel === "shortcut icon") {
      return 70;
    }
    return 80;
  }
  return 0;
}

function localizedUrl(url, locale) {
  url = new URL(url);
  if (!config.locales) {
    return url;
  }
  if (locale === "root")
    locale = "";
  const base = "/".replace(/\/$/, "");
  const hasBase = url.pathname.startsWith(base);
  if (hasBase)
    url.pathname = url.pathname.replace(base, "");
  const [_leadingSlash, baseSegment] = url.pathname.split("/");
  if (baseSegment && baseSegment in config.locales) {
    url.pathname = locale ? url.pathname.replace(baseSegment, locale) : url.pathname.replace("/" + baseSegment, "");
  } else if (locale) {
    url.pathname = "/" + locale + url.pathname;
  }
  if (hasBase)
    url.pathname = base + url.pathname;
  return url;
}

const $$Astro$y = createAstro();
const $$Head = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$y, $$props, $$slots);
  Astro2.self = $$Head;
  const { entry, lang } = Astro2.props;
  const { data } = entry;
  const canonical = Astro2.site ? new URL(Astro2.url.pathname, Astro2.site) : void 0;
  const description = data.description || config.description;
  const headDefaults = [
    { tag: "meta", attrs: { charset: "utf-8" } },
    {
      tag: "meta",
      attrs: { name: "viewport", content: "width=device-width, initial-scale=1" }
    },
    { tag: "title", content: `${data.title} ${config.titleDelimiter} ${config.title}` },
    { tag: "link", attrs: { rel: "canonical", href: canonical?.href } },
    { tag: "meta", attrs: { name: "generator", content: Astro2.generator } },
    {
      tag: "meta",
      attrs: { name: "generator", content: `Starlight v${version}` }
    },
    // Favicon
    {
      tag: "link",
      attrs: {
        rel: "shortcut icon",
        href: fileWithBase(config.favicon.href),
        type: config.favicon.type
      }
    },
    // OpenGraph Tags
    { tag: "meta", attrs: { property: "og:title", content: data.title } },
    { tag: "meta", attrs: { property: "og:type", content: "article" } },
    { tag: "meta", attrs: { property: "og:url", content: canonical?.href } },
    { tag: "meta", attrs: { property: "og:locale", content: lang } },
    { tag: "meta", attrs: { property: "og:description", content: description } },
    { tag: "meta", attrs: { property: "og:site_name", content: config.title } },
    // Twitter Tags
    {
      tag: "meta",
      attrs: { name: "twitter:card", content: "summary_large_image" }
    },
    { tag: "meta", attrs: { name: "twitter:title", content: data.title } },
    { tag: "meta", attrs: { name: "twitter:description", content: description } }
  ];
  if (description)
    headDefaults.push({
      tag: "meta",
      attrs: { name: "description", content: description }
    });
  if (canonical && config.isMultilingual) {
    for (const locale in config.locales) {
      const localeOpts = config.locales[locale];
      if (!localeOpts)
        continue;
      headDefaults.push({
        tag: "link",
        attrs: {
          rel: "alternate",
          hreflang: localeOpts.lang,
          href: localizedUrl(canonical, locale).href
        }
      });
    }
  }
  if (Astro2.site) {
    headDefaults.push({
      tag: "link",
      attrs: {
        rel: "sitemap",
        href: fileWithBase("/sitemap-index.xml")
      }
    });
  }
  if (config.social?.twitter) {
    headDefaults.push({
      tag: "meta",
      attrs: {
        name: "twitter:site",
        content: new URL(config.social.twitter.url).pathname
      }
    });
  }
  const head = createHead(headDefaults, config.head, data.head);
  return renderTemplate`${head.map(({ tag: Tag, attrs, content }) => renderTemplate`${renderComponent($$result, "Tag", Tag, { ...attrs }, { "default": ($$result2) => renderTemplate`${unescapeHTML(content)}` })}`)}`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/Head.astro", void 0);

const Icons = {
  "up-caret": '<path d="m17 13.41-4.29-4.24a.999.999 0 0 0-1.42 0l-4.24 4.24a1 1 0 1 0 1.41 1.42L12 11.29l3.54 3.54a1 1 0 0 0 1.41 0 1 1 0 0 0 .05-1.42Z"/>',
  "down-caret": '<path d="M17 9.17a1 1 0 0 0-1.41 0L12 12.71 8.46 9.17a1 1 0 1 0-1.41 1.42l4.24 4.24a1.002 1.002 0 0 0 1.42 0L17 10.59a1.002 1.002 0 0 0 0-1.42Z"/>',
  "right-caret": '<path d="m14.83 11.29-4.24-4.24a1 1 0 1 0-1.42 1.41L12.71 12l-3.54 3.54a1 1 0 0 0 0 1.41 1 1 0 0 0 .71.29 1 1 0 0 0 .71-.29l4.24-4.24a1.002 1.002 0 0 0 0-1.42Z"/>',
  "right-arrow": '<path d="M17.92 11.62a1.001 1.001 0 0 0-.21-.33l-5-5a1.003 1.003 0 1 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1.002 1.002 0 0 0 .325 1.639 1 1 0 0 0 1.095-.219l5-5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76Z"/>',
  "left-arrow": '<path d="M17 11H9.41l3.3-3.29a1.004 1.004 0 1 0-1.42-1.42l-5 5a1 1 0 0 0-.21.33 1 1 0 0 0 0 .76 1 1 0 0 0 .21.33l5 5a1.002 1.002 0 0 0 1.639-.325 1 1 0 0 0-.219-1.095L9.41 13H17a1 1 0 0 0 0-2Z"/>',
  bars: '<path d="M3 8h18a1 1 0 1 0 0-2H3a1 1 0 0 0 0 2Zm18 8H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2Zm0-5H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2Z"/>',
  translate: '<path fill-rule="evenodd" d="M8.516 3a.94.94 0 0 0-.941.94v1.15H2.94a.94.94 0 1 0 0 1.882h7.362a7.422 7.422 0 0 1-1.787 3.958 7.42 7.42 0 0 1-1.422-2.425.94.94 0 1 0-1.774.627 9.303 9.303 0 0 0 1.785 3.043 7.422 7.422 0 0 1-4.164 1.278.94.94 0 1 0 0 1.881 9.303 9.303 0 0 0 5.575-1.855 9.303 9.303 0 0 0 4.11 1.74l-.763 1.525a.968.968 0 0 0-.016.034l-1.385 2.77a.94.94 0 1 0 1.683.841l1.133-2.267h5.806l1.134 2.267a.94.94 0 0 0 1.683-.841l-1.385-2.769a.95.95 0 0 0-.018-.036l-3.476-6.951a.94.94 0 0 0-1.682 0l-1.82 3.639a7.423 7.423 0 0 1-3.593-1.256 9.303 9.303 0 0 0 2.27-5.203h1.894a.94.94 0 0 0 0-1.881H9.456V3.94A.94.94 0 0 0 8.516 3Zm6.426 11.794a1.068 1.068 0 0 1-.02.039l-.703 1.407h3.924l-1.962-3.924-1.24 2.478Z" clip-rule="evenodd"/>',
  pencil: '<path d="M22 7.24a1 1 0 0 0-.29-.71l-4.24-4.24a1 1 0 0 0-1.1-.22 1 1 0 0 0-.32.22l-2.83 2.83L2.29 16.05a1 1 0 0 0-.29.71V21a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .76-.29l10.87-10.93L21.71 8c.1-.1.17-.2.22-.33a1 1 0 0 0 0-.24v-.14l.07-.05ZM6.83 20H4v-2.83l9.93-9.93 2.83 2.83L6.83 20ZM18.17 8.66l-2.83-2.83 1.42-1.41 2.82 2.82-1.41 1.42Z"/>',
  pen: '<path d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 1 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1Zm-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83-6.94 6.93a1 1 0 0 0-.29.71Zm10.76-8.35 2.83 2.83-1.42 1.42-2.83-2.83 1.42-1.42ZM8 13.17l5.93-5.93 2.83 2.83L10.83 16H8v-2.83Z"/>',
  document: '<path d="M9 10h1a1 1 0 1 0 0-2H9a1 1 0 0 0 0 2Zm0 2a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2H9Zm11-3.06a1.3 1.3 0 0 0-.06-.27v-.09c-.05-.1-.11-.2-.19-.28l-6-6a1.07 1.07 0 0 0-.28-.19h-.09a.88.88 0 0 0-.33-.11H7a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8.94Zm-6-3.53L16.59 8H15a1 1 0 0 1-1-1V5.41ZM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5v3a3 3 0 0 0 3 3h3v9Zm-3-3H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2Z"/>',
  "add-document": '<path d="M20 8.94a1.3 1.3 0 0 0-.06-.27v-.09c-.05-.1-.11-.2-.19-.28l-6-6a1.07 1.07 0 0 0-.28-.19h-.09a.88.88 0 0 0-.33-.11H7a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8.94Zm-6-3.53L16.59 8H15a1 1 0 0 1-1-1V5.41ZM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5v3a3 3 0 0 0 3 3h3v9Zm-4-5h-1v-1a1 1 0 0 0-2 0v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0v-1h1a1 1 0 0 0 0-2Z"/>',
  setting: '<path d="m21.32 9.55-1.89-.63.89-1.78A1 1 0 0 0 20.13 6L18 3.87a1 1 0 0 0-1.15-.19l-1.78.89-.63-1.89A1 1 0 0 0 13.5 2h-3a1 1 0 0 0-.95.68l-.63 1.89-1.78-.89A1 1 0 0 0 6 3.87L3.87 6a1 1 0 0 0-.19 1.15l.89 1.78-1.89.63a1 1 0 0 0-.68.94v3a1 1 0 0 0 .68.95l1.89.63-.89 1.78A1 1 0 0 0 3.87 18L6 20.13a1 1 0 0 0 1.15.19l1.78-.89.63 1.89a1 1 0 0 0 .95.68h3a1 1 0 0 0 .95-.68l.63-1.89 1.78.89a1 1 0 0 0 1.13-.19L20.13 18a1 1 0 0 0 .19-1.15l-.89-1.78 1.89-.63a1 1 0 0 0 .68-.94v-3a1 1 0 0 0-.68-.95ZM20 12.78l-1.2.4A2 2 0 0 0 17.64 16l.57 1.14-1.1 1.1-1.11-.6a2 2 0 0 0-2.79 1.16l-.4 1.2h-1.59l-.4-1.2A2 2 0 0 0 8 17.64l-1.14.57-1.1-1.1.6-1.11a2 2 0 0 0-1.16-2.82l-1.2-.4v-1.56l1.2-.4A2 2 0 0 0 6.36 8l-.57-1.11 1.1-1.1L8 6.36a2 2 0 0 0 2.82-1.16l.4-1.2h1.56l.4 1.2A2 2 0 0 0 16 6.36l1.14-.57 1.1 1.1-.6 1.11a2 2 0 0 0 1.16 2.79l1.2.4v1.59ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/>',
  external: '<path d="M19.33 10.18a1 1 0 0 1-.77 0 1 1 0 0 1-.62-.93l.01-1.83-8.2 8.2a1 1 0 0 1-1.41-1.42l8.2-8.2H14.7a1 1 0 0 1 0-2h4.25a1 1 0 0 1 1 1v4.25a1 1 0 0 1-.62.93Z"/><path d="M11 4a1 1 0 1 1 0 2H7a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4a1 1 0 1 1 2 0v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4Z"/>',
  moon: '<path d="M21.64 13a1 1 0 0 0-1.05-.14 8.049 8.049 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05Zm-9.5 6.69A8.14 8.14 0 0 1 7.08 5.22v.27a10.15 10.15 0 0 0 10.14 10.14 9.784 9.784 0 0 0 2.1-.22 8.11 8.11 0 0 1-7.18 4.32v-.04Z"/>',
  sun: '<path d="M5 12a1 1 0 0 0-1-1H3a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1Zm.64 5-.71.71a1 1 0 0 0 0 1.41 1 1 0 0 0 1.41 0l.71-.71A1 1 0 0 0 5.64 17ZM12 5a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v1a1 1 0 0 0 1 1Zm5.66 2.34a1 1 0 0 0 .7-.29l.71-.71a1 1 0 1 0-1.41-1.41l-.66.71a1 1 0 0 0 0 1.41 1 1 0 0 0 .66.29Zm-12-.29a1 1 0 0 0 1.41 0 1 1 0 0 0 0-1.41l-.71-.71a1.004 1.004 0 1 0-1.43 1.41l.73.71ZM21 11h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2Zm-2.64 6A1 1 0 0 0 17 18.36l.71.71a1 1 0 0 0 1.41 0 1 1 0 0 0 0-1.41l-.76-.66ZM12 6.5a5.5 5.5 0 1 0 5.5 5.5A5.51 5.51 0 0 0 12 6.5Zm0 9a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm0 3.5a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1Z"/>',
  laptop: '<path d="M21 14h-1V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v7H3a1 1 0 0 0-1 1v2a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-2a1 1 0 0 0-1-1ZM6 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v7H6V7Zm14 10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1h16v1Z"/>',
  "open-book": '<path d="M21.17 2.06A13.1 13.1 0 0 0 19 1.87a12.94 12.94 0 0 0-7 2.05 12.94 12.94 0 0 0-7-2 13.1 13.1 0 0 0-2.17.19 1 1 0 0 0-.83 1v12a1 1 0 0 0 1.17 1 10.9 10.9 0 0 1 8.25 1.91l.12.07h.11a.91.91 0 0 0 .7 0h.11l.12-.07A10.899 10.899 0 0 1 20.83 16 1 1 0 0 0 22 15V3a1 1 0 0 0-.83-.94ZM11 15.35a12.87 12.87 0 0 0-6-1.48H4v-10c.333-.02.667-.02 1 0a10.86 10.86 0 0 1 6 1.8v9.68Zm9-1.44h-1a12.87 12.87 0 0 0-6 1.48V5.67a10.86 10.86 0 0 1 6-1.8c.333-.02.667-.02 1 0v10.04Zm1.17 4.15a13.098 13.098 0 0 0-2.17-.19 12.94 12.94 0 0 0-7 2.05 12.94 12.94 0 0 0-7-2.05c-.727.003-1.453.066-2.17.19A1 1 0 0 0 2 19.21a1 1 0 0 0 1.17.79 10.9 10.9 0 0 1 8.25 1.91 1 1 0 0 0 1.16 0A10.9 10.9 0 0 1 20.83 20a1 1 0 0 0 1.17-.79 1 1 0 0 0-.83-1.15Z"/>',
  information: '<path d="M12 11a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-1-1Zm.38-3.92a1 1 0 0 0-.76 0 1 1 0 0 0-.33.21 1.15 1.15 0 0 0-.21.33 1 1 0 0 0 .21 1.09c.097.088.209.16.33.21A1 1 0 0 0 13 8a1.05 1.05 0 0 0-.29-.71 1 1 0 0 0-.33-.21ZM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16.001A8 8 0 0 1 12 20Z"/>',
  magnifier: '<path d="M21.71 20.29 18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a.999.999 0 0 0 1.42 0 1 1 0 0 0 0-1.39ZM11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"/>',
  "forward-slash": '<path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5Zm3 15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10Z"/><path d="M15.293 6.707a1 1 0 1 1 1.414 1.414l-8.485 8.486a1 1 0 0 1-1.414-1.415l8.485-8.485Z"/>',
  close: '<path d="m13.41 12 6.3-6.29a1.004 1.004 0 1 0-1.42-1.42L12 10.59l-6.29-6.3a1.004 1.004 0 0 0-1.42 1.42l6.3 6.29-6.3 6.29a1 1 0 0 0 0 1.42.998.998 0 0 0 1.42 0l6.29-6.3 6.29 6.3a.999.999 0 0 0 1.42 0 1 1 0 0 0 0-1.42L13.41 12Z"/>',
  error: '<path d="M12 7a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm9.71-7.44-5.27-5.27a1.05 1.05 0 0 0-.71-.29H8.27a1.05 1.05 0 0 0-.71.29L2.29 7.56a1.05 1.05 0 0 0-.29.71v7.46c.004.265.107.518.29.71l5.27 5.27c.192.183.445.286.71.29h7.46a1.05 1.05 0 0 0 .71-.29l5.27-5.27a1.05 1.05 0 0 0 .29-.71V8.27a1.05 1.05 0 0 0-.29-.71ZM20 15.31 15.31 20H8.69L4 15.31V8.69L8.69 4h6.62L20 8.69v6.62Z"/>',
  warning: '<path d="M12 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm10.67 1.47-8.05-14a3 3 0 0 0-5.24 0l-8 14A3 3 0 0 0 3.94 22h16.12a3 3 0 0 0 2.61-4.53Zm-1.73 2a1 1 0 0 1-.88.51H3.94a1 1 0 0 1-.88-.51 1 1 0 0 1 0-1l8-14a1 1 0 0 1 1.78 0l8.05 14a1 1 0 0 1 .05 1.02v-.02ZM12 8a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1Z"/>',
  "approve-check-circle": '<path d="m14.72 8.79-4.29 4.3-1.65-1.65a1 1 0 1 0-1.41 1.41l2.35 2.36a1 1 0 0 0 1.41 0l5-5a1.002 1.002 0 1 0-1.41-1.42ZM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16.001A8 8 0 0 1 12 20Z"/>',
  "approve-check": '<path d="M18.71 7.21a1 1 0 0 0-1.42 0l-7.45 7.46-3.13-3.14A1.02 1.02 0 1 0 5.29 13l3.84 3.84a1.001 1.001 0 0 0 1.42 0l8.16-8.16a1 1 0 0 0 0-1.47Z"/>',
  rocket: '<path fill-rule="evenodd" d="M1.44 8.855v-.001l3.527-3.516c.34-.344.802-.541 1.285-.548h6.649l.947-.947c3.07-3.07 6.207-3.072 7.62-2.868a1.821 1.821 0 0 1 1.557 1.557c.204 1.413.203 4.55-2.868 7.62l-.946.946v6.649a1.845 1.845 0 0 1-.549 1.286l-3.516 3.528a1.844 1.844 0 0 1-3.11-.944l-.858-4.275-4.52-4.52-2.31-.463-1.964-.394A1.847 1.847 0 0 1 .98 10.693a1.843 1.843 0 0 1 .46-1.838Zm5.379 2.017-3.873-.776L6.32 6.733h4.638l-4.14 4.14Zm8.403-5.655c2.459-2.46 4.856-2.463 5.89-2.33.134 1.035.13 3.432-2.329 5.891l-6.71 6.71-3.561-3.56 6.71-6.711Zm-1.318 15.837-.776-3.873 4.14-4.14v4.639l-3.364 3.374Z" clip-rule="evenodd"/><path d="M9.318 18.345a.972.972 0 0 0-1.86-.561c-.482 1.435-1.687 2.204-2.934 2.619a8.22 8.22 0 0 1-1.23.302c.062-.365.157-.79.303-1.229.415-1.247 1.184-2.452 2.62-2.935a.971.971 0 1 0-.62-1.842c-.12.04-.236.084-.35.13-2.02.828-3.012 2.588-3.493 4.033a10.383 10.383 0 0 0-.51 2.845l-.001.016v.063c0 .536.434.972.97.972H2.24a7.21 7.21 0 0 0 .878-.065c.527-.063 1.248-.19 2.02-.447 1.445-.48 3.205-1.472 4.033-3.494a5.828 5.828 0 0 0 .147-.407Z"/>',
  star: '<path d="M22 9.67a1 1 0 0 0-.86-.67l-5.69-.83L12.9 3a1 1 0 0 0-1.8 0L8.55 8.16 2.86 9a1 1 0 0 0-.81.68 1 1 0 0 0 .25 1l4.13 4-1 5.68a1 1 0 0 0 1.45 1.07L12 18.76l5.1 2.68c.14.08.3.12.46.12a1 1 0 0 0 .99-1.19l-1-5.68 4.13-4A1 1 0 0 0 22 9.67Zm-6.15 4a1 1 0 0 0-.29.89l.72 4.19-3.76-2a1 1 0 0 0-.94 0l-3.76 2 .72-4.19a1 1 0 0 0-.29-.89l-3-3 4.21-.61a1 1 0 0 0 .76-.55L12 5.7l1.88 3.82a1 1 0 0 0 .76.55l4.21.61-3 2.99Z"/>',
  puzzle: '<path d="M17 22H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h1a4 4 0 0 1 7.3-2.18c.448.64.692 1.4.7 2.18h3a1 1 0 0 1 1 1v3a4 4 0 0 1 2.18 7.3A3.86 3.86 0 0 1 18 18v3a1 1 0 0 1-1 1ZM5 8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11v-3.18a1 1 0 0 1 1.33-.95 1.77 1.77 0 0 0 1.74-.23 2 2 0 0 0 .93-1.37 2 2 0 0 0-.48-1.59 1.89 1.89 0 0 0-2.17-.55 1 1 0 0 1-1.33-.95V8h-3.2a1 1 0 0 1-1-1.33 1.77 1.77 0 0 0-.23-1.74 1.939 1.939 0 0 0-3-.43A2 2 0 0 0 8 6c.002.23.046.456.13.67A1 1 0 0 1 7.18 8H5Z"/>',
  "list-format": '<path d="M3.71 16.29a1 1 0 0 0-.33-.21 1 1 0 0 0-.76 0 1 1 0 0 0-.33.21 1 1 0 0 0-.21.33 1 1 0 0 0 .21 1.09c.097.088.209.16.33.21a.94.94 0 0 0 .76 0 1.15 1.15 0 0 0 .33-.21 1 1 0 0 0 .21-1.09 1 1 0 0 0-.21-.33ZM7 8h14a1 1 0 1 0 0-2H7a1 1 0 0 0 0 2Zm-3.29 3.29a1 1 0 0 0-1.09-.21 1.15 1.15 0 0 0-.33.21 1 1 0 0 0-.21.33.94.94 0 0 0 0 .76c.05.121.122.233.21.33.097.088.209.16.33.21a.94.94 0 0 0 .76 0 1.15 1.15 0 0 0 .33-.21 1.15 1.15 0 0 0 .21-.33.94.94 0 0 0 0-.76 1 1 0 0 0-.21-.33ZM21 11H7a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2ZM3.71 6.29a1 1 0 0 0-.33-.21 1 1 0 0 0-1.09.21 1.15 1.15 0 0 0-.21.33.94.94 0 0 0 0 .76c.05.121.122.233.21.33.097.088.209.16.33.21a1 1 0 0 0 1.09-.21 1.15 1.15 0 0 0 .21-.33.94.94 0 0 0 0-.76 1.15 1.15 0 0 0-.21-.33ZM21 16H7a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2Z"/>',
  random: '<path d="M8.7 10a1 1 0 0 0 1.41 0 1 1 0 0 0 0-1.41l-6.27-6.3a1 1 0 0 0-1.42 1.42ZM21 14a1 1 0 0 0-1 1v3.59L15.44 14A1 1 0 0 0 14 15.44L18.59 20H15a1 1 0 0 0 0 2h6a1 1 0 0 0 .38-.08 1 1 0 0 0 .54-.54A1 1 0 0 0 22 21v-6a1 1 0 0 0-1-1Zm.92-11.38a1 1 0 0 0-.54-.54A1 1 0 0 0 21 2h-6a1 1 0 0 0 0 2h3.59L2.29 20.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0L20 5.41V9a1 1 0 0 0 2 0V3a1 1 0 0 0-.08-.38Z"/>',
  github: '<path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.08 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3Z"/>',
  gitlab: '<path d="m22.63 9.8-.03-.09-3-7.81a.78.78 0 0 0-.76-.5.8.8 0 0 0-.46.18.8.8 0 0 0-.26.4L16.1 8.17H7.9l-2-6.19a.79.79 0 0 0-1.5-.08l-3 7.81-.02.08a5.56 5.56 0 0 0 1.84 6.43h.01l.03.02 4.56 3.42 2.26 1.7 1.37 1.05a.92.92 0 0 0 1.12 0l1.38-1.04 2.25-1.71 4.6-3.44a5.56 5.56 0 0 0 1.84-6.43Z"/>',
  bitbucket: '<path d="M1 1.5a.8.8 0 0 0-.7.9l3.2 19.3c0 .5.5.8 1 .8h15.2c.4 0 .7-.2.8-.6l3.2-19.5a.7.7 0 0 0-.8-.9H1zm13.4 14H9.6l-1.3-7h7.3l-1.2 7z"/>',
  codePen: '<path d="M23.5 7.5 12.5.2a1 1 0 0 0-1 0L.4 7.5a1 1 0 0 0-.5.8v7.4c0 .3.2.6.5.8l11 7.3c.3.3.7.3 1 0l11-7.3c.3-.2.5-.5.5-.8V8.3a1 1 0 0 0-.5-.8zM13 3l8.1 5.3-3.6 2.5-4.5-3V3zm-2 0v4.8l-4.5 3-3.6-2.5 8-5.3zm-9 7.3L4.7 12l-2.5 1.7v-3.4zM11 21l-8.1-5.3 3.6-2.5 4.5 3V21zm1-6.6L8.4 12 12 9.6l3.6 2.4-3.6 2.4zm1 6.6v-4.8l4.5-3 3.6 2.5-8 5.3zm9-7.3L19.3 12l2.5-1.7v3.4z"/>',
  discord: '<path d="M20.32 4.37a19.8 19.8 0 0 0-4.93-1.51 13.78 13.78 0 0 0-.64 1.28 18.27 18.27 0 0 0-5.5 0 12.64 12.64 0 0 0-.64-1.28h-.05A19.74 19.74 0 0 0 3.64 4.4 20.26 20.26 0 0 0 .11 18.09l.02.02a19.9 19.9 0 0 0 6.04 3.03l.04-.02a14.24 14.24 0 0 0 1.23-2.03.08.08 0 0 0-.05-.07 13.1 13.1 0 0 1-1.9-.92.08.08 0 0 1 .02-.1 10.2 10.2 0 0 0 .41-.31h.04a14.2 14.2 0 0 0 12.1 0l.04.01a9.63 9.63 0 0 0 .4.32.08.08 0 0 1-.03.1 12.29 12.29 0 0 1-1.9.91.08.08 0 0 0-.02.1 15.97 15.97 0 0 0 1.27 2.01h.04a19.84 19.84 0 0 0 6.03-3.05v-.03a20.12 20.12 0 0 0-3.57-13.69ZM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.96 2.42-2.16 2.42Zm7.97 0c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.22 0 2.18 1.1 2.16 2.42 0 1.34-.94 2.42-2.16 2.42Z"/>',
  gitter: '<path d="M6.11 15.12H3.75V0h2.36v15.12zm4.71-11.55H8.46V24h2.36V3.57zm4.72 0h-2.36V24h2.36V3.57zm4.71 0h-2.36v11.57h2.36V3.56z"/>',
  twitter: '<path d="M24 4.4a10 10 0 0 1-2.83.78 5.05 5.05 0 0 0 2.17-2.79 9.7 9.7 0 0 1-3.13 1.23 4.89 4.89 0 0 0-5.94-1.03 5 5 0 0 0-2.17 2.38 5.15 5.15 0 0 0-.3 3.25c-1.95-.1-3.86-.63-5.61-1.53a14.04 14.04 0 0 1-4.52-3.74 5.2 5.2 0 0 0-.09 4.91c.39.74.94 1.35 1.61 1.82a4.77 4.77 0 0 1-2.23-.63v.06c0 1.16.4 2.29 1.12 3.18a4.9 4.9 0 0 0 2.84 1.74c-.73.22-1.5.26-2.24.12a4.89 4.89 0 0 0 4.59 3.49A9.78 9.78 0 0 1 0 19.73 13.65 13.65 0 0 0 7.55 22a13.63 13.63 0 0 0 9.96-4.16A14.26 14.26 0 0 0 21.6 7.65V7c.94-.72 1.75-1.6 2.4-2.6Z"/>',
  "x.com": '<path d="M 18.242188 2.25 L 21.554688 2.25 L 14.324219 10.507812 L 22.828125 21.75 L 16.171875 21.75 L 10.953125 14.933594 L 4.992188 21.75 L 1.679688 21.75 L 9.40625 12.914062 L 1.257812 2.25 L 8.082031 2.25 L 12.792969 8.480469 Z M 17.082031 19.773438 L 18.914062 19.773438 L 7.082031 4.125 L 5.113281 4.125 Z M 17.082031 19.773438 "/>',
  mastodon: '<path d="M16.45 17.77c2.77-.33 5.18-2.03 5.49-3.58.47-2.45.44-5.97.44-5.97 0-4.77-3.15-6.17-3.15-6.17-1.58-.72-4.3-1.03-7.13-1.05h-.07c-2.83.02-5.55.33-7.13 1.05 0 0-3.14 1.4-3.14 6.17v.91c-.01.88-.02 1.86 0 2.88.12 4.67.87 9.27 5.2 10.4 2 .53 3.72.64 5.1.57 2.51-.14 3.92-.9 3.92-.9l-.08-1.8s-1.8.56-3.8.5c-2-.08-4.1-.22-4.43-2.66a4.97 4.97 0 0 1-.04-.68s1.96.48 4.44.59c1.51.07 2.94-.09 4.38-.26Zm2.22-3.4h-2.3v-5.6c0-1.19-.5-1.79-1.5-1.79-1.1 0-1.66.71-1.66 2.12v3.07h-2.3V9.1c0-1.4-.55-2.12-1.65-2.12-1 0-1.5.6-1.5 1.78v5.61h-2.3V8.6c0-1.18.3-2.12.9-2.81a3.17 3.17 0 0 1 2.47-1.05c1.18 0 2.07.45 2.66 1.35l.57.96.58-.96a2.97 2.97 0 0 1 2.66-1.35c1.01 0 1.83.36 2.46 1.05.6.7.9 1.63.9 2.81v5.78Z"/>',
  codeberg: '<path d="M12 .5a12 12 0 0 0-12 12 12 12 0 0 0 1.8 6.4l10-13a.2.1 0 0 1 .4 0l10 13a12 12 0 0 0 1.8-6.4 12 12 0 0 0-12-12zm.3 6.5 4.4 16.5a12 12 0 0 0 5.2-4.2z"/>',
  youtube: '<path d="M23.5 6.2A3 3 0 0 0 21.4 4c-1.9-.5-9.4-.5-9.4-.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.3C0 8 0 12 0 12s0 4 .5 5.8A3 3 0 0 0 2.6 20c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2c.5-2 .5-5.9.5-5.9s0-4-.5-5.8zm-14 9.4V8.4l6.3 3.6-6.3 3.6z"/>',
  threads: '<path d="m17.73 11.2-.29-.13c-.17-3.13-1.88-4.92-4.75-4.94h-.04c-1.72 0-3.14.73-4.02 2.06l1.58 1.09a2.8 2.8 0 0 1 2.47-1.21c.94 0 1.66.28 2.12.81.33.4.56.93.67 1.61-.84-.14-1.74-.18-2.71-.13-2.73.16-4.49 1.75-4.37 3.97a3.41 3.41 0 0 0 1.57 2.71c.81.54 1.85.8 2.93.74a4.32 4.32 0 0 0 3.33-1.62 6 6 0 0 0 1.14-2.97 3.5 3.5 0 0 1 1.46 1.6 4 4 0 0 1-.98 4.4c-1.3 1.3-2.86 1.85-5.21 1.87-2.62-.02-4.6-.86-5.88-2.5-1.2-1.52-1.82-3.73-1.85-6.56.03-2.83.65-5.04 1.85-6.57 1.29-1.63 3.26-2.47 5.88-2.49 2.63.02 4.64.86 5.97 2.5.66.8 1.15 1.82 1.48 3l1.85-.5c-.4-1.44-1.02-2.7-1.86-3.73-1.71-2.1-4.21-3.19-7.44-3.21h-.01c-3.22.02-5.7 1.1-7.35 3.22C3.79 6.1 3.03 8.72 3 11.99V12c.03 3.29.79 5.9 2.27 7.78 1.66 2.12 4.13 3.2 7.35 3.22h.01c2.86-.02 4.88-.77 6.54-2.43a5.95 5.95 0 0 0 1.4-6.56 5.62 5.62 0 0 0-2.84-2.81Zm-4.94 4.64c-1.2.07-2.44-.47-2.5-1.62-.05-.85.6-1.8 2.57-1.92l.67-.02c.71 0 1.38.07 1.99.2-.23 2.84-1.56 3.3-2.73 3.36Z"/>',
  linkedin: '<path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2ZM8.09 18.74h-3v-9h3v9ZM6.59 8.48a1.56 1.56 0 0 1 0-3.12 1.57 1.57 0 1 1 0 3.12Zm12.32 10.26h-3v-4.83c0-1.21-.43-2-1.52-2A1.65 1.65 0 0 0 12.85 13a2 2 0 0 0-.1.73v5h-3v-9h3V11a3 3 0 0 1 2.71-1.5c2 0 3.45 1.29 3.45 4.06v5.18Z"/>',
  twitch: '<path d="M2.5 1 1 4.8v15.4h5.5V23h3.1l3-2.8H17l6-5.7V1H2.6ZM21 13.5l-3.4 3.3H12l-3 2.8v-2.8H4.5V3H21v10.5Zm-3.4-6.8v5.8h-2V6.7h2Zm-5.5 0v5.8h-2V6.7h2Z"/>',
  microsoftTeams: '<path d="M13.78 7.2a3.63 3.63 0 1 0-4.3-3.68h1.78a2.52 2.52 0 0 1 2.52 2.53V7.2zM7.34 18.8h3.92a2.52 2.52 0 0 0 2.52-2.52V8.37h4.17c.58.01 1.04.5 1.03 1.07v6.45a6.3 6.3 0 0 1-6.14 6.43 6.3 6.3 0 0 1-5.5-3.52zm16.1-14.06a2.51 2.51 0 1 1-5.02 0 2.51 2.51 0 0 1 5.02 0zm-3.36 14.24h-.17c.4-1 .59-2.05.57-3.11V9.46c0-.38-.07-.75-.23-1.09h2.69c.58 0 1.06.48 1.06 1.06v5.65a3.9 3.9 0 0 1-3.9 3.9h-.02z"/><path d="M1.02 5.02h10.24c.56 0 1.02.46 1.02 1.03v10.23a1.02 1.02 0 0 1-1.02 1.02H1.02A1.02 1.02 0 0 1 0 16.28V6.04c0-.56.46-1.02 1.02-1.02zm7.81 3.9V7.84H3.45v1.08h2.03v5.57h1.3V8.92h2.05z"/>',
  instagram: '<path d="M17.3 5.5a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2ZM22 7.9a7.6 7.6 0 0 0-.4-2.5 5 5 0 0 0-1.2-1.7 4.7 4.7 0 0 0-1.8-1.2 7.3 7.3 0 0 0-2.4-.4L12 2H7.9a7.3 7.3 0 0 0-2.5.5 4.8 4.8 0 0 0-1.7 1.2 4.7 4.7 0 0 0-1.2 1.8 7.3 7.3 0 0 0-.4 2.4L2 12v4.1a7.3 7.3 0 0 0 .5 2.4 4.7 4.7 0 0 0 1.2 1.8 4.8 4.8 0 0 0 1.8 1.2 7.3 7.3 0 0 0 2.4.4l4.1.1h4.1a7.3 7.3 0 0 0 2.4-.5 4.7 4.7 0 0 0 1.8-1.2 4.8 4.8 0 0 0 1.2-1.7 7.6 7.6 0 0 0 .4-2.5L22 12V7.9ZM20.1 16a5.6 5.6 0 0 1-.3 1.9A3 3 0 0 1 19 19a3.2 3.2 0 0 1-1.1.8 5.6 5.6 0 0 1-1.9.3H8a5.7 5.7 0 0 1-1.9-.3A3.3 3.3 0 0 1 5 19a3 3 0 0 1-.7-1.1 5.5 5.5 0 0 1-.4-1.9l-.1-4V8a5.5 5.5 0 0 1 .4-1.9A3 3 0 0 1 5 5a3.1 3.1 0 0 1 1.1-.8A5.7 5.7 0 0 1 8 3.9l4-.1h4a5.6 5.6 0 0 1 1.9.4A3 3 0 0 1 19 5a3 3 0 0 1 .7 1.1A5.6 5.6 0 0 1 20 8l.1 4v4ZM12 6.9a5.1 5.1 0 1 0 5.1 5.1A5.1 5.1 0 0 0 12 6.9Zm0 8.4a3.3 3.3 0 1 1 3.3-3.3 3.3 3.3 0 0 1-3.3 3.3Z"/>',
  stackOverflow: '<path d="M15.72 0 14 1.28l6.4 8.58 1.7-1.26L15.73 0zm-3.94 3.42-1.36 1.64 8.22 6.85 1.37-1.64-8.23-6.85zM8.64 7.88l-.91 1.94 9.7 4.52.9-1.94-9.7-4.52zm-1.86 4.86-.44 2.1 10.48 2.2.44-2.1-10.47-2.2zM1.9 15.47V24h19.19v-8.53h-2.13v6.4H4.02v-6.4H1.9zm4.26 2.13v2.13h10.66V17.6H6.15Z"/>',
  telegram: '<path d="M22.265 2.428a2.048 2.048 0 0 0-2.078-.324L2.266 9.339a2.043 2.043 0 0 0 .104 3.818l3.625 1.261 2.02 6.682a.998.998 0 0 0 .119.252c.008.012.019.02.027.033a.988.988 0 0 0 .211.215.972.972 0 0 0 .07.05.986.986 0 0 0 .31.136l.013.001.006.003a1.022 1.022 0 0 0 .203.02l.018-.003a.993.993 0 0 0 .301-.052c.023-.008.042-.02.064-.03a.993.993 0 0 0 .205-.114 250.76 250.76 0 0 1 .152-.129l2.702-2.983 4.03 3.122a2.023 2.023 0 0 0 1.241.427 2.054 2.054 0 0 0 2.008-1.633l3.263-16.017a2.03 2.03 0 0 0-.693-1.97ZM9.37 14.736a.994.994 0 0 0-.272.506l-.31 1.504-.784-2.593 4.065-2.117Zm8.302 5.304-4.763-3.69a1.001 1.001 0 0 0-1.353.12l-.866.955.306-1.487 7.083-7.083a1 1 0 0 0-1.169-1.593L6.745 12.554 3.02 11.191 20.999 4Z"/>',
  rss: '<path d="M2.88 16.88a3 3 0 0 0 0 4.24 3 3 0 0 0 4.24 0 3 3 0 0 0-4.24-4.24Zm2.83 2.83a1 1 0 0 1-1.42-1.42 1 1 0 0 1 1.42 0 1 1 0 0 1 0 1.42ZM5 12a1 1 0 0 0 0 2 5 5 0 0 1 5 5 1 1 0 0 0 2 0 7 7 0 0 0-7-7Zm0-4a1 1 0 0 0 0 2 9 9 0 0 1 9 9 1 1 0 0 0 2 0 11.08 11.08 0 0 0-3.22-7.78A11.08 11.08 0 0 0 5 8Zm10.61.39A15.11 15.11 0 0 0 5 4a1 1 0 0 0 0 2 13 13 0 0 1 13 13 1 1 0 0 0 2 0 15.11 15.11 0 0 0-4.39-10.61Z"/>',
  facebook: '<path d="M20.9 2H3.1A1.1 1.1 0 0 0 2 3.1v17.8A1.1 1.1 0 0 0 3.1 22h9.58v-7.75h-2.6v-3h2.6V9a3.64 3.64 0 0 1 3.88-4 20.26 20.26 0 0 1 2.33.12v2.7H17.3c-1.26 0-1.5.6-1.5 1.47v1.93h3l-.39 3H15.8V22h5.1a1.1 1.1 0 0 0 1.1-1.1V3.1A1.1 1.1 0 0 0 20.9 2Z"/>',
  email: '<path d="M19 4H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-.41 2-5.88 5.88a1 1 0 0 1-1.42 0L5.41 6ZM20 17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7.41l5.88 5.88a3 3 0 0 0 4.24 0L20 7.41Z"/>',
  reddit: '<path d="M14.41 16.87a3.38 3.38 0 0 1-2.37.63 3.37 3.37 0 0 1-2.36-.63 1 1 0 0 0-1.42 1.41 5.11 5.11 0 0 0 3.78 1.22 5.12 5.12 0 0 0 3.78-1.22 1 1 0 1 0-1.41-1.41ZM9.2 15a1 1 0 1 0-1-1 1 1 0 0 0 1 1Zm6-2a1 1 0 1 0 1 1 1 1 0 0 0-1-1Zm7.8-1.22a3.77 3.77 0 0 0-6.8-2.26 16.5 16.5 0 0 0-3.04-.48l.85-5.7 2.09.7a3 3 0 0 0 6-.06v-.02a3.03 3.03 0 0 0-3-2.96 2.98 2.98 0 0 0-2.34 1.16l-3.24-1.1a1 1 0 0 0-1.3.8l-1.09 7.17a16.66 16.66 0 0 0-3.34.49 3.77 3.77 0 0 0-6.22 4.23A4.86 4.86 0 0 0 1 16c0 3.92 4.83 7 11 7s11-3.08 11-7a4.86 4.86 0 0 0-.57-2.25 3.78 3.78 0 0 0 .57-1.97ZM19.1 3a1 1 0 1 1-1 1 1.02 1.02 0 0 1 1-1ZM4.77 10a1.76 1.76 0 0 1 .88.25A9.98 9.98 0 0 0 3 11.92v-.14A1.78 1.78 0 0 1 4.78 10ZM12 21c-4.88 0-9-2.29-9-5s4.12-5 9-5 9 2.29 9 5-4.12 5-9 5Zm8.99-9.08a9.98 9.98 0 0 0-2.65-1.67 1.76 1.76 0 0 1 .88-.25A1.78 1.78 0 0 1 21 11.78l-.01.14Z"/>',
  patreon: '<path d="M22.04 7.6c0-2.8-2.19-5.1-4.75-5.93a15.19 15.19 0 0 0-10.44.55C3.16 3.96 2 7.78 1.95 11.58c-.02 3.12.3 11.36 4.94 11.42 3.45.04 3.97-4.4 5.56-6.55 1.14-1.52 2.6-1.95 4.4-2.4 3.1-.76 5.2-3.2 5.2-6.44Z"/>',
  slack: '<path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52Zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313ZM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834Zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312Zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834Zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312Zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52Zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313Z"/>',
  matrix: '<path d="M22.5 1.5v21h-2.25V24H24V0h-3.75v1.5h2.25ZM7.46 7.95V9.1h.04a3.02 3.02 0 0 1 2.61-1.39c.54 0 1.03.1 1.48.32.44.2.78.58 1.01 1.1.26-.37.6-.7 1.03-.99.44-.28.95-.43 1.55-.43.45 0 .87.06 1.26.17.38.11.71.29.99.53.27.24.49.56.64.95.15.4.23.86.23 1.42v5.72h-2.34v-4.85c0-.29-.01-.56-.04-.8a1.73 1.73 0 0 0-.18-.67 1.1 1.1 0 0 0-.44-.45 1.6 1.6 0 0 0-.78-.16c-.33 0-.6.06-.8.19-.2.12-.37.29-.48.5a2 2 0 0 0-.23.69c-.04.26-.06.52-.06.78v4.77H10.6v-4.8l-.01-.75a2.29 2.29 0 0 0-.14-.69c-.08-.2-.23-.38-.42-.5a1.5 1.5 0 0 0-.85-.2c-.15.01-.3.04-.44.08-.19.06-.37.15-.52.28-.18.14-.32.34-.44.6-.12.26-.18.6-.18 1.02v4.96H5.25V7.94h2.21ZM1.5 1.5v21h2.25V24H0V0h3.75v1.5H1.5Z"/>'
};

const $$Astro$x = createAstro();
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$x, $$props, $$slots);
  Astro2.self = $$Icon;
  const { name, label, size = "1em", color } = Astro2.props;
  const a11yAttrs = label ? { "aria-label": label } : { "aria-hidden": "true" };
  const $$definedVars = defineStyleVars([{ "sl-icon-color": color, "sl-icon-size": size }]);
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(a11yAttrs)}${addAttribute(Astro2.props.class + " astro-c6vsoqas", "class")} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"${addAttribute($$definedVars, "style")}>${unescapeHTML(Icons[name])}</svg> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/user-components/Icon.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$w = createAstro();
const $$ThemeProvider = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$w, $$props, $$slots);
  Astro2.self = $$ThemeProvider;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["<script>\n	window.StarlightThemeProvider = (() => {\n		const storedTheme =\n			typeof localStorage !== 'undefined' && localStorage.getItem('starlight-theme');\n		const theme =\n			storedTheme ||\n			(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');\n		document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark';\n		return {\n			updatePickers(theme = storedTheme || 'auto') {\n				document.querySelectorAll('starlight-theme-select').forEach((picker) => {\n					const select = picker.querySelector('select');\n					if (select) select.value = theme;\n					/** @type {HTMLTemplateElement | null} */\n					const tmpl = document.querySelector(`#theme-icons`);\n					const newIcon = tmpl && tmpl.content.querySelector('.' + theme);\n					if (newIcon) {\n						const oldIcon = picker.querySelector('svg.label-icon');\n						if (oldIcon) {\n							oldIcon.replaceChildren(...newIcon.cloneNode(true).childNodes);\n						}\n					}\n				});\n			},\n		};\n	})();\n<\/script><template id=\"theme-icons\">", "", "", "</template>"], ["<script>\n	window.StarlightThemeProvider = (() => {\n		const storedTheme =\n			typeof localStorage !== 'undefined' && localStorage.getItem('starlight-theme');\n		const theme =\n			storedTheme ||\n			(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');\n		document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark';\n		return {\n			updatePickers(theme = storedTheme || 'auto') {\n				document.querySelectorAll('starlight-theme-select').forEach((picker) => {\n					const select = picker.querySelector('select');\n					if (select) select.value = theme;\n					/** @type {HTMLTemplateElement | null} */\n					const tmpl = document.querySelector(\\`#theme-icons\\`);\n					const newIcon = tmpl && tmpl.content.querySelector('.' + theme);\n					if (newIcon) {\n						const oldIcon = picker.querySelector('svg.label-icon');\n						if (oldIcon) {\n							oldIcon.replaceChildren(...newIcon.cloneNode(true).childNodes);\n						}\n					}\n				});\n			},\n		};\n	})();\n<\/script><template id=\"theme-icons\">", "", "", "</template>"])), renderComponent($$result, "Icon", $$Icon, { "name": "sun", "class": "light" }), renderComponent($$result, "Icon", $$Icon, { "name": "moon", "class": "dark" }), renderComponent($$result, "Icon", $$Icon, { "name": "laptop", "class": "auto" }));
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/ThemeProvider.astro", void 0);

const PAGE_TITLE_ID = "_top";

const $$Astro$v = createAstro();
const $$SkipLink = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$v, $$props, $$slots);
  Astro2.self = $$SkipLink;
  const { labels } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(`#${PAGE_TITLE_ID}`, "href")} class="astro-7q3lir66">${labels["skipLink.label"]}</a> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/SkipLink.astro", void 0);

const $$Astro$u = createAstro();
const $$PageFrame = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$u, $$props, $$slots);
  Astro2.self = $$PageFrame;
  const { hasSidebar, labels } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="page sl-flex astro-vrdttmbt"> <header class="header astro-vrdttmbt">${renderSlot($$result, $$slots["header"])}</header> ${hasSidebar && renderTemplate`<nav class="sidebar astro-vrdttmbt"${addAttribute(labels["sidebarNav.accessibleLabel"], "aria-label")}> ${renderComponent($$result, "MobileMenuToggle", $$MobileMenuToggle, { ...Astro2.props, "class": "astro-vrdttmbt" })} <div id="starlight__sidebar" class="sidebar-pane astro-vrdttmbt"> <div class="sidebar-content sl-flex astro-vrdttmbt"> ${renderSlot($$result, $$slots["sidebar"])} </div> </div> </nav>`} <div class="main-frame astro-vrdttmbt">${renderSlot($$result, $$slots["default"])}</div> </div> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/PageFrame.astro", void 0);

const $$Astro$t = createAstro();
const $$MobileMenuToggle = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$t, $$props, $$slots);
  Astro2.self = $$MobileMenuToggle;
  const { labels } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "starlight-menu-button", "starlight-menu-button", { "class": "astro-jif73yzw" }, { "default": () => renderTemplate` ${maybeRenderHead()}<button aria-expanded="false"${addAttribute(labels["menuButton.accessibleLabel"], "aria-label")} aria-controls="starlight__sidebar" class="sl-flex md:sl-hidden astro-jif73yzw"> ${renderComponent($$result, "Icon", $$Icon, { "name": "bars", "class": "astro-jif73yzw" })} </button> ` })}   `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/MobileMenuToggle.astro", void 0);

const $$Astro$s = createAstro();
const $$TwoColumnContent = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$s, $$props, $$slots);
  Astro2.self = $$TwoColumnContent;
  return renderTemplate`${maybeRenderHead()}<div class="lg:sl-flex astro-67yu43on"> ${Astro2.props.toc && renderTemplate`<aside class="right-sidebar-container astro-67yu43on"> <div class="right-sidebar astro-67yu43on"> ${renderSlot($$result, $$slots["right-sidebar"])} </div> </aside>`} <div class="main-pane astro-67yu43on">${renderSlot($$result, $$slots["default"])}</div> </div> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/TwoColumnContent.astro", void 0);

const $$Astro$r = createAstro();
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$r, $$props, $$slots);
  Astro2.self = $$Header;
  return renderTemplate`${maybeRenderHead()}<div class="header sl-flex astro-kmkmnagf"> <div class="sl-flex astro-kmkmnagf"> ${renderComponent($$result, "SiteTitle", $$SiteTitle, { ...Astro2.props, "class": "astro-kmkmnagf" })} </div> <div class="sl-flex astro-kmkmnagf"> ${renderTemplate`${renderComponent($$result, "Search", $$Search, { ...Astro2.props, "class": "astro-kmkmnagf" })}`} </div> <div class="sl-hidden md:sl-flex right-group astro-kmkmnagf"> <div class="sl-flex social-icons astro-kmkmnagf"> ${renderComponent($$result, "SocialIcons", $$SocialIcons, { ...Astro2.props, "class": "astro-kmkmnagf" })} </div> ${renderComponent($$result, "ThemeSelect", $$ThemeSelect, { ...Astro2.props, "class": "astro-kmkmnagf" })} ${renderComponent($$result, "LanguageSelect", $$LanguageSelect, { ...Astro2.props, "class": "astro-kmkmnagf" })} </div> </div> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/Header.astro", void 0);

const logos = {};

const project = {"build":{"format":"directory"},"root":"file:///Users/jonathanforrider/Documents/Programming/beth-stack-docs/","srcDir":"file:///Users/jonathanforrider/Documents/Programming/beth-stack-docs/src/","trailingSlash":"ignore"};

const formatStrategies = {
  file: {
    addBase: fileWithBase,
    handleExtension: (href) => ensureHtmlExtension(href)
  },
  directory: {
    addBase: pathWithBase,
    handleExtension: (href) => stripHtmlExtension(href)
  }
};
const trailingSlashStrategies = {
  always: ensureTrailingSlash,
  never: stripTrailingSlash,
  ignore: (href) => href
};
function formatPath$1(href, { format = "directory", trailingSlash = "ignore" }) {
  const formatStrategy = formatStrategies[format];
  const trailingSlashStrategy = trailingSlashStrategies[trailingSlash];
  href = formatStrategy.addBase(href);
  href = formatStrategy.handleExtension(href);
  if (format === "file")
    return href;
  href = href === "/" ? href : trailingSlashStrategy(href);
  return href;
}
function createPathFormatter(opts) {
  return (href) => formatPath$1(href, opts);
}

const formatPath = createPathFormatter({
  format: project.build.format,
  trailingSlash: project.trailingSlash
});

const $$Astro$q = createAstro();
const $$SiteTitle = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$q, $$props, $$slots);
  Astro2.self = $$SiteTitle;
  const href = formatPath(Astro2.props.locale || "/");
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} class="site-title sl-flex astro-m46x6ez3"> ${config.logo && logos.dark && renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "class": "astro-m46x6ez3" }, { "default": ($$result2) => renderTemplate` <img${addAttribute([{ "light:sl-hidden": !("src" in config.logo) }, "astro-m46x6ez3"], "class:list")}${addAttribute(config.logo.alt, "alt")}${addAttribute(logos.dark.src, "src")}${addAttribute(logos.dark.width, "width")}${addAttribute(logos.dark.height, "height")}> ${!("src" in config.logo) && renderTemplate`<img class="dark:sl-hidden astro-m46x6ez3"${addAttribute(config.logo.alt, "alt")}${addAttribute(logos.light?.src, "src")}${addAttribute(logos.light?.width, "width")}${addAttribute(logos.light?.height, "height")}>`}` })}`} <span${addAttribute([{ "sr-only": config.logo?.replacesTitle }, "astro-m46x6ez3"], "class:list")}> ${config.title} </span> </a> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/SiteTitle.astro", void 0);

const $$Astro$p = createAstro();
const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$p, $$props, $$slots);
  Astro2.self = $$Search;
  const { labels } = Astro2.props;
  const pagefindTranslations = {
    placeholder: labels["search.label"],
    ...Object.fromEntries(
      Object.entries(labels).filter(([key]) => key.startsWith("pagefind.")).map(([key, value]) => [key.replace("pagefind.", ""), value])
    )
  };
  return renderTemplate`${renderComponent($$result, "site-search", "site-search", { "data-translations": JSON.stringify(pagefindTranslations), "class": "astro-v37mnknz" }, { "default": () => renderTemplate` ${maybeRenderHead()}<button data-open-modal disabled class="astro-v37mnknz">  ${renderComponent($$result, "Icon", $$Icon, { "name": "magnifier", "label": labels["search.label"], "class": "astro-v37mnknz" })} <span class="sl-hidden md:sl-block astro-v37mnknz" aria-hidden="true">${labels["search.label"]}</span> ${renderComponent($$result, "Icon", $$Icon, { "name": "forward-slash", "class": "sl-hidden md:sl-block astro-v37mnknz", "label": labels["search.shortcutLabel"] })} </button> <dialog style="padding:0"${addAttribute(labels["search.label"], "aria-label")} class="astro-v37mnknz"> <div class="dialog-frame sl-flex astro-v37mnknz">  <button data-close-modal class="sl-flex md:sl-hidden astro-v37mnknz"> ${labels["search.cancelLabel"]} </button> ${renderTemplate`<div class="search-container astro-v37mnknz"> <div id="starlight__search" class="astro-v37mnknz"></div> </div>`} </div> </dialog> ` })}   `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/Search.astro", void 0);

const $$Astro$o = createAstro();
const $$SocialIcons = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$o, $$props, $$slots);
  Astro2.self = $$SocialIcons;
  const links = Object.entries(config.social || {});
  return renderTemplate`${links.length > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "class": "astro-wy4te6ga" }, { "default": ($$result2) => renderTemplate`${links.map(([platform, { label, url }]) => renderTemplate`${maybeRenderHead()}<a${addAttribute(url, "href")} rel="me" class="sl-flex astro-wy4te6ga"><span class="sr-only astro-wy4te6ga">${label}</span>${renderComponent($$result2, "Icon", $$Icon, { "name": platform, "class": "astro-wy4te6ga" })}</a>`)}` })}`}`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/SocialIcons.astro", void 0);

const $$Astro$n = createAstro();
const $$Select = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$n, $$props, $$slots);
  Astro2.self = $$Select;
  return renderTemplate`${maybeRenderHead()}<label${addAttribute(`--sl-select-width: ${Astro2.props.width}`, "style")} class="astro-4yphtoen"> <span class="sr-only astro-4yphtoen">${Astro2.props.label}</span> ${renderComponent($$result, "Icon", $$Icon, { "name": Astro2.props.icon, "class": "icon label-icon astro-4yphtoen" })} <select${addAttribute(Astro2.props.value, "value")} class="astro-4yphtoen"> ${Astro2.props.options.map(({ value, selected, label }) => renderTemplate`<option${addAttribute(value, "value")}${addAttribute(selected, "selected")} class="astro-4yphtoen">${unescapeHTML(label)}</option>`)} </select> ${renderComponent($$result, "Icon", $$Icon, { "name": "down-caret", "class": "icon caret astro-4yphtoen" })} </label> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/Select.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$m = createAstro();
const $$ThemeSelect = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$m, $$props, $$slots);
  Astro2.self = $$ThemeSelect;
  const { labels } = Astro2.props;
  return renderTemplate(_a || (_a = __template(["", "  <script>\n	StarlightThemeProvider.updatePickers();\n<\/script> "])), renderComponent($$result, "starlight-theme-select", "starlight-theme-select", {}, { "default": () => renderTemplate`  ${renderComponent($$result, "Select", $$Select, { "icon": "laptop", "label": labels["themeSelect.accessibleLabel"], "value": "auto", "options": [
    { label: labels["themeSelect.dark"], selected: false, value: "dark" },
    { label: labels["themeSelect.light"], selected: false, value: "light" },
    { label: labels["themeSelect.auto"], selected: true, value: "auto" }
  ], "width": "6.25em" })} ` }));
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/ThemeSelect.astro", void 0);

const $$Astro$l = createAstro();
const $$LanguageSelect = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$l, $$props, $$slots);
  Astro2.self = $$LanguageSelect;
  Astro2.props;
  return renderTemplate`${config.isMultilingual }`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/LanguageSelect.astro", void 0);

function pickLang(dictionary, lang) {
  return dictionary[lang];
}

function slugToLocale(slug) {
  const locales = Object.keys(config.locales || {});
  const baseSegment = slug.split("/")[0];
  if (baseSegment && locales.includes(baseSegment))
    return baseSegment;
  return void 0;
}
function slugToLocaleData(slug) {
  const locale = slugToLocale(slug);
  return { dir: localeToDir(locale), lang: localeToLang$1(locale), locale };
}
function localeToLang$1(locale) {
  const lang = locale ? config.locales?.[locale]?.lang : config.locales?.root?.lang;
  const defaultLang = config.defaultLocale?.lang || config.defaultLocale?.locale;
  return lang || defaultLang || "en";
}
function localeToDir(locale) {
  const dir = locale ? config.locales?.[locale]?.dir : config.locales?.root?.dir;
  return dir || config.defaultLocale.dir;
}
function slugToParam(slug) {
  return slug === "index" || slug === "" ? void 0 : slug.endsWith("/index") ? slug.replace(/\/index$/, "") : slug;
}
function slugToPathname(slug) {
  const param = slugToParam(slug);
  return param ? "/" + param + "/" : "/";
}
function localizedId(id, locale) {
  const idLocale = slugToLocale(id);
  if (idLocale) {
    return id.replace(idLocale + "/", locale ? locale + "/" : "");
  } else if (locale) {
    return locale + "/" + id;
  } else {
    return id;
  }
}

function validateLogoImports() {
  if (config.logo) {
    let err;
    if ("src" in config.logo) {
      if (!logos.dark || !logos.light) {
        err = `Could not resolve logo import for "${config.logo.src}" (logo.src)`;
      }
    } else {
      if (!logos.dark) {
        err = `Could not resolve logo import for "${config.logo.dark}" (logo.dark)`;
      } else if (!logos.light) {
        err = `Could not resolve logo import for "${config.logo.light}" (logo.light)`;
      }
    }
    if (err)
      throw new Error(err);
  }
}

validateLogoImports();
const normalizeIndexSlug = (slug) => slug === "index" ? "" : slug;
const docs = (await getCollection("docs") ?? []).map(
  ({ slug, ...entry }) => ({
    ...entry,
    slug: normalizeIndexSlug(slug)
  })
);
function getRoutes() {
  const routes2 = docs.map((entry) => ({
    entry,
    slug: entry.slug,
    id: entry.id,
    entryMeta: slugToLocaleData(entry.slug),
    ...slugToLocaleData(entry.slug)
  }));
  return routes2;
}
const routes = getRoutes();
function getPaths() {
  return routes.map((route) => ({
    params: { slug: slugToParam(route.slug) },
    props: route
  }));
}
const paths = getPaths();
function getLocaleRoutes(locale) {
  return filterByLocale(routes, locale);
}
function filterByLocale(items, locale) {
  if (config.locales) {
    if (locale && locale in config.locales) {
      return items.filter((i) => i.slug === locale || i.slug.startsWith(locale + "/"));
    } else if (config.locales.root) {
      const langKeys = Object.keys(config.locales).filter((k) => k !== "root");
      const isLangIndex = new RegExp(`^(${langKeys.join("|")})$`);
      const isLangDir = new RegExp(`^(${langKeys.join("|")})/`);
      return items.filter((i) => !isLangIndex.test(i.slug) && !isLangDir.test(i.slug));
    }
  }
  return items;
}

const DirKey = Symbol("DirKey");
function makeDir() {
  const dir = {};
  Object.defineProperty(dir, DirKey, { enumerable: false });
  return dir;
}
function isDir(data) {
  return DirKey in data;
}
function configItemToEntry(item, currentPathname, locale, routes) {
  if ("link" in item) {
    return linkFromConfig(item, locale, currentPathname);
  } else if ("autogenerate" in item) {
    return groupFromAutogenerateConfig(item, locale, routes, currentPathname);
  } else {
    return {
      type: "group",
      label: pickLang(item.translations, localeToLang$1(locale)) || item.label,
      entries: item.items.map((i) => configItemToEntry(i, currentPathname, locale, routes)),
      collapsed: item.collapsed,
      badge: item.badge
    };
  }
}
function groupFromAutogenerateConfig(item, locale, routes, currentPathname) {
  const { collapsed: subgroupCollapsed, directory } = item.autogenerate;
  const localeDir = locale ? locale + "/" + directory : directory;
  const dirDocs = routes.filter(
    (doc) => (
      // Match against `foo.md` or `foo/index.md`.
      stripExtension(doc.id) === localeDir || // Match against `foo/anything/else.md`.
      doc.id.startsWith(localeDir + "/")
    )
  );
  const tree = treeify(dirDocs, localeDir);
  return {
    type: "group",
    label: pickLang(item.translations, localeToLang$1(locale)) || item.label,
    entries: sidebarFromDir(tree, currentPathname, locale, subgroupCollapsed ?? item.collapsed),
    collapsed: item.collapsed,
    badge: item.badge
  };
}
const isAbsolute = (link) => /^https?:\/\//.test(link);
function linkFromConfig(item, locale, currentPathname) {
  let href = item.link;
  if (!isAbsolute(href)) {
    href = ensureLeadingSlash(href);
    if (locale)
      href = "/" + locale + href;
  }
  const label = pickLang(item.translations, localeToLang$1(locale)) || item.label;
  return makeLink(href, label, currentPathname, item.badge, item.attrs);
}
function makeLink(href, label, currentPathname, badge, attrs) {
  if (!isAbsolute(href)) {
    href = formatPath(href);
  }
  const isCurrent = pathsMatch(encodeURI(href), currentPathname);
  return { type: "link", label, href, isCurrent, badge, attrs: attrs ?? {} };
}
function pathsMatch(pathA, pathB) {
  const format = createPathFormatter({ trailingSlash: "never" });
  return format(pathA) === format(pathB);
}
function getBreadcrumbs(path, baseDir) {
  const pathWithoutExt = stripExtension(path);
  if (pathWithoutExt === baseDir)
    return [];
  if (!baseDir.endsWith("/"))
    baseDir += "/";
  const relativePath = pathWithoutExt.startsWith(baseDir) ? pathWithoutExt.replace(baseDir, "") : pathWithoutExt;
  let dir = dirname(relativePath);
  if (dir === ".")
    return [];
  return dir.split("/");
}
function treeify(routes, baseDir) {
  const treeRoot = makeDir();
  routes.filter((doc) => !doc.entry.data.sidebar.hidden).forEach((doc) => {
    const breadcrumbs = getBreadcrumbs(doc.id, baseDir);
    let currentDir = treeRoot;
    breadcrumbs.forEach((dir) => {
      if (typeof currentDir[dir] === "undefined")
        currentDir[dir] = makeDir();
      currentDir = currentDir[dir];
    });
    currentDir[basename(doc.slug)] = doc;
  });
  return treeRoot;
}
function linkFromRoute(route, currentPathname) {
  return makeLink(
    slugToPathname(route.slug),
    route.entry.data.sidebar.label || route.entry.data.title,
    currentPathname,
    route.entry.data.sidebar.badge,
    route.entry.data.sidebar.attrs
  );
}
function getOrder(routeOrDir) {
  return isDir(routeOrDir) ? Math.min(...Object.values(routeOrDir).flatMap(getOrder)) : (
    // If no order value is found, set it to the largest number possible.
    routeOrDir.entry.data.sidebar.order ?? Number.MAX_VALUE
  );
}
function sortDirEntries(dir, locale) {
  const collator = new Intl.Collator(localeToLang$1(locale));
  return dir.sort(([keyA, a], [keyB, b]) => {
    const [aOrder, bOrder] = [getOrder(a), getOrder(b)];
    if (aOrder !== bOrder)
      return aOrder < bOrder ? -1 : 1;
    return collator.compare(isDir(a) ? keyA : a.slug, isDir(b) ? keyB : b.slug);
  });
}
function groupFromDir(dir, fullPath, dirName, currentPathname, locale, collapsed) {
  const entries = sortDirEntries(Object.entries(dir), locale).map(
    ([key, dirOrRoute]) => dirToItem(dirOrRoute, `${fullPath}/${key}`, key, currentPathname, locale, collapsed)
  );
  return {
    type: "group",
    label: dirName,
    entries,
    collapsed,
    badge: void 0
  };
}
function dirToItem(dirOrRoute, fullPath, dirName, currentPathname, locale, collapsed) {
  return isDir(dirOrRoute) ? groupFromDir(dirOrRoute, fullPath, dirName, currentPathname, locale, collapsed) : linkFromRoute(dirOrRoute, currentPathname);
}
function sidebarFromDir(tree, currentPathname, locale, collapsed) {
  return sortDirEntries(Object.entries(tree), locale).map(
    ([key, dirOrRoute]) => dirToItem(dirOrRoute, key, key, currentPathname, locale, collapsed)
  );
}
function getSidebar(pathname, locale) {
  const routes = getLocaleRoutes(locale);
  if (config.sidebar) {
    return config.sidebar.map((group) => configItemToEntry(group, pathname, locale, routes));
  } else {
    const tree = treeify(routes, locale || "");
    return sidebarFromDir(tree, pathname, locale, false);
  }
}
function flattenSidebar(sidebar) {
  return sidebar.flatMap(
    (entry) => entry.type === "group" ? flattenSidebar(entry.entries) : entry
  );
}
function getPrevNextLinks(sidebar, paginationEnabled, config2) {
  const entries = flattenSidebar(sidebar);
  const currentIndex = entries.findIndex((entry) => entry.isCurrent);
  const prev = applyPrevNextLinkConfig(entries[currentIndex - 1], paginationEnabled, config2.prev);
  const next = applyPrevNextLinkConfig(
    currentIndex > -1 ? entries[currentIndex + 1] : void 0,
    paginationEnabled,
    config2.next
  );
  return { prev, next };
}
function applyPrevNextLinkConfig(link, paginationEnabled, config2) {
  if (config2 === false)
    return void 0;
  else if (config2 === true)
    return link;
  else if (typeof config2 === "string" && link) {
    return { ...link, label: config2 };
  } else if (typeof config2 === "object") {
    if (link) {
      return {
        ...link,
        label: config2.label ?? link.label,
        href: config2.link ?? link.href,
        // Explicitly remove sidebar link attributes for prev/next links.
        attrs: {}
      };
    } else if (config2.link && config2.label) {
      return makeLink(config2.link, config2.label, "");
    }
  }
  return paginationEnabled ? link : void 0;
}
const stripExtension = (path) => path.replace(/\.\w+$/, "");

const $$Astro$k = createAstro();
const $$Badge = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$k, $$props, $$slots);
  Astro2.self = $$Badge;
  const { variant = "default", text } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<span${addAttribute([["sl-badge", variant], "astro-vohx2lp7"], "class:list")}>${unescapeHTML(text)}</span> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/Badge.astro", void 0);

const $$Astro$j = createAstro();
const $$SidebarSublist = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$j, $$props, $$slots);
  Astro2.self = $$SidebarSublist;
  const { sublist, nested } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<ul${addAttribute([{ "top-level": !nested }, "astro-3ii7xxms"], "class:list")}> ${sublist.map((entry) => renderTemplate`<li class="astro-3ii7xxms"> ${entry.type === "link" ? renderTemplate`<a${addAttribute(entry.href, "href")}${addAttribute(entry.isCurrent && "page", "aria-current")}${addAttribute([[{ large: !nested }, entry.attrs.class], "astro-3ii7xxms"], "class:list")}${spreadAttributes(entry.attrs)}> <span class="astro-3ii7xxms">${entry.label}</span> ${entry.badge && renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "class": "astro-3ii7xxms" }, { "default": ($$result2) => renderTemplate`${" "}${renderComponent($$result2, "Badge", $$Badge, { "text": entry.badge.text, "variant": entry.isCurrent ? "outline" : entry.badge.variant, "class": "astro-3ii7xxms" })} ` })}`} </a>` : renderTemplate`<details${addAttribute(flattenSidebar(entry.entries).some((i) => i.isCurrent) || !entry.collapsed, "open")} class="astro-3ii7xxms"> <summary class="astro-3ii7xxms"> <div class="group-label astro-3ii7xxms"> <span class="large astro-3ii7xxms">${entry.label}</span> ${entry.badge && renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "class": "astro-3ii7xxms" }, { "default": ($$result2) => renderTemplate`${" "}${renderComponent($$result2, "Badge", $$Badge, { "text": entry.badge.text, "variant": entry.badge.variant, "class": "astro-3ii7xxms" })} ` })}`} </div> ${renderComponent($$result, "Icon", $$Icon, { "name": "right-caret", "class": "caret astro-3ii7xxms", "size": "1.25rem" })} </summary> ${renderComponent($$result, "Astro.self", Astro2.self, { "sublist": entry.entries, "nested": true, "class": "astro-3ii7xxms" })} </details>`} </li>`)} </ul> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/SidebarSublist.astro", void 0);

const $$Astro$i = createAstro();
const $$Sidebar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$i, $$props, $$slots);
  Astro2.self = $$Sidebar;
  const { sidebar } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "SidebarSublist", $$SidebarSublist, { "sublist": sidebar })} ${maybeRenderHead()}<div class="md:sl-hidden"> ${renderComponent($$result, "MobileMenuFooter", $$MobileMenuFooter, { ...Astro2.props })} </div>`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/Sidebar.astro", void 0);

const $$Astro$h = createAstro();
const $$MobileMenuFooter = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$h, $$props, $$slots);
  Astro2.self = $$MobileMenuFooter;
  return renderTemplate`${maybeRenderHead()}<div class="mobile-preferences sl-flex astro-wu23bvmt"> <div class="sl-flex social-icons astro-wu23bvmt"> ${renderComponent($$result, "SocialIcons", $$SocialIcons, { ...Astro2.props, "class": "astro-wu23bvmt" })} </div> ${renderComponent($$result, "ThemeSelect", $$ThemeSelect, { ...Astro2.props, "class": "astro-wu23bvmt" })} ${renderComponent($$result, "LanguageSelect", $$LanguageSelect, { ...Astro2.props, "class": "astro-wu23bvmt" })} </div> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/MobileMenuFooter.astro", void 0);

const $$Astro$g = createAstro();
const $$PageSidebar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$PageSidebar;
  return renderTemplate`${Astro2.props.toc && renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "class": "astro-pb3aqygn" }, { "default": ($$result2) => renderTemplate`${maybeRenderHead()}<div class="lg:sl-hidden astro-pb3aqygn">${renderComponent($$result2, "MobileTableOfContents", $$MobileTableOfContents, { ...Astro2.props, "class": "astro-pb3aqygn" })}</div><div class="right-sidebar-panel sl-hidden lg:sl-block astro-pb3aqygn"><div class="sl-container astro-pb3aqygn">${renderComponent($$result2, "TableOfContents", $$TableOfContents, { ...Astro2.props, "class": "astro-pb3aqygn" })}</div></div>` })}`}`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/PageSidebar.astro", void 0);

const $$Astro$f = createAstro();
const $$TableOfContentsList = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$TableOfContentsList;
  const { toc, isMobile = false, depth = 0 } = Astro2.props;
  const $$definedVars = defineStyleVars([{ depth }]);
  return renderTemplate`${maybeRenderHead()}<ul${addAttribute([{ isMobile }, "astro-g2bywc46"], "class:list")}${addAttribute($$definedVars, "style")}> ${toc.map((heading) => renderTemplate`<li class="astro-g2bywc46"${addAttribute($$definedVars, "style")}> <a${addAttribute("#" + heading.slug, "href")} class="astro-g2bywc46"${addAttribute($$definedVars, "style")}> <span class="astro-g2bywc46"${addAttribute($$definedVars, "style")}>${heading.text}</span> </a> ${heading.children.length > 0 && renderTemplate`${renderComponent($$result, "Astro.self", Astro2.self, { "toc": heading.children, "depth": depth + 1, "isMobile": isMobile, "class": "astro-g2bywc46" })}`} </li>`)} </ul> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/TableOfContents/TableOfContentsList.astro", void 0);

const $$Astro$e = createAstro();
const $$TableOfContents = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$TableOfContents;
  const { labels, toc } = Astro2.props;
  return renderTemplate`${toc && renderTemplate`${renderComponent($$result, "starlight-toc", "starlight-toc", { "data-min-h": toc.minHeadingLevel, "data-max-h": toc.maxHeadingLevel }, { "default": () => renderTemplate`${maybeRenderHead()}<nav aria-labelledby="starlight__on-this-page"><h2 id="starlight__on-this-page">${labels["tableOfContents.onThisPage"]}</h2>${renderComponent($$result, "TableOfContentsList", $$TableOfContentsList, { "toc": toc.items })}</nav>` })}`}`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/TableOfContents.astro", void 0);

const $$Astro$d = createAstro();
const $$MobileTableOfContents = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$MobileTableOfContents;
  const { labels, toc } = Astro2.props;
  return renderTemplate`${toc && renderTemplate`${renderComponent($$result, "mobile-starlight-toc", "mobile-starlight-toc", { "data-min-h": toc.minHeadingLevel, "data-max-h": toc.maxHeadingLevel, "class": "astro-doynk5tl" }, { "default": () => renderTemplate`${maybeRenderHead()}<nav aria-labelledby="starlight__on-this-page--mobile" class="astro-doynk5tl"><details id="starlight__mobile-toc" class="astro-doynk5tl"><summary id="starlight__on-this-page--mobile" class="sl-flex astro-doynk5tl"><div class="toggle sl-flex astro-doynk5tl">${labels["tableOfContents.onThisPage"]}${renderComponent($$result, "Icon", $$Icon, { "name": "right-caret", "class": "caret astro-doynk5tl", "size": "1rem" })}</div><span class="display-current astro-doynk5tl"></span></summary><div class="dropdown astro-doynk5tl">${renderComponent($$result, "TableOfContentsList", $$TableOfContentsList, { "toc": toc.items, "isMobile": true, "class": "astro-doynk5tl" })}</div></details></nav>` })}`}`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/MobileTableOfContents.astro", void 0);

const $$Astro$c = createAstro();
const $$Banner = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Banner;
  const { banner } = Astro2.props.entry.data;
  return renderTemplate`${banner && renderTemplate`${maybeRenderHead()}<div class="sl-banner astro-laz2plt2">${unescapeHTML(banner.content)}</div>`}`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/Banner.astro", void 0);

const $$Astro$b = createAstro();
const $$ContentPanel = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$ContentPanel;
  return renderTemplate`${maybeRenderHead()}<div class="content-panel astro-7nkwcw3z"> <div class="sl-container astro-7nkwcw3z">${renderSlot($$result, $$slots["default"])}</div> </div> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/ContentPanel.astro", void 0);

const $$Astro$a = createAstro();
const $$PageTitle = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$PageTitle;
  return renderTemplate`${maybeRenderHead()}<h1${addAttribute(PAGE_TITLE_ID, "id")} class="astro-j6tvhyss">${Astro2.props.entry.data.title}</h1> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/PageTitle.astro", void 0);

const $$Astro$9 = createAstro();
const $$FallbackContentNotice = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$FallbackContentNotice;
  const { labels } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<p class="sl-flex astro-hz523pza"> ${renderComponent($$result, "Icon", $$Icon, { "name": "warning", "size": "1.5em", "color": "var(--sl-color-orange-high)", "class": "astro-hz523pza" })}<span class="astro-hz523pza">${labels["i18n.untranslatedContent"]}</span> </p> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/FallbackContentNotice.astro", void 0);

const $$Astro$8 = createAstro();
const $$CallToAction = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$CallToAction;
  const { link, variant, icon } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute([["sl-flex action", variant], "astro-yjy4zhro"], "class:list")}${addAttribute(link, "href")}> ${renderSlot($$result, $$slots["default"])} ${icon?.type === "icon" && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": icon.name, "size": "1.5rem", "class": "astro-yjy4zhro" })}`} ${icon?.type === "raw" && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(icon.html)}` })}`} </a> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/CallToAction.astro", void 0);

const $$Astro$7 = createAstro();
const $$Hero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Hero;
  const { data } = Astro2.props.entry;
  const { title = data.title, tagline, image, actions = [] } = data.hero || {};
  const imageAttrs = {
    loading: "eager",
    decoding: "async",
    width: 400,
    height: 400,
    alt: image?.alt || ""
  };
  let darkImage;
  let lightImage;
  let rawHtml;
  if (image) {
    if ("file" in image) {
      darkImage = image.file;
    } else if ("dark" in image) {
      darkImage = image.dark;
      lightImage = image.light;
    } else {
      rawHtml = image.html;
    }
  }
  return renderTemplate`${maybeRenderHead()}<div class="hero astro-jbfsktt5"> ${darkImage && renderTemplate`${renderComponent($$result, "Image", $$Image, { "src": darkImage, ...imageAttrs, "class:list": [{ "light:sl-hidden": Boolean(lightImage) }, "astro-jbfsktt5"] })}`} ${lightImage && renderTemplate`${renderComponent($$result, "Image", $$Image, { "src": lightImage, ...imageAttrs, "class": "dark:sl-hidden astro-jbfsktt5" })}`} ${rawHtml && renderTemplate`<div class="hero-html sl-flex astro-jbfsktt5">${unescapeHTML(rawHtml)}</div>`} <div class="sl-flex stack astro-jbfsktt5"> <div class="sl-flex copy astro-jbfsktt5"> <h1${addAttribute(PAGE_TITLE_ID, "id")} data-page-title class="astro-jbfsktt5">${unescapeHTML(title)}</h1> ${tagline && renderTemplate`<div class="tagline astro-jbfsktt5">${unescapeHTML(tagline)}</div>`} </div> ${actions.length > 0 && renderTemplate`<div class="sl-flex actions astro-jbfsktt5"> ${actions.map(({ text, ...attrs }) => renderTemplate`${renderComponent($$result, "CallToAction", $$CallToAction, { ...attrs, "class": "astro-jbfsktt5" }, { "default": ($$result2) => renderTemplate`${unescapeHTML(text)}` })}`)} </div>`} </div> </div> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/Hero.astro", void 0);

const $$Astro$6 = createAstro();
const $$MarkdownContent = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$MarkdownContent;
  return renderTemplate`${maybeRenderHead()}<div class="sl-markdown-content">${renderSlot($$result, $$slots["default"])}</div>`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/MarkdownContent.astro", void 0);

const $$Astro$5 = createAstro();
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead()}<footer class="astro-3yyafb3n"> <div class="meta sl-flex astro-3yyafb3n"> ${renderComponent($$result, "EditLink", $$EditLink, { ...Astro2.props, "class": "astro-3yyafb3n" })} ${renderComponent($$result, "LastUpdated", $$LastUpdated, { ...Astro2.props, "class": "astro-3yyafb3n" })} </div> ${renderComponent($$result, "Pagination", $$Pagination, { ...Astro2.props, "class": "astro-3yyafb3n" })} </footer> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/Footer.astro", void 0);

const $$Astro$4 = createAstro();
const $$LastUpdated = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$LastUpdated;
  const { labels, lang, lastUpdated } = Astro2.props;
  return renderTemplate`${lastUpdated && renderTemplate`${maybeRenderHead()}<p>${labels["page.lastUpdated"]}${" "}<time${addAttribute(lastUpdated.toISOString(), "datetime")}>${lastUpdated.toLocaleDateString(lang, { dateStyle: "medium", timeZone: "UTC" })}</time></p>`}`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/LastUpdated.astro", void 0);

const $$Astro$3 = createAstro();
const $$Pagination = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Pagination;
  const { dir, labels, pagination } = Astro2.props;
  const { prev, next } = pagination;
  const isRtl = dir === "rtl";
  return renderTemplate`${maybeRenderHead()}<div class="pagination-links astro-u2l5gyhi"${addAttribute(dir, "dir")}> ${prev && renderTemplate`<a${addAttribute(prev.href, "href")} rel="prev" class="astro-u2l5gyhi"> ${renderComponent($$result, "Icon", $$Icon, { "name": isRtl ? "right-arrow" : "left-arrow", "size": "1.5rem", "class": "astro-u2l5gyhi" })} <span class="astro-u2l5gyhi"> ${labels["page.previousLink"]} <br class="astro-u2l5gyhi"> <span class="link-title astro-u2l5gyhi">${prev.label}</span> </span> </a>`} ${next && renderTemplate`<a${addAttribute(next.href, "href")} rel="next" class="astro-u2l5gyhi"> ${renderComponent($$result, "Icon", $$Icon, { "name": isRtl ? "left-arrow" : "right-arrow", "size": "1.5rem", "class": "astro-u2l5gyhi" })} <span class="astro-u2l5gyhi"> ${labels["page.nextLink"]} <br class="astro-u2l5gyhi"> <span class="link-title astro-u2l5gyhi">${next.label}</span> </span> </a>`} </div> `;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/Pagination.astro", void 0);

const $$Astro$2 = createAstro();
const $$EditLink = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$EditLink;
  const { editUrl, labels } = Astro2.props;
  return renderTemplate`${editUrl && renderTemplate`${maybeRenderHead()}<a${addAttribute(editUrl, "href")} class="sl-flex astro-eez2twj6">${renderComponent($$result, "Icon", $$Icon, { "name": "pencil", "size": "1.2em", "class": "astro-eez2twj6" })}${labels["page.editLink"]}</a>`}`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/EditLink.astro", void 0);

const $$Astro$1 = createAstro();
const $$Page = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Page;
  const pagefindEnabled = Astro2.props.entry.slug !== "404" && !Astro2.props.entry.slug.endsWith("/404") && Astro2.props.entry.data.pagefind !== false;
  return renderTemplate`<html${addAttribute(Astro2.props.lang, "lang")}${addAttribute(Astro2.props.dir, "dir")}${addAttribute(Boolean(Astro2.props.toc), "data-has-toc")}${addAttribute(Astro2.props.hasSidebar, "data-has-sidebar")}${addAttribute(Boolean(Astro2.props.entry.data.hero), "data-has-hero")} class="astro-bguv2lll"> <head>${renderComponent($$result, "Head", $$Head, { ...Astro2.props, "class": "astro-bguv2lll" })}${renderComponent($$result, "ThemeProvider", $$ThemeProvider, { ...Astro2.props, "class": "astro-bguv2lll" })}${renderHead()}</head> <body class="astro-bguv2lll"> ${renderComponent($$result, "SkipLink", $$SkipLink, { ...Astro2.props, "class": "astro-bguv2lll" })} ${renderComponent($$result, "PageFrame", $$PageFrame, { ...Astro2.props, "class": "astro-bguv2lll" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "TwoColumnContent", $$TwoColumnContent, { ...Astro2.props, "class": "astro-bguv2lll" }, { "default": ($$result3) => renderTemplate`  <main${addAttribute(pagefindEnabled, "data-pagefind-body")}${addAttribute(Astro2.props.entryMeta.lang, "lang")}${addAttribute(Astro2.props.entryMeta.dir, "dir")} class="astro-bguv2lll">  ${renderComponent($$result3, "Banner", $$Banner, { ...Astro2.props, "class": "astro-bguv2lll" })} ${Astro2.props.entry.data.hero ? renderTemplate`${renderComponent($$result3, "ContentPanel", $$ContentPanel, { ...Astro2.props, "class": "astro-bguv2lll" }, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "Hero", $$Hero, { ...Astro2.props, "class": "astro-bguv2lll" })} ${renderComponent($$result4, "MarkdownContent", $$MarkdownContent, { ...Astro2.props, "class": "astro-bguv2lll" }, { "default": ($$result5) => renderTemplate` ${renderSlot($$result5, $$slots["default"])} ` })} ${renderComponent($$result4, "Footer", $$Footer, { ...Astro2.props, "class": "astro-bguv2lll" })} ` })}` : renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "class": "astro-bguv2lll" }, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "ContentPanel", $$ContentPanel, { ...Astro2.props, "class": "astro-bguv2lll" }, { "default": ($$result5) => renderTemplate` ${renderComponent($$result5, "PageTitle", $$PageTitle, { ...Astro2.props, "class": "astro-bguv2lll" })} ${Astro2.props.isFallback && renderTemplate`${renderComponent($$result5, "FallbackContentNotice", $$FallbackContentNotice, { ...Astro2.props, "class": "astro-bguv2lll" })}`}` })} ${renderComponent($$result4, "ContentPanel", $$ContentPanel, { ...Astro2.props, "class": "astro-bguv2lll" }, { "default": ($$result5) => renderTemplate` ${renderComponent($$result5, "MarkdownContent", $$MarkdownContent, { ...Astro2.props, "class": "astro-bguv2lll" }, { "default": ($$result6) => renderTemplate` ${renderSlot($$result6, $$slots["default"])} ` })} ${renderComponent($$result5, "Footer", $$Footer, { ...Astro2.props, "class": "astro-bguv2lll" })} ` })} ` })}`} </main> `, "right-sidebar": ($$result3) => renderTemplate`${renderComponent($$result3, "PageSidebar", $$PageSidebar, { "slot": "right-sidebar", ...Astro2.props, "class": "astro-bguv2lll" })}` })} `, "header": ($$result2) => renderTemplate`${renderComponent($$result2, "Header", $$Header, { "slot": "header", ...Astro2.props, "class": "astro-bguv2lll" })}`, "sidebar": ($$result2) => renderTemplate`${Astro2.props.hasSidebar && renderTemplate`${renderComponent($$result2, "Sidebar", $$Sidebar, { "slot": "sidebar", ...Astro2.props, "class": "astro-bguv2lll" })}`}` })} </body></html>`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/components/Page.astro", void 0);

function generateToC(headings, { minHeadingLevel, maxHeadingLevel, title }) {
  headings = headings.filter(({ depth }) => depth >= minHeadingLevel && depth <= maxHeadingLevel);
  const toc = [{ depth: 2, slug: PAGE_TITLE_ID, text: title, children: [] }];
  for (const heading of headings)
    injectChild(toc, { ...heading, children: [] });
  return toc;
}
function injectChild(items, item) {
  const lastItem = items.at(-1);
  if (!lastItem || lastItem.depth >= item.depth) {
    items.push(item);
  } else {
    return injectChild(lastItem.children, item);
  }
}

class FileNotTrackedError extends Error {
}
function getFileCommitDate(file, age = "oldest") {
  const result = execaSync(
    "git",
    [
      "log",
      `--format=%ct`,
      "--max-count=1",
      ...age === "oldest" ? ["--follow", "--diff-filter=A"] : [],
      "--",
      basename(file)
    ],
    {
      cwd: dirname(file)
    }
  );
  if (result.exitCode !== 0) {
    throw new Error(
      `Failed to retrieve the git history for file "${file}" with exit code ${result.exitCode}: ${result.stderr}`
    );
  }
  const output = result.stdout.trim();
  if (!output) {
    throw new FileNotTrackedError(
      `Failed to retrieve the git history for file "${file}" because the file is not tracked by git.`
    );
  }
  const regex = /^(?<timestamp>\d+)$/;
  const match = output.match(regex);
  if (!match) {
    throw new Error(
      `Failed to retrieve the git history for file "${file}" with unexpected output: ${output}`
    );
  }
  const timestamp = Number(match.groups.timestamp);
  const date = new Date(timestamp * 1e3);
  return { date, timestamp };
}

function builtinI18nSchema() {
  return starlightI18nSchema().required().strict().merge(pagefindI18nSchema()).merge(expressiveCodeI18nSchema());
}
function starlightI18nSchema() {
  return z.object({
    "skipLink.label": z.string().describe(
      "Text displayed in the accessible “Skip link” when a keyboard user first tabs into a page."
    ),
    "search.label": z.string().describe("Text displayed in the search bar."),
    "search.shortcutLabel": z.string().describe("Accessible label for the shortcut key to open the search modal."),
    "search.cancelLabel": z.string().describe("Text for the “Cancel” button that closes the search modal."),
    "search.devWarning": z.string().describe("Warning displayed when opening the Search in a dev environment."),
    "themeSelect.accessibleLabel": z.string().describe("Accessible label for the theme selection dropdown."),
    "themeSelect.dark": z.string().describe("Name of the dark color theme."),
    "themeSelect.light": z.string().describe("Name of the light color theme."),
    "themeSelect.auto": z.string().describe("Name of the automatic color theme that syncs with system preferences."),
    "languageSelect.accessibleLabel": z.string().describe("Accessible label for the language selection dropdown."),
    "menuButton.accessibleLabel": z.string().describe("Accessible label for he mobile menu button."),
    "sidebarNav.accessibleLabel": z.string().describe(
      "Accessible label for the main sidebar `<nav>` element to distinguish it fom other `<nav>` landmarks on the page."
    ),
    "tableOfContents.onThisPage": z.string().describe("Title for the table of contents component."),
    "tableOfContents.overview": z.string().describe(
      "Label used for the first link in the table of contents, linking to the page title."
    ),
    "i18n.untranslatedContent": z.string().describe(
      "Notice informing users they are on a page that is not yet translated to their language."
    ),
    "page.editLink": z.string().describe("Text for the link to edit a page."),
    "page.lastUpdated": z.string().describe("Text displayed in front of the last updated date in the page footer."),
    "page.previousLink": z.string().describe("Label shown on the “previous page” pagination arrow in the page footer."),
    "page.nextLink": z.string().describe("Label shown on the “next page” pagination arrow in the page footer."),
    "404.text": z.string().describe("Text shown on Starlight’s default 404 page"),
    "aside.tip": z.string().describe("Text shown on the tip aside variant"),
    "aside.note": z.string().describe("Text shown on the note aside variant"),
    "aside.caution": z.string().describe("Text shown on the warning aside variant"),
    "aside.danger": z.string().describe("Text shown on the danger aside variant")
  }).partial();
}
function pagefindI18nSchema() {
  return z.object({
    "pagefind.clear_search": z.string().describe(
      'Pagefind UI translation. English default value: `"Clear"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.load_more": z.string().describe(
      'Pagefind UI translation. English default value: `"Load more results"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.search_label": z.string().describe(
      'Pagefind UI translation. English default value: `"Search this site"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.filters_label": z.string().describe(
      'Pagefind UI translation. English default value: `"Filters"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.zero_results": z.string().describe(
      'Pagefind UI translation. English default value: `"No results for [SEARCH_TERM]"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.many_results": z.string().describe(
      'Pagefind UI translation. English default value: `"[COUNT] results for [SEARCH_TERM]"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.one_result": z.string().describe(
      'Pagefind UI translation. English default value: `"[COUNT] result for [SEARCH_TERM]"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.alt_search": z.string().describe(
      'Pagefind UI translation. English default value: `"No results for [SEARCH_TERM]. Showing results for [DIFFERENT_TERM] instead"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.search_suggestion": z.string().describe(
      'Pagefind UI translation. English default value: `"No results for [SEARCH_TERM]. Try one of the following searches:"`. See https://pagefind.app/docs/ui/#translations'
    ),
    "pagefind.searching": z.string().describe(
      'Pagefind UI translation. English default value: `"Searching for [SEARCH_TERM]..."`. See https://pagefind.app/docs/ui/#translations'
    )
  }).partial();
}
function expressiveCodeI18nSchema() {
  return z.object({
    "expressiveCode.copyButtonCopied": z.string().describe('Expressive Code UI translation. English default value: `"Copied!"`'),
    "expressiveCode.copyButtonTooltip": z.string().describe('Expressive Code UI translation. English default value: `"Copy to clipboard"`'),
    "expressiveCode.terminalWindowFallbackTitle": z.string().describe('Expressive Code UI translation. English default value: `"Terminal window"`')
  }).partial();
}

const cs = {
	"skipLink.label": "Přeskočit na obsah",
	"search.label": "Hledat",
	"search.shortcutLabel": "(Vyhledejte stisknutím /)",
	"search.cancelLabel": "Zrušit",
	"search.devWarning": "Vyhledávání je dostupné pouze v produkčních sestaveních. \nZkuste sestavit a zobrazit náhled webu a otestovat jej lokálně.",
	"themeSelect.accessibleLabel": "Vyberte motiv",
	"themeSelect.dark": "Tmavý",
	"themeSelect.light": "Světlý",
	"themeSelect.auto": "Auto",
	"languageSelect.accessibleLabel": "Vyberte jazyk",
	"menuButton.accessibleLabel": "Nabídka",
	"sidebarNav.accessibleLabel": "Hlavní",
	"tableOfContents.onThisPage": "Na této stránce",
	"tableOfContents.overview": "Přehled",
	"i18n.untranslatedContent": "Tento obsah zatím není dostupný ve vašem jazyce.",
	"page.editLink": "Upravit stránku",
	"page.lastUpdated": "Poslední aktualizace:",
	"page.previousLink": "Předchozí",
	"page.nextLink": "Další",
	"404.text": "Stránka nenalezena. Zkontrolujte adresu URL nebo zkuste použít vyhledávací pole.",
	"aside.note": "Note",
	"aside.tip": "Tip",
	"aside.caution": "Caution",
	"aside.danger": "Danger"
};

const en = {
	"skipLink.label": "Skip to content",
	"search.label": "Search",
	"search.shortcutLabel": "(Press / to Search)",
	"search.cancelLabel": "Cancel",
	"search.devWarning": "Search is only available in production builds. \nTry building and previewing the site to test it out locally.",
	"themeSelect.accessibleLabel": "Select theme",
	"themeSelect.dark": "Dark",
	"themeSelect.light": "Light",
	"themeSelect.auto": "Auto",
	"languageSelect.accessibleLabel": "Select language",
	"menuButton.accessibleLabel": "Menu",
	"sidebarNav.accessibleLabel": "Main",
	"tableOfContents.onThisPage": "On this page",
	"tableOfContents.overview": "Overview",
	"i18n.untranslatedContent": "This content is not available in your language yet.",
	"page.editLink": "Edit page",
	"page.lastUpdated": "Last updated:",
	"page.previousLink": "Previous",
	"page.nextLink": "Next",
	"404.text": "Page not found. Check the URL or try using the search bar.",
	"aside.note": "Note",
	"aside.tip": "Tip",
	"aside.caution": "Caution",
	"aside.danger": "Danger"
};

const es = {
	"skipLink.label": "Saltearse al contenido",
	"search.label": "Buscar",
	"search.shortcutLabel": "(Presiona / para buscar)",
	"search.cancelLabel": "Interrumpir",
	"search.devWarning": "La búsqueda solo está disponible en las versiones de producción.  \nIntenta construir y previsualizar el sitio para probarlo localmente.",
	"themeSelect.accessibleLabel": "Seleccionar tema",
	"themeSelect.dark": "Oscuro",
	"themeSelect.light": "Claro",
	"themeSelect.auto": "Automático",
	"languageSelect.accessibleLabel": "Seleccionar idioma",
	"menuButton.accessibleLabel": "Menú",
	"sidebarNav.accessibleLabel": "Primario",
	"tableOfContents.onThisPage": "En esta página",
	"tableOfContents.overview": "Sinopsis",
	"i18n.untranslatedContent": "Esta página aún no está disponible en tu idioma.",
	"page.editLink": "Edita esta página",
	"page.lastUpdated": "Última actualización:",
	"page.previousLink": "Página anterior",
	"page.nextLink": "Siguiente página",
	"404.text": "Página no encontrada. Verifica la URL o intenta usar la barra de búsqueda.",
	"aside.note": "Nota",
	"aside.tip": "Consejo",
	"aside.caution": "Precaución",
	"aside.danger": "Peligro",
	"expressiveCode.copyButtonCopied": "¡Copiado!",
	"expressiveCode.copyButtonTooltip": "Copiar al portapapeles",
	"expressiveCode.terminalWindowFallbackTitle": "Ventana de terminal"
};

const de = {
	"skipLink.label": "Zum Inhalt springen",
	"search.label": "Suchen",
	"search.shortcutLabel": "(Drücke / zum Suchen)",
	"search.cancelLabel": "Abbrechen",
	"search.devWarning": "Search is only available in production builds. \nTry building and previewing the site to test it out locally.",
	"themeSelect.accessibleLabel": "Farbschema wählen",
	"themeSelect.dark": "Dunkel",
	"themeSelect.light": "Hell",
	"themeSelect.auto": "System",
	"languageSelect.accessibleLabel": "Sprache wählen",
	"menuButton.accessibleLabel": "Menü",
	"sidebarNav.accessibleLabel": "Hauptnavigation",
	"tableOfContents.onThisPage": "Auf dieser Seite",
	"tableOfContents.overview": "Überblick",
	"i18n.untranslatedContent": "Dieser Inhalt ist noch nicht in deiner Sprache verfügbar.",
	"page.editLink": "Seite bearbeiten",
	"page.lastUpdated": "Zuletzt bearbeitet:",
	"page.previousLink": "Vorherige Seite",
	"page.nextLink": "Nächste Seite",
	"404.text": "Seite nicht gefunden. Überprüfe die URL oder nutze die Suchleiste.",
	"aside.note": "Hinweis",
	"aside.tip": "Tipp",
	"aside.caution": "Achtung",
	"aside.danger": "Gefahr"
};

const ja = {
	"skipLink.label": "コンテンツにスキップ",
	"search.label": "検索",
	"search.shortcutLabel": "（/を押して検索）",
	"search.cancelLabel": "キャンセル",
	"search.devWarning": "検索はプロダクションビルドでのみ利用可能です。\nローカルでテストするには、サイトをビルドしてプレビューしてください。",
	"themeSelect.accessibleLabel": "テーマの選択",
	"themeSelect.dark": "ダーク",
	"themeSelect.light": "ライト",
	"themeSelect.auto": "自動",
	"languageSelect.accessibleLabel": "言語の選択",
	"menuButton.accessibleLabel": "メニュー",
	"sidebarNav.accessibleLabel": "メイン",
	"tableOfContents.onThisPage": "目次",
	"tableOfContents.overview": "概要",
	"i18n.untranslatedContent": "このコンテンツはまだ日本語訳がありません。",
	"page.editLink": "ページを編集",
	"page.lastUpdated": "最終更新日:",
	"page.previousLink": "前へ",
	"page.nextLink": "次へ",
	"404.text": "ページが見つかりません。 URL を確認するか、検索バーを使用してみてください。",
	"aside.note": "ノート",
	"aside.tip": "ヒント",
	"aside.caution": "注意",
	"aside.danger": "危険"
};

const pt = {
	"skipLink.label": "Pular para o conteúdo",
	"search.label": "Pesquisar",
	"search.shortcutLabel": "(Pressione / para Pesquisar)",
	"search.cancelLabel": "Cancelar",
	"search.devWarning": "A pesquisa está disponível apenas em builds em produção. \nTente fazer a build e pré-visualize o site para testar localmente.",
	"themeSelect.accessibleLabel": "Selecionar tema",
	"themeSelect.dark": "Escuro",
	"themeSelect.light": "Claro",
	"themeSelect.auto": "Auto",
	"languageSelect.accessibleLabel": "Selecionar língua",
	"menuButton.accessibleLabel": "Menu",
	"sidebarNav.accessibleLabel": "Principal",
	"tableOfContents.onThisPage": "Nesta página",
	"tableOfContents.overview": "Visão geral",
	"i18n.untranslatedContent": "Este conteúdo não está disponível em sua língua ainda.",
	"page.editLink": "Editar página",
	"page.lastUpdated": "Última atualização:",
	"page.previousLink": "Anterior",
	"page.nextLink": "Próximo",
	"404.text": "Página não encontrada. Verifique o URL ou tente usar a barra de pesquisa.",
	"aside.note": "Nota",
	"aside.tip": "Dica",
	"aside.caution": "Cuidado",
	"aside.danger": "Perigo"
};

const fa = {
	"skipLink.label": "رفتن به محتوا",
	"search.label": "جستجو",
	"search.shortcutLabel": "(برای جستجو / را فشار دهید)",
	"search.cancelLabel": "لغو",
	"search.devWarning": "جستجو تنها در نسخه‌های تولیدی در دسترس است. \nسعی کنید سایت را بسازید و پیش‌نمایش آن را به صورت محلی آزمایش کنید.",
	"themeSelect.accessibleLabel": "انتخاب پوسته",
	"themeSelect.dark": "تیره",
	"themeSelect.light": "روشن",
	"themeSelect.auto": "خودکار",
	"languageSelect.accessibleLabel": "انتخاب زبان",
	"menuButton.accessibleLabel": "منو",
	"sidebarNav.accessibleLabel": "اصلی",
	"tableOfContents.onThisPage": "در این صفحه",
	"tableOfContents.overview": "بررسی اجمالی",
	"i18n.untranslatedContent": "این محتوا هنوز به زبان شما در دسترس نیست.",
	"page.editLink": "ویرایش صفحه",
	"page.lastUpdated": "آخرین به روز رسانی:",
	"page.previousLink": "قبلی",
	"page.nextLink": "بعدی",
	"404.text": "صفحه یافت نشد. لطفاً URL را بررسی کنید یا از جستجو استفاده نمایید.",
	"aside.note": "Note",
	"aside.tip": "Tip",
	"aside.caution": "Caution",
	"aside.danger": "Danger"
};

const fr = {
	"skipLink.label": "Aller au contenu",
	"search.label": "Rechercher",
	"search.shortcutLabel": "(Presser / pour rechercher)",
	"search.cancelLabel": "Annuler",
	"search.devWarning": "La recherche est disponible uniquement en mode production. \nEssayez de construire puis de prévisualiser votre site pour tester la recherche localement.",
	"themeSelect.accessibleLabel": "Selectionner le thème",
	"themeSelect.dark": "Sombre",
	"themeSelect.light": "Clair",
	"themeSelect.auto": "Auto",
	"languageSelect.accessibleLabel": "Selectionner la langue",
	"menuButton.accessibleLabel": "Menu",
	"sidebarNav.accessibleLabel": "principale",
	"tableOfContents.onThisPage": "Sur cette page",
	"tableOfContents.overview": "Vue d’ensemble",
	"i18n.untranslatedContent": "Ce contenu n’est pas encore disponible dans votre langue.",
	"page.editLink": "Modifier cette page",
	"page.lastUpdated": "Dernière mise à jour :",
	"page.previousLink": "Précédent",
	"page.nextLink": "Suivant",
	"404.text": "Page non trouvée. Vérifiez l’URL ou essayez d’utiliser la barre de recherche.",
	"aside.note": "Note",
	"aside.tip": "Astuce",
	"aside.caution": "Attention",
	"aside.danger": "Danger",
	"expressiveCode.copyButtonCopied": "Copié !",
	"expressiveCode.copyButtonTooltip": "Copier dans le presse-papiers",
	"expressiveCode.terminalWindowFallbackTitle": "Fenêtre de terminal"
};

const gl = {
	"skipLink.label": "Ir ao contido",
	"search.label": "Busca",
	"search.shortcutLabel": "(Preme / para Busca)",
	"search.cancelLabel": "Deixar",
	"search.devWarning": "A busca só está dispoñible nas versións de producción. \nTrata de construir e ollear o sitio para probalo localmente.",
	"themeSelect.accessibleLabel": "Seleciona tema",
	"themeSelect.dark": "Escuro",
	"themeSelect.light": "Claro",
	"themeSelect.auto": "Auto",
	"languageSelect.accessibleLabel": "Seleciona linguaxe",
	"menuButton.accessibleLabel": "Menú",
	"sidebarNav.accessibleLabel": "Principal",
	"tableOfContents.onThisPage": "Nesta paxina",
	"tableOfContents.overview": "Sinopse",
	"i18n.untranslatedContent": "Este contido aínda non está dispoñible no teu idioma.",
	"page.editLink": "Editar paxina",
	"page.lastUpdated": "Última actualización:",
	"page.previousLink": "Anterior",
	"page.nextLink": "Seguinte",
	"404.text": "Paxina non atopada. Comproba a URL ou intenta usar a barra de busca.",
	"aside.note": "Note",
	"aside.tip": "Tip",
	"aside.caution": "Caution",
	"aside.danger": "Danger"
};

const he = {
	"skipLink.label": "דלגו לתוכן",
	"search.label": "חיפוש",
	"search.shortcutLabel": "(לחצו / כדי לחפש)",
	"search.cancelLabel": "ביטול",
	"search.devWarning": "החיפוש זמין רק בסביבת ייצור. \nנסו לבנות ולהציג תצוגה מקדימה של האתר כדי לבדוק אותו באופן מקומי.",
	"themeSelect.accessibleLabel": "בחרו פרופיל צבע",
	"themeSelect.dark": "כהה",
	"themeSelect.light": "בהיר",
	"themeSelect.auto": "מערכת",
	"languageSelect.accessibleLabel": "בחרו שפה",
	"menuButton.accessibleLabel": "תפריט",
	"sidebarNav.accessibleLabel": "ראשי",
	"tableOfContents.onThisPage": "בדף זה",
	"tableOfContents.overview": "סקירה כללית",
	"i18n.untranslatedContent": "תוכן זה אינו זמין עדיין בשפה שלך.",
	"page.editLink": "ערכו דף",
	"page.lastUpdated": "עדכון אחרון:",
	"page.previousLink": "הקודם",
	"page.nextLink": "הבא",
	"404.text": "הדף לא נמצא. אנא בדקו את כתובת האתר או נסו להשתמש בסרגל החיפוש.",
	"aside.note": "Note",
	"aside.tip": "Tip",
	"aside.caution": "Caution",
	"aside.danger": "Danger"
};

const id = {
	"skipLink.label": "Lewati ke konten",
	"search.label": "Pencarian",
	"search.shortcutLabel": "(Tekan / untuk mencari)",
	"search.cancelLabel": "Batal",
	"search.devWarning": "Pencarian hanya tersedia pada build produksi. \nLakukan proses build dan pratinjau situs Anda sebelum mencoba di lingkungan lokal.",
	"themeSelect.accessibleLabel": "Pilih tema",
	"themeSelect.dark": "Gelap",
	"themeSelect.light": "Terang",
	"themeSelect.auto": "Otomatis",
	"languageSelect.accessibleLabel": "Pilih Bahasa",
	"menuButton.accessibleLabel": "Menu",
	"sidebarNav.accessibleLabel": "Utama",
	"tableOfContents.onThisPage": "Di halaman ini",
	"tableOfContents.overview": "Ringkasan",
	"i18n.untranslatedContent": "Konten ini belum tersedia dalam bahasa Anda.",
	"page.editLink": "Edit halaman",
	"page.lastUpdated": "Terakhir diperbaharui:",
	"page.previousLink": "Sebelumnya",
	"page.nextLink": "Selanjutnya",
	"404.text": "Halaman tidak ditemukan. Cek kembali kolom URL atau gunakan fitur pencarian.",
	"aside.note": "Catatan",
	"aside.tip": "Tips",
	"aside.caution": "Perhatian",
	"aside.danger": "Bahaya"
};

const it = {
	"skipLink.label": "Salta ai contenuti",
	"search.label": "Cerca",
	"search.shortcutLabel": "(Usa / per cercare)",
	"search.cancelLabel": "Cancella",
	"search.devWarning": "Search is only available in production builds. \nTry building and previewing the site to test it out locally.",
	"themeSelect.accessibleLabel": "Seleziona tema",
	"themeSelect.dark": "Scuro",
	"themeSelect.light": "Chiaro",
	"themeSelect.auto": "Auto",
	"languageSelect.accessibleLabel": "Seleziona lingua",
	"menuButton.accessibleLabel": "Menu",
	"sidebarNav.accessibleLabel": "Principale",
	"tableOfContents.onThisPage": "In questa pagina",
	"tableOfContents.overview": "Panoramica",
	"i18n.untranslatedContent": "Questi contenuti non sono ancora disponibili nella tua lingua.",
	"page.editLink": "Modifica pagina",
	"page.lastUpdated": "Ultimo aggiornamento:",
	"page.previousLink": "Indietro",
	"page.nextLink": "Avanti",
	"404.text": "Pagina non trovata. Verifica l'URL o prova a utilizzare la barra di ricerca.",
	"aside.note": "Nota",
	"aside.tip": "Consiglio",
	"aside.caution": "Attenzione",
	"aside.danger": "Pericolo"
};

const nl = {
	"skipLink.label": "Ga naar inhoud",
	"search.label": "Zoeken",
	"search.shortcutLabel": "(Druk op / om te zoeken)",
	"search.cancelLabel": "Annuleren",
	"search.devWarning": "Zoeken is alleen beschikbaar tijdens productie. \nProbeer om de site te builden en er een preview van te bekijken om lokaal te testen.",
	"themeSelect.accessibleLabel": "Selecteer thema",
	"themeSelect.dark": "Donker",
	"themeSelect.light": "Licht",
	"themeSelect.auto": "Auto",
	"languageSelect.accessibleLabel": "Selecteer taal",
	"menuButton.accessibleLabel": "Menu",
	"sidebarNav.accessibleLabel": "Hoofdnavigatie",
	"tableOfContents.onThisPage": "Op deze pagina",
	"tableOfContents.overview": "Overzicht",
	"i18n.untranslatedContent": "Deze inhoud is nog niet vertaald.",
	"page.editLink": "Bewerk pagina",
	"page.lastUpdated": "Laatst bewerkt:",
	"page.previousLink": "Vorige",
	"page.nextLink": "Volgende",
	"404.text": "Pagina niet gevonden. Controleer de URL of probeer de zoekbalk.",
	"aside.note": "Opmerking",
	"aside.tip": "Tip",
	"aside.caution": "Opgepast",
	"aside.danger": "Gevaar"
};

const da = {
	"skipLink.label": "Gå til indhold",
	"search.label": "Søg",
	"search.shortcutLabel": "(Tryk / for at søge)",
	"search.cancelLabel": "Annuller",
	"search.devWarning": "Søgning er kun tilgængeligt i produktions versioner. \nPrøv at bygge siden og forhåndsvis den for at teste det lokalt.",
	"themeSelect.accessibleLabel": "Vælg tema",
	"themeSelect.dark": "Mørk",
	"themeSelect.light": "Lys",
	"themeSelect.auto": "Auto",
	"languageSelect.accessibleLabel": "Vælg sprog",
	"menuButton.accessibleLabel": "Menu",
	"sidebarNav.accessibleLabel": "Hovednavigation",
	"tableOfContents.onThisPage": "På denne side",
	"tableOfContents.overview": "Oversigt",
	"i18n.untranslatedContent": "Dette indhold er ikke tilgængeligt i dit sprog endnu.",
	"page.editLink": "Rediger siden",
	"page.lastUpdated": "Sidst opdateret:",
	"page.previousLink": "Forrige",
	"page.nextLink": "Næste",
	"404.text": "Siden er ikke fundet. Tjek din URL eller prøv søgelinjen.",
	"aside.note": "Note",
	"aside.tip": "Tip",
	"aside.caution": "Caution",
	"aside.danger": "Danger"
};

const tr = {
	"skipLink.label": "İçeriğe geç",
	"search.label": "Ara",
	"search.shortcutLabel": "(Aramak için / bas)",
	"search.cancelLabel": "İptal",
	"search.devWarning": "Arama yalnızca üretim derlemelerinde kullanılabilir. \nYerel bilgisayarınızda test etmek için siteyi derleyin ve önizleme yapın.",
	"themeSelect.accessibleLabel": "Tema seç",
	"themeSelect.dark": "Koyu",
	"themeSelect.light": "Açık",
	"themeSelect.auto": "Otomatik",
	"languageSelect.accessibleLabel": "Dil seçin",
	"menuButton.accessibleLabel": "Menü",
	"sidebarNav.accessibleLabel": "Ana",
	"tableOfContents.onThisPage": "Sayfa içeriği",
	"tableOfContents.overview": "Genel bakış",
	"i18n.untranslatedContent": "Bu içerik henüz dilinizde mevcut değil.",
	"page.editLink": "Sayfayı düzenle",
	"page.lastUpdated": "Son güncelleme:",
	"page.previousLink": "Önceki",
	"page.nextLink": "Sonraki",
	"404.text": "Sayfa bulunamadı. URL'i kontrol edin ya da arama çubuğunu kullanmayı deneyin.",
	"aside.note": "Note",
	"aside.tip": "Tip",
	"aside.caution": "Caution",
	"aside.danger": "Danger"
};

const ar = {
	"skipLink.label": "تخطَّ إلى المحتوى",
	"search.label": "ابحث",
	"search.shortcutLabel": "(إضغط / للبحث)",
	"search.cancelLabel": "إلغاء",
	"search.devWarning": "البحث متوفر فقط في بنيات اﻹنتاج. \n جرب بناء المشروع ومعاينته على جهازك",
	"themeSelect.accessibleLabel": "اختر سمة",
	"themeSelect.dark": "داكن",
	"themeSelect.light": "فاتح",
	"themeSelect.auto": "تلقائي",
	"languageSelect.accessibleLabel": "اختر لغة",
	"menuButton.accessibleLabel": "القائمة",
	"sidebarNav.accessibleLabel": "الرئيسية",
	"tableOfContents.onThisPage": "على هذه الصفحة",
	"tableOfContents.overview": "نظرة عامة",
	"i18n.untranslatedContent": "هذا المحتوى لا يتوفر بلغتك بعد.",
	"page.editLink": "عدل الصفحة",
	"page.lastUpdated": "اخر تحديث:",
	"page.previousLink": "السابق",
	"page.nextLink": "التالي",
	"404.text": "الصفحة غير موجودة. تأكد من الرابط أو ابحث بإستعمال شريط البحث.",
	"aside.note": "ملحوظة",
	"aside.tip": "نصيحة",
	"aside.caution": "تنبيه",
	"aside.danger": "تحذير"
};

const nb = {
	"skipLink.label": "Gå til innholdet",
	"search.label": "Søk",
	"search.shortcutLabel": "(Trykk / for å søke)",
	"search.cancelLabel": "Avbryt",
	"search.devWarning": "Søk er bare tilgjengelig i produksjonsbygg. \nPrøv å bygg siden og forhåndsvis den for å teste det lokalt.",
	"themeSelect.accessibleLabel": "Velg tema",
	"themeSelect.dark": "Mørk",
	"themeSelect.light": "Lys",
	"themeSelect.auto": "Auto",
	"languageSelect.accessibleLabel": "Velg språk",
	"menuButton.accessibleLabel": "Meny",
	"sidebarNav.accessibleLabel": "Hovednavigasjon",
	"tableOfContents.onThisPage": "På denne siden",
	"tableOfContents.overview": "Oversikt",
	"i18n.untranslatedContent": "Dette innholdet er ikke tilgjengelig på ditt språk.",
	"page.editLink": "Rediger side",
	"page.lastUpdated": "Sist oppdatert:",
	"page.previousLink": "Forrige",
	"page.nextLink": "Neste",
	"404.text": "Siden ble ikke funnet. Sjekk URL-en eller prøv å bruke søkefeltet.",
	"aside.note": "Note",
	"aside.tip": "Tip",
	"aside.caution": "Caution",
	"aside.danger": "Danger"
};

const zh = {
	"skipLink.label": "跳转到内容",
	"search.label": "搜索",
	"search.shortcutLabel": "（按 / 进行搜索）",
	"search.cancelLabel": "取消",
	"search.devWarning": "搜索仅适用于生产版本。\n尝试构建并预览网站以在本地测试。",
	"themeSelect.accessibleLabel": "选择主题",
	"themeSelect.dark": "深色",
	"themeSelect.light": "浅色",
	"themeSelect.auto": "自动",
	"languageSelect.accessibleLabel": "选择语言",
	"menuButton.accessibleLabel": "菜单",
	"sidebarNav.accessibleLabel": "主要",
	"tableOfContents.onThisPage": "本页",
	"tableOfContents.overview": "概述",
	"i18n.untranslatedContent": "此内容尚不支持你的语言。",
	"page.editLink": "编辑此页",
	"page.lastUpdated": "最近更新：",
	"page.previousLink": "上一页",
	"page.nextLink": "下一页",
	"404.text": "页面未找到。检查 URL 或尝试使用搜索栏。",
	"aside.note": "注意",
	"aside.tip": "提示",
	"aside.caution": "警告",
	"aside.danger": "危险"
};

const ko = {
	"skipLink.label": "컨텐츠로 이동",
	"search.label": "검색",
	"search.shortcutLabel": "(검색을 위해 / 키를 누르세요)",
	"search.cancelLabel": "취소",
	"search.devWarning": "검색 기능은 프로덕션 환경에서만 사용할 수 있습니다.\n사이트를 로컬 환경에서 테스트하기 위해 빌드하고 미리보기(Preview) 하세요.",
	"themeSelect.accessibleLabel": "테마 선택",
	"themeSelect.dark": "어두움",
	"themeSelect.light": "밝음",
	"themeSelect.auto": "자동",
	"languageSelect.accessibleLabel": "언어 선택",
	"menuButton.accessibleLabel": "메뉴",
	"sidebarNav.accessibleLabel": "메인",
	"tableOfContents.onThisPage": "목차",
	"tableOfContents.overview": "개요",
	"i18n.untranslatedContent": "이 컨텐츠는 아직 번역되지 않았습니다.",
	"page.editLink": "페이지 수정",
	"page.lastUpdated": "최종 수정:",
	"page.previousLink": "이전 페이지",
	"page.nextLink": "다음 페이지",
	"404.text": "페이지를 찾을 수 없습니다. URL을 확인하거나 검색창을 사용해보세요.",
	"aside.note": "노트",
	"aside.tip": "팁",
	"aside.caution": "주의",
	"aside.danger": "위험"
};

const sv = {
	"skipLink.label": "Hoppa till innehåll",
	"search.label": "Sök",
	"search.shortcutLabel": "(Tryck / för att söka)",
	"search.cancelLabel": "Avbryt",
	"search.devWarning": "Sökfunktionen är endast tillgänglig i produktionsbyggen. \nProva att bygga och förhandsvisa siten för att testa det lokalt.",
	"themeSelect.accessibleLabel": "Välj tema",
	"themeSelect.dark": "Mörkt",
	"themeSelect.light": "Ljust",
	"themeSelect.auto": "Auto",
	"languageSelect.accessibleLabel": "Välj språk",
	"menuButton.accessibleLabel": "Meny",
	"sidebarNav.accessibleLabel": "Huvudmeny",
	"tableOfContents.onThisPage": "På den här sidan",
	"tableOfContents.overview": "Översikt",
	"i18n.untranslatedContent": "Det här innehållet är inte tillgängligt på ditt språk än.",
	"page.editLink": "Redigera sida",
	"page.lastUpdated": "Senast uppdaterad:",
	"page.previousLink": "Föregående",
	"page.nextLink": "Nästa",
	"404.text": "Sidan hittades inte. Kontrollera URL:n eller testa att använda sökfältet.",
	"aside.note": "Note",
	"aside.tip": "Tip",
	"aside.caution": "Caution",
	"aside.danger": "Danger"
};

const ro = {
	"skipLink.label": "Sari la conținut",
	"search.label": "Caută",
	"search.shortcutLabel": "(Apasă pe / ca să cauți)",
	"search.cancelLabel": "Anulează",
	"search.devWarning": "Căutarea este disponibilă numai în versiunea de producție. \nÎncercă să construiești și să previzualizezi site-ul pentru a-l testa local.",
	"themeSelect.accessibleLabel": "Selectează tema",
	"themeSelect.dark": "Întunecată",
	"themeSelect.light": "Deschisă",
	"themeSelect.auto": "Auto",
	"languageSelect.accessibleLabel": "Selectează limba",
	"menuButton.accessibleLabel": "Meniu",
	"sidebarNav.accessibleLabel": "Principal",
	"tableOfContents.onThisPage": "Pe această pagină",
	"tableOfContents.overview": "Sinopsis",
	"i18n.untranslatedContent": "Acest conținut nu este încă disponibil în limba selectată.",
	"page.editLink": "Editează pagina",
	"page.lastUpdated": "Ultima actualizare:",
	"page.previousLink": "Pagina precendentă",
	"page.nextLink": "Pagina următoare",
	"404.text": "Pagina nu a fost găsită. Verifică adresa URL sau încercă să folosești bara de căutare.",
	"aside.note": "Mențiune",
	"aside.tip": "Sfat",
	"aside.caution": "Atenție",
	"aside.danger": "Pericol"
};

const ru = {
	"skipLink.label": "Пропустить до содержимого",
	"search.label": "Поиск",
	"search.shortcutLabel": "(Нажмите / для Поиска)",
	"search.cancelLabel": "Отменить",
	"search.devWarning": "Поиск доступен только в производственных сборках. \nПопробуйте выполнить сборку и просмотреть сайт, чтобы протестировать его локально.",
	"themeSelect.accessibleLabel": "Выберите тему",
	"themeSelect.dark": "Темная",
	"themeSelect.light": "Светлая",
	"themeSelect.auto": "Авто",
	"languageSelect.accessibleLabel": "Выберите язык",
	"menuButton.accessibleLabel": "Меню",
	"sidebarNav.accessibleLabel": "Основное",
	"tableOfContents.onThisPage": "На этой странице",
	"tableOfContents.overview": "Обзор",
	"i18n.untranslatedContent": "Это содержимое пока не доступно на вашем языке.",
	"page.editLink": "Редактировать страницу",
	"page.lastUpdated": "Последнее обновление:",
	"page.previousLink": "Предыдущая",
	"page.nextLink": "Следующая",
	"404.text": "Страница не найдена. Проверьтье  URL или используйте поиск по сайту",
	"aside.note": "Заметка",
	"aside.tip": "Знали ли вы?",
	"aside.caution": "Осторожно",
	"aside.danger": "Опасно"
};

const vi = {
	"skipLink.label": "Bỏ qua nội dung",
	"search.label": "Tìm kiếm",
	"search.shortcutLabel": "(Nhấn / để Tìm kiếm)",
	"search.cancelLabel": "Thoát",
	"search.devWarning": "Tìm kiếm không khả dụng khi đang trong môi trường lập trình. \nThử xuất bản website và tìm kiếm.",
	"themeSelect.accessibleLabel": "Chọn giao diện",
	"themeSelect.dark": "Tối",
	"themeSelect.light": "Sáng",
	"themeSelect.auto": "Tự động",
	"languageSelect.accessibleLabel": "Chọn ngôn ngữ",
	"menuButton.accessibleLabel": "Menu",
	"sidebarNav.accessibleLabel": "Chính",
	"tableOfContents.onThisPage": "Tóm tắt",
	"tableOfContents.overview": "Tổng quát",
	"i18n.untranslatedContent": "Nội dung này không tồn tại trong ngôn ngữ của bạn",
	"page.editLink": "Chỉnh sửa trang",
	"page.lastUpdated": "Cập nhật lần cuối:",
	"page.previousLink": "Tiếp",
	"page.nextLink": "Trước",
	"404.text": "Không tìm thấy trang. Kiểm tra URL hoặc thử sử dụng thanh tìm kiếm.",
	"aside.note": "Note",
	"aside.tip": "Tip",
	"aside.caution": "Caution",
	"aside.danger": "Danger"
};

const uk = {
	"skipLink.label": "Перейти до вмісту",
	"search.label": "Пошук",
	"search.shortcutLabel": "(Натисніть / для Пошуку)",
	"search.cancelLabel": "Скасувати",
	"search.devWarning": "Пошук доступний лише у виробничих зборках. \nСпробуйте виконати збірку та переглянути сайт, щоб протестувати його локально",
	"themeSelect.accessibleLabel": "Вибрати Тему",
	"themeSelect.dark": "Темна",
	"themeSelect.light": "Світла",
	"themeSelect.auto": "Авто",
	"languageSelect.accessibleLabel": "Оберіть мову",
	"menuButton.accessibleLabel": "Меню",
	"sidebarNav.accessibleLabel": "Головне",
	"tableOfContents.onThisPage": "На цій сторінці",
	"tableOfContents.overview": "Огляд",
	"i18n.untranslatedContent": "Цей контент ще не доступний на Вашій мові.",
	"page.editLink": "Редагувати сторінку",
	"page.lastUpdated": "Останнє оновлення:",
	"page.previousLink": "Попередня",
	"page.nextLink": "Наступна",
	"404.text": "Сторінку не знайдено. Перевірте URL-адресу або спробуйте скористатися рядком пошуку.",
	"aside.note": "Note",
	"aside.tip": "Tip",
	"aside.caution": "Caution",
	"aside.danger": "Danger"
};

const hi = {
	"skipLink.label": "इसे छोड़कर कंटेंट पर जाएं",
	"search.label": "खोजें",
	"search.shortcutLabel": "(खोजने के लिए / दबाएँ)",
	"search.cancelLabel": "रद्द करे",
	"search.devWarning": "खोज केवल उत्पादन बिल्ड में उपलब्ध है। \nस्थानीय स्तर पर परीक्षण करने के लिए साइट बनाए और उसका पूर्वावलोकन करने का प्रयास करें।",
	"themeSelect.accessibleLabel": "थीम चुनें",
	"themeSelect.dark": "अँधेरा",
	"themeSelect.light": "रोशनी",
	"themeSelect.auto": "स्वत",
	"languageSelect.accessibleLabel": "भाषा चुने",
	"menuButton.accessibleLabel": "मेन्यू",
	"sidebarNav.accessibleLabel": "मुख्य",
	"tableOfContents.onThisPage": "इस पृष्ठ पर",
	"tableOfContents.overview": "अवलोकन",
	"i18n.untranslatedContent": "यह कंटेंट अभी तक आपकी भाषा में उपलब्ध नहीं है।",
	"page.editLink": "पृष्ठ संपादित करें",
	"page.lastUpdated": "आखिरी अद्यतन:",
	"page.previousLink": "पिछला",
	"page.nextLink": "अगला",
	"404.text": "यह पृष्ठ नहीं मिला। URL जांचें या खोज बार का उपयोग करने का प्रयास करें।",
	"aside.note": "टिप्पणी",
	"aside.tip": "संकेत",
	"aside.caution": "सावधानी",
	"aside.danger": "खतरा"
};

const { parse } = builtinI18nSchema();
const builtinTranslations = Object.fromEntries(
  Object.entries({
    cs,
    en,
    es,
    de,
    ja,
    pt,
    fa,
    fr,
    gl,
    he,
    id,
    it,
    nl,
    da,
    tr,
    ar,
    nb,
    zh,
    ko,
    sv,
    ro,
    ru,
    vi,
    uk,
    hi
  }).map(([key, dict]) => [key, parse(dict)])
);

function createTranslationSystem(userTranslations, config) {
  const defaultLocale = config.defaultLocale?.locale || "root";
  const defaults = buildDictionary(
    builtinTranslations.en,
    userTranslations.en,
    builtinTranslations[defaultLocale] || builtinTranslations[stripLangRegion(defaultLocale)],
    userTranslations[defaultLocale]
  );
  return function useTranslations(locale) {
    const lang = localeToLang(locale, config.locales, config.defaultLocale);
    const dictionary = buildDictionary(
      defaults,
      builtinTranslations[lang] || builtinTranslations[stripLangRegion(lang)],
      userTranslations[lang]
    );
    const t = (key) => dictionary[key];
    t.all = () => dictionary;
    return t;
  };
}
function stripLangRegion(lang) {
  return lang.replace(/-[a-zA-Z]{2}/, "");
}
function localeToLang(locale, locales, defaultLocale) {
  const lang = locale ? locales?.[locale]?.lang : locales?.root?.lang;
  const defaultLang = defaultLocale?.lang || defaultLocale?.locale;
  return lang || defaultLang || "en";
}
function buildDictionary(base, ...dictionaries) {
  const dictionary = { ...base };
  for (const dict of dictionaries) {
    for (const key in dict) {
      const value = dict[key];
      if (value)
        dictionary[key] = value;
    }
  }
  return dictionary;
}

let userTranslations = {};
try {
  userTranslations = Object.fromEntries(
    (await getCollection("i18n")).map(({ id, data }) => [id, data])
  );
} catch {
}
const useTranslations = createTranslationSystem(userTranslations, config);

function generateRouteData({
  props,
  url
}) {
  const { entry, locale } = props;
  const sidebar = getSidebar(url.pathname, locale);
  return {
    ...props,
    sidebar,
    hasSidebar: entry.data.template !== "splash",
    pagination: getPrevNextLinks(sidebar, config.pagination, entry.data),
    toc: getToC(props),
    lastUpdated: getLastUpdated(props),
    editUrl: getEditUrl(props),
    labels: useTranslations(locale).all()
  };
}
function getToC({ entry, locale, headings }) {
  const tocConfig = entry.data.template === "splash" ? false : entry.data.tableOfContents !== void 0 ? entry.data.tableOfContents : config.tableOfContents;
  if (!tocConfig)
    return;
  const t = useTranslations(locale);
  return {
    ...tocConfig,
    items: generateToC(headings, { ...tocConfig, title: t("tableOfContents.overview") })
  };
}
function getLastUpdated({ entry }) {
  if (entry.data.lastUpdated ?? config.lastUpdated) {
    const currentFilePath = fileURLToPath(new URL("src/content/docs/" + entry.id, project.root));
    let date = typeof entry.data.lastUpdated !== "boolean" ? entry.data.lastUpdated : void 0;
    if (!date) {
      try {
        ({ date } = getFileCommitDate(currentFilePath, "newest"));
      } catch {
      }
    }
    return date;
  }
  return;
}
function getEditUrl({ entry, id, isFallback }) {
  const { editUrl } = entry.data;
  if (editUrl === false)
    return;
  let url;
  if (typeof editUrl === "string") {
    url = editUrl;
  } else if (config.editLink.baseUrl) {
    const srcPath = project.srcDir.replace(project.root, "");
    const filePath = isFallback ? localizedId(id, config.defaultLocale.locale) : id;
    url = ensureTrailingSlash(config.editLink.baseUrl) + srcPath + "content/docs/" + filePath;
  }
  return url ? new URL(url) : void 0;
}

const $$Astro = createAstro();
const $$404 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$404;
  const { lang = "en", dir = "ltr" } = config.defaultLocale || {};
  let locale = config.defaultLocale?.locale;
  if (locale === "root")
    locale = void 0;
  const entryMeta = { dir, lang, locale };
  const t = useTranslations(locale);
  const fallbackEntry = {
    slug: "404",
    id: "404.md",
    body: "",
    collection: "docs",
    data: {
      title: "404",
      template: "splash",
      editUrl: false,
      head: [],
      hero: { tagline: t("404.text"), actions: [] },
      pagefind: false,
      sidebar: { hidden: false, attrs: {} }
    },
    render: async () => ({
      Content: Content,
      headings: [],
      remarkPluginFrontmatter: {}
    })
  };
  const userEntry = await getEntry("docs", "404");
  const entry = userEntry || fallbackEntry;
  const { Content: Content$1, headings } = await entry.render();
  const route = generateRouteData({
    props: { ...entryMeta, entryMeta, headings, entry, id: entry.id, slug: entry.slug },
    url: Astro2.url
  });
  return renderTemplate`${renderComponent($$result, "Page", $$Page, { ...route }, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Content", Content$1, {})}` })}`;
}, "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/404.astro", void 0);

const $$file = "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/node_modules/@astrojs/starlight/404.astro";
const $$url = undefined;

const _404 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$Page as $, _404 as _, generateRouteData as a, $$Icon as b, $$Image as c, getConfiguredImageService as g, imageConfig as i, paths as p };
