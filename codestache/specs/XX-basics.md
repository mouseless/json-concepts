# Basics

`TEMPLATE: template.js`

```javascript
/* #function */
function $function$(/* # */$parameter$) {
    console.log("$function$ called"
        /* #parameter */
        + " $parameter: " + $parameter$
        /* / */
    );
}
/* / */
```

`SCHEMA: sample.json`

```json
{
    "$concepts": {
        "$function+": {
            "$parameter*": "$type"
        }
    },
    "firstFunction": {
        "firstParameter": "string",
        "secondParameter": "string"
    },
    "secondFunction": { }
}
```

`CODE: sample.js`

```javascript
function firstFunction(firstParameter, secondParameter) {
    console.log("firstFunction called" 
        + " firstParameter: " + firstParameter
        + " secondParameter: " + secondParameter
    );
}
function secondFunction() {
    console.log("secondFunction called" 
    );
}
```
