import webpush from 'web-push';

const publicVapidKey = 'BL9Ej0g_bDYS0C3sLbdiYD2ErYANPI4ukcjOvnigT0gV4wnVJG1F0r1HdAJ9bd4Mo2N_wk3FQNdEBTxv6WI3hdA';
const privateVapidKey = 'v3zyQG4qilI9cA3B9k2WjKyUWi6n8O_P9t6LMvqA4DA';

export default (): void => {
  webpush.setVapidDetails(
    'mailto:test@test.com',
    publicVapidKey,
    privateVapidKey,
  );
};
