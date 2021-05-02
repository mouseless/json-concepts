# Merge References

Below `#properties` and `#methods` references are declared in an array, which
means that they will be merged in the order they appeared.

`CONCEPTS 1: class.concepts.json`

```json
{
    "$class+": [ "#properties", "#methods" ],
    "#properties": {
        "$property*": "$type"
    },
    "#methods": {
        "$method*": {
            "$parameter*": "$type",
            "returns": "$type"
        }
    }
}
```

Below is an equivalent concepts definition;

`CONCEPTS 2: class.concepts.json`

```json
{
    "$class+": {
        "$property*": "$type",
        "$method*": {
            "$parameter*": "$type",
            "returns": "$type"
        }
    }
}
```