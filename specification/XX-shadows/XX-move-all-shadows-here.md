# Move All Shadow Specs To Here

> TBD - leave related parts of shadow specs if it is necessary for that
> spec only. e.g. below spec doesn't need to be in a separate section, and does
> not require to include the whole shadow
>
> ## Concepts Shadow
>
> For following concepts definition, quantifier of `service` doesn't have a max;
>
> `CONCEPTS: service.concepts.json`
>
> ```json
> {
>     "$service+": {
>         "$parameter?": "$type"
>     }
> }
> ```
>
> `CONCEPTS SHADOW`
>
> ```json
> {
>     "concept": {
>         "_": "service", 
>         "quantifier": { "min": 1 },
>         "concept": {
>             "_": "parameter",
>             "quantifier": { "min": 0, "max": 1 },
>             "variable": {
>                 "_": "type"
>             }
>         }
>     }
> }
> ```
>
> Leave only this part in that spec;
>
> ```json
> {
>   "concept": {
>       ...
>       "quantifier": { "min": 1 }
>       ...
>   }
> }
>
