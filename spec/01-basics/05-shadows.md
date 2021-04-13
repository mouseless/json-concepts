# Shadows

Shadows are traversable versions of concepts and schemas. They are to be
generated automatically given a schema or concepts.

> These are called shadows because they are not direct output of JSON Concepts,
> rather they are handy data structures to make use of concepts and schema files.

Let's begin with a schema;

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

Below is the concepts file mentioned above;

`CONCEPTS: service.concepts.json`

```json
{
    "$service": {
        "$parameter": "$type",
        "response": "$responseType"
    }
}
```

With this information, `greeting.service.json` schema is expected to cast below
shadow;

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

By default `_` key is added to to represent name of the concept it is in. This
way, schema becomes traversable. Following is an example in `javascript`;

```javascript
const schema = Schema.load(`greeting.service.json`);
const shadow = schema.castShadow();

const service = shadow.service;
console.log(service._); // prints "sayHello"
console.log(service.responseType); // prints "string"

const parameter = service.parameter;
console.log(parameter._); // prints "name"
console.log(parameter.type); // prints "string"
```

## Shadow Concepts

Concepts might also be represented by their shadow. For following concepts
file;

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

`SHADOW CONCEPT`

```json
{
    "concepts": [
        {
            "_": "service",
            "variables": [
                {
                    "_": "responseType"
                }
            ],
            "concepts": [
                { 
                    "_": "parameter",
                    "variables": [
                        {
                            "_": "type"
                        }
                    ]
                }
            ]
        }
    ]
}
```

Above shadow is the least of what it should contain. It may contain more than
what is specified above. For example, `parameter` concept might have an empty
`concepts` array like below.

```json
...
{ 
    "_": "parameter",
    "variables": [
        {
            "_": "type"
        }
    ],
    "concepts": [ ]
}
...
```
