<p align="center">
  <h1 align="center">PathMaster</h1>
</p>

An open-source, serverless companion app for Pathfinder 2e game masters.

## Projects

This monorepo contains a complete stack of components needed for running the PathMaster application:

- [`api`](./api): Backend API written in TypeScript with [Cloudflare Workers](https://workers.cloudflare.com/).
- [`web`](./web): Frontend web app written in TypeScript with [Next.js](https://nextjs.org/).

The application is continuously deployed to Cloudflare for every commit pushed to `master`.

## Prerequisite

TypeScript is used throughout the stack to implement different parts of the application. Make sure you have [Node.js](https://nodejs.org/) installed:

Depending on the component, different toolchains need to be installed to successfully build and run them.

```console
$ node --version
v20.16.0
```

In addition, the project uses the `yarn` package manager, which can be installed with:

```console
$ npm install -g yarn
```

To check whether `yarn` is properly installed:

```console
$ yarn --version
1.22.22
```
