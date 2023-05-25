
visitAll(root, e => e.originalChildren = e.children);
const isNodeDragActive = !1;
var charWidth = 2.4,
    lineHeight = 40,
    labelSize = 12,
    isScalingActive = !0;
const maxRadius = 20;
var radius = 6,
    isFilterMatched = !0,
    lineColor = "#ccc",
    nodeStrokeColor = "steelblue",
    noChildrenColor = "white",
    hasChildrenColor = "#e8f4fa",
    bgColor = "gold",
    matchColor = "#095b85",
    pieColors = [matchColor, bgColor],
    totalNodes = 0,
    maxLabelLength = 0,
    selectedNode = null,
    draggingNode = null,
    panSpeed = 200,
    panBoundary = 20,
    height_multi = 30,
    i = 0,
    duration = 750,
    zoomListener, viewerWidth, viewerHeight, tree, tooltipDiv, baseSvg, svgGroup, diagonal = d3.svg.diagonal().projection(function(e) {
        return [e.y, e.x]
    }),
    pie = d3.layout.pie().sort(null).value(function(e) {
        return e.occurrence_fraction
    });

function collapseAllAndUpdate() {
    root && (collapseToLevel(1), update(root), centerLeftNode(root))
}

function expandMatchedAndUpdate() {
    root && (visitAll(root, expandAllMatches), update(root), centerLeftNode(root))
}

function expandAllAndUpdate() {
    root && (visitAll(root, expand), update(root), centerLeftNode(root))
}

function toggleScalingAndUpdate() {
    root && (isScalingActive = !isScalingActive, update(root))
}

function toggleFilterMatched() {
    root && (isFilterMatched = !isFilterMatched, visitAll(root, filterMatched), update(root), centerLeftNode(root))
}
d3.select("#inputCharWidth").on("input", function(e) {
    setCharWidth(this.value)
}), d3.select("#inputHeight").on("input", function(e) {
    setLineHeight(this.value)
}), d3.select("#inputFontSize").on("input", function(e) {
    setLabelSize(this.value)
}), d3.select("#downloadSvg").on("click", function(e) {
    downloadSvg()
});

function downloadSvg() {
    var e = d3.select("svg").attr("title", "svg_title").attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg").node().parentNode.innerHTML;
    d3.select("#downloadSvg").attr("href-lang", "image/svg+xml").attr("href", `data:image/svg+xml;base64,
` + btoa(unescape(encodeURIComponent(e)))).html("download", "tree.svg")
}
var allGroup = ["default", "contrast", "B+W"],
    dropdownButton = d3.select("#styleCombo").append("select");
dropdownButton.selectAll("myOptions").data(allGroup).enter().append("option").text(function(e) {
    return e
}).attr("value", function(e) {
    return e
}), dropdownButton.on("change", function(e) {
    var r = d3.select(this).property("value");
    r === "default" ? (noChildrenColor = "white", hasChildrenColor = "#e8f4fa", bgColor = "gold", matchColor = "#095b85", lineColor = "#ccc", nodeStrokeColor = "steelblue") : r === "contrast" ? (noChildrenColor = "white", hasChildrenColor = "#e8f4fa", bgColor = "#E3BAFF", matchColor = "#118B8C", lineColor = "orange", nodeStrokeColor = "#8840F0") : r === "B+W" && (noChildrenColor = "white", hasChildrenColor = "#f4f4f4", bgColor = "white", matchColor = "black", lineColor = "#ccc", nodeStrokeColor = "black"), pieColors = [matchColor, bgColor], update(root)
}), viewerWidth = $(document).width(), viewerHeight = $(document).height(), tree = d3.layout.tree().size([viewerHeight, viewerWidth]), visitAll(root, function(e) {
    totalNodes++, maxLabelLength = Math.max(e.name.length, maxLabelLength)
}), sortTree();

function pan(e, r) {
    var a = panSpeed;
    panTimer && (clearTimeout(panTimer), translateCoords = d3.transform(svgGroup.attr("transform")), r == "left" || r == "right" ? (translateX = r == "left" ? translateCoords.translate[0] + a : translateCoords.translate[0] - a, translateY = translateCoords.translate[1]) : (r == "up" || r == "down") && (translateX = translateCoords.translate[0], translateY = r == "up" ? translateCoords.translate[1] + a : translateCoords.translate[1] - a), scaleX = translateCoords.scale[0], scaleY = translateCoords.scale[1], scale = zoomListener.scale(), svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")"), d3.select(e).select("g.node").attr("transform", "translate(" + translateX + "," + translateY + ")"), zoomListener.scale(zoomListener.scale()), zoomListener.translate([translateX, translateY]), panTimer = setTimeout(function() {
        pan(e, a, r)
    }, 50))
}

function zoom() {
    svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")
}
zoomListener = d3.behavior.zoom().scaleExtent([.1, 3]).on("zoom", zoom);

function initiateDrag(e, r) {
    !isNodeDragActive || (draggingNode = e, d3.select(r).select(".ghostCircle").attr("pointer-events", "none"), d3.selectAll(".ghostCircle").attr("class", "ghostCircle show"), d3.select(r).attr("class", "node activeDrag"), svgGroup.selectAll("g.node").sort(function(a, n) {
        return a.id != draggingNode.id ? 1 : -1
    }), nodes.length > 1 && (links = tree.links(nodes), nodePaths = svgGroup.selectAll("path.link").data(links, function(a) {
        return a.target.id
    }).remove(), nodesExit = svgGroup.selectAll("g.node").data(nodes, function(a) {
        return a.id
    }).filter(function(a, n) {
        return a.id != draggingNode.id
    }).remove()), parentLink = tree.links(tree.nodes(draggingNode.parent)), svgGroup.selectAll("path.link").filter(function(a, n) {
        return a.target.id == draggingNode.id
    }).remove(), dragStarted = null)
}
baseSvg = d3.select("#tree-container").append("svg").attr("width", viewerWidth).attr("height", viewerHeight * height_multi).attr("class", "overlay").call(zoomListener), dragListener = d3.behavior.drag().on("dragstart", function(e) {
    e != root && (dragStarted = !0, nodes = tree.nodes(e), d3.event.sourceEvent.stopPropagation())
}).on("drag", function(e) {
    if (e != root) {
        if (dragStarted && (domNode = this, initiateDrag(e, domNode)), relCoords = d3.mouse($("svg").get(0)), relCoords[0] < panBoundary) panTimer = !0, pan(this, "left");
        else if (relCoords[0] > $("svg").width() - panBoundary) panTimer = !0, pan(this, "right");
        else if (relCoords[1] < panBoundary) panTimer = !0, pan(this, "up");
        else if (relCoords[1] > $("svg").height() - panBoundary) panTimer = !0, pan(this, "down");
        else try {
            clearTimeout(panTimer)
        } catch (a) {}
        if (isNodeDragActive) {
            e.x0 += d3.event.dy, e.y0 += d3.event.dx;
            var r = d3.select(this);
            r.attr("transform", "translate(" + e.y0 + "," + e.x0 + ")"), updateTempConnector()
        }
    }
}).on("dragend", function(e) {
    if (!!isNodeDragActive && e != root)
        if (domNode = this, selectedNode) {
            var r = draggingNode.parent.children.indexOf(draggingNode);
            r > -1 && draggingNode.parent.children.splice(r, 1), typeof selectedNode.children != "undefined" || typeof selectedNode._children != "undefined" ? typeof selectedNode.children != "undefined" ? selectedNode.children.push(draggingNode) : selectedNode._children.push(draggingNode) : (selectedNode.children = [], selectedNode.children.push(draggingNode)), expand(selectedNode), sortTree(), endDrag()
        } else endDrag()
});

function endDrag() {
    selectedNode = null, d3.selectAll(".ghostCircle").attr("class", "ghostCircle"), d3.select(domNode).attr("class", "node"), d3.select(domNode).select(".ghostCircle").attr("pointer-events", ""), updateTempConnector(), draggingNode !== null && (update(root), centerNode(draggingNode), draggingNode = null)
}
var overCircle = function(e) {
        selectedNode = e, updateTempConnector()
    },
    outCircle = function(e) {
        selectedNode = null, updateTempConnector()
    },
    updateTempConnector = function() {
        var e = [];
        draggingNode !== null && selectedNode !== null && (e = [{
            source: {
                x: selectedNode.y0,
                y: selectedNode.x0
            },
            target: {
                x: draggingNode.y0,
                y: draggingNode.x0
            }
        }]);
        var r = svgGroup.selectAll(".templink").data(e);
        r.enter().append("path").attr("class", "templink").attr("d", d3.svg.diagonal()).attr("pointer-events", "none"), r.attr("d", d3.svg.diagonal()), r.exit().remove()
    };
tooltipDiv = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0), svgGroup = baseSvg.append("g"), root.x0 = viewerHeight * height_multi / 2, root.y0 = 0, visitAll(root, filterMatched), update(root), centerLeftNode(root);

function calcRadius(e) {
    return e > 0 && isScalingActive ? Math.min(radius + Math.sqrt(e), maxRadius) : radius
}

function click(e) {
    d3.event.defaultPrevented || (e = toggleChildren(e), update(e), centerNode(e))
}

function formatDecimals(e, r) {
    return Number(Math.round(e + "e" + r) + "e-" + r).toFixed(r)
}

function formatDecimals2(e, r) {
    return Number(e).toFixed(r)
}

function update(e) {
    var r = [1],
        a = function(c, o) {
            o.children && o.children.length > 0 && (r.length <= c + 1 && r.push(0), r[c + 1] += o.children.length, o.children.forEach(function(z) {
                a(c + 1, z)
            }))
        };
    a(0, root);
    var n = d3.max(r) * lineHeight;
    tree = tree.size([n, viewerWidth]);
    var _ = tree.nodes(root).reverse(),
        t = tree.links(_);
    _.forEach(function(c) {
        c.y = c.depth * (maxLabelLength * charWidth)
    }), node = svgGroup.selectAll("g.node").data(_, function(c) {
        return c.id || (c.id = ++i)
    });
    var d = node.enter().append("g").call(dragListener).attr("class", "node").attr("transform", function(c) {
        return "translate(" + e.y0 + "," + e.x0 + ")"
    }).on("click", click).on("mouseover", function(c) {
        tooltipDiv.transition().duration(200).style("opacity", .9), tooltipDiv.html("Name: " + c.name + (c.NCBI != null ? "<br/>NCBI: " + c.NCBI : "") + (c.matched_size > 0 ? "<br/>Matches: " + c.matched_size : "") + (c.occurrence_fraction > 0 ? "<br/>Occurance fraction: " + formatDecimals(c.occurrence_fraction, 3) : "") + (c.group_size > 0 ? "<br/>Group size: " + c.group_size : "")).style("left", d3.event.pageX + "px").style("top", d3.event.pageY - 28 + "px")
    }).on("mouseout", function(c) {
        tooltipDiv.transition().duration(200).style("opacity", 0)
    });
    d.append("circle").attr("class", "nodeCircle").attr("r", 0).style("stroke", nodeStrokeColor).style("fill", function(c) {
        return c._children ? hasChildrenColor : noChildrenColor
    }), d.selectAll("g path").data(function(c, o) {
        return c.occurrence_fraction > 0 ? pie(c.pie_data) : []
    }).enter().append("svg:path").attr("class", "nodePie").attr("fill", function(c, o) {
        return pieColors[c.data.index]
    }).attr("d", function(c) {
        return d3.svg.arc().outerRadius(calcRadius(c.data.matched_size))(c)
    }), d.append("text").attr("x", function(c) {
        return c.children || c._children ? -10 : 10
    }).attr("dy", ".35em").attr("class", "nodeText").attr("text-anchor", function(c) {
        return c.children || c._children ? "end" : "start"
    }).text(function(c) {
        return c.name
    }).style("fill-opacity", 0).style("font-size", labelSize), d.append("circle").attr("class", "ghostCircle").attr("r", 30).attr("opacity", .1).style("fill", "red").attr("pointer-events", "mouseover").on("mouseover", function(c) {
        overCircle(c)
    }).on("mouseout", function(c) {
        outCircle(c)
    }), node.select("text").attr("x", function(c) {
        return c.children || c._children ? -10 : 10
    }).attr("text-anchor", function(c) {
        return c.children || c._children ? "end" : "start"
    }).text(function(c) {
        return c.name
    }), node.select("circle.nodeCircle").attr("r", function(c) {
        return calcRadius(c.matched_size)
    }).style("stroke", nodeStrokeColor).style("fill", function(c) {
        var o = c.matched_size;
        return o > 0 ? matchColor : c._children ? hasChildrenColor : noChildrenColor
    });
    var u = node.transition().duration(duration).attr("transform", function(c) {
        return "translate(" + c.y + "," + c.x + ")"
    });
    u.select("text").style("fill-opacity", 1).style("font-size", labelSize), u.selectAll("path.nodePie").attr("d", function(c) {
        return d3.svg.arc().outerRadius(calcRadius(c.data.matched_size))(c)
    }).attr("fill", function(c, o) {
        return pieColors[c.data.index]
    });
    var p = node.exit().transition().duration(duration).attr("transform", function(c) {
        return "translate(" + e.y + "," + e.x + ")"
    }).remove();
    p.select("circle").attr("r", 0), p.select("text").style("fill-opacity", 0).style("font-size", labelSize);
    var s = svgGroup.selectAll("path.link").data(t, function(c) {
        return c.target.id
    });
    s.enter().insert("path", "g").attr("class", "link").style("stroke", lineColor).attr("d", function(c) {
        var o = {
            x: e.x0,
            y: e.y0
        };
        return diagonal({
            source: o,
            target: o
        })
    }), s.transition().duration(duration).style("stroke", lineColor).attr("d", diagonal), s.exit().transition().duration(duration).attr("d", function(c) {
        var o = {
            x: e.x,
            y: e.y
        };
        return diagonal({
            source: o,
            target: o
        })
    }).remove(), _.forEach(function(c) {
        c.x0 = c.x, c.y0 = c.y
    })
}

function collapseAll() {
    visitAll(root, collapse)
}

function visit(e, r, a) {
    if (!!e) {
        r(e);
        var n = a(e);
        if (n)
            for (var _ = n.length, t = 0; t < _; t++) visit(n[t], r, a)
    }
}

function visitAll(e, r) {
    visit(e, r, getAllChildren)
}

function visitAllToLevel(e, r, a, n) {
    visitToLevel(e, r, a, n, getAllChildren)
}

function visitToLevel(e, r, a, n, _) {
    if (!!e) {
        r > 0 ? a(e) : n(e);
        var t = _(e);
        if (t)
            for (var d = t.length, u = 0; u < d; u++) visitToLevel(t[u], r - 1, a, n, _)
    }
}

function getAllChildren(e) {
    return e.children && e.children.length > 0 ? e.children : e._children && e._children.length > 0 ? e._children : null
}

function sortTree() {
    tree.sort(function(e, r) {
        return r.name.toLowerCase() < e.name.toLowerCase() ? 1 : -1
    })
}

function hasMatches(e) {
    return e.matched_size > 0
}

function hasNoMatches(e) {
    return !hasMatches(e)
}

function expandAllMatches(e) {
    hasMatches(e) ? expand(e) : collapse(e)
}

function collapseToLevel(e) {
    visitAllToLevel(root, e, expand, collapse)
}

function collapse(e) {
    e.children && (e._children = e.children, e._children.forEach(collapse), e.children = null, e.collapsed = !0)
}

function expand(e) {
    e._children && (e.children = e._children, e.children.forEach(expand), e._children = null, e.collapsed = !1)
}

function filterMatched(e) {
    typeof e.originalChildren != "undefined" && e.originalChildren.length > 0 && (e.collapsed ? e._children = e.originalChildren : e.children = e.originalChildren, e.filteredChildren = null), isFilterMatched && (e.children && (e.filteredChildren = e.children.filter(r => !(r.matched_size > 0)), e.children = e.children.filter(r => r.matched_size > 0)), e._children && (e.filteredChildren = e._children.filter(r => !(r.matched_size > 0)), e.children = e._children.filter(r => r.matched_size > 0)))
}

function centerNode(e) {
    scale = zoomListener.scale(), x = -e.y0, y = -e.x0, x = x * scale + viewerWidth / 2, y = y * scale + viewerHeight * height_multi / 2, d3.select("g").transition().duration(duration).attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")"), zoomListener.scale(scale), zoomListener.translate([x, y])
}

function centerLeftNode(e) {
    scale = zoomListener.scale(), x = -e.y0, y = -e.x0, x = x * scale + 40, y = y * scale + viewerHeight * height_multi / 2, d3.select("g").transition().duration(duration).attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")"), zoomListener.scale(scale), zoomListener.translate([x, y])
}

function toggleChildren(e) {
    return e.children ? (e._children = e.children, e.children = null) : e._children && (e.children = e._children, e._children = null), e
}

function setLabelSize(e) {
    labelSize !== e && (console.log("Set label size to " + e), labelSize = e, update(root))
}

function setCharWidth(e) {
    charWidth !== e && (console.log("Set label size to " + e), charWidth = e, update(root))
}

function setLineHeight(e) {
    lineHeight !== e && (console.log("Set line height to " + e), lineHeight = e, update(root))
}