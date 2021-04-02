# Literals

Literals are values that are translated directly to output schema.

In below file `string` expression is a literal on value side, `response` is a
literal on key side.

`service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "string",
        "response": "string"
    }
}
```

For following data;

`greeting.json`

```json
{
    "service": [
        {
            "_key": "sayHello",
            "parameter": [
                {
                    "_key": "name"
                }
            ]
        }
    ]
}
```

Output becomes;

`greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "response": "string"
    }
}
```

> For this concepts file when a parameter with name `response` is given, there
> will be a validation error because it conflicts with `response` key literal.
