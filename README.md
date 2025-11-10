# fews-ssd-requests

FEWS Schematic Status Display library

## Development

This repository contains the code for the packages:

1. [fews-ssd-requests](packages/fews-ssd-requests)
2. [fews-ssd-webcomponent](packages/fews-ssd-webcomponent)
3. [angular-example](packages/angular-example)

The packages are managed using [lerna](https://lerna.js.org/). Dependencies are managed using npm workspaces

Install all packages, installing all their dependencies and linking any cross-dependencies

```
npm install
```

Run commands with (e.g. build)

```
npx lenra run build
```

After merging some commits to main you can create a new release with

```
npx lerna version (major|minor|patch)
```

> [!warning]
> Immediately pushes the created commit and tag
