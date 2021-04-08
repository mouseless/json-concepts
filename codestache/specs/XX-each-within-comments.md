# Each within Comments

```javascript
/**
 * <#parameter>
 * @param {$type$} $parameter$
 * </>
 */
function $function$(/* # */$parameter$) {
    console.log("$function$ called"
        /* #parameter */
        + " ($parameter$: " + $parameter$ + ")"
        /* / */
    );
}
```

or single line version

```javascript
/**
 * @param {$type$} $parameter$ // #parameter
 */
function $function$(/* # */$parameter$) {
    console.log("$function$ called"
        + " ($parameter$: " + $parameter$ + ")" // #parameter
    );
}
```
