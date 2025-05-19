export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'BREAKING CHANGE', 'chore'],
    ], // Only allow feat, fix, docs, chore and BREAKING CHANGE
    'subject-empty': [2, 'never'], // Prevent empty commit messages
    'header-max-length': [2, 'always', 72], // Limit the header length
    'footer-max-line-length': [2, 'always', 12000], // increase the limit to 1200 characters
    'body-max-line-length': [2, 'always', 12000], // increase the limit to 1200 characters
  },
};
