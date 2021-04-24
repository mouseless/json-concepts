# Filters

> TBD - create a language agnostic spec, and force all impl to support custom
> filters

```json
{
    "function": {
        "from": "service",
        "map": {
            "returnType": "responseType | capitalize | append 'Data'"
        }
    }
}
```

```javascript
const jc = require('json-concepts');

jc.options.addFilter('append', function(value, args) {
    return value + args[0];
});
```
