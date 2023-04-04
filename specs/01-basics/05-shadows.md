# Shadows

A shadow is an easy-to-code version of a definition. A concepts definition has a
concepts shadow, a schema definition has a schema shadow. They are generated
automatically using the given definition.

Let's begin with a concept;

`CONCEPTS: service.concepts.json`

```json name="service.concepts.json"
{
    "$service": {
        "$parameter": "$type",
        "response": "$responseType"
    }
}
```

Corresponding shadow is as follows;

`CONCEPTS SHADOW`

```json name="service.concepts-shadow.json"
{
    "concept": {
        "name": "service",
        "literal": {
            "name": "response",
            "variable": {
                "name": "responseType"
            }
        },
        "concept": { 
            "name": "parameter",
            "variable": {
                "name": "type"
            }
        }
    }
}
```

> To represent the name of an element, `name` key is used by default.

Shadow is generated when its definition is loaded;

`CODE: greeting.js`

```javascript
const concepts = Concepts.load('service.concepts.json');
const shadow = concepts.shadow;

const service = shadow.concept;
console.log(service.name); // prints "service"

const response = service.literal;
console.log(response.name); // prints "response"

const responseType = response.variable;
console.log(responseType.name); // prints "responseType"
```

## Schema Shadow

Below is a schema that conforms to the above concepts definition;

`SCHEMA: greeting.service.json`

```json name="schema-shadow/greeting.service.json"
{
    "sayHello": {
        "name": "string",
        "response": "string"
    }
}
```

This schema is expected to cast below shadow;

`SCHEMA SHADOW`

```json name="schema-shadow/greeting.service-shadow.json"
{
    "service": {
        "name": "sayHello",
        "parameter": {
            "name": "name",
            "type": "string"
        },
        "responseType": "string"
    }
}
```

Below code uses schema shadow;

`CODE: greeting.js`

```javascript
const schema = Schema.load('greeting.service.json', 'service.concepts.json');

const service = schema.shadow.service;
console.log(service.name); // prints "sayHello"
console.log(service.responseType); // prints "string"

const parameter = service.parameter;
console.log(parameter.name); // prints "name"
console.log(parameter.type); // prints "string"
```
