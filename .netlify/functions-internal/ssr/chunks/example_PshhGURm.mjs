import { f as createComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_0DgGDWr4.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<p>Reference pages are ideal for outlining how things work in terse and clear terms.\nLess concerned with telling a story or addressing a specific use case, they should give a comprehensive outline of what your documenting.</p>\n<h2 id=\"further-reading\">Further reading</h2>\n<ul>\n<li>Read <a href=\"https://diataxis.fr/reference/\">about reference</a> in the Diátaxis framework</li>\n</ul>";

				const frontmatter = {"title":"Example Reference","description":"A reference page in my new Starlight docs site."};
				const file = "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/src/content/docs/reference/example.md";
				const url = undefined;
				function rawContent() {
					return "\nReference pages are ideal for outlining how things work in terse and clear terms.\nLess concerned with telling a story or addressing a specific use case, they should give a comprehensive outline of what your documenting.\n\n## Further reading\n\n- Read [about reference](https://diataxis.fr/reference/) in the Diátaxis framework\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":2,"slug":"further-reading","text":"Further reading"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
