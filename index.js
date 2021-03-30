const { todo, crm } = require('./client/src/app');

todo.events.onUpdate(function (done) {
    console.log("my callback: " + done);
});

todo.services.update(true);
todo.services.delete();

crm.services.negotiate(3);