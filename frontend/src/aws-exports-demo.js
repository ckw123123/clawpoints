// Demo configuration for local preview
// Replace with actual AWS resources when deploying
const awsconfig = {
  aws_project_region: 'us-east-1',
  aws_cognito_identity_pool_id: 'us-east-1:demo-identity-pool',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: 'us-east-1_DEMO',
  aws_user_pools_web_client_id: 'demo-client-id',
  oauth: {},
  aws_cognito_username_attributes: ['username'],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ['name'],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: ['SMS'],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: []
  },
  aws_cognito_verification_mechanisms: ['username'],
  aws_appsync_graphqlEndpoint: 'https://demo.appsync-api.us-east-1.amazonaws.com/graphql',
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  API: {
    endpoints: [
      {
        name: 'membershipAPI',
        endpoint: 'http://localhost:3001/dev', // Local serverless offline
        region: 'us-east-1'
      }
    ]
  }
};

export default awsconfig;