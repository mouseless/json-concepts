# Enum

Enum validator enables you to restrict value of a custom type to be one of the
items in a given list.

For following concepts file, `statusCode` is restricted to be either `200`,
`400` or `500`.

`service.concepts.json`

```json
{
    "$service+": {
        "statusCode": "$statusCode:httpStatus"
    },
    "@types": {
        "httpStatus": {
            "type": "number",
            "enum": [ 200, 400, 500 ]
        }
    }
}
```

Short-hand for enum validator is as follows;

`service.concepts.json`

```json
{
    "$service+": {
        "statusCode": "$statusCode:httpStatus"
    },
    "@types": {
        "httpStatus": [ 200, 400, 500 ]
    }
}
```

Here `httpStatus` automatically inherits from `number`, because every item in
the array is a `number`.

For following definition;

`service.concepts.json`

```json
{
    "$service+": {
        "statusCode": "$statusCode:httpStatus"
    },
    "@types": {
        "httpStatus": [ 200, "400", 500 ]
    }
}
```

base type of `httpStatus` is automatically set to `any`, because not all of the
items are of the same type.
