import {
  I as y,
  J as m,
  K as u,
  L as g,
  N as _,
  R as F,
  T as v,
  W as E,
  f as o,
  fa as b,
  i as R,
} from "./chunk-2J7DHOVR.mjs";
import { c as t } from "./chunk-ELYU6EKT.mjs";
var x = "default" in m ? y : m,
  s = {},
  k = x;
s.createRoot = k.createRoot;
s.hydrateRoot = k.hydrateRoot;
var I = s.createRoot,
  P = s.hydrateRoot;
t.__framer_importFromPackage = (e, c) => () =>
  o(F, {
    error: 'Package component not supported: "' + c + '" in "' + e + '"',
  });
t.process = {
  ...t.process,
  env: { ...(t.process ? t.process.env : void 0), NODE_ENV: "production" },
};
v();
t.__framer_events = t.__framer_events || [];
function N() {
  t.__framer_events.push(arguments);
}
(async () => {
  let e = {
      augiA20Il: {
        elements: { tibSykubQ: "buyderp" },
        page: u(() =>
          import("./Bz1-fSElsdW1eHUT1z7oOpdMNHA-lXF5qQLPyd0WaSE.NT6TRRXN.mjs")
        ),
        path: "/",
      },
    },
    c = {},
    p = [{ code: "en-US", id: "default", name: "English", slug: "" }],
    D = u(() => import("./__framer-not-found-page.AMAAYJY2.mjs")),
    n = document.getElementById("main"),
    r,
    d,
    i,
    l = !1;
  if ("framerHydrateV2" in n.dataset) {
    let a = JSON.parse(n.dataset.framerHydrateV2);
    (r = a.routeId), (d = a.localeId), (i = a.pathVariables), (l = !0);
  } else {
    let a = _(e, decodeURIComponent(location.pathname), !0, p);
    (r = a.routeId), (d = a.localeId), (i = a.pathVariables);
  }
  let f = await e[r].page.preload();
  e[r].page = f;
  let S = o(b, {
      RootComponent: f,
      isWebsite: !0,
      routeId: r,
      pathVariables: i,
      routes: e,
      collectionUtils: c,
      notFoundPage: D,
      isReducedMotion: void 0,
      localeId: d,
      locales: p,
      preserveQueryParams: void 0,
      enableSuspenseThatPreservesDom: !0,
      shouldMarkHydrationEnd: l,
    }),
    V = o(E, { children: S, value: { imgSizesWorkaroundEnabled: !1 } }),
    h = o(g, { children: V, value: { routes: {} } });
  l
    ? R(() => {
        performance.mark("framer-hydration-start"), P(n, h);
      })
    : I(n).render(h);
})().catch((e) => {
  throw (
    (N("published_site_load_error", {
      message: String(e),
      stack: e instanceof Error && typeof e.stack == "string" ? e.stack : null,
    }),
    e)
  );
});
//# sourceMappingURL=default_script0.SIF7NHAT.mjs.map
