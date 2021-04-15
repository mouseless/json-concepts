class Query {
    /* const */ #from;
    /* const */ #where;
    /* const */ #select;

    constructor(from, where, select) {
        this.#from = from;
        this.#where = where;
        this.#select = select;
    }
}