# Regex Validator

Regex validator can be applied to custom types that derive from `string`. You
can define a regex pattern under `regex` key. For the following concepts
definition, `identifier` type only accepts values that match the given regex
pattern;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "name": "$name:identifier"
    },

    "@types": {
        "identifier": {
            "type": "string",
            "regex": "^[a-zA-Z]*$"
        }
    }
}
```

For above concepts definition following schema is **not** valid;

`SCHEMA: greeting.service.json`

```json
{
    "service": {
        "name": "say hello"
    }
}
```

Because `say hello` does **not** match `^[a-zA-Z]*$` pattern.

`ERROR: 'greeting.service.json' is not valid, 'say hello' is not a valid
identifier.`

## Short-Hand Usage

Following definition demonstrates a short-hand usage of `regex` validator.

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "name": "$name:identifier"
    },
    
    "@types": {
        "identifier": "^[a-zA-Z]*$"
    }
}
```
