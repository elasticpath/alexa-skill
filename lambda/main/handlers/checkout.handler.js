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

const CheckOutHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.CHECKOUT);
    },
    handle({responseBuilder, attributesManager}) {
        return new Promise((resolve, reject) => {
            Cortex.getCortexInstance()
            .then((cortex) => cortex.getTotals())
            .then((data) => {
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
            .catch((error) => reject(error));
        });
    }
}

module.exports = CheckOutHandler;
