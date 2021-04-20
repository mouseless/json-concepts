# Variable Arrays

> TBD - Literal can have arrays with a quantifier, how can a concept have an array???

```json
{
    "$service+": {
        "$parameter*": [ "$types" ], // can this solve?
        "statusCode?": [ "$statusCodes" ], // how is this different than "statusCode*": "$statusCodes"?
        "tags*": [ "$tagLists" ], // if they are not different, then what does this mean, a double array?
        "matrix?": [ [ "$matrix" ] ], // and this is same as tagLists, so this can go on forever...?
        "response?": [ { 
            "$property*": "$value"
        } ] // wtf could this be? an array of objects with a concept in it?
    }
}
```

## Objet Arrays

This is array of objects

`service.concepts.json`

```json
{
    "$service+": {
        "parameters*": {
            "name": "$name", //parent variable name is parameters -> $parameters.name
            "type": "$type"
        }
    }
}
```
