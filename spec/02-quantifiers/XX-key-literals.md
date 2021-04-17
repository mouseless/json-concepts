# Key Literals

> TBD

This is single value

`service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type",
        "response?": "$responseType"
    }
}
```

This is array of values (same for `+`)

`service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type",
        "response?": "$responseType",
        "tags*": "$tags:string" //support :any, :boolean, :number, :customType
    }
}
```

`greeting.json`

```json
{
    "service": [
        {
            "_key": "sayHello",
            "parameter": [
                {
                    "_key": "name",
                    "type": "string"
                }
            ],
            "responseType": "string",
            "tags": [
                "greets people",
                "is friendly"
            ]
        }
    ]
}
```

`greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "response": "string",
        "tags": [
            "greets people",
            "is friendly"
        ]
    }
}
```

This is array of objects

`service.concepts.json`

```json
{
    "$service+": {
        "parameters*": {
            "name": "$parameters.name",
            "type": "$parameters.type"
        }
    }
}
```

This is array of objects

`service.concepts.json`

```json
{
    "$service+": {
        "parameters*": {
            "name?": "$def.params.name",
            "type": {
                // top-down scan, parameters should be array,
                // $service -> object, params -> array so parameters* array is at $service.params
                // type is literal, it is skipped, isArray comes from $service.params[i].array
                "isArray": "$def.params.array:boolean", 
                "itemType": "$def.params.type"
            }
        }
    }
}
```

`greeting.json`

```json
{
    "service": [
        {
            "_key": "sayHello",
            "def": {
                "params": [
                    {
                        "name": "name",
                        "array": false,
                        "type": "string"
                    }
                ]
            }
        }
    ]
}
```

`greeting.service.json`

```json
{
    "sayHello": {
        "parameters": [
            {
                "name": "name",
                "type": {
                    "isArray": false,
                    "itemType": "string"
                }
            }
        ]
    }
}
```

> TODO think of more cases
>
> - arrays under arrays
> - how to access arrays of arrays etc
> - test against constructors problem!!
