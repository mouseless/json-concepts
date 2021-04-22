# Declaring an Array

Below is an array declaration for a literal.

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "tags?": [ "$tags" ]
    }
}
```

Below is its shadow;

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
                "array": true
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
> to have an array. This would also spread arrayify behavior everywhere. This
> way any array variable will accept `null` in schema, but shadow will always
> have an array.
>
> TBD -> Also maybe shadows SHOULD interpret schema a little bit. Otherwise
> there will be an unnecessarily extra work for anyone who uses shadow without a
> library, which makes shadows pretty much useless...? quantifiers all should
> have min & max no matter what. literal with a `*` or `+` should have
> `"array": true`(??) for variables. So all implicit things will go into shadow,
> like variable type will exist in shadow `"type": "any"`.

```json
{
    "$service+": {
        "matrix?": [ [ "$matrix" ] ], // this is double array
    }
}
```

> TBD -> Maybe allowing `*` and `+` for literals wasn't a good idea, it damages
> consistency;
>
> - `"tags?": [ "$tags" ]` is the same as `"$parameter?": [ "$types" ]`
> - `"tags*": "$tags"` is not the same `"$parameter*": "$type"`
>
> For the first one, both can appear once, and both has arrays. For the
> second one, `tags` can appear once and has an array, but `parameter` can
> appear more than once and it has a single value.
>
> Let's not allow `*` or `+` in literals. And voila! Inconsistency is gone!
