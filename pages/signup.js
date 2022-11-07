import React from 'react';
import cookie from 'js-cookie';
import Router from 'next/router';
import signupForm from '../json/forms/signup.json';
import { Form } from '~components';

const ROUTE = '/api/users';
const handleData = ({data}) => {
  const { error, token, email } = data || {};

  if (error) console.log({error});
  if (token) {
    cookie.set('token', token, { expires: 2 });
    Router.push(`/confirmation?email=${email}`)
  }
};

const Signup = () => (
  <div>
    <Form inputs={signupForm} title="Sign Up" route={ROUTE} handleData={handleData} />
  </div>
);

export default Signup;
