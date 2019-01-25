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
            if (item && item.movetocartform) {
                Cortex.getCortexInstance()
                .then((cortex) => cortex.cortexPost(item.movetocartform, { quantity: 1 }))
                .then(() => {
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
}

module.exports = MoveToCartHandler;
