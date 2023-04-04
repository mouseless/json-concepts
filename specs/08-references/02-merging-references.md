# Merge References

References can be merged using `&`. Below example merges `#properties` and
`#methods` under `$class` concept;

`CONCEPTS: class-1.concepts.json`

```json name="class-1.concepts.json"
{
    "$class+": "#properties & #methods",
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

Merge operation is done in the order references appear in definition. Below is
an equivalent concepts definition;

`CONCEPTS: class-2.concepts.json`

```json name="class-2.concepts.json"
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

> Any number of references can be merged, e.g. `#a & #b & #c`
