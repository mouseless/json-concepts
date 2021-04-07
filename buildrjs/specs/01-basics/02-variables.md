# Variables

When an **value** starts with `$` sign, it indicates that it is a variable. Below
`$type` is a variable.

`CONCEPTS: service.concepts.json`

```json
{
    "sayHello": {
        "name": "$type"
    }
}
```

Using above concepts file, now both of below schemas are valid.

`SCHEMA 1: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string"
    }
}
```

`SCHEMA 2: greeting.service.json`

```json
{
    "sayHello": {
        "name": "text"
    }
}
```
