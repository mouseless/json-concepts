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
    "update": function (done, by, doneAdded) {
        return "update called" + " (done: " + done + ")" + " (by: " + by + ")" + " (doneAdded: " + doneAdded + ")";
    }, 
    "delete": function () {
        return "delete called";
    }
};
// end todo
// begin crm
crm.services = {
    "negotiate": function (price, priceAdded) {
        return "negotiate called" + " (price: " + price + ")" + " (priceAdded: " + priceAdded + ")";
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
        raise: function (done, by, doneAdded) {
            for(let callback in this.callbacks){
                callback = this.callbacks[callback];

                callback(done, by, doneAdded);
            }
        }
    }
};

todo._services = {};
todo._services.update = todo.services.update;
todo.services.update = function(done, by, doneAdded) {
    const result = todo._services.update(done, by, doneAdded);
    
    todo.events.update.raise(done, by, doneAdded);

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
        raise: function (price, priceAdded) {
            for(let callback in this.callbacks){
                callback = this.callbacks[callback];

                callback(price, priceAdded);
            }
        }
    }
};

crm._services = {};
crm._services.negotiate = crm.services.negotiate;
crm.services.negotiate = function(price, priceAdded) {
    const result = crm._services.negotiate(price, priceAdded);
    
    crm.events.negotiate.raise(price, priceAdded);

    return result;
}
// end crm
// end events