# Validators

> TBD - will only be available in js

```json
{
    "$service+": {
        "name": "$name:name"
    },
    "@": {
        "types": {
            "name": {
                "type": "string",
                "custom": {
                    "option1": true, 
                    "option2": false
                }
            }
        },
        "options": {
            "validators": {
                "custom": "custom.validator.js"
            }
        }
    }
}
```
