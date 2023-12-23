import { f as createComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_0DgGDWr4.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<p>Guides lead a user through a specific task they want to accomplish, often with a sequence of steps.\nWriting a good guide requires thinking about what your users are trying to do.</p>\n<h2 id=\"further-reading\">Further reading</h2>\n<ul>\n<li>Read <a href=\"https://diataxis.fr/how-to-guides/\">about how-to guides</a> in the Diátaxis framework</li>\n</ul>";

				const frontmatter = {"title":"Example Guide","description":"A guide in my new Starlight docs site."};
				const file = "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/src/content/docs/guides/example.md";
				const url = undefined;
				function rawContent() {
					return "\nGuides lead a user through a specific task they want to accomplish, often with a sequence of steps.\nWriting a good guide requires thinking about what your users are trying to do.\n\n## Further reading\n\n- Read [about how-to guides](https://diataxis.fr/how-to-guides/) in the Diátaxis framework\n";
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
