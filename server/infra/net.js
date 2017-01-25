// Networking utilities.

import 'isomorphic-fetch';


// A handler wrapper that allows handlers to return promises
// instead of dealing with req and res. Also, centralizes
// rejection and error handling and attaches convenience methods.
export const endpoint = (fn) => {
  const wrapper = (req, res) => {
    // Attach a convenience function to send a JSON client error.
    res.sendClientError = (message) => {  // eslint-disable-line no-param-reassign
      return res.status(400).json({ error: message });
    };

    // Catch errors in the form of a rejected promise.
    const promise = new Promise((resolve, reject) => {
      try {
        resolve(fn(req, res));
      } catch (e) {
        reject(e);
      }
    });

    // Ensure a response is sent.
    promise.then((result) => {
      if (!res.headersSent) {
        if (!result) {
          result = {};  // Empty response => success!
        }
        return res.status(200).json(result);
      }
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error in handler:\n', error);
      if (!res.headersSent) {
        return res.status(500).send({ error: 'Internal server error.' });
      }
    });
  };

  return wrapper;
};


export const fetchJson = (url, options) => {
  return fetch(url, options).then((response) => {
    return response.json().then((json) => {
      if (!response.ok) {
        throw Error(JSON.stringify(json));
      }
      return json;
    });
  });
};
