# When Validator

```json
{
    "$schema": {
        "type": "$type:type",
        "format": "$format:format"
    },
    "@types": {
        "type": [ "object", "string", "integer" ],
        "format": {
            "type": "string",
            "when": [
                {
                    "$schema": "user",
                    "$type": "id",
                    "enum": [ "int32" ]
                },
                {
                    "$type": [ "integer" ],
                    "enum": [ "int32", "int64" ]
                },
                {
                    "$type": "string",
                    "enum": [ "date", "datetime" ]
                },
                {
                    "regex": "^.*$"
                }
            ]
        }
    }
}
```
