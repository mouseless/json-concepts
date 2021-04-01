# One or More

`+` constraint causes concepts to expect array of concept instances in given
data.

So for the following concepts definition, `$service+` indicates that there
will exist at least one `service` in every schema of this concepts file;

`service.concepts.json`

```json
{
    "$service+": {
        "$parameter?": "string"
    }
}
```

Now service data should be an array;

`greeting.json`

```json
{
    "service": [
        {
            "_key": "sayHello"
        },
        {
            "_key": "sayGoodbye",
            "parameter": {
                "_key": "name"
            }
        }
    ]
}
```

Output schema becomes;

`greeting.service.json`

```json
{
    "sayHello": { },
    "sayGoodbye": { 
        "name": "string"
    }
}
```

And the following data will **NOT** create a schema;

`greeting.json`

```json
{
    "service": [ ]
}
```

but gives a proper error message.
