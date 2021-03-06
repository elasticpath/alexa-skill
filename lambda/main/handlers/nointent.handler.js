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
const { isIntentRequestOfType } = require('../utils');
const { AmazonIntent } = require('../constants');

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

module.exports = NoIntentHandler;
