# Merging Reference with Existing

```json
{
    "$parameters*": {
        "name": "$name",
        "in": "$in:parameterPosition",
        "...": "#parameterLike"
    },
    "#parameterLike": {
        "required?": "$required:boolean",
        "description?": "$description"
    }
}
```
