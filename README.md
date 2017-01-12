
# config-hmset

Containerized util to set Redis hashes from JS/JSON file


## Docker image

The Docker image can be built as follows:
```
docker build -t config-hmset https://github.com/evanx/config-hmset.git
```

## Test

```
echo "module.exports = {
    url: 'https://news.ycombinator.com',
    selector: 'a.storylink',
    query: 'all',
    limit: 3,
    output: 'json'
};" | docker run --network=host -e redisHost=127.0.0.1 -e key=myconfig evanxsummers/config-hmset
```

This will `HMSET` the piped JS or JSON file into a Redis hashes key `myconfig`

```shell
$ redis-cli hget myconfig url
"https://news.ycombinator.com"
```
