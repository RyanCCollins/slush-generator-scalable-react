/* eslint-disable */
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { ApolloProvider } from 'react-apollo';
import { getDataFromTree } from 'react-apollo/server';
import { createNetworkInterface } from 'apollo-client';
import store from '../app/src/store.js';
import { routes } from '../app/src/routes.js';
import { GRAPHQL_URL } from '../app/src/config';
import Html from './utils/Html';
import createApolloClient from './utils/create-apollo-client';
import manifest from './public/manifest.json';
import styleSheet from 'styled-components/lib/models/StyleSheet';

const app = express();
const isDeveloping = process.env.NODE_ENV !== 'production';

// Need to set this to your api url
const IP = process.env.IP || '0.0.0.0';
const PORT = process.env.PORT || 1337;

app.use(morgan('combined'));
app.use(express.static(__dirname + '/public'));

app.use((req, res) => {
  match({ routes, location: req.url },
    (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        res.redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (error) {
        console.error('ROUTER ERROR:', error); // eslint-disable-line no-console
        res.status(500);
      } else if (renderProps) {
        const styles = styleSheet.rules().map(rule => rule.cssText).join('\n');
        const client = createApolloClient({
          ssrMode: true,
          networkInterface: createNetworkInterface({
            uri: GRAPHQL_URL,
            credentials: 'same-origin',
            headers: req.headers,
          }),
        });

        const component = (
          <ApolloProvider client={client} store={store}>
            <RouterContext {...renderProps} />
          </ApolloProvider>
        );
        getDataFromTree(component).then((ctx) => {
          const content = renderToString(component);
          const html = (
            <Html
              content={content}
              scriptHash={manifest["/main.js"]}
              vendorHash={manifest["/vendor.js"]}
              cssHash={manifest["/main.css"]}
              styles={styles}
              state={ctx.store.getState()}
            />
          );
          const html = renderToStaticMarkup(html);
          const blob = '<!doctype html>\n' + html;
          res.status(200).send(blob);
        }).catch(e => console.error('RENDERING ERROR:', e)); // eslint-disable-line no-console
      } else {
        res.status(404).send('Not found');
      }
    })
});

app.listen(PORT, IP, (err) => {
  if (err) {
    return console.warn(err);
  }
  return console.info('==> 😎 Listening on port' + PORT + '.  Open http://0.0.0.0:' + PORT + '/ in your browser.');
});
/* eslint-enable */
