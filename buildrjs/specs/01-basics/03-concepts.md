# Concepts

> TODO revise after 01 and 02 are revised..!!

Concepts are schemas that create schemas. To define concepts create a file with
`.concepts.json` extension.

For instance, following concepts file;

`service.concepts.json`

```json
{
    "$service": {
        "$parameter": "string"
    }
}
```

with following data;

`greeting.json`

```json
{
    "service": {
        "_key": "sayHello",
        "parameter": {
            "_key": "name"
        }
    }
}
```

generates following schema;

`greeting.service.json`

```json
{
    "sayHello": {
        "name": "string"
    }
}
```

> File name construction goes as follows;
>
> - `greeting` comes from the name of data file: `greeting.json`
> - `service` comes from the name of concepts file: `service.concepts.json`
> - `json` is the extension of json files
>
> So it is: `greeting.service.json`


## Case: Key Literals Under Concepts

When a variable exists next to a key literal, its value should be under the
first concept it is defined.

For below concepts file, `$responseType` value is expected to be under
`service` data.

`service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type",
        "response": "$responseType"
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
            "responseType": "string"
        }
    ]
}
```

Output schema is;

`greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "response": "string"
    }
}
```

## Case: Conflicts in Key Literals and Concept Keys

> TBD response literal under service conflicts with response parameter
