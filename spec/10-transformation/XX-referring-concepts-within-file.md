# Referring Concepts Within File

A transformation file can include source and target concepts as a reference to
concepts files. Below transformation specifies its `@source` and `@target`
concepts files as references;

`TRANSFORMATION: client.from.service.json`

```json
{
    "@source": "service.concepts.json",
    "@target": "client.concepts.json",
    "function": {
        "service": { },
        "returnType": "responseType"
    },
    "argument": {
        "parameter": { },
        "map": {
            "type": "type"
        }
    }
}
```

## URL Reference

`TRANSFORMATION: client.from.service.json`

```json
{
    "@source": "https://jsonconcepts.github.io/samples/service.concepts.json",
    "@target": "https://jsonconcepts.github.io/samples/client.concepts.json",
    "function": {
        "service": { },
        "returnType": "responseType"
    },
    "argument": {
        "parameter": { },
        "map": {
            "type": "type"
        }
    }
}
```
