import { unstable_vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import { createRoutesFromFolders } from '@remix-run/v1-route-convention'
import { installGlobals } from '@remix-run/node'
import tsconfigPaths from 'vite-tsconfig-paths'
import mdx from '@mdx-js/rollup'

import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkDirective from 'remark-directive'

import rehypeHighlightCode from './scripts/mdx/rehype-highlight-code'
import rehypeMetaAttribute from './scripts/mdx/rehype-meta-attribute'
import parseCallouts from './scripts/mdx/remark-plugin-parser'

installGlobals()

export default defineConfig({
  noExternal: [
    '@mdx-js/rollup',
    'hast-util-to-string',
    'refractor',
    'rehype-autolink-headings',
    'rehype-parse',
  ],
  plugins: [
    remix({
      ignoredRouteFiles: ['**/.*', '**/concepts/index.mdx', '**/api/index.mdx'],
      async routes(defineRoutes) {
        // uses the v1 convention, works in v1.15+ and v2
        return createRoutesFromFolders(defineRoutes)
      },
    }),
    tsconfigPaths(),
    mdx({
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        rehypeHighlightCode,
        rehypeMetaAttribute,
      ],
      remarkPlugins: [remarkDirective, parseCallouts],
    }),
  ],
})