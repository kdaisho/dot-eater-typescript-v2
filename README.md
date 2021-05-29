# Dot-eater-typescript
Refactoring [Dot-eater project](https://github.com/kdaisho/dot-eater) using Typescript

## CI/CD with Travis CI
Auto-deploy on master branch change

## NPM script for development
`npm run dev`

## NPM script for production build
`npm run build`

## Script for Typescript compiler
You do not need type `tsc -w`. Once you kick start parcel, it compiles all `ts` file in `src` folder on save.

## Note when using Parcel-Bunlder and Typescript
I found out Parcel handles all compilation and it makes Typescript a mere linting tool. Typescript compiler yells at your violations but it doesn't do anything more than that. Parcel doesn't care about what Typescript says. It compiles everything.