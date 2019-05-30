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

const AddToCartHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.ADD_TO_CART);
    },
    handle({responseBuilder, attributesManager, requestEnvelope}) {
        return new Promise((resolve, reject) => {
            const attributes = attributesManager.getSessionAttributes();
            const quantity = requestEnvelope.request.intent.slots
                && requestEnvelope.request.intent.slots.ItemQuantity
                && /^\d+$/.test(Number(requestEnvelope.request.intent.slots.ItemQuantity.value)) ?
                Number(requestEnvelope.request.intent.slots.ItemQuantity.value) : 1;
            let productSku;
            if (attributes.requestedSku) {
                productSku = attributes.requestedSku;
            } else if (requestEnvelope.request.intent.slots && requestEnvelope.request.intent.slots.SkuCode){
                productSku = requestEnvelope.request.intent.slots.SkuCode.value;
            }
            if (productSku) {
                Cortex.getCortexInstance()
                .cortexAddToCart(productSku, quantity)
                .then(() => {
                    resolve(responseBuilder
                        .speak(SpeechAssets.addedToCart())
                        .reprompt(SpeechAssets.canIHelp())
                        .getResponse());
                })
                .catch(error => reject(error));
            } else {
                //TODO: Replace this with more descriptive message
                resolve(responseBuilder
                    .speak(SpeechAssets.somethingWentWrong())
                    .reprompt(SpeechAssets.howElseCanIHelp())
                    .getResponse());
            }
        });
    }
};

module.exports = AddToCartHandler;
