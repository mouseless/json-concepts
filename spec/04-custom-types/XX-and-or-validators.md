# And / Or Validators

> TBD - Default is and validator. Or should also be supported.
>
> - Should it support multiple root types?
> - How can same validator occur more than once?

```json
{
    "@concepts": {
        "$service+": {
            "$parameter*": "$value:status"
        },
        "@types": {
            "numberOrString": {
                "or": {
                    "enum": [ 200, 201 ],
                    "enum": [ 400, 404 ]
                }
            }
        }
    }
}
