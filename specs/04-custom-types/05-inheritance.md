# Inheritance

Custom types can derive from other custom types. This means that a value of this
type is going to be validated against all validators in the inheritance chain.

`CONCEPTS: service.concepts.json`

```json name="service.concepts.json"
{
    "$service+": {
        "$parameter*": "$type:primitive"
    },

    "@types": {
        "primitive": {
            "type": "type",
            "enum": [ "number", "boolean", "float" ]
        },
        "type": {
            "type": "identifier",
            "enum": [ "string", "number", "boolean", "date", "email" ]
        },
        "identifier": "^[a-zA-Z][0-9a-zA-Z]*$"
    }
}
```

Here `primitive` seems to allow `float`, but since `type` does not, `float` is
not a valid `primitive` either.

`SCHEMA: greeting.service.json`

```json name="greeting.service.json"
{
    "sayHello": {
        "name": "float"
    }
}
```

`ERROR: 'greeting.service.json' is not valid, 'float' is not a valid primitive.`

## Circular Dependency

Inheritance chain cannot cause a circular dependency. Following concepts
definition is not valid;

`CONCEPTS: service.concepts.json`

```json name="circular/service.concepts.json"
{
    "circular": "$type:a",
    
    "@types": {
        "a": { "type": "b" },
        "b": { "type": "c" },
        "c": { "type": "a" }
    }
}
```

`ERROR: 'service.concepts.json' is not valid, 'c' cannot inherit from 'a'.`
