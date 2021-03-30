module.exports = { run };

const { todo, crm } = require('./app');

function run() {
    let domain = null;
    domain = todo;

    domain.events.onUpdate(function (done) {
        console.log("my callback: "+ "(done: " + done + ")");
    });

    domain.services.update("test - done");
    domain.services.delete();

    domain = crm;

    domain.events.onNegotiate(function (price) {
        console.log("my callback: "+ "(price: " + price + ")");
    });

    domain.services.negotiate("test - price");

};