import { unstable_vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import path from 'node:path'
import { createRoutesFromFolders } from '@remix-run/v1-route-convention'
import { installGlobals } from '@remix-run/node'
import tsconfigPaths from 'vite-tsconfig-paths'
import mdx from '@mdx-js/rollup'

import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkDirective from 'remark-directive'

import rehypeHighlightCode from './scripts/mdx/rehype-highlight-code'
import rehypeMetaAttribute from './scripts/mdx/rehype-meta-attribute'
import parseCallouts from './scripts/mdx/remark-plugin-parser'

installGlobals()

export default defineConfig({
  optimizeDeps: {
    include: ['react/jsx-runtime'],
    exclude: ['@react-spring/rafz', '@react-spring/web'],
  },
  resolve: {
    alias: {
      '@react-spring/rafz': path.resolve(__dirname, '../packages/rafz/src'),
      '@react-spring/web': path.resolve(__dirname, '../targets/web/src'),
    },
  },
  plugins: [
    remix({
      ignoredRouteFiles: ['**/.*', '**/concepts/index.mdx', '**/api/index.mdx'],
      async routes(defineRoutes) {
        // uses the v1 convention, works in v1.15+ and v2
        return createRoutesFromFolders(defineRoutes)
      },
    }),
    tsconfigPaths(),
    // @ts-expect-error – TODO: fix mdx plugin failing with Vite types.
    mdx({
      providerImportSource: '@mdx-js/react',
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        rehypeHighlightCode,
        rehypeMetaAttribute,
      ],
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
        remarkDirective,
        parseCallouts,
      ],
    }),
  ],
})
