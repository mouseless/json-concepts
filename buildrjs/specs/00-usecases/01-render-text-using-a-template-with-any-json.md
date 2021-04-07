# Render text using a template with any json

## Case

There is a json and a template, but they don't match.

## Solution

- Create concepts for json
- Create concepts for template
- Create a transformation from concepts of json to concepts of template
- Transform existing json to a json that matches template
- Render template using new json

## Class Diagram

Below diagram allows;

- Verifying schemas against concepts
- Transforming a schema to another schema
- Generate code from templates and schemas

```plantuml

class Concepts {
    + loadSchema(schema: JSON, path: String): Schema
    + validateSchema(schema: JSON, path: String): boolean
    + {static} load(concepts: JSON, path: String): Concepts
}

class Schema {
    - concepts: Concepts
    + getJSON() : JSON
    + {static} load(schema: JSON, path: String): Schema
}

class Transformation {
    - source: Concepts
    - target: Concepts
    + transform(schema: Schema): Schema
    + transform(schema: JSON): JSON
}

class Template {
    + render(schema: Schema): String
    + render(schema: Schema, transformation: Transformation): String
}

Transformation *-- Concepts : has 2 >
Schema *-- Concepts : has > 
Transformation .. Schema : transforms >
Schema .. Template : renders <
```

## Pseudo Code of Facade Methods

```javascript
Concepts.createSchema = function(schema) {
    if(!validateSchema(schema))
        throw error;    
    
    return this + schema; // => implementation
}

Transformation.transform = function(source: Schema) {
    return this.target.createSchema(
        this.transform(
            source.getJSON()
        )
    );
}

Transformation.transform = function(source: JSON) {
    return this + this.target + source; // => implementation
}

Template.render = function(schema) {
    return this + schema; // => implementation
}

Template.render = function(schema, transformation) {
    return this.render(
        transformation.transform(schema)
    );
}
```
