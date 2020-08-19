/*! 
    AutoMenu    Copyright (C) AonaSuzutsuki 2020.
    MIT License

    Includes jQuery.js
    Copyright JS Foundation and other contributors, https://js.foundation/
*/

function Stack() {
    const array = [];

    const push = (item) => array.push(item);

    this.push = (item) => push(item);

    this.pop = () => array.length <= 0 ? null : array.pop();
    
    this.each = (func) => array.forEach((value, index) => func(value));
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

    const createContentName = () => {
        let h3 = document.createElement("h3");
        h3.className = _addedClassName;
        h3.innerText = "目次";
        return h3;
    };

    const createLink = (href, text) => {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.innerText = text;
        return link;
    }

    const createParentString = (parentStringStack) => {
        let parentString = "";
        parentStringStack.each((item) => {
            parentString += item;
        });
        return parentString;
    }

    //
    // 見出し要素配列から自動メニュー生成
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
    // idが振られていないものを自動で降る
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
    // span.titleに応じてグループ分け
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

    const removeIgnoreClass = (elements) => {
        let array = Array.from(elements);
        let removed = array.filter(elem => !elem.classList.contains(_ignoreClassNmae));
        return removed;
    }

    //
    // 見出しのメニューを自動生成
    //
    const createContentsMenu = (isShowNumber) => {
        //let headers = $(`${_className}, h1, h2, h3, h4, h5, h6`);

        let headers = document.querySelectorAll(`${_className}, h1, h2, h3, h4, h5, h6`);
        if (_ignoreClassNmae)
            headers = removeIgnoreClass(headers);

        allocHeadId(headers);
        const groups = separateGroup(headers);

        const container2 = document.createElement("div");
        if (_containerClassName)
            container2.className = _containerClassName;
        
        let titleNumber = 1;
        for (let [_key, value] of Object.entries(groups)) {
            const key = value[0];
            if (key != null) {
                let title = document.createElement("div");
                title.innerText = key.innerText;
                title.className = `content-title title-${String(titleNumber++)}`;
                container2.appendChild(title);
            }

            const ol = document.createElement("ol");
            const containers = new Stack();
            containers.push([ol, 1]);

            const elements = new Queue();
            elements.enqueueRange(value[1]);

            const numberStack = new Stack();
            numberStack.push("");

            appendMenuElements(elements, containers, numberStack, isShowNumber);
            container2.appendChild(ol);
        }


        return container2;
    };

    this.drawContentsMenu = (exportId, isShowNumber = false) => {
        const container = createContentsMenu(isShowNumber);

        let exportElement = document.querySelector(exportId);
        exportElement.appendChild(createContentName());
        exportElement.appendChild(container);
    };

    this.registerGroup = (name) => _className = name;

    this.ignoreGroupClass = (name) => _ignoreClassNmae = name;

    this.registerGroupClass = (className) => _addedClassName = className;

    this.registerContainerClass = (className) => _containerClassName = className;
}
