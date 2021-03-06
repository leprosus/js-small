/*
 * JS-Small JavaScript Framework Plugin 0.0.3
 * Description: Work with dynamic dialogs
 * Copyright (c) 2008 - 2014 Denis Korolev
 * Released under the MIT License.
 * More information: http://www.js-small.ru/
 *                   http://www.js-small.com/
 * Project support:  http://www.evalab.ru/
 *                   http://www.evalab.com/
 * @author Denis Korolev
 * @version 0.0.3
 */
var initDialogs = {
    "escapable": false,
    "closable": true,
    "modal": true,
    "autostart": false,
    "foregroundColor": "white",
    "foregroundImage": null,
    "borderColor": "blue",
    "backgroundColor": "black",
    "backgroundOpacity": 75,
    "color": "black",
    "titled": true,
    "defaultTitle": "",
    "titleBackground": "blue",
    "titleColor": "white",
    "layout": 9
}, layouts = {
    "north": 1,
    "northeast": 2,
    "east": 3,
    "southeast": 4,
    "south": 5,
    "southwest": 6,
    "west": 7,
    "northwest": 8,
    "center": 9
};
small.extendFunctions({
    initDialogs: function(options) {
        initDialogs = {
            "escapable": small.typeIn(options.escapable, "boolean") ? options.escapable : initDialogs.escapable,
            "closable": small.typeIn(options.closable, "boolean") ? options.closable : initDialogs.closable,
            "modal": small.typeIn(options.modal, "boolean") ? options.modal : initDialogs.modal,
            "autostart": small.typeIn(options.autostart, "boolean") ? options.autostart : initDialogs.autostart,
            "foregroundColor": small.typeIn(options.foregroundColor, "string") ? options.foregroundColor
                : initDialogs.foregroundColor,
            "foregroundImage": small.typeIn(options.foregroundImage, "string") ? options.foregroundImage
                : initDialogs.foregroundImage,
            "borderColor": small.typeIn(options.borderColor, "string") ? options.borderColor : initDialogs.borderColor,
            "backgroundColor": small.typeIn(options.backgroundColor, "string") ? options.backgroundColor
                : initDialogs.backgroundColor,
            "backgroundOpacity": small.typeIn(options.backgroundOpacity, "string") ? options.backgroundOpacity
                : initDialogs.backgroundOpacity,
            "color": small.typeIn(options.color, "string") ? options.color : initDialogs.color,
            "titled": small.typeIn(options.titled, "boolean") ? options.titled : initDialogs.titled,
            "defaultTitle": small.typeIn(options.defaultTitle, "string,number") ? options.defaultTitle
                : initDialogs.defaultTitle,
            "titleBackground": small.typeIn(options.titleBackground, "string") ? options.titleBackground
                : initDialogs.titleBackground,
            "titleColor": small.typeIn(options.titleColor, "string") ? options.titleColor : initDialogs.titleColor,
            "layout": small.typeIn(options.layout, "string,number") &&
                          (/^(north|northeast|east|southeast|south|southwest|west|northwest|center)$/i.test(options.layout) || /^[1-9]$/.test(options.layout))
                ? (/^[1-9]$/.test(options.layout) ? options.layout : layouts[options.layout]) : initDialogs.layout
        };
    },
    showDialog: function(options) {
        var escapable = small.typeIn(options.escapable, "boolean") ? options.escapable
            : initDialogs.escapable, closable = small.typeIn(options.closable, "boolean") ? options.closable
            : initDialogs.closable, modal = small.typeIn(options.modal, "boolean") ? options.modal
            : initDialogs.modal, autostart = small.typeIn(options.autostart, "boolean") ? options.autostart
            : initDialogs.autostart, titled = small.typeIn(options.titled, "boolean") ? options.titled
            : initDialogs.titled, foregroundColor = small.typeIn(options.foregroundColor, "string")
            ? options.foregroundColor
            : initDialogs.foregroundColor, foregroundImage = small.typeIn(options.foregroundImage, "string")
            ? options.foregroundImage
            : initDialogs.foregroundImage, borderColor = small.typeIn(options.borderColor, "string")
            ? options.borderColor
            : initDialogs.borderColor, backgroundColor = small.typeIn(options.backgroundColor, "string")
            ? options.backgroundColor
            : initDialogs.backgroundColor, backgroundOpacity = small.typeIn(options.backgroundOpacity, "string")
            ? options.backgroundOpacity
            : initDialogs.backgroundOpacity, titleBackground = small.typeIn(options.titleBackground, "string")
            ? options.titleBackground
            : initDialogs.titleBackground, titleColor = small.typeIn(options.titleColor, "string") ? options.titleColor
            : initDialogs.titleColor, color = small.typeIn(options.color, "string") ? options.color
            : initDialogs.color, layout = small.typeIn(options.layout, "string,number") &&
                                              (/^(north|northeast|east|southeast|south|southwest|west|northwest|center)$/i.test(options.layout) || /^[1-9]$/.test(options.layout))
            ? (/^[1-9]$/.test(options.layout) ? options.layout : layouts[options.layout])
            : initDialogs.layout, title = small.typeIn(options.title, "string,number") ? options.title
            : initDialogs.defaultTitle, content = small.typeIn(options.content, "undefined") ? small.create("div")
            : options.content, width = /^\d+$/.test(options.width) ? options.width
            : null, height = /^\d+$/.test(options.height) ? options.height
            : null, onOpen = small.typeIn(options.onOpen, "function") ? options.onOpen : function() {
        }, onClose = small.typeIn(options.onClose, "function") ? options.onClose : function() {
        };

        var container = small.body().append("div.ui-dialog");
        if(width == null || height == null) {
            var wrap = container.append("div.content"), temp = wrap.append("span").css("display", "table");
            temp.html(content.serialize());
            var bound = temp.bound();
            width = bound.width + 30;
            height = bound.height + 16;

            wrap.remove();
        }
        container.hide();

        var positions = {
            "1": {
                "top": "0",
                "left": "50%",
                "topMargin": 0,
                "leftMargin": -width / 2
            },
            "2": {
                "top": "0",
                "left": "100%",
                "topMargin": 0,
                "leftMargin": -width - 2
            },
            "3": {
                "top": "50%",
                "left": "100%",
                "topMargin": -height / 2,
                "leftMargin": -width - 2
            },
            "4": {
                "top": "100%",
                "left": "100%",
                "topMargin": -height - 2,
                "leftMargin": -width - 2
            },
            "5": {
                "top": "100%",
                "left": "50%",
                "topMargin": -height - 2,
                "leftMargin": -width / 2
            },
            "6": {
                "top": "100%",
                "left": "0",
                "topMargin": -height - 2,
                "leftMargin": 0
            },
            "7": {
                "top": "50%",
                "left": "0",
                "topMargin": -height / 2,
                "leftMargin": 0
            },
            "8": {
                "top": "0",
                "left": "0",
                "topMargin": 0,
                "leftMargin": 0
            },
            "9": {
                "top": "50%",
                "left": "50%",
                "topMargin": -height / 2,
                "leftMargin": -width / 2
            }
        };

        function showDialog() {
            onOpen();

            var opacity = 0, object = container.child(), backgroundFlag = false;

            object.opacity(opacity);
            container.show();

            small.start({
                "time": 100,
                "callback": function() {
                    opacity += 20;
                    object.opacity(opacity);
                    if(!backgroundFlag && opacity >= backgroundOpacity) {
                        object = container.find("div.dialog");
                        container.find("div.modal").opacity(backgroundOpacity);
                        backgroundFlag = true;
                    }
                },
                "repeat": 5
            });
        }

        function hideDialog() {
            var opacity = 100, object = container.child();

            small.start({
                "time": 100,
                "callback": function() {
                    opacity -= 20;
                    object.opacity(opacity);
                    if(opacity == 0) {
                        container.remove();
                    }
                },
                "repeat": 5
            });

            onClose();
        }

        small.extend(container, {
            "showDialog": showDialog,
            "hideDialog": hideDialog
        });

        if(modal) {
            container.append("div.modal").css("background-color", backgroundColor).opacity(backgroundOpacity);
        }

        var dialog = container.append("div.dialog").css({
            "background-color": foregroundColor,
            "background-image": foregroundImage == null ? "none" : "url(" + foregroundImage + ")",
            "border-color": borderColor,
            "left": positions[layout].left,
            "top": positions[layout].top,
            "margin": positions[layout].topMargin + "px 0px 0px " + positions[layout].leftMargin + "px",
            "width": width + "px",
            "height": height + "px"
        });

        if(titled) {
            dialog.append("div.title").css({
                "background-color": titleBackground,
                "color": titleColor
            }).condition(closable, function() {
                var close = small(this).append("div.close").text("✕");
                if(closable) {
                    close.click(hideDialog);
                }
            }).concat(title);
        }

        dialog.append("div.content").css({
            "top": titled ? "25px" : "0",
            "color": color
        }).append(content);

        if(autostart) {
            container.showDialog();
        }

        return container;
    },
    showNotice: function(options) {
        small.initDialogs(options);
        var notice = small.showDialog({
            "autostart": true,
            "titled": false,
            "modal": false,
            "content": small.create("div").html(options.text || "")
        });
        notice.start({
            "time": options.time || 5000,
            "callback": function() {
                notice.hideDialog();
            }
        });

        return notice;
    }
});