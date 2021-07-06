/** @private */ class Trace {
    /* const */ #map;

    /**
     * Trace is a helper to keep track of visited shadow objects when building
     * a concepts shadow tree.
     */
    constructor() {
        this.#map = new Map();
    }

    /**
     * Gets the previously visited item if an item with given name exists at
     * given key.
     * 
     * @param {*} key Key object
     * @param {String} name Name of the searched item
     * 
     * @returns {*} Visited item if found, `undefined` otherwise
     */
    get(key, name) {
        const array = this.#map.get(key);
        if (!array) {
            return undefined;
        }

        return array.find(item => item.name === name);
    }

    /**
     * Marks item as visited at given key.
     * 
     * @param {*} key Key object
     * @param {{name:String}} item Visited item
     */
    visit(key, item) {
        let array = this.#map.get(key);
        if (!array) {
            this.#map.set(key, array = []);
        }

        array.push(item);
    }

    /**
     * Removes item from visited list at given key.
     * 
     * @param {*} key Key object
     * @param {{name:String}} item Item to remove from list
     */
    unvisit(key, item) {
        const array = this.#map.get(key);
        if (!array) {
            return;
        }

        array.splice(array.indexOf(item));

        if (array.length == 0) {
            this.#map.delete(key);
        }
    }
}

module.exports = Trace;