# Concepts

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
