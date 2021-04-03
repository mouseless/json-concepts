# Render text using a template with any json

Case: There is a json and a template, but they don't match

Steps to follow;

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
    + createSchema(dataOrSchema: json): Schema
    + verifySchema(schema: json): boolean
    + verifyData(data: json): boolean
}

class Schema {
    - concepts: Concepts
    + getData(): JSON
}

class Transformation {
    - source: Concepts
    - target: Concepts
    + transform(source: Schema): Schema
    + transform(source: JSON): JSON
}

class Template {
    + render(schema: Schema): String
    + render(schema: Schema, transformation: Transformation): String
}

Transformation *-- Concepts : have >
Schema *-- Concepts : have > 
Transformation - Schema : transforms >
Schema - Template : renders <
```

## Pseudo Code of Facade Methods

```javascript
Concepts.createSchema = function(dataOrSchema) {
    if(verifySchema(dataOrSchema))
        return this + dataOrSchema; // => implementation

    if(verifyData(dataOrSchema))
        return this + dataOrSchema; // => implementation
    
    throw error;
}

Schema.getData = function() {
    return this + this.concepts; // => implementation
}

Transformation.transform = function(source: Schema) {
    return this.target.createSchema(
        this.transform(
            source.getData()
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
