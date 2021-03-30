const todo = {};
const crm = {};

module.exports = { todo, crm };

let domain = null;

// begin services
// begin todo
domain = todo;
domain.services = {
    "$": todo,
    "update": function (done) {
        console.log("update called"+ " (done: " + done + ")");
    }, 
    "delete": function () {
        console.log("delete called");
    }
};
// end todo
// begin crm
domain = crm;
domain.services = {
    "$": crm,
    "negotiate": function (price) {
        console.log("negotiate called"+ " (price: " + price + ")");
    }
};
// end crm
// end services

// begin events
// begin todo
domain = todo;
domain.events = {
    "$": todo,
    "onUpdate": function (callback) {
        this.$.events.update.callbacks.push(callback);
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

domain._services = {
    "$": todo
};
domain._services.update = domain.services.update;
domain.services.update = function(done) {
    this.$._services.update(done);
    
    this.$.events.update.raise(done);
}
// end todo
// begin crm
domain = crm;
domain.events = {
    "$": crm,
    "onNegotiate": function (callback) {
        this.$.events.negotiate.callbacks.push(callback);
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

domain._services = {
    "$": crm
};
domain._services.negotiate = domain.services.negotiate;
domain.services.negotiate = function(price) {
    this.$._services.negotiate(price);
    
    this.$.events.negotiate.raise(price);
}
// end crm
// end events