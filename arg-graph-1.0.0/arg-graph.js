// Arg-Graph

// a simple JQuery library to generate directional graphs.
// jQuery Plugin Boilerplate : http://stefangabos.ro/jquery/jquery-plugin-boilerplate/

//####################################################
// version 1.0, 2 Apr 2018
// by Naser Yousefi
// Website: https://github.com/n-yousefi/Arg-Graph
//####################################################

(function ($) {
    $.ArgGraph = function (element, options) {
        var defaults = {
            groupingAttr: "data-group-id",
            onFoo: function () { }
        };
        var plugin = this;

        plugin.settings = {};

        var $element = $(element); 
        
        var mouse = new Object();
        var dragging = false;
        var dragType;
        var dragItemId;
       
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
        var drawConnector = function () {
            var arrows = $element.find("svg > g")[0];
            if (arrows) {
                arrows.innerHTML = "";
                var items = $element.find(".arg-Graph_item");
                $.each(items,
                    function (index, orginDiv) {
                        var orginPoint = getCenter(orginDiv);
                        var $orginDiv = $(orginDiv);
                        if (dragging && dragType == 'C' && $orginDiv.attr("Id") == dragItemId && mouse) {
                            var path = '<path d="' + getdStr(orginPoint, mouse) + '"/>';
                            arrows.innerHTML += path;
                        }
                        var nextIDs = $orginDiv.attr("data-next-ids");
                        if (nextIDs) {
                            nextIDs = nextIDs.split(",");
                            $.each(nextIDs,
                                function (index2, val2) {
                                    if (val2) {
                                        var nextDiv = element.querySelector("#" + val2);
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
            if (dragging && dragType === 'D' && mouse) {
                var dragItem = $element.find('#' + dragItemId);
                if (dragItem) {
                    dragItem.css('left', mouse.x + 'px');
                    dragItem.css('top', mouse.y + 'px');
                }
            };
        };
        var draggingCancel = function () {
            if (dragging) {
                dragging = false;
                dragItemId = null;
                dragType = null;
                drawConnector();
            }
        };
        var addSvgMarkers = function () {
            var svg = $element.find("#arg-Graph_svg");
            if (!svg || svg.length<=0) {
                var myvar = $('<svg id="arg-Graph_svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">' +
                    '            <defs>' +
                    '                <marker id="arrow" viewBox="0 0 10 10" refX="3" refY="5"' +
                    '                        markerWidth="6" markerHeight="6" orient="auto">' +
                    '                    <path d="M 0 0 L 10 5 L 0 10 z" />' +
                    '                </marker>' +
                    '            </defs>' +
                    '            <g fill="none" stroke="black" stroke-width="2" marker-end="url(#arrow)"></g>' +
                    '        </svg>');
                $element.prepend(myvar);   
            }            
        };
        plugin.resetGraph = function () {
            addSvgMarkers();            
            var items = $element.find(".arg-Graph_item");
            // قابلیت درگ
            $.each(items, function (index, value) {
                var item = $(value);

                item.mousedown(function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var $target = $(e.target);
                    if (!dragging) {
                        dragging = true;
                        dragItemId = $(this).attr("Id");
                        if (!$target.is(".arg-Graph_connector-handler")) {
                            dragType = "D"; // Dragging Items;
                        }
                        else {
                            dragType = "C"; // Creating Connector
                        }
                    }
                    return false;
                });
            });

            drawConnector();
        };

        plugin.isInDragging = function () {
            return dragging;
        }

        plugin.output = function () {
            var groupingAttr = plugin.settings.groupingAttr;
            var items = $(".arg-Graph_item");
            var result = {};
            $.each(items,
                function (index, val) {
                    var $val = $(val);
                    var nextIds = $val.attr("data-next-ids");
                    if (nextIds)
                        nextIds = nextIds.split(",");
                    result[$val.attr("id")] = {
                        groupType: $val.attr(groupingAttr),
                        nextIds: nextIds
                    };
                });
            return result;
        };

        plugin.init = function () {
            plugin.settings = $.extend({}, defaults, options);
            $element.mousemove(function (e) {
                var $of = $(this).offset();
                mouse = {
                    x: e.pageX - $of.left,
                    y: e.pageY - $of.top
                };
                if (dragging) {
                    if (dragType === 'D')
                        dragToMouseLocation();
                    drawConnector();
                }
                if (plugin.isInDragging()) {
                    $('.arg-Graph_delete-item').hide();
                    $('.arg-Graph_connector-handler').hide();
                }
            });

            plugin.resetGraph();

            $element.mouseup(function (e) {
                e.stopPropagation();
                e.preventDefault();
                var $target = $(e.target);
                if (!$target.is('.arg-Graph_item')) {
                    $target = $target.closest(".arg-Graph_item");
                }
                
                if (dragging
                    && dragType === 'C'
                    && $target != null) {
                    var targetId = $target.attr("id");
                    var startDrag = $element.find("#" + dragItemId);
                    var startId = startDrag.attr("id");
                    if (targetId != startId) {
                        if ($target.hasClass("arg-Graph_item")) {
                            var ids = startDrag.attr("data-next-ids");
                            if (ids) {
                                if (ids.split(",").indexOf(targetId) < 0) {
                                    ids += "," + targetId;
                                    startDrag.attr("data-next-ids", ids);
                                }
                            } else {
                                ids = $target.attr("id");
                                startDrag.attr("data-next-ids", ids);
                            }
                        }
                    }
                }
                draggingCancel();
                return false;
            });

            $element.find(".arg-Graph_item").mouseover(function (e) {
                var $this = $(this);
                $this.find('.arg-Graph_delete-item').show();
                $this.find('.arg-Graph_connector-handler').show();
            }).mouseleave(function (e) {
                $('.arg-Graph_delete-item').hide();
                $('.arg-Graph_connector-handler').hide();
            }).click(function (e) {
                var $this = $(this);
                var $target = $(e.target);
                if ($target.is('.arg-Graph_delete-item')) {
                    var id = $this.attr('id');
                    $.each($(".arg-Graph_item"),
                        function (key, val) {
                            var $val = $(val);
                            var ids = $val.attr("data-next-ids");
                            if (ids) {
                                var newIds = ids.split(",").filter(function (a) { return a !== id }).join(",");
                                if (newIds)
                                    $val.attr("data-next-ids", newIds);
                                else $val.removeAttr("data-next-ids");
                            }
                        });
                    $this.remove();
                    plugin.resetGraph();
                }
            });

        };

        plugin.init();

    };

    $.fn.ArgGraph = function (options) {
        this.output = function () {
            var $this = $(this);
            var plugin = new $.ArgGraph($this[0], options);
            return plugin.output();
        };
        return this.each(function () {
            var $this = $(this);
            var plugin = new $.ArgGraph(this, options);
            if (undefined == $this.data("arg-Graph")) {
                $this.data("arg-Graph", plugin);
            } else {
                plugin.resetGraph();
            }
        });
    };

})(jQuery);