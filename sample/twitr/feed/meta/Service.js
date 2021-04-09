/* ! auto generation warning  */
// ---------------------------
// this file is generated
// DO NOT modify code here
// ---------------------------
/* ! auto generation warning  */

/* #domain */
const $domain$ = {};
/* / */

module.exports = { /* # */$domain$ };

/* #domain */
$domain$.services = {
    /* #service */
    $service$: function (/* # */$parameter$) {
        return "$service$ called"/* #parameter */ + " ($parameter$: " + $parameter$ + ")"/* / */;
    }
    /* / */
};
/* / */

/* #domain */
$domain$.events = {
    /* #event */
    $event$: function (callback) {
        $domain$.events.$service$.callbacks.push(callback);
    },
    $service$: {
        callbacks: [],
        raise: function (/* # */$parameter$) {
            for (let callback in this.callbacks) {
                callback = this.callbacks[callback];

                callback(/* # */$parameter$);
            }
        }
    }/* , */
    /* / */
};

$domain$._services = {};
/* #event */
$domain$._services.$service$ = $domain$.services.$service$;
$domain$.services.$service$ = function (/* # */$parameter$) {
    const result = $domain$._services.$service$(/* # */$parameter$);

    $domain$.events.$service$.raise(/* # */$parameter$);

    return result;
}
/* / */

/* / */