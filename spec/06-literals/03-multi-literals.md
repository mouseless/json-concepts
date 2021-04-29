# Multi Literals

Any number of literals can be defined at the same level;

`CONCEPTS: service.concepts.json`

```json
{
    "services?": {
        "$service+": "$response"
    },
    "models?": {
        "$model+": {
            "$field*": "$type"
        }
    }
}
```

Shadow has an array of literals instead of a single literal object;

`CONCEPTS SHADOW`

```json
{
    "literal": [
        {
            "_": "services",
            "quantifier": { "min": 0, "max": 1 },
            "concept": {
                "_": "service",
                "quantifier": { "min": 1 },
                "variable": { "_": "response" }
            }
        },
        {
            "_": "models",
            "quantifier": { "min": 0, "max": 1 },
            "concept": {
                "_": "model",
                "quantifier": { "min": 1 },
                "concept": {
                    "_": "field",
                    "quantifier": { "min": 0 },
                    "variable": { "_": "type" }
                }
            }
        }
    ]
}
```

Below is a valid schema;

`SCHEMA: greeting.service.json`

```json
{
    "services": {
        "sayHello": "message",
        "sayGoodbye": "message"

    },
    "models": {
        "message": {
            "text": "string",
            "status": "number"
        }
    }
}
```

`SCHEMA SHADOW`

```json
{
    "service": [
        {
            "_": "sayHello",
            "response": "message"
        },
        {
            "_": "sayGoodbye",
            "response": "message"
        }
    ],
    "model": [
        {
            "_": "message",
            "field": [
                {
                    "_": "text",
                    "type": "string"
                },
                {
                    "_": "status",
                    "type": "number"
                }
            ]
        }
    ]
}
```

## Multiple Variables in a Concept

Multiple literals allow more than one variable in a concept. Below is an
example;

`CONCEPTS: filters.concepts.json`

```json
{
    "$filter+": {
        "input": "$input",
        "output": "$output"
    }
}
```

`SCHEMA: default.filters.json`

```json
{
    "append": {
        "input": "string",
        "output": "string"
    },
    "split": {
        "input": "string",
        "output": "array"
    }
}
```

`SCHEMA SHADOW`

```json
{
    "filter": [
        {
            "_": "append",
            "input": "string",
            "output": "string"
        },
        {
            "_": "split",
            "input": "string",
            "output": "array"
        }
    ]
}
```
