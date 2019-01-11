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


module.exports.handler = (cortex, brandAssets) => Alexa.CreateStateHandler(SessionState.IN_CART, {
    'GetCartIntent': function () {
        delete this.attributes['orderedCart'];
        cortex.cortexGetZoomData(cortex.cortexBaseUrl,
            '?zoom=defaultcart:lineitems:element:item:definition,defaultcart:lineitems:element:item:code,defaultcart:lineitems:element:price')
            .then((response) => {
                cortex.getPromotionDiscountForCart().then((promo) => {
                    console.log('IN_CART.GetCartIntent() - getPromotionDiscountForCart response:\n' + JSON.stringify(response));
                    try {
                        const promotion = promo.promotion;
                        const discountAmount = promo.discount;

                        var obj = JSON.parse(response);
                        var items = (obj._defaultcart) ? obj._defaultcart[0]._lineitems[0]._element : [];

                        var names = [];

                        items.forEach((item, i) => {
                            try {
                                var discount = 0;
                                var listPrice = item._price[0]['list-price'][0].amount;
                                var purchasePrice = item._price[0]['purchase-price'][0].amount;
                                if (purchasePrice < listPrice) {
                                    discount = listPrice - purchasePrice;
                                }
                                names.push({
                                    index: i,
                                    name: item._item[0]._definition[0]['display-name'],
                                    code: item._item[0]._code[0].code,
                                    discount: discount,
                                    price: purchasePrice
                                });
                            } catch (err) {
                                console.log('IN_CART.GetCartIntent() - Error processing item.'
                                    + '\nError: ' + JSON.stringify(err)
                                    + '\nItem:  ' + JSON.stringify(item)
                                );
                            }
                        });
                        this.attributes['orderedCart'] = names;
                        if (names.length == 0) {
                            this.handler.state = SessionState.BROWSING;
                        }

                        var listen = SpeechAssets.readyToCheckOut();
                        var speechResponse = SpeechAssets.cartDescription(names);

                        this.response.speak(speechResponse).listen(listen);
                        this.emit(':responseReady');
                    }
                    catch (err) {
                        console.log(err);
                        this.response.speak(SpeechAssets.cantReadCart());
                        this.emit(':responseReady');
                    }
                }).catch((err) => {
                    console.log('ERROR in IN_CART.GetCartIntent() - getPromotionDiscountForCart: ' + err);
                    this.response.speak(SpeechAssets.cantReadCart());
                    this.emit(':responseReady');
                });
            }).catch((err) => {
                console.log('ERROR in IN_CART.GetCartIntent() - cortexGetZoomData: ' + err);
                this.response.speak(SpeechAssets.cantReadCart());
                this.emit(':responseReady');
            });
    },

    'MoveToWishlistIntent': function () {
        const itemIndex = this.event.request.intent.slots.ItemNumber.value - 1;
        const itemSku = this.attributes['orderedCart'][itemIndex].code;
        const itemName = this.attributes['orderedCart'][itemIndex].name;
        if (itemSku && itemName) {
            cortex.cortexAddToWishlist(itemSku)
            .then((data) => {
                cortex.cortexDeleteFromCart(itemSku).then((data) => {
                    this.response.speak(SpeechAssets.movedToWishlist(itemName))
                        .listen(SpeechAssets.howElseCanIHelp());
                    this.emit(':responseReady');
                });
            }).catch((error) => {
                console.log(error)
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

    'RemoveFromCartIntent': function () {
        const itemIndex = this.event.request.intent.slots.ItemNumber.value - 1;
        const item = this.attributes['orderedCart'][itemIndex];
        if (item) {
            cortex.cortexDeleteFromCart(item.code).then((data) => {
                this.attributes['orderedCart'].splice(itemIndex, 1);
                this.response.speak(SpeechAssets.removedFromCart(item.name) + " " + SpeechAssets.cartDescription(this.attributes['orderedCart']))
                    .listen(SpeechAssets.readyToCheckOut());
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

    'DescribeListedProductIntent': function () {
        const itemIndex = this.event.request.intent.slots.ItemNumber.value - 1;
        const item = this.attributes['orderedCart'][itemIndex];
        if (item) {
            cortex.getItemBySku(item.code)
                .then((item) => {
                    var description = {};
                    item.definition.details.forEach((detail) => {
                        if (detail['display-name'] == 'Summary') {
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
                }).catch((err) => {
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

    'AddToCartIntent': function (sku) {
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
                console.log('tried to add to cart, but couldn\'t find a sku');
            }
        }

        if (productSku) {
            cortex.cortexAddToCart(productSku, 1).then((availability) => {
                if (availability === 'AVAILABLE') {
                    this.response.speak(SpeechAssets.addedToCart())
                        .listen(SpeechAssets.canIHelp());
                } else {
                    this.response.speak(SpeechAssets.itemNotAvailable())
                        .listen(SpeechAssets.canIHelp());
                }
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

    'DescribeStoreIntent': function() {
        this.handler.state = SessionState.BROWSING;
        this.emitWithState('DescribeStoreIntent');
    },

    'KeywordSearchIntent': function () {
        this.handler.state = SessionState.BROWSING;
        this.emitWithState('KeywordSearchIntent');
    },

    'SkuCodeSearchIntent': function () {
        this.handler.state = SessionState.BROWSING;
        this.emit('SkuCodeSearchIntent');
    },

    'CheckOutIntent': function () {
        this.handler.state = SessionState.CHECKOUT;
        this.emitWithState('CheckOutIntent');
    },

    'GetWishlistIntent': function () {
        this.handler.state = SessionState.WISHLIST;
        this.emitWithState('GetWishlistIntent');
    },

    'AMAZON.StopIntent': function () {
        this.handler.state = SessionState.SESSION_END;
        this.emitWithState(AmazonIntent.STOP);
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak('Use the item number to ask me about the items in your cart, or move them to your wishlist.  What would you like to do?').listen('What would you like to do?');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.handler.state = SessionState.SESSION_END;
        this.emitWithState(AmazonIntent.CANCEL);
    },
    'AMAZON.YesIntent': function () {
        this.handler.state = SessionState.CHECKOUT;
        this.emitWithState('CheckOutIntent');
    },
    'AMAZON.NoIntent': function () {
        this.handler.state = SessionState.BROWSING;
        this.response.speak('Okay! ' + SpeechAssets.howElseCanIHelp()).listen(SpeechAssets.canIHelp());
        this.emit(':responseReady');
    },
    'Unhandled': function () {
        this.response.speak(SpeechAssets.unhandled()).listen(SpeechAssets.howElseCanIHelp());
        this.emit(':responseReady');
    }
});
