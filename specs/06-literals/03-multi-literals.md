# Multi Literals

Any number of literals can be defined at the same level. Below concepts
definition has `services` and `models` literals at the root;

`CONCEPTS: service.concepts.json`

```json name="service.concepts.json"
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

In this case, concepts shadow has an array of literals instead of a single
literal object;

`CONCEPTS SHADOW`

```json name="service.concepts-shadow.json"
{
    "literal": [
        {
            "name": "services",
            "quantifier": { "min": 0, "max": 1 },
            "concept": {
                "name": "service",
                "quantifier": { "min": 1 },
                "variable": { "name": "response" }
            }
        },
        {
            "name": "models",
            "quantifier": { "min": 0, "max": 1 },
            "concept": {
                "name": "model",
                "quantifier": { "min": 1 },
                "concept": {
                    "name": "field",
                    "quantifier": { "min": 0 },
                    "variable": { "name": "type" }
                }
            }
        }
    ]
}
```

Below is a valid schema;

`SCHEMA: greeting.service.json`

```json name="greeting.service.json"
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

Schema shadow is expected to be as the following;

`SCHEMA SHADOW`

```json name="greeting.service-shadow.json"
{
    "service": [
        {
            "name": "sayHello",
            "response": "message"
        },
        {
            "name": "sayGoodbye",
            "response": "message"
        }
    ],
    "model": [
        {
            "name": "message",
            "field": [
                {
                    "name": "text",
                    "type": "string"
                },
                {
                    "name": "status",
                    "type": "number"
                }
            ]
        }
    ]
}
```

## Multiple Variables in a Concept

Multiple literals allow more than one variable in a concept. Below example
demonstrates that `$filter` concept has `$input` and `$output` variables;

`CONCEPTS: filters.concepts.json`

```json name="multiple-variables/filters.concepts.json"
{
    "$filter+": {
        "input": "$input",
        "output": "$output"
    }
}
```

A valid schema with multiple variables;

`SCHEMA: default.filters.json`

```json name="multiple-variables/default.filters.json"
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

Schema shadow lists all variables of a concept next to each other.

`SCHEMA SHADOW`

```json name="multiple-variables/default.filters-shadow.json"
{
    "filter": [
        {
            "name": "append",
            "input": "string",
            "output": "string"
        },
        {
            "name": "split",
            "input": "string",
            "output": "array"
        }
    ]
}
```
