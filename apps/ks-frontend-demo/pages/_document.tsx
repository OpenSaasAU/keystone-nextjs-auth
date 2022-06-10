import React from 'react';
import Document, { Html, Head, NextScript, Main } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const sheet = new ServerStyleSheet();
    const page = ctx.renderPage(
      (App: any) => (props: any) => sheet.collectStyles(<App {...props} />)
    );
    const styleTags = sheet.getStyleElement();
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, ...page, styleTags };
  }

  render() {
    return (
      <Html lang="en-AU">
        <link rel="icon" href="/static/favicon.ico" />
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
