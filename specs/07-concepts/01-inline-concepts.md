# Inline Concepts

Concepts definition can be embedded into a schema file using `@concepts`
meta-data.

`SCHEMA: greeting.service.json`

```json name="greeting.service.json"
{
    "sayHello": {
        "name": "string",
        "surname": "string"
    },

    "@concepts": {
        "$service+": {
            "$parameter*": "$type"
        }
    }
}
```

This is a self-validating schema and can be loaded as follows;

```javascript
const schema = Schema.load("greeting.service.json");
```
