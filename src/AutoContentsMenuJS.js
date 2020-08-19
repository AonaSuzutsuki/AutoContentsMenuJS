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

function AutoMenu() {
    const _hierarchyMap = { "H1": 0, "H2": 1, "H3": 2, "H4": 3, "H5": 4, "H6": 5 };
    let _className = null;
    let _ignoreClassNmae = null;
    let _addedClassName = "";
    let _containerClassName = "";

    const createContentName = () => $(`<h3 class="${_addedClassName}">`).text("目次");

    const createLink = (href, text) => {
        const link = $("<a>");
        link.attr("href", href);
        link.text(text);
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

        const list = $("<li>");
        const id = $(element).attr("id");
        const text = isShowNumber ? `${parentString}${number} ${$(element).text()}` : $(element).text();
        list.append(createLink(`#${id}`, text));
        container.append(list);
        containerStack.push([container, number + 1]);

        const next = elements.get();
        if (next != null) {
            const nextHierarchy = _hierarchyMap[next.tagName];
            const currentHierarchy = _hierarchyMap[element.tagName];
            if (nextHierarchy > currentHierarchy) {
                const _container = $("<ol>");
                containerStack.push([_container, 1]);
                container.append(_container);
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

        $("*").each((index, value) => {
            const id = $(value).attr("id");
            if (id !== void 0)
                map[id] = id in map ? map[id] + 1 : 0;
        });

        headers.forEach((elem, index) => {
            if (elem.tagName in _hierarchyMap) {
                const element = $(elem);
                const id = element.attr("id");
                if (id === void 0) {
                    const text = element.text();
                    if (text in map) {
                        let index = map[text];
                        element.attr("id", `${text}_${++index}`);
                        map[text] = index;
                    }
                    else {
                        element.attr("id", text);
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

        const container = $(`<div class="${_containerClassName}">`);
        let titleNumber = 1;
        for (let [_key, value] of Object.entries(groups)) {
            const key = value[0];
            if (key != null) {
                let title = $("<div>").text($(key).text());
                title.addClass("content-title");
                title.addClass("title-" + String(titleNumber++));
                container.append(title);
            }

            const ol = $("<ol>");
            const containers = new Stack();
            containers.push([ol, 1]);

            const elements = new Queue();
            elements.enqueueRange(value[1]);

            const numberStack = new Stack();
            numberStack.push("");

            appendMenuElements(elements, containers, numberStack, isShowNumber);
            container.append(ol);
        }


        return container;
    };

    this.drawContentsMenu = (exportId, isShowNumber = false) => {
        const container = createContentsMenu(isShowNumber);

        $(exportId).append(createContentName());
        $(exportId).append(container);
    };

    this.registerGroup = (name) => _className = name;

    this.ignoreGroupClass = (name) => _ignoreClassNmae = name;

    this.registerGroupClass = (className) => _addedClassName = className;

    this.registerContainerClass = (className) => _containerClassName = className;
}
