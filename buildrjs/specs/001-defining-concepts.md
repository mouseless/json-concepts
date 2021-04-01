# Defining Concepts

Concepts are schemas that create schemas. Meta-schema could be another word for concepts, but we like concepts more.

To define concepts create a file with `.concepts.json` extension.

`service.concepts.json`

```json
{
    "$service": {
        "$parameter": "string"
    }
}
```

For the following data;

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

It creates following file;

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
