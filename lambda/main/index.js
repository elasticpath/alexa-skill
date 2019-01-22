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

'use strict';

const Alexa = require('ask-sdk-core');
const Cortex = require('./cortex.js');
const { AmazonIntent, ElasticPathIntents, PROD_DESCRIPTION } = require('./constants.js');

const user = process.env['CORTEX_USER'];
const pass = process.env['CORTEX_PASSWORD'];
const cortexUrl = process.env['CORTEX_URL'];
const scope = process.env['CORTEX_SCOPE'].toLowerCase();

const SpeechAssets = require('./speech/assets.js');

let _cortex;

const LaunchRequestHandler = {
    canHandle({requestEnvelope}) {
        return requestEnvelope.request.type === 'LaunchRequest';
    },
    handle({responseBuilder}) {
        return new Promise((resolve, reject) => {
            Cortex.createCortexInstance(user, pass, cortexUrl, scope)
            .then((cortex) => {
                _cortex = cortex;
                resolve(responseBuilder
                    .speak(SpeechAssets.greeting())
                    .reprompt(SpeechAssets.canIHelp())
                    .getResponse());
            }).catch((err) =>
                console.log(err)
            );
        }); 
    }
};

const SessionEndedHandler = {
    canHandle({requestEnvelope}) {
        return requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle({requestEnvelope}) {
        console.log(`Session ended with reason: ${requestEnvelope.request.reason}`);
    }
}

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(input, error) {
        console.log(error)
        return input.responseBuilder
            .speak(SpeechAssets.unhandled())
            .reprompt(SpeechAssets.unhandled())
            .getResponse()
    }
}

const StopSessionHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, AmazonIntent.STOP, AmazonIntent.CANCEL);
    },
    handle({responseBuilder}) {
        return responseBuilder
            .speak(SpeechAssets.sendoff())
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, AmazonIntent.HELP);
    },
    handle({responseBuilder}) {
        return responseBuilder
            .speak(SpeechAssets.helpMessage())
            .reprompt(SpeechAssets.canIHelp())
            .getResponse();
    }
};

const NoIntentHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, AmazonIntent.NO);
    },
    handle({responseBuilder}) {
        return responseBuilder
            .speak(SpeechAssets.howElseCanIHelp())
            .reprompt(SpeechAssets.canIHelp())
            .getResponse();
    }
}

const KeywordSearchHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.KEYWORD_SEARCH);
    },
    handle({responseBuilder, attributesManager, requestEnvelope}) {
        return new Promise((resolve, reject) => {
            const keywords = requestEnvelope.request.intent.slots.SearchKeyword.value;

            if (keywords) {
                _cortex.getItemsByKeyword(keywords)
                .then((items) => {
                    let speech;
                    if (items.length > 0) {
                        const attributes = attributesManager.getSessionAttributes();
                        const searchResults = [];
                        items.forEach(item => searchResults.push(item.code));
                        attributes.requestedSku = items[0].code;
                        attributes.searchResults = searchResults;
                        attributesManager.setSessionAttributes(attributes);

                        speech = SpeechAssets.searchResults(items.length, items[0]);

                    } else {
                        speech = SpeechAssets.itemNotFound();
                    }
                    resolve(responseBuilder
                        .speak(speech)
                        .reprompt(SpeechAssets.howElseCanIHelp())
                        .getResponse());
                })
                .catch((err) => reject(err));
            } else {
                resolve(responseBuilder
                    .speak(SpeechAssets.itemNotFound())
                    .reprompt(SpeechAssets.howElseCanIHelp())
                    .getResponse());
            }
        });
    }
};

const NextItemHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.NEXT_ITEM);
    },
    handle({responseBuilder, attributesManager}) {
        return new Promise((resolve, reject) => {
            const attributes = attributesManager.getSessionAttributes();
            let index = attributes.searchResults.indexOf(attributes.requestedSku);

            if (index < attributes.searchResults.length - 1) {
                let currentItemSku = attributes.searchResults[++index];
                attributes.requestedSku = currentItemSku;
                attributesManager.setSessionAttributes(attributes);

                _cortex.getItemBySku(currentItemSku)
                    .then((item) => {
                        resolve(responseBuilder
                            .speak(SpeechAssets.nextItem(item.definition.displayName))
                            .reprompt(SpeechAssets.canIHelp())
                            .getResponse());
                    })
                    .catch((err) => reject(err));
            }
            else {
                resolve(responseBuilder
                    .speak(`That's all I have right now. ${SpeechAssets.whatNext()}`)
                    .reprompt(SpeechAssets.canIHelp())
                    .getResponse());
            }
        })
    }
};

const PreviousItemHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.PREVIOUS_ITEM);
    },
    handle({responseBuilder, attributesManager}) {
        return new Promise((resolve, reject) => {
            const attributes = attributesManager.getSessionAttributes();
            let index = attributes.searchResults.indexOf(attributes.requestedSku);
            if (index > 0) {
                attributes.requestedSku = attributes.searchResults[--index];
                attributesManager.setSessionAttributes(attributes);
                _cortex.getItemBySku(attributes.requestedSku)
                    .then((item) => {
                        resolve(responseBuilder
                            .speak(SpeechAssets.previousItem(item.definition.displayName))
                            .reprompt(SpeechAssets.canIHelp())
                            .getResponse());
                    })
                    .catch((err) => reject(err));
            }
            else {
                resolve(responseBuilder
                    .speak(`That's all I have right now. ${SpeechAssets.whatNext()}`)
                    .reprompt(SpeechAssets.canIHelp())
                    .getResponse());
            }
        })
    }
};

const SpecificItemHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.SPECIFIC_ITEM);
    },
    handle({responseBuilder, attributesManager, requestEnvelope}) {
        return new Promise((resolve, reject) => {
            const attributes = attributesManager.getSessionAttributes();
            const index = requestEnvelope.request.intent.slots.ItemNumber.value;

            if (0 <= index && index < attributes.searchResults.length) {
                attributes.requestedSku = attributes.searchResults[index];
                attributesManager.setSessionAttributes(attributes);

                _cortex.getItemBySku(currentItemSku)
                    .then((item) => {
                        resolve(responseBuilder
                            .speak(SpeechAssets.specificItem(item.definition.displayName))
                            .reprompt(SpeechAssets.canIHelp())
                            .getResponse());
                    })
                    .catch((err) => reject(err));
            }
            else {
                resolve(responseBuilder
                    .speak(`That's all I have right now. ${SpeechAssets.whatNext()}`)
                    .reprompt(SpeechAssets.canIHelp())
                    .getResponse());
            }
        })
    }
};

const SkuCodeSearchHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.SKU_SEARCH);
    },
    handle({responseBuilder, requestEnvelope}) {
        return new Promise((resolve, reject) => {
            const sku = requestEnvelope.request.intent.slots.SkuCode.value;
            _cortex.getItemBySku(sku)
                .then((item) => {
                    resolve(responseBuilder
                        .speak(SpeechAssets.itemFound(item.displayName))
                        .reprompt(SpeechAssets.addToCartQuery())
                        .getResponse());
                })
                .catch((err) => reject(err));
        });
    }
};

const DescribeProductHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.DESCRIBE_PRODUCT);
    },
    handle({responseBuilder, attributesManager}) {
        return new Promise((resolve, reject) => {
            const attributes = attributesManager.getSessionAttributes();
            const skuCode = attributes.requestedSku;

            if (skuCode) {
                _cortex.getItemBySku(skuCode)
                    .then((item) => {
                        item.definition.details.forEach((detail) => {
                            if (detail['display-name'] == PROD_DESCRIPTION) {
                                const description = detail['display-value'].slice(0, detail['display-value'].indexOf('.'))
                                resolve(responseBuilder
                                    .speak(SpeechAssets.describeProduct(description, item))
                                    .reprompt(SpeechAssets.addToCartQuery())
                                    .getResponse());
                            }
                        });
                    })
                    .catch((err) => reject(err));
            } else {
                resolve(responseBuilder
                    .speak(SpeechAssets.noProductToDescribe())
                    .reprompt(SpeechAssets.howElseCanIHelp())
                    .getResponse());
            }
        });
    }
};

// TODO: Works for cart only at the moment, move most to helper function and then make work for wishlist
const DescribeListedProductHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.DESCRIBE_LISTED_PRODUCT);
    },
    handle(input) {
        return new Promise((resolve, reject) => {
            const {attributesManager, requestEnvelope} = input;
            const attributes = attributesManager.getSessionAttributes();
            const itemIndex = requestEnvelope.request.intent.slots.ItemNumber.value - 1;
            const item = attributes.orderedCart[itemIndex];
            if (item) {
                attributes.requestedSku = item.code;
                attributesManager.setSessionAttributes(attributes);
                return DescribeProductHandler.handle(input);
            } else {
                resolve(responseBuilder
                    .speak(SpeechAssets.noProductToDescribe())
                    .reprompt(SpeechAssets.howElseCanIHelp())
                    .getResponse());
            }
        });
    }
};

const AddToCartHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.ADD_TO_CART);
    },
    handle({responseBuilder, attributesManager, requestEnvelope}) {
        return new Promise((resolve, reject) => {
            const attributes = attributesManager.getSessionAttributes();
            let productSku = '';
            if (attributes.requestedSku) {
                productSku = attributes.requestedSku;
            } else if (requestEnvelope.request.intent.slots && requestEnvelope.request.intent.slots.SkuCode){
                productSku = requestEnvelope.request.intent.slots.SkuCode.value;
            }

            if (productSku) {
                _cortex.cortexAddToCart(productSku, 1).then((availability) => {
                    const speech = (availability === 'AVAILABLE') ? SpeechAssets.addedToCart() : SpeechAssets.itemNotAvailable();
                    resolve(responseBuilder
                        .speak(speech)
                        .reprompt(SpeechAssets.canIHelp())
                        .getResponse());
                })
                .catch((err) => reject(err));
            } else {
                //TODO: Replace this with more descriptive message
                reject(responseBuilder
                    .speak(SpeechAssets.somethingWentWrong())
                    .reprompt(SpeechAssets.howElseCanIHelp())
                    .getResponse());
            }
        });
    }
};

const GetCartHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.GET_CART);
    },
    // TODO: FIX THIS MESS
    handle({responseBuilder, attributesManager}) {
        return new Promise((resolve, reject) => {
            const zoom = [
                'defaultcart:lineitems:element:item:code',
                'defaultcart:lineitems:element:item:definition',
                'defaultcart:lineitems:element:price'
            ];
            _cortex.cortexGet(`${cortexUrl}?zoom=${zoom.join()}`)
                .then((data) => {
                    const attributes = attributesManager.getSessionAttributes();
                    const lineitems = (data._defaultcart) ? data._defaultcart[0]._lineitems[0]._element : [];

                    if (lineitems.length > 0) {
                        const items = [];

                        lineitems.forEach((item) => {
                                let purchasePrice = item._price[0]['purchase-price'][0].amount;
                                items.push({
                                    name: item._item[0]._definition[0]['display-name'],
                                    code: item._item[0]._code[0].code,
                                    price: purchasePrice
                                });
                        });

                        attributes.orderedCart = items;
                        attributesManager.setSessionAttributes(attributes);

                        resolve(responseBuilder
                            .speak(SpeechAssets.cartDescription(items))
                            .reprompt(SpeechAssets.readyToCheckOut())
                            .getResponse());
                    } else {
                        resolve(responseBuilder
                            .speak(SpeechAssets.emptyCart())
                            .reprompt(SpeechAssets.howElseCanIHelp())
                            .getResponse());
                    }
                })
                .catch((err) => reject(err));
        });
    }
};

//TODO: Sort out the differences between AddToWishlist and MoveToWishlist
const MoveToWishlistHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.MOVE_TO_WISHLIST);
    },
    handle({responseBuilder, attributesManager, requestEnvelope}) {
        return new Promise((resolve, reject) => {
            const attributes = attributesManager.getSessionAttributes();
            const itemIndex = (requestEnvelope.request.intent.slots && requestEnvelope.request.intent.slots.ItemNumber) ? requestEnvelope.request.intent.slots.ItemNumber.value - 1 : 0 ;
            const item = attributes.orderedCart[itemIndex];
            if (item) {
                // TODO: Replace with a move to cart action?  Start saving the item hrefs in the ordered cart? Should definitely be one call
                _cortex.cortexAddToWishlist(item.code)
                .then((data) => {
                    _cortex.cortexDeleteFromCart(item.code)
                    .then((data) => {
                        resolve(responseBuilder
                            .speak(SpeechAssets.movedToWishlist(item.name))
                            .reprompt(SpeechAssets.howElseCanIHelp())
                            .getResponse());
                    });
                })
                .catch((err) => reject(err));
            } else {
                // TODO: Replace this with a more descriptive message
                reject(responseBuilder
                    .speak(SpeechAssets.somethingWentWrong())
                    .reprompt(SpeechAssets.canIHelp())
                    .getResponse());
            }
        });
    }
};

const RemoveFromCartHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.REMOVE_FROM_CART);
    },
    handle({responseBuilder, attributesManager, requestEnvelope}) {
        return new Promise((resolve, reject) => {
            const itemIndex = requestEnvelope.request.intent.slots.ItemNumber.value - 1;
            const attributes = attributesManager.getSessionAttributes();
            const item = attributes.orderedCart[itemIndex];
            if (item) {
                _cortex.cortexDeleteFromCart(item.code)
                .then(() => {
                    attributes.orderedCart.splice(itemIndex, 1);
                    attributesManager.setSessionAttributes(attributes);
                    resolve(responseBuilder
                        .speak(`${SpeechAssets.removedFromCart(item.name)}  ${SpeechAssets.cartDescription(attributes.orderedCart)}`)
                        .reprompt(SpeechAssets.readyToCheckOut())
                        .getResponse());
                })
                .catch((err) => reject(err));
            } else {
                // TODO: Replace this with a more descriptive message
                reject(responseBuilder
                    .speak(SpeechAssets.somethingWentWrong())
                    .reprompt0(SpeechAssets.canIHelp())
                    .getResponse());
            }
        });
    }
};

const GetWishlistHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.GET_WISLIST);
    },
    //TODO: Fix this mess
    handle({responseBuilder, attributesManager}) {
        return new Promise((resolve, reject) => {
            _cortex.getWishlistItems()
            .then((items) => {
                const attributes = attributesManager.getSessionAttributes();
                const orderedWishlist = [];
                for (let item of items) {
                        let obj = {
                            name: item.definition.displayName,
                            code: item.code,
                            addToCartHref: item.movetocartform,
                        };
                        orderedWishlist.push(obj);
                }
                attributes.orderedWishlist = orderedWishlist;
                attributesManager.setSessionAttributes(attributes);
                resolve(responseBuilder
                    .speak(SpeechAssets.describeWishlist(attributes.orderedWishlist))
                    .reprompt(SpeechAssets.howElseCanIHelp())
                    .getResponse());
            })
            .catch((err) => reject(err));
        });
    }
};

const MoveToCartHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.MOVE_TO_CART);
    },
    handle({responseBuilder, attributesManager, requestEnvelope}) {
        return new Promise((resolve, reject) => {
            const attributes = attributesManager.getSessionAttributes();
            let index;
            if (requestEnvelope.request.intent.slots && requestEnvelope.request.intent.slots.ItemNumber) {
                index = requestEnvelope.request.intent.slots.ItemNumber.value - 1;
            } else {
                index = attributes.orderedWishlist.indexOf(attributes.requestedSku)
            }
            const item = attributes.orderedWishlist[index];
            if (item && item.addToCartHref) {
                _cortex.cortexPost(item.addToCartHref, { quantity: 1})
                .then((data) => {
                    attributes.orderedWishlist.splice(index, 1);
                    attributesManager.setSessionAttributes(attributes);
                    resolve(responseBuilder
                        .speak(SpeechAssets.movedToCart(item))
                        .reprompt(SpeechAssets.canIHelp())
                        .getResponse());
                })
                .catch((err) => reject(err));
            } else {
                // TODO: Replace with more descriptive error message
                resolve(responseBuilder
                    .speak(SpeechAssets.somethingWentWrong())
                    .reprompt(SpeechAssets.canIHelp())
                    .getResponse());
            }
        });
    }
};

const AddToWishlistHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.ADD_TO_WISHLIST);
    },
    handle({responseBuilder, attributesManager, requestEnvelope}) {
        return new Promise((resolve, reject) => {
            const attributes = attributesManager.getSessionAttributes();
            let productSku;
            if (attributes.requestedSku) {
                productSku = attributes.requestedSku;
                delete attributes.requestedSku;
                attributesManager.setSessionAttributes(attributes);
            } else if (requestEnvelope.request.intent.slots &&  requestEnvelope.request.intent.slots.SkuCode) {
                productSku = requestEnvelope.request.intent.slots.SkuCode.value;
            } else {
                // TODO: Replace with a more descriptive error message
                resolve(responseBuilder
                    .speak(SpeechAssets.somethingWentWrong())
                    .reprompt(SpeechAssets.canIHelp())
                    .getResponse());
            }
        
            _cortex.cortexAddToWishlist(productSku).then((data) => {
                resolve(responseBuilder
                    .speak(SpeechAssets.addedToWishlist())
                    .reprompt(SpeechAssets.canIHelp())
                    .getResponse());
            })
            .catch((err) => reject(err));
        });
    }
};

const RemoveFromWishlistHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.REMOVE_FROM_WISHLIST);
    },
    // TODO: Error Handling for Item index
    handle({responseBuilder, attributesManager, requestEnvelope}) {
        return new Promise((resolve, reject) => {
            const attributes = attributesManager.getSessionAttributes();
            const itemIndex = requestEnvelope.request.intent.slots.ItemNumber.value - 1;
            const item = attributes.orderedWishlist[itemIndex];
            if (item) {
                _cortex.cortexDeleteFromWishlist(item.code)
                .then((data) => {
                    attributes.orderedWishlist.splice(itemIndex, 1);
                    resolve(responseBuilder    
                        .speak(`${SpeechAssets.removedFromWishlist(item.name)} ${SpeechAssets.describeWishlist(attributes.orderedWishlist)}`)
                        .reprompt(SpeechAssets.howElseCanIHelp())
                        .getResponse());
                })
                .catch((err) => reject(err));
            } else {
                // TODO: Replace with a more descriptive error message
                resolve(responseBuilder
                    .speak(SpeechAssets.somethingWentWrong())
                    .reprompt(SpeechAssets.canIHelp())
                    .getResponse());
            }
        });
    }
};

const CheckOutHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.CHECKOUT);
    },
    handle({responseBuilder, attributesManager}) {
        const zoom = [
            'defaultcart',
            'defaultcart:total'
        ];
        return new Promise((resolve, reject) => {
            _cortex.cortexGet(`${cortexUrl}?zoom=${zoom.join()}`)()
            .then((data) => {
                console.log(data);
                let speech, reprompt;
                if (data._defaultcart[0]['total-quantity'] > 0) {
                    const attributes = attributesManager.getSessionAttributes();
                    speech = SpeechAssets.fullCheckoutMessage(data._defaultcart[0]['total-quantity'], data._defaultcart[0]._total[0].cost[0].display);
                    reprompt = SpeechAssets.likeToCheckout();
                    attributes.confirmCheckout = true;
                    attributesManager.setSessionAttributes(attributes);
                } else {
                    speech = SpeechAssets.noItemsToCheckOut();
                    reprompt = SpeechAssets.howElseCanIHelp();
                }
                resolve(responseBuilder
                    .speak(speech)
                    .reprompt(reprompt)
                    .getResponse());
            })
            .catch((err) => reject(err));
        });
    }
};

const ConfirmCheckoutHandler = {
    canHandle({requestEnvelope, attributesManager}) {
        const attributes = attributesManager.getSessionAttributes();
        return isIntentRequestOfType(requestEnvelope, AmazonIntent.YES)
            && attributes.confirmCheckout;
    },
    handle({responseBuilder, attributesManager}) {
        return new Promise((resolve, reject) => {
            const attributes = attributesManager.getSessionAttributes()
            delete attributes.confirmCheckout;
            _cortex.cortexCheckout()
            .then(() => {
                resolve(responseBuilder
                    .speak(SpeechAssets.purchaseSuccess())
                    .reprompt(SpeechAssets.howElseCanIHelp())
                    .getResponse());
            })
            .catch((err) => reject(err));
        });
    }
};

const isIntentRequestOfType = (requestEnvelope, ...intentTypes) => {
    if (requestEnvelope.request.type === AmazonIntent.INTENT_REQUEST) {
        for (let type of intentTypes) {
            if (requestEnvelope.request.intent.name === type) {
                return true;
            }
        }
    }
    return false
}

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        AddToCartHandler,
        AddToWishlistHandler,
        CheckOutHandler,
        ConfirmCheckoutHandler,
        DescribeProductHandler,
        DescribeListedProductHandler,
        GetCartHandler,
        GetWishlistHandler,
        HelpIntentHandler,
        KeywordSearchHandler,
        MoveToCartHandler,
        MoveToWishlistHandler,
        LaunchRequestHandler,
        NextItemHandler,
        NoIntentHandler,
        PreviousItemHandler,
        RemoveFromCartHandler,
        RemoveFromWishlistHandler,
        SessionEndedHandler,
        SpecificItemHandler,
        SkuCodeSearchHandler,
        StopSessionHandler)
    .addErrorHandlers(ErrorHandler)
    .lambda();