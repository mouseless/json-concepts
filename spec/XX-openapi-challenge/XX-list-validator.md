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
            "list": {
                "#path": "/**/$model",
                "template": "'#/definitions/' & #path"
            }
        }
    }
}
```
