import React, { useState } from 'react';
import cookie from 'js-cookie';
import Router from 'next/router';
import loginForm from '../json/forms/login.json';
import { Form } from '~components';

const ROUTE = '/api/auth';
const handleData = ({ data }) => {
  const { error, token } = data || {};

  if (error) console.log({error});
  if (token) {
    cookie.set('token', token, { expires: 2 });
    Router.push('/');
  }
};

const Login = () => (
  <div>
    <Form inputs={loginForm} title="Log In" route={ROUTE} handleData={handleData} />
  </div>
);

export default Login;
