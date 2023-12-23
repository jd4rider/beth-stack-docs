import { f as createComponent, r as renderTemplate, m as maybeRenderHead, u as unescapeHTML } from './astro_0DgGDWr4.mjs';
import 'kleur/colors';
import 'clsx';

const html = "<h1 id=\"this-project-was-created-using-create-beth-app\">This project was created using <code dir=\"auto\">create-beth-app</code></h1>\n<h2 id=\"to-open-an-issue-httpsgithubcomethanniserthe-beth-stack\">To open an issue: <a href=\"https://github.com/ethanniser/the-beth-stack\">https://github.com/ethanniser/the-beth-stack</a></h2>\n<h2 id=\"to-discuss-httpsdiscordggz3yutmfkwa\">To discuss: <a href=\"https://discord.gg/Z3yUtMfkwa\">https://discord.gg/Z3yUtMfkwa</a></h2>\n<h3 id=\"to-run-locally\">To run locally:</h3>\n<ol>\n<li><code dir=\"auto\">bun install</code></li>\n<li>create a new turso database with <code dir=\"auto\">turso db create &#x3C;name></code></li>\n<li>get the database url with <code dir=\"auto\">turso db show --url &#x3C;name></code></li>\n<li>get the auth token with <code dir=\"auto\">turso db tokens create &#x3C;name></code></li>\n<li>(optional) create a new github developer app and get credentials</li>\n<li>copy <code dir=\"auto\">.env.example</code> to <code dir=\"auto\">.env</code></li>\n<li>fill out all enviorment variables (refer to the config file to see schema)</li>\n<li><code dir=\"auto\">bun db:push</code></li>\n<li><code dir=\"auto\">bun dev</code></li>\n</ol>\n<h3 id=\"to-deploy-to-flyio\">To deploy to fly.io</h3>\n<ol>\n<li>\n<p>Install the <a href=\"https://fly.io/docs/hands-on/install-flyctl/\">Fly CLI</a></p>\n</li>\n<li>\n<p>Run <code dir=\"auto\">fly launch</code></p>\n</li>\n<li>\n<p>Run <code dir=\"auto\">fly secrets set &#x3C;NAME>=&#x3C;VALUE></code> (probably want to set <code dir=\"auto\">NODE_ENV</code> to <code dir=\"auto\">\"production\"</code>)</p>\n</li>\n<li>\n<p>Run <code dir=\"auto\">fly deploy</code></p>\n</li>\n</ol>";

				const frontmatter = {"title":"Getting Started","description":"This is the getting started page for the BETH Stack"};
				const file = "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/src/content/docs/start_here/getting_started.md";
				const url = undefined;
				function rawContent() {
					return "\n# This project was created using `create-beth-app`\n## To open an issue: https://github.com/ethanniser/the-beth-stack\n## To discuss: https://discord.gg/Z3yUtMfkwa\n\n### To run locally:\n\n1. `bun install`\n2. create a new turso database with `turso db create <name>`\n3. get the database url with `turso db show --url <name>`\n4. get the auth token with `turso db tokens create <name>`\n5. (optional) create a new github developer app and get credentials\n6. copy `.env.example` to `.env`\n7. fill out all enviorment variables (refer to the config file to see schema)\n8. `bun db:push`\n9. `bun dev`\n\n### To deploy to fly.io\n\n1. Install the [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/)\n\n2. Run `fly launch`\n\n3. Run `fly secrets set <NAME>=<VALUE>` (probably want to set `NODE_ENV` to `\"production\"`)\n\n5. Run `fly deploy`\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":1,"slug":"this-project-was-created-using-create-beth-app","text":"This project was created using create-beth-app"},{"depth":2,"slug":"to-open-an-issue-httpsgithubcomethanniserthe-beth-stack","text":"To open an issue: https://github.com/ethanniser/the-beth-stack"},{"depth":2,"slug":"to-discuss-httpsdiscordggz3yutmfkwa","text":"To discuss: https://discord.gg/Z3yUtMfkwa"},{"depth":3,"slug":"to-run-locally","text":"To run locally:"},{"depth":3,"slug":"to-deploy-to-flyio","text":"To deploy to fly.io"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, rawContent, url };
