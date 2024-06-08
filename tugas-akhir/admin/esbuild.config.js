#!/usr/bin/env node

const { build } = require("esbuild");
const path = require("path");

build({
   entryPoints: ["src/App.jsx"],
   allowOverwrite: true,
   bundle: true,
   format: "esm", // Output format: ES modules
   minify: true,
   sourcemap: "external",
   alias: {
      "~": "./src",
   },
   jsxSideEffects: true,
   splitting: true,
   outdir: "../../cdn/bundle/tugas-akhir/admin",
   loader: {
      ".js": "jsx",
      ".png": "copy",
      ".jpg": "copy",
      ".ttf": "copy",
      ".woff": "copy",
      ".woff2": "copy",
      ".eot": "copy",
      ".svg": "copy",
   },
   plugins: [
      {
         name: "resolve-babel",
         setup(build) {
            // Resolve .babelrc and .babelrc.js files
            build.onResolve({ filter: /\.babelrc(\.js)?$/ }, (args) => ({
               path: path.resolve(args.resolveDir, args.path),
               namespace: "file",
            }));
            // Handle .babelrc files
            build.onLoad({ filter: /\.babelrc$/, namespace: "file" }, async (args) => ({
               contents: `export default ${JSON.stringify(require(args.path))}`,
               loader: "json",
            }));
            // Handle .babelrc.js files
            build.onLoad({ filter: /\.babelrc\.js$/, namespace: "file" }, async (args) => ({
               contents: await require("fs").promises.readFile(args.path, "utf8"),
               loader: "js",
            }));
         },
      },
   ],
}).catch(() => process.exit(1));
