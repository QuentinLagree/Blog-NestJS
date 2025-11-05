import 'dotenv/config';
export const PEPPER = process.env["ARGON2_PEPPER"]
console.log(PEPPER?.length)