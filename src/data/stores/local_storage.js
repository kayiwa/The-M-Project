// Copyright (c) 2013 M-Way Solutions GmbH
// http://github.com/mwaylabs/The-M-Project/blob/absinthe/MIT-LICENSE.txt

/**
 * The M.LocalStorageStore can be used to store model collection into
 * the localStorage
 *
 * @module M.LocalStorageStore
 *
 * @type {*}
 * @extends M.Store
 *
 * @example
 *
 * var MyCollection = M.Collection.extend({
 *      model: MyModel,
 *      store: new M.LocalStorageStore()
 * });
 *
 */
M.LocalStorageStore = M.Store.extend({

    _type: 'M.LocalStorageStore',

    ids: {},

    sync: function( method, model, options ) {
        options = options || {};
        var that = options.store || this.store;
        var entity = that.getEntity(model.entity || options.entity || this.entity);
        var attrs;
        if( that && entity && model ) {
            var id = model.id || (method === 'create' ? new M.ObjectID().toHexString() : null);
            attrs = options.attrs || model.toJSON(options);
            switch( method ) {
                case 'patch':
                case 'update':
                case 'create':
                    if (method !== 'create') {
                        attrs = _.extend(that._getItem(entity, id) || {}, attrs);
                    }
                    if( model.id !== id && model.idAttribute ) {
                        attrs[model.idAttribute] = id;
                    }
                    that._setItem(entity, id, attrs);
                    break;
                case 'delete' :
                    that._removeItem(entity, id);
                    break;
                case 'read' :
                    if( id ) {
                        attrs = that._getItem(entity, id);
                    } else {
                        attrs = [];
                        var ids = that._getItemIds(entity);
                        for( id in ids ) {
                            var itemData = that._getItem(entity, id);
                            if( itemData ) {
                                attrs.push(itemData);
                            }
                        }
                    }
                    break;
                default:
                    return;
            }
        }
        if( attrs ) {
            that.handleSuccess(options, attrs);
        } else {
            that.handleError(options);
        }
    },

    _getKey: function( entity, id ) {
        return '_' + entity.name + '_' + id;
    },

    _getItem: function( entity, id ) {
        var attrs;
        if( entity && id ) {
            try {
                attrs = JSON.parse(localStorage.getItem(this._getKey(entity, id)));
                if( attrs ) {
                    entity.setId(attrs, id); // fix id
                } else {
                    this._delItemId(id);
                }
            } catch( e ) {
                M.Logger.error(M.CONST.LOGGER.TAG_FRAMEWORK_DATA, 'Error while loading data from local storage: ', e);
            }
        }
        return attrs;
    },

    _setItem: function( entity, id, attrs ) {
        if( entity && id && attrs ) {
            try {
                localStorage.setItem(this._getKey(entity, id), JSON.stringify(attrs));
                this._addItemId(entity, id);
            } catch( e ) {
                M.Logger.error(M.CONST.LOGGER.TAG_FRAMEWORK_DATA, 'Error while saving data to local storage: ', e);
            }
        }
    },

    _removeItem: function( entity, id ) {
        if( entity && id ) {
            localStorage.removeItem(this._getKey(entity, id));
            this._delItemId(entity, id);
        }
    },

    _addItemId: function( entity, id ) {
        var ids = this._getItemIds(entity);
        if( !(id in ids) ) {
            ids[id] = '';
            this._saveItemIds(entity, ids);
        }
    },

    _delItemId: function( entity, id ) {
        var ids = this._getItemIds(entity);
        if( id in ids ) {
            delete ids[id];
            this._saveItemIds(entity, ids);
        }
    },

    _getItemIds: function( entity ) {
        try {
            var key = '__ids__' + entity.name;
            if( !this.ids[entity.name] ) {
                this.ids[entity.name] = JSON.parse(localStorage.getItem(key)) || {};
            }
            return this.ids[entity.name];
        } catch( e ) {
            M.Logger.error(M.CONST.LOGGER.TAG_FRAMEWORK_DATA, 'Error while loading ids from local storage: ', e);
        }
    },

    _saveItemIds: function( entity, ids ) {
        try {
            var key = '__ids__' + entity.name;
            localStorage.setItem(key, JSON.stringify(ids));
        } catch( e ) {
            M.Logger.error(M.CONST.LOGGER.TAG_FRAMEWORK_DATA, 'Error while saving ids to local storage: ', e);
        }
    }
});