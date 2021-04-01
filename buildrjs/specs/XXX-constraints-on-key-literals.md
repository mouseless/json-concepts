# Constraints on Key Literals

> TBD

This is single value

`service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type",
        "response?": "$responseType"
    }
}
```

This is array of values (same for `+`)

`service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type",
        "response?": "$responseType",
        "tags*": "$tags"
    }
}
```

This is array of objects

`service.concepts.json`

```json
{
    "$service+": {
        "parameters*": {
            "name": "$parameters.name", //?? how to resolve whether parameters is the array or name
            "type": "$parameters.type"
        },
        "returns+": 
    }
}
```

This is array of objects

`service.concepts.json`

```json
{
    "$service+": {
        "parameters*": {
            "name?": "$parameters.name",
            "types": {
                "isArray": "$parameters.type.isArray", //????
                "itemType": "$parameters.type.itemType"
            }
        },
        "returns+": 
    }
}
```

> TODO think of more cases
>
> - arrays under arrays
> - how to access arrays of arrays etc
