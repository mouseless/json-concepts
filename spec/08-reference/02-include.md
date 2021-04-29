# Include

> TBD

`CONCEPTS: parameter.concepts.json`

```json
{
    "$parameter*": "$type"
}
```

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "#include": "parameter.concepts.json"
    }
}
```

`RESULT`

```json
{
    "$service+": {
        "$parameter*": "$type"
    }
}
```
