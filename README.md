# JSON Concepts

"JSON Concepts" is a schema specification in JSON format which allows you to
create a conceptual design for any type of data structure, especially those
that represent a schema.

This repository mainly focuses on the specification of JSON Concepts, but there
is going to be a node.js implementation for PoC purposes.

Below is a sample concepts file;

`CONCEPTS: endpoint.concepts.json`

```json
{
    "$endpoint:path+": {
        "$method:method+": {
            "$parameter*": "$model",
            "response?": "$model",
            "status": [ "$status:status" ]
        }
    },
    "models?": {
        "$model+": {
            "$field*": "$type"
        },
    },
    "@types": {
        "path": "/\/.*/g",
        "method": [ "GET", "POST", "PUT", "PATCH", "DELETE" ],
        "status": [ 200, 201, 202, 204, 400, 401, 403, 404, 500 ]
    }
}
```

Below is a sample schema;

`SCHEMA: users.endpoint.json`

```json
{
    "@concepts": "endpoint.concepts.json",
    
    "/users": {
        "GET": {
            "name": "string",
            "response": "user",
            "status": [ 200, 404 ]
        },
        "POST": {
            "name": "string",
            "surname": "string",
            "status": [ 200, 400 ]
        }
    },
    "models": {
        "user": {
            "name": "string",
            "surname": "string",
            "email": "string"
        }
    }
}
```
