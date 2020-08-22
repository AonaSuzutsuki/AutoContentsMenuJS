/*
    AutoContentsMenuJS    Copyright (C) AonaSuzutsuki 2020.
    v1.0

    MIT License
*/

class Queue {
    constructor() {
        this.array = [];
    }

    enqueue(item) {
        this.array.push(item);
    }

    enqueueRange(items) {
        for (let [_key, value] of Object.entries(items)) {
            this.enqueue(value);
        }
    }

    dequeue() {
        return this.array.length <= 0 ? null : this.array.shift();
    }

    get() {
        return this.array.length < 0 ? null : this.array[0];
    }
}
