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

const SessionConstants = require('./session-states.js');
const SessionState = SessionConstants.SessionState;
const AmazonIntent = SessionConstants.AmazonIntent;

var Alexa = require('alexa-sdk');

module.exports.handler = (cortex) => Alexa.CreateStateHandler(SessionState.READING_PROMOTION, {

    'TellPromotionIntent': function() {
        this.response.speak('We have some great sales on right now!  This is the part where I tell you about them.  '
            + 'Would you like to add our promotion item to your cart?').listen('Say yes to add the item to your cart, or no to continue shopping');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent' : function() {
        this.handler.state = SessionState.SESSION_END;
        this.emitWithState(AmazonIntent.STOP);
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak('You can try: \'alexa, hello gartner\' or \'alexa, ask hello gartner my' +
            ' name is awesome Aaron\'');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.handler.state = SessionState.SESSION_END;
        this.emitWithState(AmazonIntent.CANCEL);
    },
    'AMAZON.YesIntent' : function() {
        this.response.speak('Great!  I\'ve added it to your cart.  How else can I help you today?').listen('How can I help you?');
        this.handler.state = SessionState.BROWSING;
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent' : function() {
        this.response.speak('Okay!  How else can I help you today?').listen('How can I help you?');
        this.handler.state = SessionState.BROWSING;
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak('Sorry, I didn\'t get that. You can try: \'alexa, open vestri motors\'');
        this.emit(':responseReady');
    }
});
