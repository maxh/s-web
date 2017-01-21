export const getTokensFromCode = function(code) {
  return new Promise((resolve, reject) => {
    oauth2Client.getToken(code, (err, tokens) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        refreshToken: tokens.refresh_token,
        accessToken: tokens.access_token,
        accessTokenExpiration: tokens.expiry_date / 1000,  // ms => secs
      });
    });
  });
};

export const getTokenInfo = (accessToken) => {
  const INFO_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo';
  const url = INFO_URL + '?access_token=' + accessToken;
  return fetch(url).then(response => {
    return response.json();
  });
}
