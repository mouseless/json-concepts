# Custom Types

Custom types are defined under `:` key at the root of concepts file. Under `:`
key, you can define name-object pairs of custom type definitions.

For below file, `identifier` is defined as a custom type and type of `$name` is
`identifier`.

`service.concepts.json`

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

Above definition makes `name` variable an `identifier`, and `identifier`
inherits from `any` type, because we did not specify which type it is based on.
You can define a base type of a custom type by adding `type` key under its
definition.

`service.concepts.json`

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

Now `$name` variable is an `identifier` which inherits from `string`.
