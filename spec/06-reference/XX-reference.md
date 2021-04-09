# Reference

> TBD

```json
{
    "$service+": {
        "async": "#async"
    },
    "#def": {
        "async": "$async:boolean"
    }
}
```

`#` always following identifier is a preprocessor;

- `#inc`: includes the file in given path to where this preprocessor was used
- `#def`: defines new preprocessors
- `#[custom]`: when defined under `#def`, replaces value where it is defined
