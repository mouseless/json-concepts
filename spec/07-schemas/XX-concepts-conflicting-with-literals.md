# Concepts Conflicting with Literals

```json
{
    "$service+": {
        "$parameter*": "$type",
        "response?": "$responseType"
    }
}
```

```json
{
    "writeLog": {
        "response:parameter": "object",
        "response:literal": "string"
    }
}
```

> TBD when there is conflict, first one is literal, then the first concept
> `:parameter` means it is explicitly belongs to the `parameter` concept.
