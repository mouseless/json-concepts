# Shadows

> TBD - shadow schema is the programmable version of a concepts definition or a schema

In JSON Concepts, concepts are designed to be easy-to-read for us. This is a
trade-off, because it makes them hard-to-code. We need shadows of our concepts
which are easy-to-code.

```json
{
    "$service": {
        "$parameter": "$value"
    }
}
```

```javascript
    const concepts = Concepts.load('service.concepts.json');

    concepts['$service'] //?
```

```json
[
    {
        "concept": "service",
        "child": {
            "concept": "parameter"
        }
    },
    {
        "concept": "parameter",
        "child": {
            "variable": "value"
        }
    }
]
```

```javascript
    const concepts = Concepts.load('service.concepts.json');

    concepts.shadow.concept[0].childConcept[0].concept // => parameter
```

```json
{
    "sayHello": {
        "name": "string"
    }
}
```

```json
{
    "service": {
        "service": "sayHello",
        "parameter": {
            "parameter": "name",
            "value": "string"
        }
    }
}
```
