module.exports = {
  "plugins": [
    "react",
    "jsx-a11y",
    "import",
    "css-modules",
  ],
  "extends": [
    "airbnb",
    "plugin:css-modules/recommended"
  ],
  "parser": "babel-eslint",
  "rules": {
    "consistent-return": 0,
    "no-param-reassign": 0,
    "arrow-body-style": 0,
    "import/prefer-default-export": 0,
    "react/jsx-filename-extension": 0,
    "react/forbid-prop-types": [0, {"forbid": "any"}],
    "no-unused-vars": ["error", {
      "argsIgnorePattern": "(dispatch|getState|state)"
    }],
    "no-multiple-empty-lines": [2, {"max": 2}],
  },
  "globals": {
    "fetch": true,
    "Headers": true,
    "document": true,
    "window": true,
    "atob": true
  }
};
