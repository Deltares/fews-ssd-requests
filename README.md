# fews-ssd-requests

FEWS Schematic Status Display library

## Development

This repository contains the code for the packages:

1. [fews-ssd-requests](packages/fews-ssd-requests)
2. [fews-ssd-webcomponent](packages/fews-ssd-webcomponent)

The packages are managed using native npm workspaces.

Install all packages, installing all their dependencies and linking any cross-dependencies

```
npm install
```

Run commands with (e.g. build)

```
npm run build:packages
```

Create a new release

```
npm version x.y.z --workspaces --include-workspace-root=false
```

Publish all workspace packages with

```
npm run publish:packages
```
