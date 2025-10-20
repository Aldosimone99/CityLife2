
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: false,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 0,
    "route": "/login"
  },
  {
    "renderMode": 0,
    "route": "/register"
  },
  {
    "renderMode": 0,
    "route": "/dashboard"
  },
  {
    "renderMode": 0,
    "route": "/users"
  },
  {
    "renderMode": 0,
    "route": "/user/*"
  },
  {
    "renderMode": 0,
    "route": "/profile"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 676, hash: '340040876e9025b533a50c86cb3b78fee8e4752f0fd30544e81043bcfff2e82e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1216, hash: '1517fa80cd5337e9eeb78af29196b23f79e60e8c6557f08c0e0f13428349d2a0', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)}
  },
};
