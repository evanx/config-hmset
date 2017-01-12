
# config-hmset

Containerized util to set Redis hashes from JS/JSON file

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
}" | docker run --network=host -e redisHost=127.0.0.1 -e key=myconfig evanxsummers/config-hmset
```

This will `HMSET` the piped JS or JSON file into a Redis hashes key `myconfig` on the specified `redisHost` e.g. `localhost.` Note that since this is a container, usually `redisHost` it will not be `localhost` unless bridged e.g. via `--network=host.`

```shell
$ redis-cli hget myconfig url
"https://news.ycombinator.com"
```
