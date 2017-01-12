
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

## Docker image

The Docker image can be built as follows:
```
docker build -t config-hmset https://github.com/evanx/config-hmset.git
```

## Test

```shell
echo "module.exports = {
    url: 'https://news.ycombinator.com',
    selector: 'a.storylink'
}" | docker run -i --network=host -e redisHost=127.0.0.1 -e key=myconfig evanxsummers/config-hmset
```

This will `HMSET` the piped JS or JSON file into a Redis hashes key `myconfig` on the specified `redisHost` e.g. `localhost.` Note that since this is a container, usually `redisHost` it will not be `localhost` unless bridged e.g. via `--network=host.`

```shell
$ redis-cli hgetall myconfig
1) "url"
2) "https://news.ycombinator.com"
3) "selector"
4) "a.storylink"
```
