/*
 * gui-builder - A simple WYSIWYG HTML5 app creator
 * Copyright (c) 2011, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
"use strict";

// Palette view widget


(function($, undefined) {

    $.widget('gb.paletteView', {

        options: {
            model: null,
        },

        _create: function() {
            var o = this.options,
                e = this.element;


            this.refresh(null, this);

            return this;
        },

        _setOption: function(key, value) {
            switch (key) {
                case 'model':
                    this.options.model = value;
                    this.refresh(null, this);
                    break;
                default:
                    break;
            }
        },

        destroy: function() {
            // TODO: unbind any ADM event handlers
            $(this.element).find('.'+this.widgetName).remove();
            this.options.primaryTools.remove();
            this.options.secondaryTools.remove();
        },

        refresh: function(event, widget) {
            var listWidgets = function (container, group) {
                    $.each(group, function (i, value) {
                        if (value && typeof value === "string") {
                            if (BWidget.isPaletteWidget(value)) {
                                var li = $('<img id="BWidget-'+value+'"></img>')
                                             .attr("src", "src/css/images/widgets/" + value + ".png")
                                             .appendTo(container);
                                $(li).disableSelection();
                                $(li).addClass('nrc-palette-widget');
                                $(li).data("code", BWidget.getTemplate(value));
                                $(li).data("adm-node", {type: value});
                            }
                        }
                        else if (value)
                            listWidgets(container, value);
                    });
                };
            widget = widget || this;
            if (widget.options && widget.options.model) {
                this.element.empty();
                listWidgets((this.element), this.options.model);
                var w = this.element.find('.nrc-palette-widget');

                w.draggable({
                    revert: false,
                    appendTo: 'body',
                    iframeFix: true,
                    containment: false,
                    connectToSortable: $(':gb-layoutView')
                                       .layoutView('option', 'contentDocument')
                                       .find('.nrc-sortable-container'),
                    helper: 'clone',
                    refreshPositions: true,
                    stack: '.layoutView iframe',
                    revertDuration: 0,
                    filter: function() {
                        var f=$(':gb-layoutView')
                                    .layoutView('option','contentDocument'),
                            a=$(':gb-layoutView').layoutView('option','model'),
                            t=$(this).data('adm-node').type, s = [];

                        // Find all sortables (and the page)
                        s=f.find('.nrc-sortable-container,[data-role="page"]');

                        // Filter out those that will not accept this widget
                        return s.filter( function(index) {
                            var id = $(this).attr('data-uid'), node, wt;
                            node = a.getDesignRoot().findNodeByUid(id);
                            wt = node.getType();
                            return a.canAddChild(node, t);
                        });
                    },
                    start: function(event,ui){
                        var d = $(this).draggable('option','connectToSortable');
                        if (d.length <= 0) {
                            return false;
                        }
                        if (ui.helper) {
                            if (ui.helper[0].id == "") {
                                ui.helper[0].id = this.id+'-helper';
                            }
                        }
                    },
                })
                .disableSelection();
            }
        },
        resize: function(event, widget) {
            this.element.height(this.element.parent().height() -
                    this.element.prev().height());
        },

    });
})(jQuery);
