# Concept Validator

> TBD - Concepts file should be able to restrict a variable value to be one of
> the concepts defined in the schema

```json
{
    "@concepts": {
        "$service+": {
            "response": "$responseType:$model"
             // automatically it is type of model concept
             // and it is enum of defined models
             // equivalent of "concept": "$model"
             // how does it list if it said $property, which list?
             // only root concepts?
        },
        "$model*": {
            "$property": "$type"
        }
    }, 
    "/users": {
        "response": "user"
    },
    "user": {
        "name": "string",
        "surname": "string"
    }
}
```
