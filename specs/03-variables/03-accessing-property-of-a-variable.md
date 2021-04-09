# Accessing Property of a Variable

You can use value of a property of a variable instead of directly using its
value.

For the following concepts file, `$type.name` indicates that `type` is expected
to be an object with a property named `name` and value of this property should
used when creating schema file. So for this concepts file;

`service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type.name"
    }
}
```

Following data;

`greeting.json`

```json
{
    "service": [
        {
            "_key": "sayHello",
            "parameter": [
                {
                    "_key": "name",
                    "type": {
                        "name": "string"
                    }
                }
            ]
        }
    ]
}
```

will create this schema;

`greeting.service.json`

```json
{
    "sayHello": {
        "name": "string"
    }
}
```

## Deeper Levels Are Supported

It is allowed to go as deep as it needs to be;

`deep.concepts.json`

```json
{
    "$you": "$can.go.as.deep.as.you.can"
}
```

`levels.json`

```json
{
    "you": {
        "_key": "there are",
        "can": {
            "go": {
                "as": {
                    "deep": {
                        "as": {
                            "you": {
                                "can": "so many levels"
                            }
                        }
                    }
                }
            }
        }
    }
}
```

`levels.deep.json`

```json
{
    "there are": "so many levels"
}
```
