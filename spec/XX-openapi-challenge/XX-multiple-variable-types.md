# Multiple Definitions Types

> TBD -> a definition should be able to conform to one of the definitions
> Should also support multiple types for object arrays

```json
{
    "$schema*": "#ref | #schema",
    "$class*": "#properties & #methods"
}
```

```json
{
    "$schema*": [
        {
            "\\$ref": "$reference"
        },
        {
            "type": "$type"
        }
    ]
}
```
