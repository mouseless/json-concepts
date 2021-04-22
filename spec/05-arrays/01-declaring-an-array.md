# Declaring an Array

When a literal has `+` or `*` quantifiers it means that value of that literal
should be an array.

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "tags*": "$tags"
    }
}
```

A more convenient way of declaring an array is as follows;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "tags?": [ "$tags" ]
    }
}
```

Two concepts definitions above have exactly the same validation rules, but their
shadow differ. Below shadow is for the latter;

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "_": "service",
        "quantifier": { "min": 1 },
        "literal": {
            "_": "tags",
            "quantifier": { "min": 0, "max": 1 },
            "variable": {
                "_": "tags",
                "array": true //??? not sure
            }
        }
    }
}
```

## Arrays for Concepts

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": [ "$types" ]
    }
}
```

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "_": "service",
        "quantifier": { "min": 1 },
        "concept": {
            "_": "parameter",
            "quantifier": { "min": 0 },
            "variable": {
                "_": "types",
                "array": true //??? not sure
            }
        }
    }
}
```

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": [ "string", "text" ],
        "surname": [ "string" ]
    }
}
```

> TBD -> Maybe forcing array is not a good idea, maybe `"surname": "string"`
> should also be valid. if so, revise previous specs which were forcing literals
> to have an array. This would also spread arrayify behavior everywhere.
>
> Also maybe shadows SHOULD interpret schema a little bit. Otherwise there will
> be an unnecessarily extra work for anyone who uses shadow without a library,
> which makes the shadows pretty much useless...? quantifiers all should have
> min & max no matter what. literal with a `*` or `+` should have
> `"array": true`(??) for variables.

```json
{
    "$service+": {
        "tags*": [ "$tagLists" ], // what does this mean, a double array?
        "matrix?": [ [ "$matrix" ] ], // and this is same as tagLists?
        
        // so this can go on forever...? yes
    }
}
```
