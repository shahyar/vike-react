import type { Config, ConfigEffect } from 'vite-plugin-ssr/types'

// Depending on the value of `config.meta.ssr`, set other config options' `env`
// accordingly.
// See https://vite-plugin-ssr.com/meta#modify-existing-configurations
const toggleSsrRelatedConfig: ConfigEffect = ({ configDefinedAt, configValue }) => {
  if (typeof configValue !== 'boolean') {
    throw new Error(`${configDefinedAt} should be a boolean`)
  }

  return {
    meta: {
      // When the SSR flag is false, we want to render the page only in the
      // browser. We achieve this by then making the `Page` implementation
      // accessible only in the client's renderer.
      Page: {
        env: configValue
          ? 'server-and-client' // default
          : 'client-only'
      }
    }
  }
}

export default {
  onRenderHtml: 'import:vike-react/renderer/onRenderHtml',
  onRenderClient: 'import:vike-react/renderer/onRenderClient',
  passToClient: ['pageProps', 'title'],
  clientRouting: true,
  hydrationCanBeAborted: true,
  meta: {
    Head: {
      env: 'server-only'
    },
    Layout: {
      env: 'server-and-client'
    },
    title: {
      env: 'server-and-client'
    },
    description: {
      env: 'server-only'
    },
    favicon: {
      env: 'server-only'
    },
    lang: {
      env: 'server-only'
    },
    ssr: {
      env: 'config-only',
      effect: toggleSsrRelatedConfig
    }
  }
} satisfies Config

// We purposely define the ConfigVikeReact interface in this file: that way we ensure it's always applied whenever the user `import vikeReact from 'vike-react'`
import type { Component } from './types'
declare module 'vite-plugin-ssr/types' {
  export interface ConfigVikeReact {
    /** React element rendered and appended into &lt;head>&lt;/head> */
    Head?: Component
    /** A component, usually common to several pages, that wraps the root component `Page` */
    Layout?: Component
    /** &lt;title>${title}&lt;/title> */
    title?: string
    /** &lt;meta name="description" content="${description}" /> */
    description?: string
    /** &lt;link rel="icon" href="${favicon}" /> */
    favicon?: string
    /** &lt;html lang="${lang}">
     *
     *  @default 'en'
     *
     */
    lang?: string
    /**
     * If true, render mode is SSR or pre-rendering (aka SSG). In other words, the
     * page's HTML will be rendered at build-time or request-time.
     * If false, render mode is SPA. In other words, the page will only be
     * rendered in the browser.
     *
     * See https://vite-plugin-ssr.com/render-modes
     *
     * @default true
     *
     */
    ssr?: boolean
  }
}
