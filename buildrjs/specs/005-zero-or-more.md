# Zero or More

Just like `+`, `*` constraint also requires an array of concept instances in
data file, except now it can be an empty array.

Changing parameter concept to `$parameter*` will allow zero or more parameters
under service concept;

`service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "string"
    }
}
```

Resulting following data;

`greeting.json`

```json
{
    "service": [
        {
            "_key": "sayHello"
        },
        {
            "_key": "sayGoodbye",
            "parameter": [
                {
                    "_key": "name",
                },
                {
                    "_key": "surname",
                }
            ]
        }
    ]
}
```

to render this schema;

`greeting.service.json`

```json
{
    "sayHello": { },
    "sayGoodbye": { 
        "name": "string",
        "surname": "string"
    }
}
```
