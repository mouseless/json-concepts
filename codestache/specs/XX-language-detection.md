# Language Detection

Extension of template file indicates which language to render.

`TEMPLATE: template.js`

```javascript
/* #function */
function $function$(/* # */$parameter$) {
    console.log("$function$ called"
        /* #parameter */
        + " $parameter$: " + $parameter$
        /* / */
    );
}
/* / */
```

`LANGUAGE: js.json`

```json
{
    "tag": {
        "begin": "/*",
        "end": "*/"
    },
    "variable": {
        "begin": "$",
        "end": "$"
    }
}
```

## Load Language Definition from URL

> TBD
