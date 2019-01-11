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


module.exports.handler = (cortex, brandAssets) => Alexa.CreateStateHandler(SessionState.BROWSING, {
    'KeywordSearchIntent': function() {
        var keywords = this.event.request.intent.slots.SearchKeyword.value;

        if (keywords === '111' && cortex.scope === 'signatur_store') {
            keywords = keywords.replace('111', 'one eleven');
        }

        this.attributes['requestedSku'] = '';
        this.attributes['searchResults'] = [];
        if (keywords) {
            cortex.getItemsByKeyword(keywords)
            .then((items) => {
                const numItems = items.length;

                if (numItems > 0) {
                    items.forEach(item => {
                        this.attributes['searchResults'].push(item.code);
                    });
                    
                    var topItem = items[0];
                    this.attributes['requestedSku'] = topItem.code;
                    var speechResponse = SpeechAssets.searchResults(numItems, topItem);

                    this.response.speak(speechResponse).listen(SpeechAssets.howElseCanIHelp());
                    this.emit(':responseReady');
                } else {
                    this.response.speak(SpeechAssets.itemNotFound())
                        .listen(SpeechAssets.howElseCanIHelp());
                    this.emit(':responseReady');
                }
            }).catch((err) => {
                console.log(err);
                this.response.speak(SpeechAssets.somethingWentWrong()).listen(SpeechAssets.howElseCanIHelp());
                this.emit(':responseReady');
            });
        }
        else {
            this.response.speak(SpeechAssets.itemNotFound())
                .listen(SpeechAssets.canIHelp());
            this.emit(':responseReady');
        }
    },

    'NextItemIntent': function() {
        try {
            let currentItemSku      = this.attributes['requestedSku'];
            let searchResultSkus    = this.attributes['searchResults'];
            let index               = searchResultSkus.indexOf(currentItemSku);

            if (index < searchResultSkus.length - 1) {
                currentItemSku = searchResultSkus[++index];
                this.attributes['requestedSku'] = currentItemSku;
                
                cortex.getItemBySku(currentItemSku)
                    .then((item) => {
                        let name = item.definition.displayName;
                        this.response.speak(SpeechAssets.nextItem(name))
                                     .listen(SpeechAssets.canIHelp());
                        this.emit(':responseReady');
                    })
                    .catch((err) => {
                        console.log(err);
                        this.response.speak(SpeechAssets.somethingWentWrong())
                                     .listen(SpeechAssets.canIHelp());
                        this.emit(':responseReady');
                    });
            }
            else {
                this.response.speak('That\'s all I have right now. ' + SpeechAssets.whatNext())
                             .listen(SpeechAssets.canIHelp());
                this.emit(':responseReady');
            }
        }
        catch (err) {
            console.log(err);
            this.response.speak(SpeechAssets.somethingWentWrong())
                         .listen(SpeechAssets.canIHelp());
            this.emit(':responseReady');
        }
    },

    'PreviousItemIntent': function() {
        try {
            let currentItemSku      = this.attributes['requestedSku'];
            let searchResultSkus    = this.attributes['searchResults'];
            let index               = searchResultSkus.indexOf(currentItemSku);

            if (index > 0) {
                currentItemSku = searchResultSkus[--index];
                this.attributes['requestedSku'] = currentItemSku;
                
                cortex.getItemBySku(currentItemSku)
                    .then((item) => {
                        let name = item.definition.displayName;
                        this.response.speak(SpeechAssets.previousItem(name))
                                     .listen(SpeechAssets.canIHelp());
                        this.emit(':responseReady');
                    })
                    .catch((err) => {
                        console.log(err);
                        this.response.speak(SpeechAssets.somethingWentWrong())
                                     .listen(SpeechAssets.canIHelp());
                        this.emit(':responseReady');
                    });
            }
            else {
                this.response.speak('That\'s all I have right now. ' + SpeechAssets.whatNext())
                             .listen(SpeechAssets.canIHelp());
                this.emit(':responseReady');
            }
        }
        catch (err) {
            console.log(err);
            this.response.speak(SpeechAssets.somethingWentWrong())
                         .listen(SpeechAssets.canIHelp());
            this.emit(':responseReady');
        }
    },

    'SpecificItemIntent': function() {
        try {
            let currentItemSku      = this.attributes['requestedSku'];
            let searchResultSkus    = this.attributes['searchResults'];
            let index               = this.event.request.intent.slots.ItemNumber.value;

            if (0 <= index && index < searchResultSkus.length) {
                currentItemSku = searchResultSkus[index];
                this.attributes['requestedSku'] = currentItemSku;
                
                cortex.getItemBySku(currentItemSku)
                    .then((item) => {
                        let name = item.definition.displayName;
                        this.response.speak(SpeechAssets.specificItem(name))
                                     .listen(SpeechAssets.canIHelp());
                        this.emit(':responseReady');
                    })
                    .catch((err) => {
                        console.log(err);
                        this.response.speak(SpeechAssets.somethingWentWrong())
                                     .listen(SpeechAssets.canIHelp());
                        this.emit(':responseReady');
                    });
            }
            else {
                this.response.speak('That\'s all I have right now. ' + SpeechAssets.whatNext())
                             .listen(SpeechAssets.canIHelp());
                this.emit(':responseReady');
            }
        }
        catch (err) {
            console.log(err);
            this.response.speak(SpeechAssets.somethingWentWrong())
                         .listen(SpeechAssets.canIHelp());
            this.emit(':responseReady');
        }
    },

    'SkuCodeSearchIntent': function() {
        const sku = this.event.request.intent.slots.SkuCode.value;
        cortex.getItemBySku(sku)
            .then((item) => {
                const itemName = item.displayName;
                this.response.speak(SpeechAssets.itemFound(itemName))
                    .listen(SpeechAssets.addToCartQuery());
                this.attributes['requestedSku'] = sku;
                this.emit(':responseReady');
            }).catch((err) => {
                console.log(err);
                this.response.speak(SpeechAssets.itemNotFound())
                    .listen(SpeechAssets.canIHelp());
                this.emit(':responseReady');
            });
    },

    'AddToCartIntent': function() {
        try {
            const itemSku = this.attributes['requestedSku'];

            this.handler.state = SessionState.IN_CART;
            this.emitWithState('AddToCartIntent', itemSku);
        } catch (e) {
            console.log(e);
            this.response.speak(SpeechAssets.somethingWentWrong()).listen(SpeechAssets.howElseCanIHelp());
            this.emit(':responseReady');
        }
    },

    'AddToWishlistIntent': function() {
        try {
            const itemSku = this.attributes['requestedSku'];

            this.handler.state = SessionState.WISHLIST;
            this.emitWithState('AddToWishlistIntent', itemSku);
        } catch (e) {
            console.log(e);
            this.response.speak(SpeechAssets.somethingWentWrong()).listen(SpeechAssets.howElseCanIHelp());
            this.emit(':responseReady');
        }
    },

    'DescribeProductIntent': function() {
        const skuCode = this.attributes['requestedSku'];
        console.log("DescribeProductIntent: SKU = " + skuCode);
        if (skuCode) {
            cortex.getItemBySku(skuCode)
                .then((item) => {
                    var description = {};
                    item.definition.details.forEach((detail) => {
                        if (detail['display-name'] == 'Summary'
                         || detail['display-name'] == 'BBSummary'
                         || detail['display-name'] == 'Overview')
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
                }).catch((err) => {
                    console.log("ERROR: session-browsing.DescribeProductIntent"
                              + " failed calling cortex.getItemBySku. "
                              + JSON.stringify(err));
                    this.response.speak(SpeechAssets.somethingWentWrong())
                        .listen(SpeechAssets.howElseCanIHelp());
                    this.emit(':responseReady');
                });
        } else {
            this.response.speak(SpeechAssets.noProductToDescribe()).listen(SpeechAssets.howElseCanIHelp());
            this.emit(':responseReady');
        }
    },

    'DescribeStoreIntent': function() {
        this.response.speak(brandAssets.description() + ' ' + SpeechAssets.howElseCanIHelp()).listen(SpeechAssets.canIHelp());
        this.emit(':responseReady');
    },

    'CheckOutIntent': function() {
        this.handler.state = SessionState.CHECKOUT;
        this.emitWithState('CheckOutIntent');
    },

    'TellPromotionIntent': function() {
        this.handler.state = SessionState.READING_PROMOTION;
        this.emitWithState('TellPromotionIntent');
    },

    'GetCartIntent': function() {
        this.handler.state = SessionState.IN_CART;
        this.emitWithState('GetCartIntent');
    },

    'GetWishlistIntent': function() {
        this.handler.state = SessionState.WISHLIST;
        this.emitWithState('GetWishlistIntent');
    },

    'AMAZON.YesIntent': function() {
        this.handler.state = SessionState.IN_CART;
        this.emitWithState('AddToCartIntent', this.attributes['requestedSku']);
    },

    'AMAZON.NoIntent': function() {
        this.response.speak(SpeechAssets.howElseCanIHelp())
            .listen(SpeechAssets.canIHelp());
        this.emit(':responseReady');
    },

    'AMAZON.StopIntent' : function() {
        this.handler.state = SessionState.SESSION_END;
        this.emitWithState(AmazonIntent.STOP);
    },

    'AMAZON.HelpIntent' : function() {
        this.response.speak(SpeechAssets.helpMessage()).listen('What would you like to do?');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.handler.state = SessionState.SESSION_END;
        this.emitWithState(AmazonIntent.CANCEL);
    },
    'Unhandled' : function() {
        this.response.speak(SpeechAssets.unhandled()).listen(SpeechAssets.howElseCanIHelp());
        this.emit(':responseReady');
    }
});