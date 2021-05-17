# Variables

An expression is not a literal when it starts with a variable sign `$`. When it
is on the **right-hand** side, an expression is called a **variable**. Below,
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
