# Accessing Objects and Its Keys

```json
{
    "$parent": {
        "$child": "$value"
    }
}
```

```json
{
    "turkey": {
        "istanbul": "34"
    }
}
```

Array syntax is still valid;

```js
/* #parent */
var $parent$ =  {
    /* #child */
    $child$: "value$"
    /* / */
};
/* / */
```

Object syntax is also available without `#parent` and `#child` tags;

```js
var $parent$ =  { 
    $parent.child$: "$parent.child.value$" 
};
```

since `$parent$` is object, it is treated as `$parent._$`
since `$child$` is object it is treated as `$parent.child._$`
value is string so it remains `$parent.child.value$`

`SHADOW SCHEMA`

```json
{
    "parent": {
        "_": "turkey",
        "parent": "turkey",
        "child": {
            "_": "istanbul",
            "child": "istanbul",
            "value": "34"
        }
    }
}
```

Shadow schema is template friendly version of your original schema, to include
concept names available in template.
