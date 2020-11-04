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

'use strict';

const Alexa = require('ask-sdk-core');
// Request Handlers
const AddToCartHandler  = require('./handlers/addtocart.handler');
const AddToWishlistHandler = require('./handlers/addtowishlist.handler');
const AuthHandler = require('./handlers/auth.handler');
const CheckOutHandler = require('./handlers/checkout.handler');
const ConfirmCheckoutHandler = require('./handlers/confirmcheckout.handler');
const DescribeInventoryIntent = require('./handlers/describeinventory.handler');
const DescribePriceHandler = require('./handlers/describeprice.handler');
const DescribeProductHandler = require('./handlers/describeproduct.handler');
const DescribeListedProductHandler = require('./handlers/descibelistedproduct.handler');
const GetCartHandler = require('./handlers/getcart.handler');
const GetWishlistHandler = require('./handlers/getwishlist.handler');
const GetPreviousPurchaseHandler = require('./handlers/getpreviouspurchase.handler');
const HelpIntentHandler = require('./handlers/helpintent.handler');
const KeywordSearchHandler = require('./handlers/keywordsearch.handler');
const MoveToCartHandler= require('./handlers/movetocart.handler');
const MoveToWishlistHandler = require('./handlers/movetowishlist.handler');
const LaunchRequestHandler = require('./handlers/launchrequest.handler');
const NextItemHandler = require('./handlers/nextitem.handler');
const NoIntentHandler = require('./handlers/nointent.handler');
const PreviousItemHandler = require('./handlers/previousitem.handler');
const RemoveFromCartHandler = require('./handlers/removefromcart.handler');
const RemoveFromWishlistHandler = require('./handlers/removefromwishlist.handler');
const SessionEndedHandler = require('./handlers/sessionended.handler');
const SpecificItemHandler = require('./handlers/specificitem.handler');
const StopSessionHandler = require('./handlers/stopsession.handler');

// Error Handlers
const AccessDeniedHandler = require('./handlers/accessdenied.handler');
const GenericErrorHandler = require('./handlers/genericerror.handler');

//Interceptors
const AuthInterceptor = require('./interceptors/auth.interceptor');

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        AuthHandler,
        AddToCartHandler,
        AddToWishlistHandler,
        ConfirmCheckoutHandler,
        CheckOutHandler,
        DescribeInventoryIntent,
        DescribePriceHandler,
        DescribeProductHandler,
        DescribeListedProductHandler,
        GetCartHandler,
        GetWishlistHandler,
        GetPreviousPurchaseHandler,
        HelpIntentHandler,
        KeywordSearchHandler,
        MoveToCartHandler,
        MoveToWishlistHandler,
        LaunchRequestHandler,
        NextItemHandler,
        NoIntentHandler,
        PreviousItemHandler,
        RemoveFromCartHandler,
        RemoveFromWishlistHandler,
        SessionEndedHandler,
        SpecificItemHandler,
        StopSessionHandler
    )
    .addRequestInterceptors(AuthInterceptor)
    .addErrorHandlers(
        AccessDeniedHandler,
        GenericErrorHandler
    )
    .lambda();
