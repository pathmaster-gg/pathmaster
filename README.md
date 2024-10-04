<p align="center">
  <img src="./images/logo.svg" alt="Logo" width="200" />
  <h1 align="center">PathMaster</h1>
</p>

An open-source, serverless companion app for Pathfinder 2e game masters.

## Projects

This monorepo contains a complete stack of components needed for running the PathMaster application:

- [`api`](./api): Backend API written in TypeScript with [Cloudflare Workers](https://workers.cloudflare.com/).
- [`web`](./web): Frontend web app written in TypeScript with [Next.js](https://nextjs.org/).

The application is continuously deployed to Cloudflare for every commit pushed to `master`.

## Quickstart

This repository provides a [`docker-compose.yml`](./docker-compose.yml) file for quickly running the entire application stack without requiring the [prerequisites](#prerequisite) to be installed.

With [Docker Compose](https://docs.docker.com/compose/) installed:

```console
$ docker compose up -d --build
```

and then:

- the API server will be accessible locally at [http://localhost:8787/](http://localhost:8787/); and
- the web app will be served locally at [http://localhost:3000/](http://localhost:3000/).

To stop the stack:

```console
$ docker compose down
```

> [!NOTE]
>
> On Windows or macOS, a [Docker Desktop](https://docs.docker.com/desktop/) installation comes with Compose functionalities. There's no need to install Compose separately in this case.

Note that you'd still need to [configure the API server](./api/README.md#configuration) in order to use [Google Identity](https://developers.google.com/identity) for authentication. Configuring the Docker Compose stack is slightly different from configuring the development server. Simply edit the [`api.dev.env`](./api.dev.env) file to set the proper values.

> [!TIP]
>
> Keep your changes to the [`api.dev.env`](./api.dev.env) file local and do not commit them.

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
