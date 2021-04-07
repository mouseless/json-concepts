# Auto Concepts

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

`Concepts: template.concepts.json`

```json
{
    "$function*": {
        "$parameter*": "$type"
    }
}
```
