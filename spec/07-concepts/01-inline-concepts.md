# Inline Concepts

Concepts definition can be embedded into a schema file in `@concepts` meta-data.

`SCHEMA: greeting.service.json`

```json
{
    "@concepts": {
        "$service+": {
            "$parameter*": "$type"
        }
    },
    "sayHello": {
        "name": "string",
        "surname": "string"
    }
}
```

This is a self-validating schema and can be loaded as follows;

```javascript
const schema = Schema.load("greeting.service.json");
```
