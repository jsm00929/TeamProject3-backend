import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

export class Config {
  // #################
  // # SERVER CONFIG #
  // #################
  @IsString()
  @IsNotEmpty()
  private _host: string;

  @Min(1025)
  @Max(65536)
  private _port: number;

  // #################
  // # CLIENT CONFIG #
  // #################
  @IsString()
  @IsNotEmpty()
  private _clientHost: string;

  @Min(1025)
  @Max(65536)
  private _clientPort: number;

  // ###################
  // # DATABASE CONFIG #
  // ###################
  @IsString()
  @IsNotEmpty()
  private _dbUrl: string;

  // ##############
  // # API CONFIG #
  // ##############
  @IsString()
  @IsNotEmpty()
  private _imdbApiUrl: string;

  @IsString()
  @IsNotEmpty()
  private _imdbApiKeyV3: string;

  @IsString()
  @IsNotEmpty()
  private _googleClientId: string;

  @IsString()
  @IsNotEmpty()
  private _googleClientSecret: string;

  @IsString()
  @IsNotEmpty()
  private _googleSignupRedirectUri: string;

  @IsString()
  @IsNotEmpty()
  private _googleLoginRedirectUri: string;

  // #################
  // # SECRET CONFIG #
  // #################
  @MinLength(10)
  @IsNotEmpty()
  private _accessTokenSecret: string;

  @MinLength(10)
  @IsNotEmpty()
  private _refreshTokenSecret: string;

  @IsString()
  @MinLength(100)
  private _cookieSecret: string;

  @IsString()
  @MinLength(30)
  private _jwtSecret: string;

  // ###################
  // # ALLOWED ORIGINS #
  // ###################

  @IsArray()
  @ArrayMinSize(1)
  private _allowedOrigins: string[];

  // ####################
  // #     NODE_ENV     #
  // ####################
  @IsIn(['dev', 'prod', 'test', 'ngrok'])
  private _env: string;

  public get host(): string {
    return this._host;
  }

  get port() {
    return this._port;
  }

  public get clientHost(): string {
    return this._clientHost;
  }

  public get clientPort(): number {
    return this._clientPort;
  }

  get dbUrl() {
    return this._dbUrl;
  }

  get accessTokenSecret() {
    return this._accessTokenSecret;
  }

  get refreshTokenSecret() {
    return this._refreshTokenSecret;
  }

  get imdbApiUrl() {
    return this._imdbApiUrl;
  }

  get imdbApiKeyV3() {
    return this._imdbApiKeyV3;
  }

  get googleClientId(): string {
    return this._googleClientId;
  }

  get googleClientSecret(): string {
    return this._googleClientSecret;
  }

  get googleSignupRedirectUri(): string {
    return this._googleSignupRedirectUri;
  }

  get googleLoginRedirectUri(): string {
    return this._googleLoginRedirectUri;
  }

  get cookieSecret() {
    return this._cookieSecret;
  }

  get jwtSecret(): string {
    return this._jwtSecret;
  }

  get env() {
    return this._env;
  }

  get allowedOrigins(): string[] {
    return this._allowedOrigins;
  }

  private static instance?: Config;

  static init() {
    const envPath = `.env.${process.env.NODE_ENV}`;

    require('dotenv').config({
      path: envPath,
    });

    const {
      HOST,
      PORT,
      CLIENT_HOST,
      CLIENT_PORT,
      DB_URL,
      IMDB_API_URL,
      IMDB_API_KEY_V3,
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_SIGNUP_REDIRECT_URI,
      GOOGLE_LOGIN_REDIRECT_URI,
      COOKIE_SECRET,
      ACCESS_TOKEN_SECRET,
      REFRESH_TOKEN_SECRET,
      JWT_SECRET,
      NODE_ENV,
      ALLOWED_ORIGINS,
    } = process.env;
    const config = new Config();
    config._host = HOST!;
    config._port = +PORT!;
    config._clientHost = CLIENT_HOST!;
    config._clientPort = +CLIENT_PORT!;
    config._dbUrl = DB_URL!;
    config._imdbApiUrl = IMDB_API_URL!;
    config._imdbApiKeyV3 = IMDB_API_KEY_V3!;
    config._googleClientId = GOOGLE_CLIENT_ID!;
    config._googleClientSecret = GOOGLE_CLIENT_SECRET!;
    config._googleSignupRedirectUri = GOOGLE_SIGNUP_REDIRECT_URI!;
    config._googleLoginRedirectUri = GOOGLE_LOGIN_REDIRECT_URI!;
    config._accessTokenSecret = ACCESS_TOKEN_SECRET!;
    config._refreshTokenSecret = REFRESH_TOKEN_SECRET!;
    config._cookieSecret = COOKIE_SECRET!;
    config._jwtSecret = JWT_SECRET!;
    config._env = NODE_ENV!;
    config._allowedOrigins = ALLOWED_ORIGINS!.split(',');

    const errors = validateSync(config);
    if (errors.length > 0) {
      throw new Error(`[failed to initialize 'Config'. errors: ${errors}]`);
    }

    this.instance = config;
  }

  static get env() {
    if (!this.instance) {
      this.init();
    }
    return this.instance!;
  }
}
