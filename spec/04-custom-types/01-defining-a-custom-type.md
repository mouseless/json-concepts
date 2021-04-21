# Defining a Custom Type

Custom types are defined under `@types` meta-data. For below file, `identifier`
is defined as a custom type. So `$name` variable is of type `identifier`.

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "name": "$name:identifier"
    },
    "@types": {
        "identifier": { }
    }
}
```

> If a custom type does not exist under `@types`, then concepts definition
> is **INVALID**.

Concepts shadow keeps meta-data in the root under `metaData`;

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "_": "service",
        "quantifier": { "min": 1 },
        "literal": {
            "_": "name",
            "variable": {
                "_": "name",
                "type": "identifier"
            }
        }
    },
    "metaData": {
        "types": [
            {
                "_": "identifier"
            }
        ]
    }
}
```

Above definition makes `name` variable an `identifier`, and `identifier`
inherits from `any` type, because we did not specify which type it is based on.

## Specifying Base Type

You can define the base type of a custom type by adding `type` key under its
definition.

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "name": "$name:identifier"
    },
    "@types": {
        "identifier": { 
            "type": "string"
        }
    }
}
```

Now `$name` variable is an `identifier` which is a `string`. So it will allow
only `string` values.

`CONCEPTS SHADOW`

```json
{
    ...
    "metaData": {
        "types": [
            {
                "_": "identifier",
                "type": "string"
            }
        ]
    }
}
```

> `type` can either be one of the built-in variable types (`boolean`, `string`,
> `number`, `object` or `any`). Or it can be another custom type.
