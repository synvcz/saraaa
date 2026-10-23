# SARA HIMEJI

A responsive, frontend-only six-scene character study devoted to Sara Himeji (姫路 紗良). The visual language is editorial and cinematic: oversized Instrument Serif and DM Sans typography, restrained DM Mono labels, near-black/ivory/lavender/graphite, a subtle CSS grain, and quiet scroll-triggered transitions. The scenes move from introduction, to verified context, to interpretation, detail, a locally editable creator-perspective passage, and a final frame.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

From the project directory:

```sh
npm install
npm run dev
```

Open the local Vite address printed in the terminal. The defaults are port `5173` and root path `/`; set `PORT` or `BASE_PATH` only when a different value is needed.

## Production build

```sh
npm run typecheck
npm run build
npm run serve
```

The production bundle is written to `dist/public`.

## GitHub Pages under a repository path

The eventual repository name is intentionally not assumed. For a project site hosted at `https://<account>.github.io/<repository>/`, build with the repository’s actual path as `BASE_PATH`, including both slashes:

```sh
BASE_PATH="/<repository>/" npm run build
```

Replace `<repository>` with the real repository name once known. `BASE_PATH` is passed through to Vite’s `base` option, including assets and links. For a custom domain or a user/organization site hosted at the domain root, use `BASE_PATH=/` or omit it.

In a GitHub Actions deployment, set the build environment variable `BASE_PATH` to `/<repository>/`, run the production build, and publish the generated `dist/public` directory to GitHub Pages. Do not commit a guessed repository path into the source.

## Editing the provisional passage

Scene 05 contains explicitly provisional creator-perspective copy. It is editable directly in the page and stored in that browser’s local storage. The supplied text is not presented as an account of the site creator’s confirmed feelings.

## Content and visual assets

The factual profile and episode information are attributed to the linked official sources in the final scene; interpretive comments are explicitly labeled and the director’s view is attributed to the production interview. All visual compositions are typographic and CSS-only. No artwork is embedded: the official profile image was not used because permission and visual integrity could not be confirmed. There are no generated images, fan art, or image placeholders.

## Checks

```sh
npm run typecheck
PORT=4173 BASE_PATH=/ npm run build
```
