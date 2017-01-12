
# config-hmset

Containerized util to set Redis hashes from JS/JSON file

## Implementation

Note that for properties that are not strings or numbers, we apply `JSON.stringify`

The implementation is essentially as follows:
```javascript
const content = await getStdin();
const object = JSON.parse(content);
await multiExecAsync(redis, multi => {
    Object.keys(object).forEach(key => {
        const value = object[key];
        if (typeof value === 'object') {
            multi.hset(config.key, key, JSON.stringify(value));
        } else {
            multi.hset(config.key, key, value);
        }
    });
});
```

It's designed to be containerized:
```shell
echo '{"url": "https://news.ycombinator.com"}' |
  docker run -i --network=host -e redisHost=127.0.0.1 \
    -e key=myconfig evanxsummers/config-hmset
```
- the image of the application container is `evanxsummers/config-hmset` (DockerHub)
- JSON content is piped into the standard input of `docker run -i`
- `redisHost` and `key` are specified using `-e` (environment variables for the app)
- the app will set a Redis `hashes` key from the JSON input content

This will `HMSET` the piped JS or JSON file into a Redis hashes key `myconfig` on the specified `redisHost` e.g. `localhost.` Note that since this is a container, usually `redisHost` it will not be `localhost` unless bridged e.g. via `--network=host.`

```shell
$ redis-cli hgetall myconfig
1) "url"
2) "https://news.ycombinator.com"
3) "selector"
4) "a.storylink"
```

## Docker image

The Docker image can be built as follows:
```
docker build -t config-hmset https://github.com/evanx/config-hmset.git
```

From the `Dockerfile`
```
FROM mhart/alpine-node
ADD package.json .
RUN npm install
ADD components components
ADD src src
CMD ["node", "--harmony", "src/index.js"]
```
