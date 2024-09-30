FROM node:22 AS build

WORKDIR /src
COPY ./ /src/

RUN --mount=type=cache,target=/src/node_modules \
    yarn install

RUN --mount=type=cache,target=/src/node_modules \
    yarn build

RUN --mount=type=cache,target=/src/node_modules \
    cp -r /src /app

FROM node:22

COPY --from=build /app /app
WORKDIR /app

COPY ./docker/entrypoint.sh /entrypoint.sh

EXPOSE 8787

ENTRYPOINT ["/entrypoint.sh"]
