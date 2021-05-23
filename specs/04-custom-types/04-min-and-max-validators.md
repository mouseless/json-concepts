# Min and Max Validators

Min and max validators can be applied to `number` or `string` variables. When
applied to a `string`, they validate its length. In the following concepts
definition, length of `$name` is expected to be between `1` and `10`, and value
of `$dailyCallLimit` to be between `10` and `100`.

`CONCEPTS: service.concepts.json`

```json name="service.concepts.json"
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

Below schemas are **invalid** because of min-max validations;

`SCHEMA: greeting-1.service.json`

```json name="greeting-1.service.json"
{
    "sayHello": {
        "name": "string",
        "dailyCallLimit": 9
    }
}
```

`ERROR: 'greeting-1.service.json' is not valid, '9' is not a valid limit.`

---

`SCHEMA: greeting-2.service.json`

```json name="greeting-2.service.json"
{
    "sayHello": {
        "name": "string",
        "dailyCallLimit": 101
    }
}
```

`ERROR: 'greeting-2.service.json' is not valid, '101' is not a valid limit.`

---

`SCHEMA: greeting-3.service.json`

```json name="greeting-3.service.json"
{
    "sayHello": {
        "name": "",
        "dailyCallLimit": 50
    }
}
```

`ERROR: 'greeting-3.service.json' is not valid, '' is not a valid identifier.`

---

`SCHEMA: greeting-4.service.json`

```json name="greeting-4.service.json"
{
    "sayHello": {
        "name": "01234567890",
        "dailyCallLimit": 50
    }
}
```

`ERROR: 'greeting-4.service.json' is not valid, '01234567890' is not a valid
identifier.`
