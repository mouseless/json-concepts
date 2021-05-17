# Escaping Special Characters

A literal name can contain a special character using escape sequences '\\'.
Below is an example of both key and value literals;

`CONCEPTS: escape.concepts.json`

```json
{
    "\\$service\\+": "\\$response"
}
```

Below is the only valid schema for this concepts definition, because it only
contains literals;

`SCHEMA: concepts.escape.json`

```json
{
    "$service+": "$response"
}
```
