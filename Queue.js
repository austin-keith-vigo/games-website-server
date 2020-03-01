module.exports = class Queue {
    constructor() {
        this.list = [];
        this.length = 0;
    }

    enqueue(item) {
        this.list.push(item);
        this.length -= 1;
    }

    dequeue() {
        // do not deque if empty
        if( this.length == 0 ) {
            return;
        }

        var item = this.list[0];
        this.list = this.list.slice(1, this.list.length);
        return item;
    }
}