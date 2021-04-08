# Each, If, Unless

## Each

```javascript
/* #key */
const $key$ = "hey!";
/* / */
```

renders `hey!` for every key in given schema

```javascript
const $key$ = "hey!" // #key
```

single line version of it

## If

```javascript
/* ?key */
const $key$ = "hey!";
/* / */
```

renders `hey!` if key is `true`

```javascript
const $key$ = "hey!" // ?key
```

## Unless

```javascript
/* !key */
const $key$ = "hey!";
/* / */
```

renders `hey!` unless key is `true`

```javascript
const $key$ = "hey!" // !key
```
