# Duplicate Variables

There can only be one variable with the same name under the same concept. Below
concepts definition is **NOT** valid

`CONCEPTS: example.concepts.json`

```json
{
    "$concept": {
        "literal1": "$value",
        "literal2": "$value"
    }
}
```

`ERROR: 'example.concepts.json' is not valid, 'concept' cannot have '$value'
more than once.`
