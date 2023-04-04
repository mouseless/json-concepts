# Variables

An expression is not a literal when it starts with a variable sign `$`. When it
is on the **right-hand** side, an expression is called a **variable**. Below,
`$type` is a variable.

`CONCEPTS: service.concepts.json`

```json name="service.concepts.json"
{
    "sayHello": {
        "name": "$type"
    }
}
```

Using above concepts file, now both of below schemas are valid.

`SCHEMA: greeting-1.service.json`

```json name="greeting-1.service.json"
{
    "sayHello": {
        "name": "string"
    }
}
```

`SCHEMA: greeting-2.service.json`

```json name="greeting-2.service.json"
{
    "sayHello": {
        "name": "text"
    }
}
```
