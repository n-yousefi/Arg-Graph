## a simple directed graph using jQuery

[Arg](https://en.wikipedia.org/wiki/Arg_e_Bam)-Graph is a simple free library for creating directed SVG graphs.

## Examples/Demos
The best way to become acquainted with the library is to see [Demos](https://n-yousefi.github.io/Arg-Graph/Demo/Example1.html)

## How it works
### HTML:
```html
<div id="arg-Graph">
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
### JavaScript
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
