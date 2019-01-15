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

const Alexa = require('alexa-sdk');
const SessionConstants = require('./session-states.js');
const SessionState = SessionConstants.SessionState;

const SpeechAssets = require('../speech/assets.js');

module.exports.handler = (cortex, brandAssets) => Alexa.CreateStateHandler(SessionState.SESSION_END, {

    'AMAZON.StopIntent' : function() {
        this.response.speak(brandAssets.sendoff());
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak(SpeechAssets.helpMessage());
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak(brandAssets.sendoff());
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak(SpeechAssets.unhandled());
        this.emit(':responseReady');
    }
});
