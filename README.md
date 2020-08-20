# AutoContentsMenuJS
Automatically generate a table of contents for the headings (h1, h2, h3, h4, h5, h6 tags) by hierarchy using JavaScript.
Tables of contents are often created by hand. However, as the size of the table of contents increases, it becomes difficult to keep the table of contents consistent when changing the display name, position, or ID of the headings.
This script reduces the burden of document creation by automatically generating a table of contents by calling a method in JavaScript.
The main feature of this script is that the table of contents can be divided into different groups.
This makes it possible to describe multiple topics on a single page.

# Sample
[Sample](https://aonsztk.xyz/sample/AutoMenu/AutoMenu.html)  
[Practical example](http://kimamalab.azurewebsites.net/SevenDays/BuildServer)  

# How to use
## Simple
### HTML
Define the insertion position of the menu.
```html
<div id="menu-container"></div>
```

Define an HTML document with headings.  
\* The id attribute can be specified, but it is not required.
```html
<h1 id="content1">h1</h1>
<h2>h2</h2>
<h3>h3</h3>
<div>
    content
</div>
<h1>h1</h1>
<div>
    <h2>h2</h2>
    <p>
        content
    </p>

    <div>
        <h3>h3</h3>
        <p>
            content
        </p>
    </div>

    <h2>h2</h2>
    <p>
        content
    </p>
</div>
<h1>h1</h1>
```

### JavaScript
Import AutoContentsMenuJS.min.js.
```html
<script type="text/javascript" src="AutoContentsMenuJS.min.js"></script>
```

Call **drawContentsMenu method** in AutoContentsMenuJS instance.
The first argument of the drawContentsMenu method is the ID as selector of the element to be written in the table of contents.  
The second argument specifies whether the table of contents should be numbered or not.
```javascript
let menu = new AutoContentsMenuJS();
menu.drawContentsMenu("#menu-container", true);
```


## Grouping
To divide a group, you can define the boundaries of the group with a div element.  
Specify the class name for the group.  
```html
<div class="content-group">Group1</div>
<h1 id="content1">h1</h1>
<h2>h2</h2>
<h3>h3</h3>
<div>
    content
</div>

<div class="content-group">Group2</div>
<h1>h1</h1>
<div>
    <h2>h2</h2>
    <p>
        content
    </p>

    <div>
        <h3>h3</h3>
        <p>
            content
        </p>
    </div>

    <h2>h2</h2>
    <p>
        content
    </p>
</div>
<h1>h1</h1>
```

Call the **registerGroup method** before call the drawContentsMenu method.  
The argument should be a class name as selector for the group.  
```javascript
let menu = new AutoContentsMenuJS();
menu.registerGroup(".content-group");
menu.drawContentsMenu("#menu-container", true);
```

The group title will be given ".content-title".


## Ignore the headlines.
Set the class name to be ignored to the element.  
```html
<h1 id="content1">h1</h1>
<h2>h2</h2>
<h2 class="ignore">h2(ignore)</h2>
<h3>h3</h3>
<div>
    content
</div>
```

Call the **ignoreClass method** before call the drawContentsMenu method.  
The argument should be a class name as selector to be ignored for the group.   
```javascript
let menu = new AutoContentsMenuJS();
menu.ignoreClass(".ignore");
menu.drawContentsMenu("#menu-container", true);
```


## Assign a class name to container and titles.
Can also set the class name to the title of the table of contents or the container element of the menu.  

The registerGroupClass method adds a class name to the table of contents title.
```javascript
menu.registerGroupClass("arrow box_arrow");
```

The HTML after the depiction is as follows.  
```html
<div id="menu-container">
    <h3 class="arrow box_arrow">Contents</h3>
    <div>
        <ol>
            ...
        </ol>
    </div>
</div>
```

The registerContainerClass method adds a class to the container of the menu item.  
```javascript
menu.registerContainerClass("h2_body");
```

The HTML after the depiction is as follows.  
```html
<div id="menu-container">
    <h3>Contents</h3>
    <div class="h2_body">
        <ol>
            ...
        </ol>
    </div>
</div>
```

\* For processing purposes, "." is not necessary.