# Multi Concepts

A concepts definition allows more than one concept at the same level. In below
example, `$property` and `$method` concepts appear directly under `$class`
concept;

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

Above definition is valid and its shadow has an array under `concept` object;

`CONCEPTS SHADOW`

```json name="class.concepts-shadow.json"
{
    "concept": {
        "name": "class",
        "quantifier": { "min": 0 },
        "concept": [
            {
                "name": "property",
                "quantifier": { "min": 0 },
                "literal": {
                    "name": "returns",
                    "variable": { "name": "returnType" }
                }
            },
            {
                "name": "method",
                "quantifier": { "min": 0 },
                "literal": {
                    "name": "returns",
                    "variable": { "name": "returnType" }
                },
                "concept": {
                    "name": "parameter",
                    "quantifier": { "min": 0 },
                    "variable": { "name": "type" }
                }
            }
        ]
    }
}
```

## Name Conflicts

When there exists more than one concept with the same name at the same level,
then the concept definition is invalid.

`CONCEPTS: invalid.concepts.json`

```json name="conflicts/invalid.concepts.json"
{
    "$conflict*": "$value",
    "$conflict+": {
        "another": "$value"
    }
}
```

Above concepts definition is in valid because there are two concepts named
`$conflict` at the same level.

`ERROR: 'invalid.concepts.json' is not valid, cannot declare 'conflict' more
than once at the same level.`

## Concepts Resolution

A schema is going to be validated by concepts in the order they appear in
concepts definition.

`CONCEPTS: class.concepts.json`

```json name="resolution/class.concepts.json"
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

For above concepts definition below schema has `login` definition to be resolved
against `$property` or `$method` concepts;

`SCHEMA: user.class.json`

```json name="resolution/user.class.json"
{
    "user": {
        "login": {
            "username": "string",
            "password": "string",
            "returns": "string"
        }
    }
}
```

`login` will firstly be validated against `$property` concept. Since it does not
fit `$property` concept, it will then be validated against `$method` concept. So
it will be an instance of a `$method` concept.

`SCHEMA SHADOW`

```json name="resolution/user.class-shadow.json"
{
    "class": [
        {
            "name": "user",
            "property": [],
            "method": [
                {
                    "name": "login",
                    "parameter": [
                        {
                            "name": "username",
                            "type": "string"
                        },
                        {
                            "name": "password",
                            "type": "string"
                        }
                    ],
                    "returnType": "string"
                }
            ]
        }
    ]
}
```

## More Than One Match Found

When there is a definition that matches more than one concept, then this
definition is decided to be an instance of the first concept. For below schema,
`logout` becomes a `$property`.

`SCHEMA: user.class.json`

```json name="more-than-one/user.class.json"
{
    "user": {
        "logout": {
            "returns": "number"
        }
    }
}
```

This problem can be solved by explicit concepts, which is covered in the next
specification.
