# Defining a Custom Type

Custom types are defined under `@types` meta-data. In below definition,
`identifier` is a custom type definition.

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

Above definition makes `$name` an `identifier`. `identifier` type derives from
`any` type by default.

> If a custom type does not exist under `@types`, then concepts definition
> is **invalid**.

Concepts shadow does not reflect meta-data, however it still sets the type of
`$name` to `identifier`;

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "name": "service",
        "quantifier": { "min": 1 },
        "literal": {
            "name": "name",
            "variable": {
                "name": "name",
                "type": "identifier"
            }
        }
    }
}
```

## Specifying a Base Type

You can derive a custom type from another type by adding `type` key under its
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

Now `$name` is an `identifier` which is a `string`. So it will allow only
`string` values.

> `type` can be either one of the built-in types (`boolean`, `string`, `number`
> or `any`) or another custom type.
