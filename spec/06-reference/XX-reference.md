# Reference

> TBD

```json
{
    "$service+": {
        "async": "#async"
    },
    "#define": {
        "async": "$async:boolean"
    }
}
```

`#` always following identifier is a preprocessor;

- `#include`: includes the file in given path to where this preprocessor was used
- `#define`: defines new preprocessors
- `#[custom]`: when defined under `#define`, replaces value where it is defined
