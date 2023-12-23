const id = "index.mdx";
						const collection = "docs";
						const slug = "index";
						const body = "\nimport { Card, CardGrid } from '@astrojs/starlight/components';\n\n## BETH (Bun, ElysiaJS, Turso, HTMX)\n\n<CardGrid>\n\t<Card title=\"BUN\" icon=\"pencil\">\n\t\t[Learn more about Bun](https://bun.sh).\n\t</Card>\n\t<Card title=\"ELYSIAJS\" icon=\"add-document\">\n\t\t[Learn more about ElysiaJS](https://elysiajs.com).\n\t</Card>\n\t<Card title=\"TURSO\" icon=\"setting\">\n\t\t[Learn more about Turso](https://turso.tech).\n\t</Card>\n\t<Card title=\"HTMX\" icon=\"open-book\">\n\t\t[Learn more about HTMX](https://htmx.org).\n\t</Card>\n</CardGrid>\n";
						const data = {title:"Welcome to BETH",description:"Get started building your site with The BETH.",editUrl:true,head:[],template:"splash",hero:{tagline:"Let's get started on a new BETH (Bun, ElysiaJS, Turso, HTMX) project!",image:{alt:"",file:
						new Proxy({"src":"/_astro/Beth.eJBgLQAf.webp","width":480,"height":360,"format":"webp"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							
							return target[name];
						}
					})
					},actions:[{text:"Getting Started",link:"/start_here/getting_started/",variant:"primary",icon:{type:"icon",name:"right-arrow"}}]},sidebar:{hidden:false,attrs:{}},pagefind:true};
						const _internal = {
							type: 'content',
							filePath: "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/src/content/docs/index.mdx",
							rawData: "\ntitle: Welcome to BETH\ndescription: Get started building your site with The BETH.\ntemplate: splash\nhero:\n  tagline: Let's get started on a new BETH (Bun, ElysiaJS, Turso, HTMX) project!\n  image:\n    file: ../../assets/Beth.webp\n  actions:\n    - text: Getting Started\n      link: /start_here/getting_started/\n      icon: right-arrow\n      variant: primary",
						};

export { _internal, body, collection, data, id, slug };
