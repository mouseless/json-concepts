# Validators

> TBD - create a language agnostic spec, and force all impl to support custom
> validators

```json
{
    "$service+": {
        "name": "$name:identifier"
    },
    "@": {
        "types": {
            "identifier": {
                "type": "string",
                "range": {
                    "min": 1, 
                    "max": 5
                }
            }
        }
    }
}
```

```javascript
const jc = require('json-concepts');

jc.options.addValidator('custom', function(value, args) {
    return value.length >= args.min && value.length <= args.max;
});
```
