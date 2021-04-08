# JSON Concepts

"JSON Concepts" is a schema specification in JSON format which allows you to
create a conceptual design for any type of data structure, especially those
that represent a schema.

This project mainly focuses on a specification rather than an implementation.
However there is going to be a node.js implementation for PoC purposes.

Below is a sample concepts file;

`CONCEPTS: endpoint.concepts.json`

```json
{
    "$endpoint+": {
        "$method+": {
            "$parameter*": "$model",
            "response?": "$responseModel",
            "status*": "$status:httpStatus"
        }
    },
    ":": {
        "httpStatus": [ 200, 400, 404 ]
    }
}
```

Below is a sample schema;

`SCHEMA: users.endpoint.json`

```json
{
    "$concepts": "endpoint.concepts.json",
    
    "users": {
        "get": {
            "name": "string",
            "response": "user",
            "status": [ 200, 404 ]
        },
        "post": {
            "name": "string",
            "surname": "string",
            "status": [ 200, 400 ]
        }
    }
}
```
