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

const RemoveFromCartHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.REMOVE_FROM_CART);
    },
    handle({responseBuilder, attributesManager, requestEnvelope}) {
        return new Promise((resolve, reject) => {
            const attributes = attributesManager.getSessionAttributes();
            const itemIndex = (requestEnvelope.request.intent.slots && requestEnvelope.request.intent.slots.ItemNumber) ? requestEnvelope.request.intent.slots.ItemNumber.value - 1 : null;
            const item = (attributes.orderedCart && attributes.orderedCart[itemIndex]) ? attributes.orderedCart[itemIndex] : null;
            if (item) {
                Cortex.getCortexInstance()
                .then((cortex) => cortex.cortexDeleteFromCart(item.code))
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
                // TODO: Replace with a more descriptive message
                resolve(responseBuilder
                    .speak(SpeechAssets.somethingWentWrong())
                    .reprompt(SpeechAssets.canIHelp())
                    .getResponse());
            }
        });
    }
}

module.exports = RemoveFromCartHandler;
