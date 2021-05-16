# Schemas

A schema file is a json file that can be validated against a concepts file.

Below is an example schema;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "response": "string"
    }
}
```

This schema can be validated against following concepts file;

`CONCEPTS: service.concepts.json`

```json
{
    "$service": {
        "$parameter": "$type",
        "response": "$responseType"
    }
}
```

Below is a validation example in `javascript`;

```javascript
const schema = Schema.load("greeting.service.json", "service.concepts.json");
```

## Self-Validating Schema

A schema file is **self-validating**  when there exists a `@concepts`
meta-data. Below is a schema that refers to `service.concepts.json` file
locally;

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

To validate above schema you don't need to specify a concepts file explicitly.
So the validation example in `javascript` becomes simpler;

```javascript
const schema = Schema.load("greeting.service.json");
```

## Referring to a Remote Concepts File

You can also write a complete URL to refer to a concepts file. Below is an
example;

`SCHEMA: greeting.service.json`

```json
{
    "@concepts": "https://json-concepts.github.io/samples/service.concepts.json",
    "sayHello": {
        "name": "string",
        "response": "string"
    }
}
```
