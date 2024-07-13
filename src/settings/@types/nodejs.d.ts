declare namespace NodeJS {
  interface ProcessEnv {
    readonly BOT_TOKEN: string;
    readonly GENIUS_CLIENT_ID: string;
    readonly GENIUS_CLIENT_SECRET: string;
  }
}
