const id = "start_here/getting_started.md";
						const collection = "docs";
						const slug = "start_here/getting_started";
						const body = "\n# This project was created using `create-beth-app`\n## To open an issue: https://github.com/ethanniser/the-beth-stack\n## To discuss: https://discord.gg/Z3yUtMfkwa\n\n### To run locally:\n\n1. `bun install`\n2. create a new turso database with `turso db create <name>`\n3. get the database url with `turso db show --url <name>`\n4. get the auth token with `turso db tokens create <name>`\n5. (optional) create a new github developer app and get credentials\n6. copy `.env.example` to `.env`\n7. fill out all enviorment variables (refer to the config file to see schema)\n8. `bun db:push`\n9. `bun dev`\n\n### To deploy to fly.io\n\n1. Install the [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/)\n\n2. Run `fly launch`\n\n3. Run `fly secrets set <NAME>=<VALUE>` (probably want to set `NODE_ENV` to `\"production\"`)\n\n5. Run `fly deploy`\n";
						const data = {title:"Getting Started",description:"This is the getting started page for the BETH Stack",editUrl:true,head:[],template:"doc",sidebar:{hidden:false,attrs:{}},pagefind:true};
						const _internal = {
							type: 'content',
							filePath: "/Users/jonathanforrider/Documents/Programming/beth-stack-docs/src/content/docs/start_here/getting_started.md",
							rawData: "\ntitle: Getting Started \ndescription: This is the getting started page for the BETH Stack",
						};

export { _internal, body, collection, data, id, slug };
