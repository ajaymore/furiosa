import React from 'react';
import {
  ServerStyleSheets,
  ThemeProvider,
  Typography
} from '@material-ui/core';
import ReactDOMServer from 'react-dom/server';
import theme from '../../../lib/theme';

const handler = async (req, res) => {
  const sheets = new ServerStyleSheets();
  const html = ReactDOMServer.renderToString(
    sheets.collect(
      <ThemeProvider theme={theme}>
        <div
          className="page portrait"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Typography variant="h1">Furiosa</Typography>
        </div>
      </ThemeProvider>
    )
  );
  const css = sheets.toString();
  const finalHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Pdf</title>
        <style id="jss-server-side">${css}</style>
        <style>
          body {
            margin: 0px;
            padding: 0px;
            box-sizing: border-box;
          }
          .page {
              position: relative;
              overflow: hidden;
              padding: 0.8in;
              page-break-after: always;
          }
          .page.landscape {
              width: 11.7in;
              height: 8.2in;
          }
          .page.portrait {
              width: 8.3in;
              height: 11.6in;
          }
        </style>
      </head>
      <body>
        <div id="root">${html}</div>
      </body>
    </html>
  `;
  try {
    const browser = await req.puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    // page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    await page.addStyleTag({
      url:
        'https://fonts.googleapis.com/css?family=Noto+Sans&display=swap&subset=devanagari'
    });
    await page.setContent(finalHTML);
    const pdf = await page.pdf({
      path: 'resume.pdf',
      pageRanges: '1',
      // landscape: true,
      format: 'A4',
      printBackground: true
      // margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });
    await browser.close();
    res.setHeader('Content-disposition', `attachment; filename="demo.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    res.end(pdf);
  } catch (err) {
    res.status(400).end();
  }
};
export default handler;
