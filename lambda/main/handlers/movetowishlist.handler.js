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

const MoveToWishlistHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.MOVE_TO_WISHLIST);
    },
    handle({responseBuilder, attributesManager, requestEnvelope}) {
        return new Promise((resolve, reject) => {
            const attributes = attributesManager.getSessionAttributes();
            const index = (requestEnvelope.request.intent.slots && requestEnvelope.request.intent.slots.ItemNumber) ? requestEnvelope.request.intent.slots.ItemNumber.value - 1 : 0 ;
            const item = attributes.orderedCart[index];
            if (item) {
                Cortex.getCortexInstance()
                .then((cortex) => cortex.cortexPost(item.movetowishlist))
                .then(() => {
                    attributes.orderedCart.splice(index, 1);
                    attributesManager.setSessionAttributes(attributes);
                    resolve(responseBuilder
                        .speak(SpeechAssets.movedToWishlist(item.name))
                        .reprompt(SpeechAssets.howElseCanIHelp())
                        .getResponse());
                })
                .catch((error) => reject(error));
            } else {
                // TODO: Replace this with a more descriptive message
                resolve(responseBuilder
                    .speak(SpeechAssets.somethingWentWrong())
                    .reprompt(SpeechAssets.canIHelp())
                    .getResponse());
            }
        });
    }
}

module.exports = MoveToWishlistHandler;