# Nested Literals

> TBD

`concepts`

```json
{
    "this": {
        "is": {
            "nested": {
                "literal": "$value"
            }
        }
    }
}
```

`schema`

```json
{
    "this": {
        "is": {
            "nested": {
                "literal": "text"
            }
        }
    }
}
```

`shadow schema`

```json
{
    "value": "text"
}
```

`shadow concepts`

```json
{
    "literals": [
        {
            "_": "this",
            "literals": [
                {
                    "_": "is",
                    "literals": [
                        {
                            "_": "nested",
                            "literals": [
                                {
                                    "_": "literal",
                                    "variables": [
                                        {
                                            "_": "value"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
```

## Objet Arrays

This is array of objects

`service.concepts.json`

```json
{
    "$service+": {
        "parameters*": {
            "name": "$name", //parent variable name is parameters -> $parameters.name
            "type": "$type"
        }
    }
}
```

## Conflicting Parent Variable Name

```json
{
    "$service+": {
        "test": {
            "test": {
                "parameters*": {
                    "name": "$name", //parent variable name is parameters -> $parameters.name
                    "type": "$type"
                }
            }
        }
}
```

```json
{
    "$service+": {
        "test": {
            "test": {
                "parameters*": {
                    "name": "$name", //parent variable name is testTestParameters -> $testTestParameters.name
                    "type": "$type"
                }
            },
            "parameters*": {
                "name": "$name", //parent variable name is testParameters -> $testParameters.name
                "type": "$type"
            }
        },
        "parameters*": {
            "name": "$name", //parent variable name is parameters -> $parameters.name
            "type": "$type"
        }
    }
}
```
