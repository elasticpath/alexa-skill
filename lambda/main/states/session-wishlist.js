/**
 * Copyright © 2018 Elastic Path Software Inc. All rights reserved.
 *
 * This is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this license. If not, see
 *
 *     https://www.gnu.org/licenses/
 *
 *
 */

const Alexa = require('alexa-sdk');
const SessionConstants = require('./session-states.js');
const SessionState = SessionConstants.SessionState;
const AmazonIntent = SessionConstants.AmazonIntent;

const SpeechAssets = require('../speech/assets.js');

const striptags = require('striptags');


module.exports.handler = (cortex, brandAssets) => Alexa.CreateStateHandler(SessionState.WISHLIST, {

    'GetWishlistIntent' : function() {
        cortex.getWishlistItems()
            .then((items) => {
                this.attributes['orderedWishlist'] = [];
                for (var key in items) {
                    if (items.hasOwnProperty(key)) {
                        var obj = {
                            index: key,
                            name: items[key].wishlistItem.definition.displayName,
                            code: items[key].wishlistItem.code,
                            addToCartHref: items[key].movetocartform,
                        };
                        this.attributes['orderedWishlist'].push(obj);
                    }
                }

                var speechResponse = SpeechAssets.describeWishlist(this.attributes['orderedWishlist']) + " " + SpeechAssets.howElseCanIHelp();
                this.response.speak(speechResponse).listen(SpeechAssets.howElseCanIHelp());
                this.emit(':responseReady');
            }).catch((err) => {
                console.log(err);
                this.response.speak(SpeechAssets.somethingWentWrong()).listen(SpeechAssets.canIHelp());
                this.emit(':responseReady');
            });
    },

    'MoveToCartIntent': function() {
        const itemIndex = this.event.request.intent.slots.ItemNumber.value - 1;
        const obj = this.attributes['orderedWishlist'][itemIndex];
        const toCartHref = obj.addToCartHref;
        if (toCartHref) {
            cortex.cortexPost(toCartHref, { quantity: 1}).then((data) => {
                this.attributes['orderedWishlist'].splice(itemIndex, 1);
                this.response.speak(SpeechAssets.movedToCart(obj))
                    .listen(SpeechAssets.canIHelp());
                this.emit(':responseReady');
            }).catch((err) => {
                console.log(err);
                this.response.speak(SpeechAssets.somethingWentWrong()).listen(SpeechAssets.canIHelp());
                this.emit(':responseReady');
            });
        } else {
            this.response.speak(SpeechAssets.somethingWentWrong()).listen(SpeechAssets.canIHelp());
            this.emit(':responseReady');
        }
    },

    'RemoveFromWishlistIntent': function() {
        const itemIndex = this.event.request.intent.slots.ItemNumber.value - 1;
        const item = this.attributes['orderedWishlist'][itemIndex];
        if (item) {
            cortex.cortexDeleteFromWishlist(item.code).then((data) => {
                this.attributes['orderedWishlist'].splice(itemIndex, 1);
                this.response.speak(SpeechAssets.removedFromWishlist(item.name) + " " + SpeechAssets.describeWishlist(this.attributes['orderedWishlist']) + " " + SpeechAssets.howElseCanIHelp())
                    .listen(SpeechAssets.howElseCanIHelp());
                this.emit(':responseReady');
            }).catch((err) => {
                console.log(err);
                this.response.speak(SpeechAssets.somethingWentWrong())
                    .listen(SpeechAssets.canIHelp());
                this.emit(':responseReady');
            });
        } else {
            this.response.speak(SpeechAssets.somethingWentWrong())
                .listen(SpeechAssets.canIHelp());
            this.emit(':responseReady');
        }
    },

    'DescribeListedProductIntent': function() {
        const itemIndex = this.event.request.intent.slots.ItemNumber.value - 1;
        const item = this.attributes['orderedCart'][itemIndex];
        if (item) {
            cortex.getItemBySku(item.code)
                .timeout(500)
                .then((item) => {
                    var description = {};
                    item.definition.details.forEach((detail) => {
                        if (detail['display-name'].toUpperCase() == 'SUMMARY'
                         || detail['name'].toUpperCase()         == 'SUMMARY')
                        {
                            description = detail;
                            var desc = description['display-value'];
                            // filters out html tags
                            desc = striptags(desc);
                            desc = desc.slice(0, desc.indexOf('.'));
                            description['display-value'] = desc.replace('&reg;', '')
                                .replace('&amp;', '')
                                .replace('&', 'and');
                        }
                    });
                    this.response.speak(SpeechAssets.describeProduct(description['display-value'], item))
                        .listen(SpeechAssets.howElseCanIHelp());
                    this.emit(':responseReady');
                })
                .catch((err) => {
                    console.log(err);
                    this.response.speak(SpeechAssets.somethingWentWrong())
                        .listen(SpeechAssets.howElseCanIHelp());
                    this.emit(':responseReady');
                })
        } else {
            this.response.speak(SpeechAssets.somethingWentWrong())
                .listen(SpeechAssets.howElseCanIHelp());
            this.emit(':responseReady');
        }
    },

    'AddToWishlistIntent': function (sku) {
        this.handler.state = SessionState.BROWSING;
        var productSku;
        if (sku) {
            productSku = sku;
        } else if (this.attributes['requestedSku']) {
            productSku = this.attributes['requestedSku'];
            delete this.attributes['requestedSku'];
        } else {
            try {
                productSku = this.event.request.intent.slots.SkuCode.value;
            } catch (e) {
                console.log(e);
                console.log('tried to add to wishlist, but couldn\'t find a sku');
            }
        }

        if (productSku) {
            cortex.cortexAddToWishlist(productSku).then((data) => {
                this.response.speak(SpeechAssets.addedToWishlist())
                    .listen(SpeechAssets.canIHelp());
                this.emit(':responseReady');
            }).catch((err) => {
                console.log(err);
                this.response.speak(SpeechAssets.somethingWentWrong())
                    .listen(SpeechAssets.howElseCanIHelp());
                this.emit(':responseReady');
            });
        } else {
            this.response.speak(SpeechAssets.somethingWentWrong())
                .listen(SpeechAssets.howElseCanIHelp());
            this.emit(':responseReady');
        }
    },

    'DescribeStoreIntent': function() {
        this.handler.state = SessionState.BROWSING;
        this.emitWithState('DescribeStoreIntent');
    },

    'KeywordSearchIntent': function() {
        this.handler.state = SessionState.BROWSING;
        this.emitWithState('KeywordSearchIntent');
    },

    'GetCartIntent': function() {
        this.handler.state = SessionState.IN_CART;
        this.emitWithState('GetCartIntent');
    },

    'AMAZON.StopIntent' : function() {
        this.handler.state = SessionState.SESSION_END;
        this.emitWithState(AmazonIntent.STOP);
    },

    'AMAZON.HelpIntent' : function() {
        this.response.speak('Use the item number to ask me about the items in your wishlist, remove an item from your wish list, or move them to your cart.  What would you like to do?').listen('What would you like to do?');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.handler.state = SessionState.SESSION_END;
        this.emitWithState(AmazonIntent.CANCEL);
    },
    'AMAZON.YesIntent': function() {
        this.handler.state = SessionState.CHECKOUT;
        this.emitWithState('CheckOutIntent');
    },
    'AMAZON.NoIntent': function() {
        this.handler.state = SessionState.BROWSING;
        this.response.speak('Okay!  How else can I help you today?');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak(SpeechAssets.unhandled()).listen(SpeechAssets.howElseCanIHelp());
        this.emit(':responseReady');
    }
});
