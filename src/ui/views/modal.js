// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 * @module M.ModalView
 * @type {M|*}
 */
M.ModalView = M.View.extend({

    /**
     * The type of the object
     * @private
     */
    _type: 'M.ModalView',

    /**
     * The default cssClass for this view.
     * @type {String}
     */
    cssClass: 'modalview',

    /**
     * Determines if the modal should close on clicking the overlay.
     * @type {String}
     */
    hideOnOverlayClick: YES,

    /**
     * The template of the object before initializing it.
     * @private
     */
    _template: _.tmpl(M.TemplateManager.get('M.ModalView')),

    /**
     * Determines if the modal is shown or not. Access it by calling isShown()
     * @private
     * @type {Boolean}
     */
    _isShown: NO,

    /**
     * Counts the number how often the show function was called.
     * @private
     * @type {Number}
     */
    _shownCounter: 0,

    /**
     * Background element for this modal view.
     * @private
     * @type {$}
     */
    _$backdrop: null,

    /**
     * Register internal events for this view.
     * @private
     */
    _internalEvents: {
        tap: function( events, view ) {
            view._closeHandler(events, view);
        }
    },

    /**
     * Show the modal view
     * @returns {M.ModalView}
     */
    show: function() {
        this._shownCounter += 1;
        if( this._shownCounter > 0 ) {
            this._showBackdrop();
            $('body').append(this.$el);
            this._isShown = YES;
        }
        return this;
    },

    /**
     * Hide the modal view. You have to call for every show a hide or force it by calling with true as first parameter
     * @param {Boolean} force - Force the modal view to hide
     * @returns {M.ModalView}
     */
    hide: function( force ) {
        this._shownCounter -= 1;
        if( force === YES || this._shownCounter <= 0 ) {
            this.$el.remove();
            this._isShown = NO;
            this._shownCounter = 0;
            this._hideBackdrop();
        }

        return this;
    },

    /**
     * If the modal view is visible at the moment
     * @returns {Boolean}
     */
    isShown: function() {
        return this._isShown;
    },

    /**
     * Toggle the modal view. If the modal view is visibile it gets hidden if it is hidden show the modal view
     * @returns {Boolean}
     */
    toggle: function( text ) {
        if( this.isShown(text) ) {
            this.hide(true);
        } else {
            this.show(text);
        }
    },

    /**
     * This function needs to be implemented to render the view if there is no value given
     * @returns {Boolean|Function|YES}
     * @private
     */
    _attachToDom: function() {
        return YES;
    },

    /**
     * Show the backdrop
     * @private
     */
    _showBackdrop: function() {
        var that = this;
        if( that._$backdrop ) {
            return;
        }

        that._$backdrop = $('<div class="modal-backdrop fade"><div>');
        that._$backdrop.appendTo('body');

        if( M.Animation.transitionSupport ) {
            setTimeout(function() {
                that._$backdrop.addClass('in');
            }, 0);
        }
    },

    /**
     * Hide the backdrop
     * @private
     */
    _hideBackdrop: function() {
        var that = this;
        var callback = function() {
            if(that._$backdrop) {
                that._$backdrop.remove();
                that._$backdrop = null;
            }
        };
        if( that._$backdrop ) {
            if( M.Animation.transitionSupport ) {
                that._$backdrop.on(M.Animation.transitionEndEventName, callback);
                setTimeout(function(){
                    that._$backdrop.removeClass('in');
                }, 0);
            } else {
                callback();
            }
        }
    },

    /**
     * Hides the view
     *
     * @param {Event} event
     * @param {M.Modal} view
     * @private
     */
    _closeHandler: function( event, view ) {
        if( this.hideOnOverlayClick && event.target === view.el ) {
            view.hide();
        }
    }

});