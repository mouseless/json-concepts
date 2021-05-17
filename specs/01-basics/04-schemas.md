# Schemas

A json file is called a schema when it is validated against a concepts
definition. Below is an example;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "response": "string"
    }
}
```

This schema can be validated against following concepts definition;

`CONCEPTS: service.concepts.json`

```json
{
    "$service": {
        "$parameter": "$type",
        "response": "$responseType"
    }
}
```

Below code loads and validates this schema;

```javascript
const schema = Schema.load("greeting.service.json", "service.concepts.json");
```

## Self-Validating Schema

A schema file is **self-validating**  when there exists a `@concepts` meta-data.
Below is a schema that refers to `service.concepts.json` file locally;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "response": "string"
    },

    "@concepts": "service.concepts.json"
}
```

For a self-validating schema, you don't need to specify its concepts definition;

```javascript
const schema = Schema.load("greeting.service.json");
```

## Referring to a Remote Concepts Definition

You can also write a complete URL to refer to a concepts definition. Below is an
example;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "response": "string"
    },

    "@concepts": "https://my-concepts.com/service.concepts.json"
}
```
