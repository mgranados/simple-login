import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';
import { Redirector, Form } from '~components';
import inputs from '../../json/forms/account.json';

const Account = () => {
    const router = useRouter();

    const { query: { accountId } } = router;
    const [userData, setUserData] = useState({});
    const { firstName, lastName, email } = userData;

    const handleData = (response) => {
        setUserData(response?.data?.data || {});
    };

    const handleFormData = () => {
      Router.push(`/users/${accountId}`);
    };

    useEffect(() => {

      setUserData({});
      let source = axios.CancelToken.source();
      axios({
          method: 'GET',
          url: `/api/users/${accountId}`,
          cancelToken: source.token
      })
      .then(handleData)
      .catch((err) => console.log({ err }))
      
      return () => { source.cancel("Cancelling in cleanup") };
    }, []);

    
    if (!email) return <h1>Loading...</h1>;
   
    const inputsWithValues = inputs.map((input) => {
      const { type, name, checkboxes = [], validation = {} } = input;
      const { type: validationType } = validation;
      if (type === "checkboxes") {
        const checkedBoxes = checkboxes.map((checkbox) => {
          return (
          { ...checkbox, checked: userData[name] && userData[name].indexOf(checkbox.value) !== -1}
        )});
        return {
          ...input,
          checkboxes: checkedBoxes
        }
      }
      if (validationType === "image" || validationType === "resume") {
        return {
          ...input,
          value: '',
          fileId: userData[name]
        }
      }
      return {
        ...input,
        value: type !== 'file' ? userData[name] : ''
      };
    })

    return (!!email &&
      <Redirector>
        <Head>
          <title>Account Page: {accountId}</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <h1>Account for {firstName + ' ' + lastName}</h1>
  
        <Form  
          inputs={inputsWithValues} 
          title="Account Info" 
          route={`/api/users/${accountId}`} 
          handleData={handleFormData} 
          method="patch"
        />
      </Redirector>
    );
}

export default Account;