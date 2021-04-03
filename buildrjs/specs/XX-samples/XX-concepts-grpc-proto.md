# Variables

> TBD - give data and show result schema

`$` is used to indicate a variable. A variable is a key variable when it is
on the key part, and a value variable when it is on the value part.

Notice that concepts are basically key variables, so we will refer them as
concepts. Therefore we will use variable only for value variables.

Below `$service` and `$parameter` are concepts, but `$type` is a variable.

`service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type"
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
            ]
        }
    ]
}
```
