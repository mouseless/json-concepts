# Array Item Type

This is array of values (same for `+`)

`service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type",
        "response?": "$responseType",
        "tags*": "$tags:string", //support :any, :boolean, :number, :customType,
        "marks?": [ "$marks:string" ]
    }
}
```
