# Array Item Type

Type syntax (`:`) also applies to array variables. When an array variable has a
type, it means all items of that array is required to be of that type. Below is
an example;

`CONCEPTS: tags.concepts.json`

```json
{
    "tags?": [ "$tags:string" ]
}
```

Below schema is **invalid** because all items in `$tags` are expected to be a
`string`;

`SCHEMA: invalid.tags.json`

```json
{
    "tags": [ "number", "not", "allowed", 0 ]
}
```

`ERROR: 'invalid.tags.json' is not valid, '0' is not a valid string.`

## Custom Types

Custom types are also supported.

`CONCEPTS: season.concepts.json`

```json
{
    "$season*": [ "$months:month" ],
    "@types": {
        "month": [
            "JAN", "FEB", "MAR",
            "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP",
            "OCT", "NOV", "DEC"
        ]
    }
}
```

`SCHEMA: invalid.season.json`

```json
{
    "summer": [ "JUN", "JUL", "AUH" ]
}
```

`ERROR: 'invalid.season.json' is not valid, 'AUH' is not a valid month.`
