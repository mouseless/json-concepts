# Inheritance

> TBD - A custom type can inherit from another custom type. They are merged.
> Inheritance is validated a circular dependency. a -> b -> c -> d -> a is not
> allowed.
>
> Inherit does not override validator, instead it creates a chain of validators.
>
> `status: [ 200, 201, 202, 204, 400, 401, 404 ], number`
>
> `success: [ 200, 201, 202, 204, 302 ], status`
>
> `302` is not a valid `success`, because it is not listed in `status`
