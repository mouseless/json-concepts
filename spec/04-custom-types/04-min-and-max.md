# Min and Max

Min and max validators can be applied to `number` or `string` variables. When
applied to a `string`, they validate its length.

In following concepts definition, length of `name` should be between `1` and
`10`, and value `dailyCallLimit` should be between `10` and `100`.

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "name": "$name:identifier",
        "dailyCallLimit": "$dailyCallLimit:limit"
    },
    "@types": {
        "identifier": {
            "type": "string",
            "min": 1,
            "max": 10
        },
        "limit": {
            "type": "number",
            "min": 10,
            "max": 100
        }
    }
}
```

Above definition has following schema;

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "_": "service",
        "quantifier": { "min": 1 },
        "literal": [
            {
                "_": "name",
                "variable": {
                    "_": "name",
                    "type": "identifier"
                }
            },
            {
                "_": "dailyCallLimit",
                "variable": {
                    "_": "dailyCallLimit",
                    "type": "limit"
                }
            }
        ]
    }
}
```

Below schemas are **INVALID** because of min-max validations;

---

`SCHEMA 1: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "dailyCallLimit": 9
    }
}
```

`ERROR: 'greeting.service.json' is not valid, '$dailyCallLimit' cannot be less`
`than 10.`

---

`SCHEMA 2: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "dailyCallLimit": 101
    }
}
```

`ERROR: 'greeting.service.json' is not valid, '$dailyCallLimit' cannot be more`
`than 100.`

---

`SCHEMA 3: greeting.service.json`

```json
{
    "sayHello": {
        "name": "",
        "dailyCallLimit": 50
    }
}
```

`ERROR: 'greeting.service.json' is not valid, length of '$name' cannot be less`
`than 1.`

---

`SCHEMA 4: greeting.service.json`

```json
{
    "sayHello": {
        "name": "01234567890",
        "dailyCallLimit": 50
    }
}
```

`ERROR: 'greeting.service.json' is not valid, length of '$name' cannot be more`
`than 10.`
