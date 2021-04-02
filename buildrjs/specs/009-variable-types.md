# Variable Types

Variable types can be defined explicitly.

For this schema, `$async:boolean` denotes that `async` should be a `boolean`;

`service.concepts.json`

```json
{
    "$service+": {
        "async": "$async:boolean"
    }
}
```

So for this data;

`greeting.json`

```json
{
    "service": [
        {
            "_key": "sayGoodbye",
            "async": "yes",
        }
    ]
}
```

A validation error will be displayed.

## Available Variable Types

- `:any` allows any type of value to be set to corresponding variable
- `:string` allows only string values
- `:boolean` allows only `true` or `false`
- `:number` allows only numbers

Not specifying a variable type means it is `:any`. Two concepts files below
are the same;

`explicit.concepts.json`

```json
{
    "$service+": {
        "tag": "$tag:any"
    }
}
```

`implicit.concepts.json`

```json
{
    "$service+": {
        "tag": "$tag"
    }
}
```
