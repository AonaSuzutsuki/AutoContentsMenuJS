/*! 
    AutoContentsMenuJS    Copyright (C) AonaSuzutsuki 2020.
    MIT License
*/

function Stack() {
    const array = [];

    const push = (item) => array.push(item);

    this.push = (item) => push(item);

    this.pop = () => array.length <= 0 ? null : array.pop();
    
    this.each = (func) => array.forEach((value, index) => func(value));

    this.reduce = (func) => array.reduce((prev, current) => func(prev, current));
}

function Queue() {
    const array = [];

    const enqueue = (item) => array.push(item);

    this.enqueueRange = (items) => {
        for (let [_key, value] of Object.entries(items)) {
            enqueue(value);
        }
    }

    this.enqueue = (item) => enqueue(item);

    this.dequeue = () => array.length <= 0 ? null : array.shift();

    this.get = () => item = array.length < 0 ? null : array[0];
}

function AutoContentsMenuJS() {
    const _hierarchyMap = { "H1": 0, "H2": 1, "H3": 2, "H4": 3, "H5": 4, "H6": 5 };
    let _className = null;
    let _ignoreClassNmae = null;
    let _addedClassName = "";
    let _containerClassName = "";

    const createContentName = (contentTitle) => {
        let h3 = document.createElement("h3");
        h3.className = _addedClassName;
        h3.innerText = contentTitle;
        return h3;
    };

    const createLink = (href, text) => {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.innerText = text;
        return link;
    }

    const createParentString = (parentStringStack) => parentStringStack.reduce((prev, current) => prev + current);

    //
    // Automatic menu generation from an array of headline elements.
    //
    const appendMenuElements = (elements, containerStack, parentStringStack, isShowNumber) => {
        const item = containerStack.pop();
        const container = item[0];
        let number = item[1];
        const element = elements.dequeue();

        const parentString = createParentString(parentStringStack);

        const list = document.createElement("li");
        const id = element.getAttribute("id");
        const text = isShowNumber ? `${parentString}${number} ${element.innerText}` : element.innerText;
        list.appendChild(createLink(`#${id}`, text));
        container.appendChild(list);
        containerStack.push([container, number + 1]);

        const next = elements.get();
        if (next != null) {
            const nextHierarchy = _hierarchyMap[next.tagName];
            const currentHierarchy = _hierarchyMap[element.tagName];
            if (nextHierarchy > currentHierarchy) {
                const _container = document.createElement("ol");
                containerStack.push([_container, 1]);
                container.appendChild(_container);
                parentStringStack.push(`${number}.`);
                appendMenuElements(elements, containerStack, parentStringStack, isShowNumber);
            }
            else if (nextHierarchy === currentHierarchy) {
                appendMenuElements(elements, containerStack, parentStringStack, isShowNumber);
            }
            else {
                const loop = currentHierarchy - nextHierarchy;
                for (let i = 0; i < loop; i++) {
                    containerStack.pop();
                    parentStringStack.pop();
                }
                appendMenuElements(elements, containerStack, parentStringStack, isShowNumber);
            }
        }
    }

    //
    // Automatically add the id to elements.
    //
    const allocHeadId = (headers) => {
        const map = {};

        Array.from(document.body.getElementsByTagName("*")).forEach(value => {
            const id = value.getAttribute("id");
            if (id !== void 0)
                map[id] = id in map ? map[id] + 1 : 0;
        });

        headers.forEach((elem, index) => {
            if (elem.tagName in _hierarchyMap) {
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
    }

    //
    // Group according to a given class.
    //
    const separateGroup = (headers) => {
        const containerArray = [];
        let array = [];

        headers.forEach((header, index) => {
            if (header.tagName in _hierarchyMap) {
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
    }

    //
    // Removes the element with the specified class name.
    //
    const removeIgnoreClass = (elements, ignores) => {
        let array = Array.from(elements);
        let ignoreArray = Array.from(ignores);
        let removed = array.filter(elem => !ignoreArray.includes(elem));
        return removed;
    }

    //
    // Automatically generate contents menu.
    //
    const createContentsMenu = (isShowNumber) => {
        let headers = document.querySelectorAll(`${_className}, h1, h2, h3, h4, h5, h6`);
        if (_ignoreClassNmae) {
            let ignores = document.querySelectorAll(_ignoreClassNmae);
            headers = removeIgnoreClass(headers, ignores);
        }

        allocHeadId(headers);
        const groups = separateGroup(headers);

        const containerElement = document.createElement("div");
        if (_containerClassName)
            containerElement.className = _containerClassName;
        
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

            appendMenuElements(elements, containers, numberStack, isShowNumber);
            containerElement.appendChild(ol);
        }


        return containerElement;
    };

    //
    // An "auto-generate" method called by the user.
    //
    this.drawContentsMenu = (exportId, isShowNumber = false, contentTitle = "目次") => {
        const container = createContentsMenu(isShowNumber);

        let exportElement = document.querySelector(exportId);
        exportElement.appendChild(createContentName(contentTitle));
        exportElement.appendChild(container);
    };



    //
    // Set the class name to be considered a group.
    //
    this.registerGroup = (name) => _className = name;

    //
    // Set the class name to be ignored.
    //
    this.ignoreClass = (name) => _ignoreClassNmae = name;

    //
    // Set the class to be given to the title of the group.
    //
    this.registerGroupClass = (className) => _addedClassName = className;

    //
    // Set the class to be added to the table of contents container of each group.
    //
    this.registerContainerClass = (className) => _containerClassName = className;
}
