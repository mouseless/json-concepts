---
title: json concepts
home: true
footer: MIT License - Copyright (C) 2021, Cihan Deniz
---

**json concepts** is a meta-schema specification in JSON format which allows you
to create a conceptual design for any type of data structure, especially those
that represent a schema.

It is designed for definitions to have the same hierarchy with the schema files
they validate. So by looking at a definition, you will roughly understand what
schema it expects.

Here is a quick example.

`CONCEPTS: endpoint.concepts.json`

```json
{
    "$endpoint:path+": {
        "$method:method+": {
            "$parameter*": "$type",
            "response?": "$responseType",
            "status": [ "$status:status" ]
        }
    },
    "models?": {
        "$model+": {
            "$field*": "$type"
        },
    },
    "@types": {
        "path": "^\\/.*$",
        "method": [ "GET", "POST", "PUT", "DELETE" ],
        "status": [ 200, 201, 202, 204, 400, 401, 403, 404, 500 ]
    }
}
```

This definition introduces `$endpoint`, `$method`, `$parameter`, `$model` and
`$field` concepts. `$endpoint` is of type `:path`, `$method` is `:method`, and
so on. `@types` meta-data lists all custom types. Long story short, this
definition validates a schema like this one;

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

To understand how you can make use of **json concepts**, have a look at its
[use cases].

Or you can directly dive into the [specs].

## Contribution

Thanks for your interest in **json concepts**. If you want to ask a question or
make a contribution, just go to the [github repository]. See you
there :wave:

[use cases]: use-cases/README.md
[specs]: specs/README.md
[github repository]: https://github.com/codingatwill/json-concepts
