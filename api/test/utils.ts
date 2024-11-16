import SQL from "./initialize";

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
export const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

export const TOKEN: string = "7ca935fb-b337-4b54-ab91-91cf923800cf";
export const TOKEN2: string = "bc14d4cf-fda6-4e89-a3ff-269d8eb880c3";

export const initializeDb = async (env: Env) => {
  // Database table creation
  for (const statement of SQL) {
    await env.DB.exec(statement);
  }

  // Mock user creation
  await env.DB.exec(
    "INSERT INTO account (account_id, username, email) VALUES (1, 'pathmaster', 'info@pathmaster.gg');",
  );
  await env.DB.exec(
    `INSERT INTO session (session_id, type, token, create_time, expiration, account_id) VALUES (1, 2, '${TOKEN}', 1, 999999999999, 1);`,
  );

  // Mock user creation
  await env.DB.exec(
    "INSERT INTO account (account_id, username, email) VALUES (2, 'tester', 'test@pathmaster.gg');",
  );
  await env.DB.exec(
    `INSERT INTO session (session_id, type, token, create_time, expiration, account_id) VALUES (2, 2, '${TOKEN2}', 1, 999999999999, 2);`,
  );
};
