# Shadows

Shadows are traversable versions of concepts and schemas. They are to be
generated automatically given a schema or concepts.

> These are called shadows because they are not direct output of JSON Concepts,
> rather they are handy data structures to make use of concepts and schema files.

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

`SHADOW CONCEPTS`

```json
{
    "concepts": [
        {
            "_": "service",
            "literals": [
                {
                    "_": "response",
                    "variable": {
                        "_": "responseType"
                    }
                }
            ],
            "concepts": [
                { 
                    "_": "parameter",
                    "variable": {
                        "_": "type"
                    }
                }
            ]
        }
    ]
}
```

> By default `_` key is added to represent name of an element.

## Shadow Schema

Assume there is below schema that conforms to `service.concepts.json`;

`SCHEMA: greeting.service.json`

```json
{
    "@concepts": "service.concepts.json",
    "sayHello": {
        "name": "string",
        "response": "string"
    }
}
```

In this case `greeting.service.json` schema is expected to cast below shadow;

`SHADOW SCHEMA`

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
const schema = Schema.load(`greeting.service.json`);
const shadow = schema.shadow;

const service = shadow.service;
console.log(service._); // prints "sayHello"
console.log(service.responseType); // prints "string"

const parameter = service.parameter;
console.log(parameter._); // prints "name"
console.log(parameter.type); // prints "string"
```
