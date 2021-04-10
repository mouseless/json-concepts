# Min & Max

Min and max validators validate either a `number` or the length of a `string`.

For following concepts file, length of `name` should be between `1` and `10`,
and `dailyCallLimit` should be between `10` and `100`.

`service.concepts.json`

```json
{
    "$service+": {
        "name": "$name:identifier",
        "dailyCallLimit": "$dailyCallLimit:limit"
    },
    ":": {
        "identifier": {
            "type": "string",
            "min": 1,
            "max": 10
        },
        "limit": {
            "type": "number",
            "min": 10,
            "max": 100
        }
    }
}
```

So for following data;

`greeting.json`

```json
{
    "service": [
        {
            "name": "sayHello",
            "dailyCallLimit": 35
        }
    ]
}
```

it will create this schema;

`greeting.service.json`

```json
{
    "sayHello": {
        "dailyCallLimit": 35
    }
}
```

But for following data;

`greeting.json`

```json
{
    "service": [
        {
            "name": "sayHello",
            "dailyCallLimit": 101
        }
    ]
}
```

It will **NOT** create a schema, because `dailyCallLimit` cannot be larger than
`100`. So it will give a proper validation error.
