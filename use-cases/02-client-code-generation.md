# Client Code Generation

Assume you are developing a web app, the back-end team publishes an api and
shares a json file for their api specification.

## Example Case

Let's say the back-end team shared the following schema;

`SCHEMA: photos.service.json`

```json
{
    "/photos": {
        "post": {
            "content": "base64",
            "response": {
                "model": "#/ref"
            }
        },
        "get": {
            "start": "date",
            "end": "date",
            "response": { 
                "model": "#/photo",
                "type": "array"
            }
        }
    },
    "definitions": {
        "ref": {
            "uid": "string"
        },
        "photo": {
            "uid": "string",
            "url": "url",
            "date": "date"
        }
    }
}
```

> This schema is **not** OpenAPI, because of demonstration purposes.

Now to consume this api from your web app, assume you need to write below code;

`CODE: photos.client.js`

```javascript
function photos(url) {
    function post(content) {
        return axios(
                method: "post",
                url: `${url}/photos`,
                ...parameters({
                    content: content
                })
            ).then(response => response);
    }

    function get(start, end) {
        return axios(
                method: "get",
                url: `${url}/photos`,
                ...parameters({
                    start: start,
                    end: end
                })
            ).then(response => response);
    }

    function parameters(method, parameters) {
        return method === "get"
            ? { params: parameters }
            : { data: parameters };
    }

    return Object.freeze({
        post: post,
        get: get
    });
}
```

## With Concepts

Here, json concepts can help you parse and structure given service schema, so
that you can use a template engine to generate necessary client code.

Below concepts definition will cover given api schema;

`CONCEPTS: service.concepts.json`

```json
{
    "$resource*": {
        "$method*": {
            "$parameter*": "$type",
            "!response": {
                "model": "$model",
                "type?": "$type"
            }
        }
    },
    "definitions": {
        "$definition*": {
            "$property*": "$type"
        }
    }
}
```

Now that you have defined every concept for the given api schema, we can make
use of them to generate code with the following template;

`TEMPLATE: client.template.js`

```javascript
/* #resource */
function $resource$(url) {
    /* #method */
    function $method$(/* #, */$parameter$) {
        return axios(
                method: "$method$",
                url: `${url}/$resource$`,
                ...parameters("$method$", {
                    $parameter$: $parameter$ // #parameter,
                })
            ).then(response => response);
    }
    /* / */

    function parameters(method, parameters) {
        return method === "get"
            ? { params: parameters }
            : { data: parameters };
    }

    return Object.freeze({
        $method$: $method$ // #method,
    });
}
/* / */
```

> We used **codestache** template syntax because of its readability. Below you
> can find a mustache version of the same code template.
>
> ::: details Mustache version
>
> ```js
> 
> {{#resource}}
> function {{resource}}(url) {
>     {{#method}}
>     function {{method}}({{#parameter}}{{parameter}}{{^last}},{{/last}}{{/parameter}}) {
>         return axios(
>               method: "{{method}}",
>               url: `${url}/{{resource}}`,
>               ...parameters("{{method}}", {
>                   {{#parameter}}
>                   {{parameter}}: {{parameter}}{{^last}},{{/last}}
>                   {{/parameter}}
>               })
>           ).then(response => response);
>     }
>     {{/method}}
> 
>     function parameters(method, parameters) {
>         return method === "get"
>             ? { params: parameters }
>             : { data: parameters };
>     }
> 
>     return Object.freeze({
>         {{#method}}
>         {{method}}: {{method}}{{^last}},{{/last}}
>         {{/method}}
>     });
> }
> {{/resource}}
> ```
>
> Note that mustache does not support `last` and it does not exist in the shadow
> of above schema. So `last` needs to be added to schema shadow for this
> template to work correctly.
>
> :::

Now that its concepts and template are ready, client code can be generated
during build time with the following script;

```javascript
const schema = jc.Schema.load('photos.service.json', 'service.concepts.json');

const photosClient = cs.render('client.template.js', schema.shadow);

fs.writeFile('photos.client.js', photosClient);
```

## Without Concepts

Without using code generation, you would simply write the above code manually
and maintain it for future updates of the back-end api. There are a couple of
drawbacks worth mentioning here.

### Syncing With New Services

You will maintain your client code manually with every back-end update. With
code generation you will have the implementation right away, without any errors.

### Lower Cost of Change

Since it is generated, you can change your design decisions to make it better
at any time. For example, if you want to change `axios` to `fetch`, it would
require a rewrite for the client layer without code generation. Another example,
you may want to change the way you handle errors. If you use code generation, it
won't cost you an extra.

### More Readable

Things like error handling, logging and authentication are not necessarily have
to be done through runtime mechanisms like interceptors. This is because it is
not considered as code duplication when you generate the code.

### More Things To Generate

You can make use of this schema to generate mock implementations and test data
as well. This way you don't have to wait for the back-end team to develop these
apis.
