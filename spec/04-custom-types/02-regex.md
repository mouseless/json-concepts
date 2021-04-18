# Regex

Regex validator can be applied to custom types that inherits from `string`. You
can define a regex pattern under `regex` key. For the following concepts
definition, `identifier` type only accepts values that match the given regex
pattern;

`service.concepts.json`

```json
{
    "$service+": {
        "name": "$name:identifier"
    },
    "@types": {
        "identifier": {
            "type": "string",
            "regex": "/[a-zA-Z]/g"
        }
    }
}
```

Following definition demonstrates a short-hand usage of `regex` validator.

```json
{
    "$service+": {
        "name": "$name:identifier"
    },
    "@types": {
        "identifier": "/[a-zA-Z]/g"
    }
}
```

For above concepts definition following data;

```json
{
    "service": [
        {
            "_key": "say hello"
        }
    ]
}
```

does **NOT** create a schema because `say hello` does **NOT** match
`/[a-zA-Z]/g` pattern. So it gives a proper validation error.
