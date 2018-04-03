## a simple directed graph using jQuery

[Arg](https://en.wikipedia.org/wiki/Arg_e_Bam)-Graph is a simple free library for creating directed SVG graphs.

## Examples/Demos
The best way to become acquainted with the library is to see [Demos](https://n-yousefi.github.io/Arg-Graph/Demo/Example1.html)

## How it works
For each node, you can set the next nodes by defaults with data-next-ids attribute and let the user to create or change the graph by adding a handler to elements:
Example 1: Default Edges:
```html
<div id="arg-Graph" class="panel">
    <div id="item-1" class="arg-Graph_item" data-next-ids="item-2">
        Title
        <span class="arg-Graph_delete-item"></span>
    </div>
     <div id="item-2" class="arg-Graph_item">
        Title
        <span class="arg-Graph_delete-item"></span>
    </div>
</div>
```
Example 2: Dynamic creating edges by drag and drop:
```html
<div id="arg-Graph" class="panel">
    <div id="item-1" class="arg-Graph_item">
        Title
        <span class="arg-Graph_connector-handler"></span>
        <span class="arg-Graph_delete-item"></span>
    </div>
     <div id="item-2" class="arg-Graph_item">
        Title
        <span class="arg-Graph_connector-handler"></span>
        <span class="arg-Graph_delete-item"></span>
    </div>
</div>
```
Example 3: Using Both:
```html
     <div id="item-1" class="arg-Graph_item" data-next-ids="item-2">
        Title
        <span class="arg-Graph_connector-handler"></span>
        <span class="arg-Graph_delete-item"></span>
    </div>
    <div id="item-2" class="arg-Graph_item">
        Title
        <span class="arg-Graph_connector-handler"></span>
        <span class="arg-Graph_delete-item"></span>
    </div>
</div>
```
### Initialize
```javascript
 $('#arg-Graph').ArgGraph();
```

### Output
```javascript
var output = $('#arg-Graph').ArgGraph().output();
```


## Author
Naser Yousefi
     
 ## License
Licensed under the Apache License, Version 2.0.
