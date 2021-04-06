# Literals

Literals are values that are translated directly to output schema.

In below file `sayHello` and `name` are literals on key side, `string`
expression is a literal on value side.

`service.concepts.json`

```json
{
    "sayHello": {
        "name": "string"
    }
}
```

For any data;

`greeting.json`

```json
{
}
```

Output is always;

`greeting.service.json`

```json
{
    "sayHello": {
        "name": "string"
    }
}
```
