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

const Cortex = require('../cortex');
const SpeechAssets = require('../speech/assets');
const { isIntentRequestOfType } = require('../utils');
const { ElasticPathIntents } = require('../constants');

const GetCartHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.GET_CART);
    },
    handle({responseBuilder, attributesManager}) {
        return new Promise((resolve, reject) => {
            Cortex.getCortexInstance()
            .getCartItems()
            .then((data) => {
                const attributes = attributesManager.getSessionAttributes();
                const lineitems = (data._defaultcart && data._defaultcart[0]._lineitems) ? data._defaultcart[0]._lineitems[0]._element : [];                if (lineitems.length > 0) {
                    const items = [];
                    lineitems.forEach((item) => {
                        items.push({
                            name: item._item[0]._definition[0]['display-name'],
                            code: item._item[0]._code[0].code,
                            price: item._price[0]['purchase-price'][0].amount,
                            quantity: item.quantity,
                            movetowishlist: item._movetowishlistform[0]._movetowishlistaction[0].self.href
                        });
                    });
                    attributes.orderedCart = items;
                    attributes.checkout = true;
                    attributesManager.setSessionAttributes(attributes);
                    resolve(responseBuilder
                        .speak(SpeechAssets.cartDescription(data._defaultcart[0]['total-quantity'], items))
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
}

module.exports = GetCartHandler;
