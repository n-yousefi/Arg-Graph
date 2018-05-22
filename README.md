## Arg-Graph

[Arg](https://en.wikipedia.org/wiki/Arg_e_Bam)-Graph is a simple free library for creating dynamic Directed Graph using JQuery which enables you to draw SVG based connectors (lines, arrows) between DOM nodes via drag and drop.

![Directed Javascript graph](https://github.com/n-yousefi/Arg-Graph/blob/master/demo.png)
## Examples/Demos
The best way to become acquainted with the library is to see [Demos](https://n-yousefi.github.io/Arg-Graph/arg-graph-1.1/Example1.html)

## How it works
### Creating digraph:
You can create a digraph (directed graph) easily by calling the "ArgGraph" function.
```html
<div class="arg-Graph">
</div>
```
```javascript
var argGraph=$('.arg-Graph').ArgGraph();
```
### Adding new nodes:
#### Append html code
You can append new items to the container div, as html code. like this:
```html
<div class="arg-Graph">
     <div id="item1" class="arg-Graph_item" data-neighbors="item2,item3" style="left: 259px; top: 22px;">
        Title
        <span class="arg-Graph_connector-handler"></span>
        <span class="arg-Graph_delete-item"></span>
    </div>
    <div id="item2" class="arg-Graph_item" style="left: 159px; top: 212px;">
        Title
        <span class="arg-Graph_connector-handler"></span>
        <span class="arg-Graph_delete-item"></span>
    </div>
</div>
```
Now you must refresh the graph by calling 'refresh' function.
```javascript
argGraph.refresh()
```
#### import new item/s
Creating a JavaScript object and import that to the graph:
```javascript
newItem = {
        "id": "item1",
        "text": "Start",
        "position": {
            "left": "259px",
            "top": "22px"
        },
        "neighbors": [
            "item2",
            "item3"
        ]
    }
argGraph.import(newItem)
```
Note: You can append multiple items as array object using "import" function.
#### import JSON object
You can import this object as JSON format by calling "importJson" function.
```javascript
var json=JSON.stringify(newItem,null,4);
argGraph.importJson(json);
```

### Output
By calling "export"/"exportJson" function you can get a JavaScript/JSON object similar to the import object format:
```javascript
var json = argGraph.exportJson();

result:
[
    {
        "id": "item7",
        "text": "Test",
        "position": {
            "left": "531.328px",
            "top": "406px"
        },
        "neighbors": [
            "item8"
        ]
    },
    {
        "id": "item8",
        "text": "Deployment",
        "position": {
            "left": "373.328px",
            "top": "463px"
        },
        "neighbors": [
            "item9"
        ]
    },
    {
        "id": "item9",
        "text": "Test",
        "position": {
            "left": "239.328px",
            "top": "515px"
        },
        "neighbors": ""
    }
]
```


## Author
Naser Yousefi
     
