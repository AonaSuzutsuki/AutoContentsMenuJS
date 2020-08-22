/*
    AutoContentsMenuJS    Copyright (C) AonaSuzutsuki 2020.
    v1.0

    MIT License
*/

class Stack {
    constructor() {
        this.array = [];
    }

    push(item) {
        this.array.push(item);
    }

    pop() {
        return this.array.length <= 0 ? null : this.array.pop();
    }

    each(func) {
        this.array.forEach((value, index) => func(value));
    }

    reduce(func) {
        return this.array.reduce((prev, current) => func(prev, current));
    }
}
