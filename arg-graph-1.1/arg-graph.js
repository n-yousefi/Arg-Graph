//####Arg-Graph####
// a simple JQuery library to generate directional graphs.
// version 1.1, 2 Apr 2018
// by Naser Yousefi
// Website: https://github.com/n-yousefi/Arg-Graph
//################
; (function ($) {
    $.fn.ArgGraph = function (options) {
        var element = $(this);
        var defaults = {
            dragObject: new Object(),
            mouseObject: new Object(),
            groupingAttr: "data-group-id",
            onChange: function () { },
            onGraphChange: function () { }
        };
        var settings = {};
        var getCenter = function (div) {
            return {
                x: div.offsetLeft + div.offsetWidth / 2,
                y: div.offsetTop + div.offsetHeight / 2
            };
        };
        var getRectangleLines = function (div) {
            var result = new Object();
            result.L1 = {
                x1: div.offsetLeft,
                y1: div.offsetTop,
                x2: div.offsetLeft,
                y2: div.offsetTop + div.offsetHeight
            };
            result.L2 = {
                x1: div.offsetLeft,
                y1: div.offsetTop,
                x2: div.offsetLeft + div.offsetWidth,
                y2: div.offsetTop
            };
            result.L3 = {
                x1: div.offsetLeft,
                y1: div.offsetTop + div.offsetHeight,
                x2: div.offsetLeft + div.offsetWidth,
                y2: div.offsetTop + div.offsetHeight,
            };
            result.L4 = {
                x1: div.offsetLeft + div.offsetWidth,
                y1: div.offsetTop,
                x2: div.offsetLeft + div.offsetWidth,
                y2: div.offsetTop + div.offsetHeight,
            };
            return result;
        };
        var checkLineCollision = function (line1, line2) {
            var uA = ((line2.x2 - line2.x1) * (line1.y1 - line2.y1) - (line2.y2 - line2.y1) * (line1.x1 - line2.x1)) / ((line2.y2 - line2.y1) * (line1.x2 - line1.x1) - (line2.x2 - line2.x1) * (line1.y2 - line1.y1));
            var uB = ((line1.x2 - line1.x1) * (line1.y1 - line2.y1) - (line1.y2 - line1.y1) * (line1.x1 - line2.x1)) / ((line2.y2 - line2.y1) * (line1.x2 - line1.x1) - (line2.x2 - line2.x1) * (line1.y2 - line1.y1));
            if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
                var intersection =
                    {
                        x: line1.x1 + (uA * (line1.x2 - line1.x1)),
                        y: line1.y1 + (uA * (line1.y2 - line1.y1)),
                    };
                return intersection;
            }
            return null;
        };
        var getDestinationPosition = function (orginPoint, destinationDiv) {
            var destinationPoint = getCenter(destinationDiv);
            var connectorLine = {
                x1: orginPoint.x,
                y1: orginPoint.y,
                x2: destinationPoint.x,
                y2: destinationPoint.y
            };
            var destinationLines = getRectangleLines(destinationDiv);
            var result;
            $.each(destinationLines,
                function (index, line) {
                    if (!result) {
                        var collisionPoint = checkLineCollision(connectorLine, line);
                        if (collisionPoint) {
                            result = collisionPoint;
                        }
                    }
                });
            return result;
        };
        var getdStr = function (fropPos, toPos) {
            return "M" +
                (fropPos.x) + "," + (fropPos.y) + " " +
                "L" +
                (toPos.x) + "," + (toPos.y) + " ";
        };
        var refreshConnectors = function () {
            var arrows = element.find("svg > g")[0];
            if (arrows) {
                arrows.innerHTML = "";
                $.each(items,
                    function (index, orginDiv) {
                        var orginPoint = getCenter(orginDiv);
                        var $orginDiv = $(orginDiv);
                        if (settings.dragObject.dragging
                            && settings.dragObject.type == 'C'
                            && $orginDiv.attr("Id") == settings.dragObject.itemId
                            && settings.mouseObject) {
                            var path = '<path d="' + getdStr(orginPoint, settings.mouseObject) + '"/>';
                            arrows.innerHTML += path;
                        }
                        var neighbors = $orginDiv.attr("data-neighbors");
                        if (neighbors) {
                            neighbors = neighbors.split(",");
                            $.each(neighbors,
                                function (index2, val2) {
                                    if (val2) {
                                        var nextDiv = $("#" + val2)[0];
                                        var destinationPoint = getDestinationPosition(orginPoint, nextDiv);
                                        if (destinationPoint) {
                                            var path = '<path d="' + getdStr(orginPoint, destinationPoint) + '"/>';
                                            arrows.innerHTML += path;
                                        }
                                    }
                                });
                        }
                    });
            }
        };
        var dragToMouseLocation = function () {
            if (settings.dragObject.dragging && settings.dragObject.type === 'D' && settings.mouseObject) {
                var dragItem = element.find('#' + settings.dragObject.itemId);
                if (dragItem) {
                    dragItem.css('left', settings.mouseObject.x - settings.dragObject.offsetX + 'px');
                    dragItem.css('top', settings.mouseObject.y - settings.dragObject.offsetY + 'px');
                    change();
                }
            };
        };
        var draggingCancel = function () {
            if (settings.dragObject.dragging) {
                settings.dragObject.dragging = false;
                settings.dragObject.itemId = null;
                settings.dragObject.type = null;
                refreshConnectors();
            }
        };
        var addSvgMarkers = function () {
            var svg = element.find("#arg-Graph_svg");
            if (!svg || svg.length <= 0) {
                var myvar = $('<svg id="arg-Graph_svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">' +
                    '            <defs>' +
                    '                <marker id="arrow" viewBox="0 0 10 10" refX="3" refY="5"' +
                    '                        markerWidth="6" markerHeight="6" orient="auto">' +
                    '                    <path d="M 0 0 L 10 5 L 0 10 z" />' +
                    '                </marker>' +
                    '            </defs>' +
                    '            <g fill="none" stroke="black" stroke-width="2" marker-end="url(#arrow)"></g>' +
                    '        </svg>');
                element.prepend(myvar);
            }
        };
        var refreshItems = function () {
            // بروز کردن آیتم ها
            items = element.find(".arg-Graph_item");

            items
                .mousedown(function (e) {
                    if (e.button !== 2) {
                        e.stopPropagation();
                        e.preventDefault();
                        settings.dragObject.offsetX = e.offsetX;
                        settings.dragObject.offsetY = e.offsetY;
                        var $target = $(e.target);
                        if (!settings.dragObject.dragging) {
                            settings.dragObject.dragging = true;
                            settings.dragObject.itemId = $(this).attr("Id");
                            if (!$target.is(".arg-Graph_connector-handler")) {
                                settings.dragObject.type = "D"; // Dragging Items;
                            } else {
                                settings.dragObject.type = "C"; // Creating Connector
                            }
                        }
                    }
                    return false;
                })
                .mouseover(function (e) {
                    var $this = $(this);
                    $this.find('.arg-Graph_delete-item').show();
                    $this.find('.arg-Graph_connector-handler').show();
                })
                .mouseleave(function (e) {
                    $('.arg-Graph_delete-item').hide();
                    $('.arg-Graph_connector-handler').hide();
                })
                .click(function (e) {
                    var $this = $(this);
                    var $target = $(e.target);
                    if ($target.is('.arg-Graph_delete-item')) {
                        var id = $this.attr('id');
                        $.each(items,
                            function (key, val) {
                                var $val = $(val);
                                var ids = $val.attr("data-neighbors");
                                if (ids) {
                                    var newIds = ids.split(",").filter(function (a) { return a !== id }).join(",");
                                    if (newIds)
                                        $val.attr("data-neighbors", newIds);
                                    else $val.removeAttr("data-neighbors");
                                }
                            });
                        $this.remove();
                        changeGraph();
                    }
                });
        }
        var importNewNode = function (newNode) {
            var node = element.find('#' + newNode.id);
            if (node.length <= 0) {
                var node = $("<div>" +
                    "<span class=\"arg-Graph_connector-handler\" style=\"display: none; \"></span>" +
                    "<span class=\"arg-Graph_delete-item\" style=\"display: none;\" ></span ></div>");
                element.append(node);
                node.attr("id", newNode.id);
                node.addClass("arg-Graph_item");
                node.prepend(newNode.text);

            }  
            node.css("left", newNode.position.left);
            node.css("top", newNode.position.top);     
            var ngbs = '';
            $.each(newNode.neighbors,
                function (indx, ngb) {
                    ngbs += ngb + ",";
                });
            node.attr('data-neighbors', ngbs.slice(0, -1));
        }
        var change = function () {
            settings.onChange();
        }
        var changeGraph = function () {
            refreshItems();
            refreshConnectors();
            change();
            settings.onGraphChange();
        }
        var init = function () {
            settings = $.extend({}, defaults, options);
            element = $(element);
            addSvgMarkers();
            element
                .mousemove(function (e) {
                    var $of = $(this).offset();
                    settings.mouseObject = {
                        x: e.pageX - $of.left,
                        y: e.pageY - $of.top
                    };
                    if (settings.dragObject.dragging) {
                        if (settings.dragObject.type === 'D')
                            dragToMouseLocation();
                        refreshConnectors();
                    }
                    if (settings.dragObject.dragging) {
                        $('.arg-Graph_delete-item').hide();
                        $('.arg-Graph_connector-handler').hide();
                    }
                })
                .mouseup(function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var $target = $(e.target);
                    if (!$target.is('.arg-Graph_item')) {
                        $target = $target.closest(".arg-Graph_item");
                    }

                    if (settings.dragObject.dragging && settings.dragObject.type === 'C' && $target != null) {
                        var targetId = $target.attr("id");
                        var startDrag = element.find("#" + settings.dragObject.itemId);
                        var startId = startDrag.attr("id");
                        if (targetId != startId) {
                            if ($target.hasClass("arg-Graph_item")) {
                                var ids = startDrag.attr("data-neighbors");
                                if (ids) {
                                    if (ids.split(",").indexOf(targetId) < 0) {
                                        ids += "," + targetId;
                                        startDrag.attr("data-neighbors", ids);
                                    }
                                } else {
                                    ids = $target.attr("id");
                                    startDrag.attr("data-neighbors", ids);
                                }
                                changeGraph();
                            }
                        }
                    }
                    draggingCancel();
                    return false;
                });
            refreshItems();
            refreshConnectors();
        };

        $.fn.ArgGraph.export = function () {
            var groupingAttr = settings.groupingAttr;
            var result = [];
            $.each(items,
                function (index, val) {
                    var $val = $(val);
                    var neighbors = $val.attr("data-neighbors");
                    if (neighbors)
                        neighbors = neighbors.split(",");
                    result.push({
                        id: $val.attr("id"),
                        text: $val.text().trim(),
                        position: {
                            left: $val.css('left'),
                            top: $val.css('top')
                        },
                        groupType: $val.attr(groupingAttr),
                        neighbors: neighbors
                    });
                });
            return result;
        }
        $.fn.ArgGraph.exportJson = function () {
            var output = $.fn.ArgGraph.export();
            return JSON.stringify(output, null, 4);
        }
        $.fn.ArgGraph.import = function (newNodes) {
            if (!(newNodes instanceof Array)) {
                importNewNode(newNodes);
            } else {
                $.each(newNodes,
                    function(index, newNode) {
                        importNewNode(newNode);
                    });
            }
            changeGraph();
        }
        $.fn.ArgGraph.importJson = function(json) {
            var newNodes = JSON.parse(json);
            $.fn.ArgGraph.import(newNodes);
        }
	$.fn.ArgGraph.refresh = function() {
	    init();
	}
        init();
        return $.fn.ArgGraph;
    };
})(jQuery);