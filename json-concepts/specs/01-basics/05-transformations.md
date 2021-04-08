# Transformations

Schema transformation is another main feature that JSON Concepts makes possible
along with schema validation. Transformations are of crucial importance
especially when dealing with source code generation.

> On top of a transformation example, this specification also includes a code
> generation example to emphasize the value of schema transformations more.

Assume you have implemented a back-end service and created the below schema to
represent that service;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "response": "string"
    }
}
```

Now to consume this service from client-side, assume you need to write below
code;

`CODE: greeting.client.js`

```javascript
/**
 * @param {String} name
 * @return {String}
 */
function hello(name) {
    return axios
        .get(`/sayHello/${name}`)
        .then(response => {
            return response;
        })
    ;
}
```

This client-side code is trivial and can be generated directly from a schema
and a template. However, there are certain differences that makes the service
schema not suitable to generate above code.

Most obvious differences are;

- Name of the function is `hello` instead of `sayHello`
- Type of the argument is `String` instead of `string`
- Return type is `String` instead of `string`

So below schema is more suitable to generate above code.

`SCHEMA: greeting.client.json`

```json
{
    "hello": {
        "name": "String",
        "return": "String",
        "rootPath": "sayHello"
    }
}
```

Other than literal differences, there are also conceptual differences. For
example in above schema, there is a `rootPath` to make a request to. This is a
conceptual difference rather than a literal one. So the conceptual differences
are;

- Code has a `function` instead of a `service`
- This function has an `argument`, not a `parameter`
- It does not have a `response` type, it has a `return` type
- It makes a request to a `rootPath`, not to the name of the `service`

Below is a concepts file to define concepts of this client code;

`CONCEPTS: client.concepts.json`

```json
{
    "$function": {
        "$argument": "$type",
        "rootPath": "$rootPath",
        "return": "$returnType"
    }
}
```

And below is a Codestache template for this client-side code to be generated;

`TEMPLATE: client.js`

```javascript
/**
 * @param {$function.argument.type$} $function.argument$
 * 
 * @return {$function.returnType$}
 */
function $function$($function.argument$) {
    return axios
        .get(`/$function.rootPath$/${$function.argument$}`)
        .then(response => response)
    ;
}
```

Every template requires its own concepts just like a view requiring its own
model in MVC, but what we have is two different definitions of concepts;

Client concepts are;

`CONCEPTS: client.concepts.json`

```json
{
    "$function": {
        "$argument": "$type",
        "rootPath": "$rootPath",
        "return": "$returnType"
    }
}
```

Service concepts are;

`CONCEPTS: service.concepts.json`

```json
{
    "$service": {
        "$parameter": "$type",
        "response": "$responseType"
    }
}
```

Now what we can do is to create a transformation file to define how a `service`
schema should be transformed into a `client` schema;

`TRANSFORMATION: client.from.service.json`

```json
{
    "function": {
        "from": "service",
        "map": {
            "_": "_.after('say').camelCase()",
            "rootPath": "_",
            "returnType": "responseType.capitalize()"
        }
    },
    "argument": {
        "from": "parameter",
        "map": {
            "_": "_",
            "type": "type.capitalize()"
        }
    }
}
```

What above transformation defines is this;

- `"from": "service"`
  - For a `service`, there is a `function`
- `"_": "_.after('say').camelCase()"`
  - Name of a function should not have prefix `say`, and it should be in
  `camelCase`
- `"rootPath": "_"`
  - Root path for a function is the name of its service
- `"returnType": "responseType.capitalize()"`
  - Return type of a function is capitalized version of response type of its
    service
- `"from": "parameter"`
  - For a `parameter`, there is an `argument`
- `"_": "_"`
  - Name of an argument is the same as the name of its parameter
- `"type": "type.capitalize()"`
  - Type of an argument is capitalized

Now we can transform following schema;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "response": "string"
    }
}
```

into this one;

`SCHEMA: greeting.client.json`

```json
{
    "hello": {
        "name": "String",
        "rootPath": "sayHello",
        "return": "String"
    }
}
```

And with this template;

`TEMPLATE: client.js`

```javascript
/**
 * @param {$function.argument.type$} $function.argument$
 * 
 * @return {$function.returnType$}
 */
function $function$($function.argument$) {
    return axios
        .get(`/$function.rootPath$/${$function.argument$}`)
        .then(response => response)
    ;
}
```

We can generate following client code;

`CODE: greeting.client.js`

```javascript
/**
 * @param {String} name
 * @return {String}
 */
function hello(name) {
    return axios
        .get(`/sayHello/${name}`)
        .then(response => {
            return response;
        })
    ;
}
```
