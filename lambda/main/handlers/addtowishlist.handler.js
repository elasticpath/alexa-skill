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
            Cortex.getCortexInstance()
            .then((cortex) => cortex.cortexAddToWishlist(productSku))
            .then(() => {
                resolve(responseBuilder
                    .speak(SpeechAssets.addedToWishlist())
                    .reprompt(SpeechAssets.canIHelp())
                    .getResponse());
            })
            .catch(error => reject(error));
        });
    }
}

module.exports = AddToWishlistHandler;