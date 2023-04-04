# Literals

A literal is an expression that is expected in a schema as it appears in the
concepts definition. Below definition has `sayHello`, `name` and `string` as
literals.

`CONCEPTS: service.concepts.json`

```json name="service.concepts.json"
{
    "sayHello": {
        "name": "string"
    }
}
```

Literals on the **left-hand** side are called **key literals**, literals on the
**right-hand** side are called **value literals**. So `sayHello` and `name` are
**key literals**, `string` is a **value literal**.

Since this concepts definition consists of only literals, it only validates
itself;

`SCHEMA: greeting.service.json`

```json name="greeting.service.json"
{
    "sayHello": {
        "name": "string"
    }
}
```
