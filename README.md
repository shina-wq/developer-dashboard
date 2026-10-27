# DevHub: Developer Dashboard

A lightweight dashboard of curated developer resources: docs, tools and learning sites. It is built to practise a modern front-end workflow with **npm**, **Vite**, **TypeScript**, **ESLint** and **Prettier**.

**Live demo:** [developer-dashboard-psi.vercel.app](https://developer-dashboard-psi.vercel.app/)

## Features

- Resource cards rendered from a data array with template literals
- Live search and category filters that work together
- Bookmarks saved in `localStorage`
- Light and dark theme that follows the system setting and remembers your choice
- Responsive layout with a mobile menu
- Pages: Home (dashboard), Resources (all resources), Bookmarks, plus placeholder pages for Tools and Learning Paths

## Tech Stack

| Tool                                                                             | Purpose                                            |
| -------------------------------------------------------------------------------- | -------------------------------------------------- |
| [Vite](https://vite.dev)                                                         | Dev server with hot reload, production bundling    |
| [TypeScript](https://www.typescriptlang.org)                                     | Typed data and DOM code                            |
| [Tailwind CSS](https://tailwindcss.com)                                          | Utility classes, generated only for classes in use |
| [ESLint](https://eslint.org) + [typescript-eslint](https://typescript-eslint.io) | Code quality rules                                 |
| [Prettier](https://prettier.io)                                                  | Consistent formatting                              |
| [Simple Icons](https://simpleicons.org)                                          | Brand logos                                        |

## Getting Started

Requires [Node.js](https://nodejs.org) 20.19+ or 22.13+ (needed by Vite 8 and ESLint 10).

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Scripts

| Command                     | What it does                                 |
| --------------------------- | -------------------------------------------- |
| `npm run dev` / `npm start` | Start the Vite dev server with hot reload    |
| `npm run build`             | Type-check with `tsc`, then build to `dist/` |
| `npm run preview`           | Serve the production build locally           |
| `npm run lint`              | Run ESLint on the project                    |
| `npm run format`            | Format all files with Prettier               |
| `npm run format:check`      | Check formatting without changing files      |

## Project Structure

```
├── index.html          # Page shell: sidebar, header, empty content area
├── vite.config.js      # Vite settings and Tailwind plugin
├── eslint.config.js    # ESLint rules
├── .prettierrc         # Prettier settings
├── .prettierignore     # Files Prettier skips
├── tsconfig.json       # TypeScript settings
└── src/
    ├── data.ts         # Resources and quick links
    ├── types.ts        # Shared TypeScript types
    ├── templates.ts    # HTML template-literal functions
    ├── main.ts         # State, rendering and event handling
    └── style.css       # Tailwind import, font, dark mode
```

## Tooling Setup

### Vite

[`vite.config.js`](vite.config.js) sets:

- `root: '.'`: the folder that contains `index.html`
- `base: './'`: relative asset paths, so `dist/` works from any folder
- `build.outDir: 'dist'`: the output folder, emptied before each build
- `plugins: [tailwindcss()]`: runs Tailwind as part of the build

### ESLint

[`eslint.config.js`](eslint.config.js) uses ESLint's flat config format (the default since ESLint 9; it replaces `.eslintrc.json`). It extends the recommended JavaScript and TypeScript rules and adds:

| Rule                                | Level | Catches                        |
| ----------------------------------- | ----- | ------------------------------ |
| `@typescript-eslint/no-unused-vars` | error | Variables that are never used  |
| `eqeqeq`                            | warn  | `==` instead of `===`          |
| `prefer-const`                      | error | `let` that is never reassigned |
| `no-var`                            | error | `var` declarations             |
| `curly`                             | error | `if` blocks without braces     |

`eslint-config-prettier` is added last so ESLint never fights Prettier over formatting.

### Prettier

[`.prettierrc`](.prettierrc) uses single quotes, semicolons, trailing commas and a print width of 100. `prettier-plugin-tailwindcss` sorts Tailwind classes in the HTML. [`.prettierignore`](.prettierignore) skips `dist`, `node_modules` and `package-lock.json`, and [`.gitattributes`](.gitattributes) keeps LF line endings so formatting checks also pass on Windows.

## Build Analysis

Output of `npm run build` (8 modules transformed in about 0.6 s):

| File                             | Size     | Gzip     |
| -------------------------------- | -------- | -------- |
| `dist/index.html`                | 6.45 kB  | 2.04 kB  |
| `dist/assets/index-BdDwpZyo.css` | 24.40 kB | 5.43 kB  |
| `dist/assets/index-B7FlibLv.js`  | 37.32 kB | 15.54 kB |

- **Bundling:** five source modules and the icon library become one JS file and one CSS file.
- **Minification:** whitespace and comments are removed and names are shortened, for example `filterResources` becomes a single letter.
- **Tree-shaking:** Simple Icons ships 3,467 icons in a 5.26 MB file. Only the 17 icons the app imports are included.
- **Tailwind:** the 433-byte `style.css` produces 24.4 kB of CSS with only the classes the app uses.
- **Caching:** content hashes in file names (`index-B7FlibLv.js`) let browsers cache files long term and still fetch new versions after changes.

|                                | Requests          | Downloaded                                |
| ------------------------------ | ----------------- | ----------------------------------------- |
| Dev server (`npm run dev`)     | 8 unbundled files | About 13 MB, mostly the full icon library |
| Production (`npm run preview`) | 3 files           | About 60 kB (23 kB gzipped)               |

## Decisions

- **Vanilla TypeScript, no framework:** the brief asks to render resources with template literals, which plain TypeScript does directly. It also keeps the build output small and easy to analyse.
- **TypeScript 6 instead of 7:** the Vite template installs TypeScript 7, the new Go-based compiler. It does not yet ship the JavaScript API that `typescript-eslint` needs, so the project pins TypeScript 6.
- **`eslint.config.js` instead of `.eslintrc.json`:** current ESLint versions only support the flat config format by default.

## Reflection

In development, Vite serves source files as native ES modules and only processes the file that changes, so the server starts instantly and hot reload shows edits without a full page refresh. For production, it bundles every module into one JavaScript file and one CSS file, minifies them and removes unused code, which is why only 17 of the 3,467 icons in Simple Icons reached the final bundle. Running Tailwind as a Vite plugin means the CSS contains only the classes the app actually uses. Content-hashed file names let browsers cache these files safely, while relative paths let the `dist/` folder run anywhere. As a result, the production page loads in 3 requests and about 23 kB gzipped instead of 8 unbundled requests and roughly 13 MB in development, and every task in the workflow is a single npm command.
