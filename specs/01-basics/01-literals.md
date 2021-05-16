# Literals

Literals are definitions that are expected in schema files exactly the same as
they exist in concepts files.

In below file `sayHello`, `name` and `string` are literals.

`CONCEPTS: service.concepts.json`

```json
{
    "sayHello": {
        "name": "string"
    }
}
```

Literals on the left-hand side are called **key literals**. Those that are on
the right-hand side are called **value literals**.

Above concepts file only accepts below schema;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string"
    }
}
```

This is because there are no variables in above concepts file, but only
literals.
