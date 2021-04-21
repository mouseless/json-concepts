# Custom

To set custom min and max values of quantifier there exists `{#,#}` syntax;

- `{2,4}` means `{ "min": 2, "max": 4 }`
- `{,4}` means `{ "max": 4 }`
- `{2,}` means `{ "min": 4 }`
- `{3}` or `{3,3}` means `{ "min": 3, "max": 3 }`

Both min and max values are inclusive. Other quantifiers can be expressed with
this syntax as well;

- Default is `{1}`
- `?` is `{0,1}`
- `+` is `{1,}`
- `*` is `{0,}`

For example;

`CONCEPTS: service.concepts.json`

```json
{
    "$service{1,3}": {
        "$parameter{,2}": "$type",
        "response{1}": "$responseType",
        "tags{0,}": "$tags"
    }
}
```

This concepts definition should have following shadow;

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "_": "service",
        "quantifier": { "min": 1, "max": 3 },
        "literal": [
            {
                "_": "response",
                "quantifier": { "min": 1, "max": 1 },
                "variable": {
                    "_": "responseType"
                }
            },
            {
                "_": "tags",
                "quantifier": { "min": 0 },
                "variable": {
                    "_": "tags"
                }
            }
        ],
        "concept": {
            "_": "parameter",
            "quantifier": { "max": 2 },
            "variable": {
                "_": "type"
            }
        }
    }
}
```

It is trivial to give schema validation examples here. Any concept or literal
should not have less occurrences than its minimum quantifier, and should not
have more occurrences than its maximum quantifier.

Lastly, when `max` is `1`, corresponding concept or variable becomes an
object, otherwise it should always be an array.
