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
<h4>h4</h4>
<h3>h3</h3>
<h4>h4</h4>
<h5>h5</h5>
<div>
    content
</div>
<h6>h6</h6>
<div>
    content
</div>
<h2>h2</h2>
<h1>h1</h1>
```

### JavaScript
Import AutoContentsMenuJS.min.js.
```html
<script type="text/javascript" src="AutoContentsMenuJS.min.js"></script>
```


```javascript
let menu = new AutoMenu();
menu.drawContentsMenu("#menu-container", true);
```

## Grouping