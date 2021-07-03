import { TypeOrmModuleOptions } from '@nestjs/typeorm';

require('dotenv').config();

class ConfigService {

  constructor(private env: { [k: string]: string | undefined }) { }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      autoLoadEntities:true,
      synchronize:true,
      ssl: this.isProduction(),
    };
  }

  public getJwtConfig():string{
    return this.getValue('JWT_SECRET')
  }
  public getJwtRefresh():string{
    return this.getValue('JWT_REFRESH_SECRET')
  }
  public getBunnyCdnVideo():string{
    return this.getValue('BUNNY_CDN_VIDEO');
  }
  public getBunnyCdnStorage():string{
    return this.getValue('BUNNY_CDN_STORAGE');
  }
  public getBunnyCdnStream():string{
    return this.getValue('BUNNY_CDN_STREAM');
  }
  public getAwsS3Config(){
    return {
      accessKeyId:this.getValue('AWS_KEY'),
      secretAccessKey:this.getValue('AWS_SECRET_KEY')
    }
  }
  public getStripeTest(){
    return this.getValue('STRIPE_TEST_KEY');
  }
  public getStripeTestSecret(){
    return this.getValue('STRIPE_TEST_SECRET');
  }
}

const configService = new ConfigService(process.env)
  .ensureValues([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DATABASE',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'BUNNY_CDN_VIDEO',
    'BUNNY_CDN_STORAGE',
    'BUNNY_CDN_STREAM',
    'AWS_KEY',
    'AWS_SECRET_KEY',
    'AWS_BUCKET_NAME',
    'STRIPE_TEST_KEY',
    'STRIPE_TEST_SECRET'
  ]);

export { configService };
