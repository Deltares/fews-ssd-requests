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

#Create a new release

Create a new version X.Y.Z for all workspaces:

```
npm version X.Y.Z --workspaces --include-workspace-root=false
```

This does not commit the changes to Git, you have to do add and commit them manually.
 
Then push the changes and tags to the remote:

```
git push
git push origin vX.Y.Z
```
 
On GitHub, draft a new release at [Releases · Deltares/fews-ssd-requests](https://github.com). Check that the GitHub Action successfully builds the release and publishes it to npmjs.org.
