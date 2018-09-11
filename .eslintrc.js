module.exports = {
  "env": {
    "es6": true,
    "node": true,
    "mocha": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "no-console": 0,
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ]
  },
  "globals": {
    "sails": true,
    "AppViewsController": true,
    "Artifact1Controller": true,
    "Artifact2Controller": true,
    "Artifact3Controller": true,
    "Artifact4Controller": true,
    "Artifact5Controller": true,
    "Artifact6Controller": true,
    "Artifact7Controller": true,
    "AuthController": true,
    "InitiativeController": true,
    "MailController": true,
    "MetaDataController": true,
    "PostController": true,
    "SearchController": true,
    "UploadMilestoneController": true,
    "UserController": true,
    "ActivityCount": true,
    "AppViews": true,
    "Artifact1": true,
    "Artifact2": true,
    "Artifact3": true,
    "Artifact4": true,
    "Artifact5": true,
    "Artifact6": true,
    "Artifact7": true,
    "Initiative": true,
    "Evidence": true,
    "MilestoneCheck": true,
    "Post": true,
    "User": true,
    "Custom": true,
    "DataUtils": true,
    "DbPopulate": true,
    "Mailer": true,
    "ModelGen": true,
    "getQueries": true,
    "describe": true,
    "expect": true,
    "it": true,
    "assert": true
  }
};
