# PathMaster serverless API

This folder hosts the serverless API for PathMaster.

## Getting started

With Node.js and `yarn` installed, run from the current folder:

```console
$ yarn install
```

to make sure dependencies are installed. Then run a development server with:

```console
$ yarn dev
```

The server can then be accessed at [http://localhost:8787/](http://localhost:8787/).

### Configuration

Since PathMaster uses [Google Identity](https://developers.google.com/identity) for authentication, additional configuration is needed, even during local development.

To configure the API server, create a `.dev.vars` file in the current `api` folder (_not_ the repository root folder), with content similar to the following:

```env
OAUTH_GOOGLE_CLIENT_SECRET = "fill-in-google-oauth-client-secret-here"
```

where the quoted value is replaced with the actual OAuth secret.
