import React, {useState} from 'react';

import signupForm from '../json/forms/signup.json';
import Form from '../components/Form/Form'

const ROUTE = 'users';

const Signup = () => (
  <div>
    <Form inputs={signupForm} title="Sign Up" route={ROUTE} />
  </div>
);

export default Signup;
