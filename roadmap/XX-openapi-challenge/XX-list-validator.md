# List Validator

```json
{
    "$property*": {
        "\\$ref": "$ref:definition"
    },
    "definitions": {
        "$model*": {
            "$property*": "$type"
        }
    },
    "@types": {
        "definition": {
            "#each": {
                "path": "/**/$model",
                "apply": "\\#/definitions/#path"
            }
        }
    }
}
```
