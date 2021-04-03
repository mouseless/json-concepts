# Variables

> TODO don't mention concepts yet, because concepts come after variables now...!!11!

`$` is used to indicate a variable. A variable is a key variable when it is on
the key part, and a value variable when it is on the value part. Since concepts
are basically key variables, we will use variable only for value variables.

Below `$service` and `$parameter` are concepts, but `$type` is a variable.

`service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type"
    }
}
```

Now we can define parameters with different types;

`greeting.json`

```json
{
    "service": [
        {
            "_key": "sayHello",
            "parameter": [
                {
                    "_key": "name",
                    "type": "string"
                },
                {
                    "_key": "age",
                    "type": "number"
                }
            ]
        }
    ]
}
```

Output schema is;

`greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "age": "number"
    }
}
```

## For Key Literals

When a variable exists next to a key literal, its value should be under the
first concept it is defined.

For below concepts file, `$responseType` value is expected to be under
`service` data.

`service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type",
        "response": "$responseType"
    }
}
```

`greeting.json`

```json
{
    "service": [
        {
            "_key": "sayHello",
            "parameter": [
                {
                    "_key": "name",
                    "type": "string"
                }
            ],
            "responseType": "string"
        }
    ]
}
```

Output schema is;

`greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "response": "string"
    }
}
```
