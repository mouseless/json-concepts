# Flat Definition

Another way to define concepts is to create a flat array of concepts to be
merged one by one. This will help you to define concepts separately.

For hierarchical definition, root of a concepts file was an object. For flat
definition it should be an array.

`app.concepts.json`

```json
[
    { 
        "$service": { },
    },
    {
        "$parameter": "string",
        "@path": "/service"
    }
]
```

is equivalent to

`app.concepts.json`

```json
{
    "$service": {
        "$parameter": "string"
    }
}
```
