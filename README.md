## Arg-Graph

[Arg](https://en.wikipedia.org/wiki/Arg_e_Bam)-Graph is a simple free library for creating dynamic Directed Graph using JQuery which enables you to draw SVG based connectors (lines, arrows) between DOM nodes via drag and drop.

![Directed Javascript graph](https://github.com/n-yousefi/Arg-Graph/blob/master/demo.png)
## Examples/Demos
The best way to become acquainted with the library is to see [Demos](https://n-yousefi.github.io/Arg-Graph/Demo/Example1.html)

## How it works
### HTML:
```html
<div class="arg-Graph">
     <div id="item1" class="arg-Graph_item" data-next-ids="item2,item3">
        Title
        <span class="arg-Graph_connector-handler"></span>
        <span class="arg-Graph_delete-item"></span>
    </div>
    <div id="item2" class="arg-Graph_item">
        Title
        <span class="arg-Graph_connector-handler"></span>
        <span class="arg-Graph_delete-item"></span>
    </div>
</div>
```
### JavaScript
```javascript
 $('.arg-Graph').ArgGraph();
```

### Output
You can get output as an JavaScript object like this:
```javascript
{
    "item1": {
        "nextIds": [
            "item2",
            "item3"
        ]
    },
    "item2": {
        "nextIds": [
            "item4"
        ]
    },
    "item3": {
        "nextIds": [
            "item4"
        ]
    },
    "item4": {
        "nextIds": [
            "item5"
        ]
    },
    "item5": {},
}
```
Only by calling the output function:
```javascript
var output = $('.arg-Graph').ArgGraph().output();
```


## Author
Naser Yousefi
     
