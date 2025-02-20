import type { AddressInfo } from 'net';
import type * as babel from '@babel/core';
import type * as vite from 'vite';
import { z } from 'zod';
import type { AstroConfigSchema } from '../core/config';
import type { AstroComponentFactory, Metadata } from '../runtime/server';
import type { ViteConfigWithSSR } from '../core/create-vite';
export type { SSRManifest } from '../core/app/types';

export interface AstroBuiltinProps {
	'client:load'?: boolean;
	'client:idle'?: boolean;
	'client:media'?: string;
	'client:visible'?: boolean;
}

export interface AstroComponentMetadata {
	displayName: string;
	hydrate?: 'load' | 'idle' | 'visible' | 'media' | 'only';
	hydrateArgs?: any;
	componentUrl?: string;
	componentExport?: { value: string; namespace?: boolean };
}

/** The flags supported by the Astro CLI */
export interface CLIFlags {
	projectRoot?: string;
	site?: string;
	sitemap?: boolean;
	host?: string | boolean;
	hostname?: string;
	port?: number;
	config?: string;
	/** @deprecated */
	experimentalStaticBuild?: boolean;
	experimentalSsr?: boolean;
	experimentalIntegrations?: boolean;
	legacyBuild?: boolean;
	drafts?: boolean;
}

export interface BuildConfig {
	client: URL;
	server: URL;
	serverEntry: string;
	staticMode: boolean | undefined;
}

/**
 * Astro.* available in all components
 * Docs: https://docs.astro.build/reference/api-reference/#astro-global
 */
export interface AstroGlobal extends AstroGlobalPartial {
	/** get the current canonical URL */
	canonicalURL: URL;
	/** get page params (dynamic pages only) */
	params: Params;
	/** set props for this astro component (along with default values) */
	props: Record<string, number | string | any>;
	/** get information about this page */
	request: Request;
	/** see if slots are used */
	slots: Record<string, true | undefined> & { has(slotName: string): boolean; render(slotName: string): Promise<string> };
}

export interface AstroGlobalPartial {
	/**
	 * @deprecated since version 0.24. See the {@link https://astro.build/deprecated/resolve upgrade guide} for more details.
	 */
	resolve: (path: string) => string;
	/** @deprecated Use `Astro.glob()` instead. */
	fetchContent(globStr: string): Promise<any[]>;
	glob(globStr: `${any}.astro`): Promise<ComponentInstance[]>;
	glob<T extends Record<string, any>>(globStr: `${any}.md`): Promise<MarkdownInstance<T>[]>;
	glob<T extends Record<string, any>>(globStr: string): Promise<T[]>;
	site: URL;
}

/**
 * Astro User Config
 * Docs: https://docs.astro.build/reference/configuration-reference/
 */
export interface AstroUserConfig {
	/**
	 * @docs
	 * @kind heading
	 * @name Top-Level Options
	 */

	/**
	 * @docs
	 * @name projectRoot
	 * @cli --project-root
	 * @type {string}
	 * @default `"."` (current working directory)
	 * @summary Set the project root. The project root is the directory where your Astro project (and all `src`, `public` and `package.json` files) live.
	 * @description  You should only provide this option if you run the `astro` CLI commands in a directory other than the project root directory. Usually, this option is provided via the CLI instead of the `astro.config.js` file, since Astro needs to know your project root before it can locate your config file.
	 *
	 * If you provide a relative path (ex: `--project-root: './my-project'`) Astro will resolve it against your current working directory.
	 *
	 * #### Examples
	 *
	 * ```js
	 * {
	 *   projectRoot: './my-project-directory'
	 * }
	 * ```
	 * ```bash
	 * $ astro build --project-root ./my-project-directory
	 * ```
	 */
	projectRoot?: string;

	/**
	 * @docs
	 * @name dist
	 * @type {string}
	 * @default `"./dist"`
	 * @description Set the directory that `astro build` writes your final build to.
	 *
	 * The value can be either an absolute file system path or a path relative to the project root.
	 *
	 * ```js
	 * {
	 *   dist: './my-custom-build-directory'
	 * }
	 * ```
	 */
	dist?: string;

	/**
	 * @docs
	 * @name public
	 * @type {string}
	 * @default `"./public"`
	 * @description
	 * Set the directory for your static assets. Files in this directory are served at `/` during dev and copied to your build directory during build. These files are always served or copied as-is, without transform or bundling.
	 *
	 * The value can be either an absolute file system path or a path relative to the project root.
	 *
	 * ```js
	 * {
	 *   public: './my-custom-public-directory'
	 * }
	 * ```
	 */
	public?: string;

	/**
	 * @docs
	 * @name integrations
	 * @type {AstroIntegration[]}
	 * @default `[]`
	 * @description
	 * Add Integrations to your project to extend Astro.
	 *
	 * Integrations are your one-stop shop to add new frameworks (like Solid.js), new features (like sitemaps), and new libraries (like Partytown and Turbolinks).
	 *
	 * Setting this configuration will disable Astro's default integration, so it is recommended to provide a renderer for every framework that you use:
	 *
	 * Note: Integrations are currently under active development, and only first-party integrations are supported. In the future, 3rd-party integrations will be allowed.
	 *
	 * ```js
	 * import react from '@astrojs/react';
	 * import vue from '@astrojs/vue';
	 * {
	 *   // Example: Use Astro with Vue + React, and no other frameworks.
	 *   integrations: [react(), vue()]
	 * }
	 * ```
	 */
	integrations?: Array<AstroIntegration | AstroIntegration[]>;

	/**
	 * @name adapter
	 * @type {AstroIntegration}
	 * @default `undefined`
	 * @description
	 * Add an adapter to build for SSR (server-side rendering). An adapter makes it easy to connect a deployed Astro app to a hosting provider or runtime environment.
	 */
	adapter?: AstroIntegration;

	/** @deprecated - Use "integrations" instead. Run Astro to learn more about migrating. */
	renderers?: string[];

	/**
	 * @docs
	 * @name markdownOptions
	 * @type {{render: MarkdownRenderOptions}}
	 * @see [Markdown guide](/en/guides/markdown-content/)
	 * @description
	 * Configure how markdown files (`.md`) are rendered.
	 *
	 * ```js
	 * import { defineConfig } from "astro/config";
	 * import astroRemark from "@astrojs/markdown-remark";
	 * import customRehypePlugin from "/path/to/rehypePlugin.mjs";
	 *
	 * export default defineConfig({
	 *   // Enable Custom Markdown options, plugins, etc.
	 *   markdownOptions: {
	 *     render: [
	 *       // The Remark parser to parse Markdown content
	 *       astroRemark,
	 *       {
	 *         // Add a Remark plugin to your project.
	 *         remarkPlugins: ["remark-code-titles"],
	 *
	 *         // Add a Rehype plugin to your project.
	 *         rehypePlugins: [
	 *           "rehype-slug",
	 *           [customRehypePlugin, { configKey: "value" }],
	 *           ["rehype-autolink-headings", { behavior: "prepend" }],
	 *         ],
	 *       },
	 *     ],
	 *   },
	 * });
	 * ```
	 */
	markdownOptions?: {
		render?: MarkdownRenderOptions;
	};

	/**
	 * @docs
	 * @kind heading
	 * @name Build Options
	 */
	buildOptions?: {
		/**
		 * @docs
		 * @name buildOptions.site
		 * @type {string}
		 * @description
		 * Your final, deployed URL. Astro uses this full URL to generate your sitemap and canonical URLs in your final build. It is strongly recommended that you set this configuration to get the most out of Astro.
		 *
		 * Astro will match the site pathname during development so that your development experience matches your build environment as closely as possible. In the example below, `astro dev` will start your server at `http://localhost:3000/docs`.
		 *
		 * ```js
		 * {
		 *   buildOptions: {
		 *     // Example: Tell Astro the final URL of your deployed website.
		 * 	   site: 'https://www.my-site.dev/docs'
		 *   }
		 * }
		 * ```
		 */
		site?: string;

		/**
		 * @docs
		 * @name buildOptions.sitemap
		 * @type {boolean}
		 * @default `true`
		 * @description
		 * Generate a sitemap for your build. Set to false to disable.
		 *
		 * Astro will automatically generate a sitemap including all generated pages on your site. If you need more control over your sitemap, consider generating it yourself using a [Non-HTML Page](/en/core-concepts/astro-pages/#non-html-pages).
		 *
		 * ```js
		 * {
		 *   buildOptions: {
		 *     // Example: Disable automatic sitemap generation
		 * 	   sitemap: false
		 *   }
		 * }
		 * ```
		 */
		sitemap?: boolean;

		/**
		 * @docs
		 * @name buildOptions.sitemapFilter
		 * @typeraw {(page: string) => boolean}
		 * @see buildOptions.sitemap
		 * @description
		 * By default, all pages are included in your generated sitemap.
		 * You can filter included pages by URL using `buildOptions.sitemapFilter`.
		 *
		 * The `page` function parameter is the full URL of your rendered page, including your `buildOptions.site` domain.
		 * Return `true` to include a page in your sitemap, and `false` to remove it.
		 *
		 * ```js
		 * {
		 *   buildOptions: {
		 * 	   sitemap: true
		 * 	   sitemapFilter: (page) => page !== 'http://example.com/secret-page')
		 *   }
		 * }
		 * ```
		 */
		sitemapFilter?: (page: string) => boolean;

		/**
		 * @docs
		 * @name buildOptions.pageUrlFormat
		 * @type {('file' | 'directory')}
		 * @default `'directory'`
		 * @description
		 * Control the output file format of each page.
		 *   - If 'file', Astro will generate an HTML file (ex: "/foo.html") for each page.
		 *   - If 'directory', Astro will generate a directory with a nested `index.html` file (ex: "/foo/index.html") for each page.
		 *
		 * ```js
		 * {
		 *   buildOptions: {
		 *     // Example: Generate `page.html` instead of `page/index.html` during build.
		 * 	   pageUrlFormat: 'file'
		 *   }
		 * }
		 * ```
		 */
		pageUrlFormat?: 'file' | 'directory';

		/**
		 * @docs
		 * @name buildOptions.drafts
		 * @type {boolean}
		 * @default `false`
		 * @description
		 * Control if markdown draft pages should be included in the build.
		 *
		 * A markdown page is considered a draft if it includes `draft: true` in its front matter. Draft pages are always included & visible during development (`astro dev`) but by default they will not be included in your final build.
		 *
		 * ```js
		 * {
		 *   buildOptions: {
		 *     // Example: Include all drafts in your final build
		 * 	   drafts: true,
		 *   }
		 * }
		 * ```
		 */
		drafts?: boolean;
		/**
		 * Enables "legacy build mode" for compatibility with older Astro versions.
		 * Default: false
		 */
		legacyBuild?: boolean;
		/**
		 * @deprecated
		 * Experimental: Enables "static build mode" for faster builds.
		 * Default: true
		 */
		experimentalStaticBuild?: boolean;
		/**
		 * Enable a build for SSR support.
		 * Default: false
		 */
		experimentalSsr?: boolean;
	};

	/**
	 * @docs
	 * @kind heading
	 * @name Dev Options
	 */
	devOptions?: {
		/**
		 * @docs
		 * @name devOptions.host
		 * @type {string | boolean}
		 * @default `false`
		 * @version 0.24.0
		 * @description
		 * Set which network IP addresses the dev server should listen on (i.e. 	non-localhost IPs).
		 * - `false` - do not expose on a network IP address
		 * - `true` - listen on all addresses, including LAN and public addresses
		 * - `[custom-address]` - expose on a network IP address at `[custom-address]`
		 */
		host?: string | boolean;

		/**
		 * @docs
		 * @name devOptions.hostname
		 * @type {string}
		 * @default `'localhost'`
		 * @deprecated Use `host` instead
		 * @description
		 * > **This option is deprecated.** Consider using `host` instead.
		 *
		 * Set which IP addresses the dev server should listen on. Set this to 0.0.0.0 to listen on all addresses, including LAN and public addresses.
		 */
		hostname?: string;

		/**
		 * @docs
		 * @name devOptions.port
		 * @type {number}
		 * @default `3000`
		 * @description
		 * Set which port the dev server should listen on.
		 *
		 * If the given port is already in use, Astro will automatically try the next available port.
		 */
		port?: number;

		/**
		 * @docs
		 * @name devOptions.trailingSlash
		 * @type {('always' | 'never' | 'ignore')}
		 * @default `'always'`
		 * @see buildOptions.pageUrlFormat
		 * @description
		 *
		 * Set the route matching behavior of the dev server. Choose from the following options:
		 *   - 'always' - Only match URLs that include a trailing slash (ex: "/foo/")
		 *   - 'never' - Never match URLs that include a trailing slash (ex: "/foo")
		 *   - 'ignore' - Match URLs regardless of whether a trailing "/" exists
		 *
		 * Use this configuration option if your production host has strict handling of how trailing slashes work or do not work.
		 *
		 * You can also set this if you prefer to be more strict yourself, so that URLs with or without trailing slashes won't work during development.
		 *
		 * ```js
		 * {
		 *   devOptions: {
		 *     // Example: Require a trailing slash during development
		 * 	   trailingSlash: 'always'
		 *   }
		 * }
		 * ```
		 */
		trailingSlash?: 'always' | 'never' | 'ignore';
	};

	/**
	 * Enable experimental support for 3rd-party integrations.
	 * Default: false
	 */
	experimentalIntegrations?: boolean;

	/**
	 * @docs
	 * @name vite
	 * @type {vite.UserConfig}
	 * @description
	 *
	 * Pass additional configuration options to Vite. Useful when Astro doesn't support some advanced configuration that you may need.
	 *
	 * View the full `vite` configuration object documentation on [vitejs.dev](https://vitejs.dev/config/).
	 *
	 * #### Examples
	 *
	 * ```js
	 * {
	 *   vite: {
	 * 	   ssr: {
	 *      // Example: Force a broken package to skip SSR processing, if needed
	 * 		external: ['broken-npm-package'],
	 *     }
	 *   }
	 * }
	 * ```
	 *
	 * ```js
	 * {
	 *   vite: {
	 *     // Example: Add custom vite plugins directly to your Astro project
	 * 	   plugins: [myPlugin()],
	 *   }
	 * }
	 * ```
	 */
	vite?: vite.UserConfig & { ssr?: vite.SSROptions };
}

// NOTE(fks): We choose to keep our hand-generated AstroUserConfig interface so that
// we can add JSDoc-style documentation and link to the definition file in our repo.
// However, Zod comes with the ability to auto-generate AstroConfig from the schema
// above. If we ever get to the point where we no longer need the dedicated
// @types/config.ts file, consider replacing it with the following lines:
//
// export interface AstroUserConfig extends z.input<typeof AstroConfigSchema> {
// }

/**
 * IDs for different stages of JS script injection:
 * - "before-hydration": Imported client-side, before the hydration script runs. Processed & resolved by Vite.
 * - "head-inline": Injected into a script tag in the `<head>` of every page. Not processed or resolved by Vite.
 * - "page": Injected into the JavaScript bundle of every page. Processed & resolved by Vite.
 * - "page-ssr": Injected into the frontmatter of every Astro page. Processed & resolved by Vite.
 */
export type InjectedScriptStage = 'before-hydration' | 'head-inline' | 'page' | 'page-ssr';

/**
 * Resolved Astro Config
 * Config with user settings along with all defaults filled in.
 */
export interface AstroConfig extends z.output<typeof AstroConfigSchema> {
	// Public:
	// This is a more detailed type than zod validation gives us.
	// TypeScript still confirms zod validation matches this type.
	integrations: AstroIntegration[];
	adapter?: AstroIntegration;
	// Private:
	// We have a need to pass context based on configured state,
	// that is different from the user-exposed configuration.
	// TODO: Create an AstroConfig class to manage this, long-term.
	_ctx: {
		adapter: AstroAdapter | undefined;
		renderers: AstroRenderer[];
		scripts: { stage: InjectedScriptStage; content: string }[];
	};
}

export type AsyncRendererComponentFn<U> = (Component: any, props: any, children: string | undefined, metadata?: AstroComponentMetadata) => Promise<U>;

/** Generic interface for a component (Astro, Svelte, React, etc.) */
export interface ComponentInstance {
	$$metadata: Metadata;
	default: AstroComponentFactory;
	css?: string[];
	getStaticPaths?: (options: GetStaticPathsOptions) => GetStaticPathsResult;
}

export interface MarkdownInstance<T extends Record<string, any>> {
	frontmatter: T;
	file: string;
	url: string | undefined;
	Content: AstroComponentFactory;
	getHeaders(): Promise<{ depth: number; slug: string; text: string }[]>;
}

export type GetHydrateCallback = () => Promise<(element: Element, innerHTML: string | null) => void>;

/**
 * getStaticPaths() options
 * Docs: https://docs.astro.build/reference/api-reference/#getstaticpaths
 */ export interface GetStaticPathsOptions {
	paginate?: PaginateFunction;
	rss?: (...args: any[]) => any;
}

export type GetStaticPathsItem = { params: Params; props?: Props };
export type GetStaticPathsResult = GetStaticPathsItem[];
export type GetStaticPathsResultKeyed = GetStaticPathsResult & {
	keyed: Map<string, GetStaticPathsItem>;
};

export interface HydrateOptions {
	name: string;
	value?: string;
}

export interface JSXTransformConfig {
	/** Babel presets */
	presets?: babel.PluginItem[];
	/** Babel plugins */
	plugins?: babel.PluginItem[];
}

export type JSXTransformFn = (options: { mode: string; ssr: boolean }) => Promise<JSXTransformConfig>;

export interface ManifestData {
	routes: RouteData[];
}

export type MarkdownRenderOptions = [string | MarkdownParser, Record<string, any>];
export type MarkdownParser = (contents: string, options?: Record<string, any>) => MarkdownParserResponse | PromiseLike<MarkdownParserResponse>;

export interface MarkdownParserResponse {
	frontmatter: {
		[key: string]: any;
	};
	metadata: {
		headers: any[];
		source: string;
		html: string;
	};
	code: string;
}

/**
 * paginate() Options
 * Docs: https://docs.astro.build/guides/pagination/#calling-the-paginate-function
 */
export interface PaginateOptions {
	/** the number of items per-page (default: `10`) */
	pageSize?: number;
	/** key: value object of page params (ex: `{ tag: 'javascript' }`) */
	params?: Params;
	/** object of props to forward to `page` result */
	props?: Props;
}

/**
 * Page Prop
 * Docs: https://docs.astro.build/guides/pagination/#using-the-page-prop
 */
export interface Page<T = any> {
	/** result */
	data: T[];
	/** metadata */
	/** the count of the first item on the page, starting from 0 */
	start: number;
	/** the count of the last item on the page, starting from 0 */
	end: number;
	/** total number of results */
	total: number;
	/** the current page number, starting from 1 */
	currentPage: number;
	/** number of items per page (default: 25) */
	size: number;
	/** number of last page */
	lastPage: number;
	url: {
		/** url of the current page */
		current: string;
		/** url of the previous page (if there is one) */
		prev: string | undefined;
		/** url of the next page (if there is one) */
		next: string | undefined;
	};
}

export type PaginateFunction = (data: [], args?: PaginateOptions) => GetStaticPathsResult;

export type Params = Record<string, string | undefined>;

export type Props = Record<string, unknown>;

type Body = string;

export interface AstroAdapter {
	name: string;
	serverEntrypoint?: string;
	exports?: string[];
	args?: any;
}

export interface EndpointOutput<Output extends Body = Body> {
	body: Output;
}

export interface EndpointHandler {
	[method: string]: (params: any, request: Request) => EndpointOutput | Response;
}

export interface AstroRenderer {
	/** Name of the renderer. */
	name: string;
	/** Import entrypoint for the client/browser renderer. */
	clientEntrypoint?: string;
	/** Import entrypoint for the server/build/ssr renderer. */
	serverEntrypoint: string;
	/** JSX identifier (e.g. 'react' or 'solid-js') */
	jsxImportSource?: string;
	/** Babel transform options */
	jsxTransformOptions?: JSXTransformFn;
}

export interface SSRLoadedRenderer extends AstroRenderer {
	ssr: {
		check: AsyncRendererComponentFn<boolean>;
		renderToStaticMarkup: AsyncRendererComponentFn<{
			html: string;
		}>;
	};
}

export interface AstroIntegration {
	/** The name of the integration. */
	name: string;
	/** The different hooks available to extend. */
	hooks: {
		'astro:config:setup'?: (options: {
			config: AstroConfig;
			command: 'dev' | 'build';
			updateConfig: (newConfig: Record<string, any>) => void;
			addRenderer: (renderer: AstroRenderer) => void;
			injectScript: (stage: InjectedScriptStage, content: string) => void;
			// TODO: Add support for `injectElement()` for full HTML element injection, not just scripts.
			// This may require some refactoring of `scripts`, `styles`, and `links` into something
			// more generalized. Consider the SSR use-case as well.
			// injectElement: (stage: vite.HtmlTagDescriptor, element: string) => void;
		}) => void;
		'astro:config:done'?: (options: { config: AstroConfig; setAdapter: (adapter: AstroAdapter) => void }) => void | Promise<void>;
		'astro:server:setup'?: (options: { server: vite.ViteDevServer }) => void | Promise<void>;
		'astro:server:start'?: (options: { address: AddressInfo }) => void | Promise<void>;
		'astro:server:done'?: () => void | Promise<void>;
		'astro:build:start'?: (options: { buildConfig: BuildConfig }) => void | Promise<void>;
		'astro:build:setup'?: (options: { vite: ViteConfigWithSSR; target: 'client' | 'server' }) => void;
		'astro:build:done'?: (options: { pages: { pathname: string }[]; dir: URL; routes: RouteData[] }) => void | Promise<void>;
	};
}

export type RouteType = 'page' | 'endpoint';

export interface RouteData {
	component: string;
	generate: (data?: any) => string;
	params: string[];
	pathname?: string;
	pattern: RegExp;
	type: RouteType;
}

export type SerializedRouteData = Omit<RouteData, 'generate' | 'pattern'> & {
	generate: undefined;
	pattern: string;
};

export type RuntimeMode = 'development' | 'production';

/**
 * RSS
 * Docs: https://docs.astro.build/reference/api-reference/#rss
 */
export interface RSS {
	/** (required) Title of the RSS Feed */
	title: string;
	/** (required) Description of the RSS Feed */
	description: string;
	/** Specify arbitrary metadata on opening <xml> tag */
	xmlns?: Record<string, string>;
	/**
	 * If false (default), does not include XSL stylesheet.
	 * If true, automatically includes 'pretty-feed-v3'.
	 * If a string value, specifies a local custom XSL stylesheet, for example '/custom-feed.xsl'.
	 */
	stylesheet?: string | boolean;
	/** Specify custom data in opening of file */
	customData?: string;
	/**
	 * Specify where the RSS xml file should be written.
	 * Relative to final build directory. Example: '/foo/bar.xml'
	 * Defaults to '/rss.xml'.
	 */
	dest?: string;
	/** Return data about each item */
	items: {
		/** (required) Title of item */
		title: string;
		/** (required) Link to item */
		link: string;
		/** Publication date of item */
		pubDate?: Date;
		/** Item description */
		description?: string;
		/** Append some other XML-valid data to this item */
		customData?: string;
	}[];
}

export type RSSFunction = (args: RSS) => RSSResult;

export type FeedResult = { url: string; content?: string };
export type RSSResult = { xml: FeedResult; xsl?: FeedResult };

export type SSRError = Error & vite.ErrorPayload['err'];

export interface SSRElement {
	props: Record<string, any>;
	children: string;
}

export interface SSRMetadata {
	renderers: SSRLoadedRenderer[];
	pathname: string;
	legacyBuild: boolean;
}

export interface SSRResult {
	styles: Set<SSRElement>;
	scripts: Set<SSRElement>;
	links: Set<SSRElement>;
	createAstro(Astro: AstroGlobalPartial, props: Record<string, any>, slots: Record<string, any> | null): AstroGlobal;
	resolve: (s: string) => Promise<string>;
	_metadata: SSRMetadata;
}
