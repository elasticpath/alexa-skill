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

const SpeechAssets = require('../speech/assets');
const DescribeProductHandler = require('./describeproduct.handler');
const { isIntentRequestOfType } = require('../utils');
const { ElasticPathIntents } = require('../constants');

const DescribeListedProductHandler = {
    canHandle({requestEnvelope}) {
        return isIntentRequestOfType(requestEnvelope, ElasticPathIntents.DESCRIBE_LISTED_PRODUCT);
    },
    handle(input) {
        return new Promise((resolve) => {
            const { responseBuilder, attributesManager, requestEnvelope } = input;
            const attributes = attributesManager.getSessionAttributes();
            const itemIndex = requestEnvelope.request.intent.slots.ItemNumber.value - 1;
            if (attributes.orderedCart && attributes.orderedCart[itemIndex]) {
                attributes.requestedSku = attributes.orderedCart[itemIndex].code;
                attributesManager.setSessionAttributes(attributes);
                resolve(DescribeProductHandler.handle(input));
            } else {
                resolve(responseBuilder
                    .speak(SpeechAssets.noProductToDescribe())
                    .reprompt(SpeechAssets.howElseCanIHelp())
                    .getResponse());
            }
        });
    }
}

module.exports = DescribeListedProductHandler;
