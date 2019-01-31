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

import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { loginRegistered } from '../utils/AuthService';
import './AuthenticationPage.less';

class AuthPage extends React.Component {
  static propTypes = {
    location: ReactRouterPropTypes.location.isRequired,
  }

  constructor(props) {
    super(props);
    const params = new URLSearchParams(props.location.search);
    const redirectUri = params.get('redirect_uri');
    const authState = params.get('state');
    this.state = {
      email: '',
      password: '',
      isLogging: false,
      failedLogin: '',
      succeededLogin: '',
      redirectUri,
      authState,
    };

    this.setPassword = this.setPassword.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.login = this.login.bind(this);
  }

  setEmail(event) {
    this.setState({ email: event.target.value });
  }

  setPassword(event) {
    this.setState({ password: event.target.value });
  }

  login() {
    const {
      email, password, redirectUri, authState,
    } = this.state;

    this.setState({
      isLogging: true,
      failedLogin: '',
      succeededLogin: '',
    });

    loginRegistered(email, password).then((response) => {
      if (response && response !== 400 && response !== 401) {
        this.setState({
          failedLogin: '',
          succeededLogin: 'You successfully logged in!',
          isLogging: false,
        });
        setTimeout(() => {
          window.location = `${redirectUri}#state=${authState}&access_token=${response}&token_type=Bearer`;
        }, 3000);
      } else {
        this.setState({
          failedLogin: 'The email address or the password is incorrect',
          succeededLogin: '',
          isLogging: false,
        });
      }
    }).catch(() => {
      this.setState({
        failedLogin: 'An unexpected error occurred',
        succeededLogin: '',
        isLogging: false,
      });
    });
  }

  render() {
    const { isLogging, failedLogin, succeededLogin } = this.state;
    return (
      <div className="col-md-12 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
        <div className="facebook-auth-form">
          <div className="login-form">
            <div className="main-div">
              <div className="panel">
                <h2>Chat login</h2>
                <p>Please enter your email and password</p>
              </div>
              <div className="form-group">
                <input type="email" autoCapitalize="none" className="form-control" id="inputEmail" placeholder="Email Address" onChange={this.setEmail} />
              </div>
              <div className="form-group">
                <input type="password" className="form-control" id="inputPassword" placeholder="Password" onChange={this.setPassword} />
              </div>
              <div className="forgot">
                <a href="reset.html">Forgot password?</a>
              </div>
              <button type="submit" className="btn btn-primary" onClick={this.login}>Login</button>
              <div className="panel margin-top-30">
                <div className={isLogging ? 'display-block' : 'display-none'}>
                  <h1 className="color-blue">
                    <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate" />
                  </h1>
                </div>
                <div className={succeededLogin ? 'display-block' : 'display-none'}>
                  <h1 className="color-green">
                    <span className="glyphicon glyphicon-ok-circle" />
                    &nbsp;&nbsp; {succeededLogin}
                  </h1>
                </div>
                <div className={failedLogin ? 'display-block' : 'display-none'}>
                  <h1 className="color-red">
                    <span className="glyphicon glyphicon-remove-circle" />
                    &nbsp;&nbsp; {failedLogin}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AuthPage;
