import { G as t, H as o, aa as e } from "./chunk-2J7DHOVR.mjs";
import "./chunk-ELYU6EKT.mjs";
var r = () =>
    t("div", {
      className: "__framer-not-found-page",
      style: {
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-background)",
        fontSize: 15,
      },
      children: o("main", {
        style: {
          display: "flex",
          width: "100%",
          maxWidth: 555,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 20px",
          fontFamily: '"GT Walsheim", sans-serif',
          fontWeight: 400,
        },
        children: [
          t("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "30",
            height: "30",
            style: { marginBottom: 30, color: "var(--color-title)" },
            children: t("path", {
              d: "M 6 2 L 24 2 L 24 11 L 15 11 Z M 6 11 L 15 11 L 24 20 L 15 20 L 15 29 L 6 20 Z",
              fill: "currentColor",
            }),
          }),
          t("h1", {
            style: {
              margin: "0 0 15px 0",
              color: "var(--color-title)",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: -0.4,
              lineHeight: 1.3,
              textAlign: "center",
            },
            children: "Page Not Found",
          }),
          o("div", {
            style: {
              marginBottom: 30,
              color: "var(--color-description)",
              lineHeight: 1.5,
              textAlign: "center",
            },
            children: [
              "The page you are looking for does not exist.",
              t("br", {}),
              "Sign up for Framer to publish your own website.",
            ],
          }),
          t("a", {
            href: "https://login.framer.com/sign-up/?ref=site-404&redirect=https%3A%2F%2Fframer.com%2F",
            role: "button",
            style: {
              padding: "12px 24px",
              backgroundColor: "#09f",
              borderRadius: 10,
              color: "#fff",
              fontWeight: 500,
              lineHeight: 1.2,
              textDecoration: "none",
            },
            children: "Sign Up for Free",
          }),
        ],
      }),
    }),
  f = [
    `@font-face {
        font-display: swap;
        font-family: GT Walsheim;
        font-weight: 400;
        src: url(https://www.framer.com/fonts/GT-Walsheim/GT-Walsheim-Regular-subset.woff2) format("woff2"), url(https://www.framer.com/fonts/GT-Walsheim/GT-Walsheim-Regular-subset.woff) format("woff")
    }`,
    `@font-face {
        font-display: swap;
        font-family: GT Walsheim;
        font-weight: 500;
        src: url(https://www.framer.com/fonts/GT-Walsheim/GT-Walsheim-Medium-subset.woff2) format("woff2"), url(https://www.framer.com/fonts/GT-Walsheim/GT-Walsheim-Medium-subset.woff) format("woff")
    }`,
    `@font-face {
        font-display: swap;
        font-family: GT Walsheim;
        font-weight: 700;
        src: url(https://www.framer.com/fonts/GT-Walsheim/GT-Walsheim-Bold-subset.woff2) format("woff2"), url(https://www.framer.com/fonts/GT-Walsheim/GT-Walsheim-Bold-subset.woff) format("woff")
    }`,
    `.__framer-not-found-page {
        --color-background: #ffffff;
        --color-title: #333333;
        --color-description: #777777;
    }`,
    `@media (prefers-color-scheme: dark) {
        .__framer-not-found-page {
            --color-background: #1b1b1b;
            --color-title: #ffffff;
            --color-description: #cccccc;
        }
    }`,
  ],
  a = e(r, f),
  c = a,
  h = {
    exports: {
      default: {
        type: "reactComponent",
        name: "component",
        slots: [],
        annotations: { framerContractVersion: "1" },
      },
      __FramerMetadata__: { type: "variable" },
    },
  };
export { h as __FramerMetadata__, c as default };
//# sourceMappingURL=__framer-not-found-page.AMAAYJY2.mjs.map
