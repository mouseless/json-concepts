// ---------------------------
// this file is generated
// DO NOT modify code here
// ---------------------------

const business = {};

module.exports = { business };

// begin services
// begin business
business.services = {
    "get": function () {
        return "get called";
    }, 
    "getByName": function (name, nameAdded) {
        return "getByName called" + " (name: " + name + ")" + " (nameAdded: " + nameAdded + ")";
    }
};
// end business
// end services

// begin events
// begin business
business.events = {
};

// end business
// end events