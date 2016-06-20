/*
 Hash.js
 Copyright © 2009-2016 Health On Net <honservices@healthonnet.org>

 This file is part of HON.

 The first version was HONcode Status; it was originally developed by Thierry
 Raguin 2003 NetUnion SARL within the European Project ActiveHealth .

 Developer:
 - Jeremy Blatter
 - William Belle
 - Cédric Frossard
 */

/**
 * Representation de la honList sour la forme d'une HashMap
 * ["code_md5 du site", "n° certificat"]
 */
var hon_hash =
{
  // La HashMap
  items: null,

  /**
   * Initialisation de la HashMap
   */
  init: function() {
    this.items = {};
  },

  /**
   * Retourne la valeur selon la cle
   * @param {} inKey
   */
  getItem: function(inKey) {
    var that = this;
    var promise = new Promise(function(resolve) {
      if (that.items !== null) {
        resolve(that.items[inKey]);
      } else {
        // Check LocalStorage
        chrome.storage.local.get('hash', function(hash) {
          resolve(hash.hash[inKey]);
        });
      }
    });

    return promise;
  },

  /**
   * Inscrit l'entree in_key in_value dans la Hash et
   * @param {} inKey
   * @param {} inValue
   * @return {} inValue
   */
  setItem: function(inKey, inValue) {
    if (typeof (inValue) != 'undefined') {
      this.items[inKey] = inValue;
    } else {
      dump('HON Error in Hash.setItem() : in_value is type \'undefined\'');
      Components.utils.reportError('HON Error in Hash.setItem() : ' +
        'in_value is type \'undefined\'');
    }
    return inValue;
  },

  /**
   * Inscrit l'entree in_key in_value dans la Hash et
   * @param {} tab
   */
  saveHash: function(tab) {
    if (typeof (tab) != 'undefined') {
      chrome.storage.local.set({hash: tab});
    } else {
      dump('HON Error in Hash.saveHash() : tab is type \'undefined\'');
      Components.utils.reportError('HON Error in Hash.saveHash() : ' +
        'tab is type \'undefined\'');
    }
  },
};