# Shadows

Shadows are traversable versions of concepts and schemas. They are to be
generated automatically given a schema or concepts.

> These are called shadows because they are not direct output of JSON Concepts,
> rather they are handy data structures.

Let's begin with a concept;

`CONCEPTS: service.concepts.json`

```json
{
    "$service": {
        "$parameter": "$type",
        "response": "$responseType"
    }
}
```

Corresponding shadow is as follows;

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "_": "service",
        "literal": {
            "_": "response",
            "variable": {
                "_": "responseType"
            }
        },
        "concept": { 
            "_": "parameter",
            "variable": {
                "_": "type"
            }
        }
    }
}
```

> By default `_` key is added to represent name of an element.

## Schema Shadow

Assume there is below schema that conforms to above concepts;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "response": "string"
    }
}
```

In this case `greeting.service.json` schema is expected to cast below shadow;

`SCHEMA SHADOW`

```json
{
    "service": {
        "_": "sayHello",
        "parameter": {
            "_": "name",
            "type": "string"
        },
        "responseType": "string"
    }
}
```

This way, schema becomes traversable. Following is an example in `javascript`;

```javascript
const schema = Schema.load('greeting.service.json');
const shadow = schema.shadow;

const service = shadow.service;
console.log(service._); // prints "sayHello"
console.log(service.responseType); // prints "string"

const parameter = service.parameter;
console.log(parameter._); // prints "name"
console.log(parameter.type); // prints "string"
```
