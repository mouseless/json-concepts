// ---------------------------
// this file is generated
// DO NOT modify code here
// ---------------------------

const todo = {};
const crm = {};

module.exports = { todo, crm };

// begin services
// begin todo
todo.services = {
    "update": function (done) {
        return "update called" + " (done: " + done + ")";
    }, 
    "delete": function () {
        return "delete called";
    }
};
// end todo
// begin crm
crm.services = {
    "negotiate": function (price) {
        return "negotiate called" + " (price: " + price + ")";
    }
};
// end crm
// end services

// begin events
// begin todo
todo.events = {
    "onUpdate": function (callback) {
        todo.events.update.callbacks.push(callback);
    },
    "update": {
        callbacks: [],
        raise: function (done) {
            for(let callback in this.callbacks){
                callback = this.callbacks[callback];

                callback(done);
            }
        }
    }
};

todo._services = {};
todo._services.update = todo.services.update;
todo.services.update = function(done) {
    const result = todo._services.update(done);
    
    todo.events.update.raise(done);

    return result;
}
// end todo
// begin crm
crm.events = {
    "onNegotiate": function (callback) {
        crm.events.negotiate.callbacks.push(callback);
    },
    "negotiate": {
        callbacks: [],
        raise: function (price) {
            for(let callback in this.callbacks){
                callback = this.callbacks[callback];

                callback(price);
            }
        }
    }
};

crm._services = {};
crm._services.negotiate = crm.services.negotiate;
crm.services.negotiate = function(price) {
    const result = crm._services.negotiate(price);
    
    crm.events.negotiate.raise(price);

    return result;
}
// end crm
// end events