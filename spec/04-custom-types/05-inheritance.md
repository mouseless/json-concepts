# Inheritance

Custom types can derive from other custom types. This means that a value of this
type is going to be validated against all validators in the inheritance chain.

`CONCEPTS: service.concepts.json`

```json
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
            "enum": [ "string", "number", "boolean", "date", "email", "_" ]
        },
        "identifier": "/^[a-zA-Z][0-9a-zA-Z]*$/g"
    }
}
```

Here `primitive` custom type can have `float`, but `type` cannot. This means
`float` can never be used. Also `type` allows `_`, but `identifier` does not. So
`_` is also never going to be used.

`SCHEMA: greeting.service.json`

```json
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

```json
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
            "type": "primitive",
            "enum": [ "string", "number", "boolean", "date", "email"]
        }
    }
}
```

`ERROR: 'service.concepts.json' is not valid, 'type' cannot inherit from`
`'primitive'.`
