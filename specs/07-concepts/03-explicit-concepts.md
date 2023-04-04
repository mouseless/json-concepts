# Explicit Concepts

Consider below concepts definition;

`CONCEPTS: class.concepts.json`

```json name="class.concepts.json"
{
    "$class*": {
        "$property*": {
            "returns": "$returnType"
        },
        "$method*": {
            "$parameter*": "$type",
            "returns": "$returnType"   
        }
    }
}
```

In below schema definition, it is explicitly specified that `logout` is a
`$method`;

`SCHEMA: user.class.json`

```json name="user.class.json"
{
    "user": {
        "logout:method": {
            "returns": "number"
        }
    }
}
```

Without `:method`, it would be a `$property`.

## Resolving Literal Conflicts

When a literal and a concept exists at the same level, literals are resolved
before concepts. That puts a restriction on potential names of that concept. To
workaround this problem, concept name can be given explicitly.

`CONCEPTS: service.concepts.json`

```json name="resolve/service.concepts.json"
{
    "$service+": {
        "$parameter*": "$type",
        "response?": "$responseType"
    }
}
```

Below schema defines a `$parameter` named `response`;

`SCHEMA: log.service.json`

```json name="resolve/log.service.json"
{
    "writeLog": {
        "response:parameter": "string"
    }
}
```
