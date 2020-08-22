/*@license 
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

class AutoContentsMenuGenerator {
    constructor() {
        this._hierarchyMap = { "H1": 0, "H2": 1, "H3": 2, "H4": 3, "H5": 4, "H6": 5 };
        this._className = null;
        this._ignoreClassNmae = null;
        this._addedClassName = "";
        this._containerClassName = "";
    }


    static createContentName(contentTitle) {
        let h3 = document.createElement("h3");
        h3.className = this._addedClassName;
        h3.innerText = contentTitle;
        return h3;
    };

    static createLink(href, text) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.innerText = text;
        return link;
    };

    static createParentString(parentStringStack) {
        return parentStringStack.reduce((prev, current) => prev + current);
    }

    //
    // Automatic menu generation from an array of headline elements.
    //
    appendMenuElements(elements, containerStack, parentStringStack, isShowNumber) {
        const item = containerStack.pop();
        const container = item[0];
        let number = item[1];
        const element = elements.dequeue();

        const parentString = AutoContentsMenuGenerator.createParentString(parentStringStack);

        const list = document.createElement("li");
        const id = element.getAttribute("id");
        const text = isShowNumber ? `${parentString}${number} ${element.innerText}` : element.innerText;
        list.appendChild(AutoContentsMenuGenerator.createLink(`#${id}`, text));
        container.appendChild(list);
        containerStack.push([container, number + 1]);

        const next = elements.get();
        if (next != null) {
            const nextHierarchy = this._hierarchyMap[next.tagName];
            const currentHierarchy = this._hierarchyMap[element.tagName];
            if (nextHierarchy > currentHierarchy) {
                const _container = document.createElement("ol");
                containerStack.push([_container, 1]);
                container.appendChild(_container);
                parentStringStack.push(`${number}.`);
                this.appendMenuElements(elements, containerStack, parentStringStack, isShowNumber);
            }
            else if (nextHierarchy === currentHierarchy) {
                this.appendMenuElements(elements, containerStack, parentStringStack, isShowNumber);
            }
            else {
                const loop = currentHierarchy - nextHierarchy;
                for (let i = 0; i < loop; i++) {
                    containerStack.pop();
                    parentStringStack.pop();
                }
                this.appendMenuElements(elements, containerStack, parentStringStack, isShowNumber);
            }
        }
    };

    //
    // Automatically add the id to elements.
    //
    allocHeadId(headers) {
        const map = {};

        Array.from(document.body.getElementsByTagName("*")).forEach(value => {
            const id = value.getAttribute("id");
            if (id !== void 0)
                map[id] = id in map ? map[id] + 1 : 0;
        });

        headers.forEach((elem, index) => {
            if (elem.tagName in this._hierarchyMap) {
                const id = elem.getAttribute("id");
                if (id == null) {
                    const text = elem.innerText;
                    if (text in map) {
                        let index = map[text];
                        elem.setAttribute("id", `${text}_${++index}`);
                        map[text] = index;
                    }
                    else {
                        elem.setAttribute("id", text);
                        map[text] = 0;
                    }
                }
                else {
                    map[id] = id in map ? map[id] + 1 : 0;
                }
            }
        });
    };

    //
    // Group according to a given class.
    //
    separateGroup(headers) {
        const containerArray = [];
        let array = [];

        headers.forEach((header, index) => {
            if (header.tagName in this._hierarchyMap) {
                array.push(header);
            }
            else {
                array = [];
                containerArray[containerArray.length] = [header, array];
            }
        });

        if (containerArray.length == 0)
            containerArray[0] = [null, array];

        return containerArray;
    };

    //
    // Removes the element with the specified class name.
    //
    removeIgnoreClass(elements, ignores) {
        let array = Array.from(elements);
        let ignoreArray = Array.from(ignores);
        let removed = array.filter(elem => !ignoreArray.includes(elem));
        return removed;
    };

    //
    // Automatically generate contents menu.
    //
    createContentsMenu(isShowNumber) {
        let headers = document.querySelectorAll(`${this._className}, h1, h2, h3, h4, h5, h6`);
        if (this._ignoreClassNmae) {
            let ignores = document.querySelectorAll(this._ignoreClassNmae);
            headers = this.removeIgnoreClass(headers, ignores);
        }

        this.allocHeadId(headers);
        const groups = this.separateGroup(headers);

        const containerElement = document.createElement("div");
        if (this._containerClassName)
            containerElement.className = this._containerClassName;

        let titleNumber = 1;
        for (let [_key, value] of Object.entries(groups)) {
            const key = value[0];
            if (key != null) {
                let title = document.createElement("div");
                title.innerText = key.innerText;
                title.className = `content-title title-${String(titleNumber++)}`;
                containerElement.appendChild(title);
            }

            const ol = document.createElement("ol");
            const containers = new Stack();
            containers.push([ol, 1]);

            const elements = new Queue();
            elements.enqueueRange(value[1]);

            const numberStack = new Stack();
            numberStack.push("");

            this.appendMenuElements(elements, containers, numberStack, isShowNumber);
            containerElement.appendChild(ol);
        }


        return containerElement;
    };

    //
    // An "auto-generate" method called by the user.
    //
    drawContentsMenu(exportId, isShowNumber = false, contentTitle = "目次") {
        const container = this.createContentsMenu(isShowNumber);

        let exportElement = document.querySelector(exportId);
        exportElement.appendChild(AutoContentsMenuGenerator.createContentName(contentTitle));
        exportElement.appendChild(container);
    }



    //
    // Set the class name to be considered a group.
    //
    registerGroup(name) {
        this._className = name;
    }

    //
    // Set the class name to be ignored.
    //
    ignoreClass(name) {
        this._ignoreClassNmae = name;
    }

    //
    // Set the class to be given to the title of the group.
    //
    registerGroupClass(className) {
        this._addedClassName = className;
    }

    //
    // Set the class to be added to the table of contents container of each group.
    //
    registerContainerClass(className) {
        this._containerClassName = className;
    }
}
