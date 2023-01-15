export const JWT_SECRET = process.env.SECRET_KEY;

if (!JWT_SECRET) {
  console.log('No JWT secret string. Set SECRET_KEY environment variable.');
  process.exit(1);
}
