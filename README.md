## Installation

1. Install Package
```bash
$ npm install
```

2. Running Migration & Seeding
```bash
$ npm run migrate
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Note
1. REST API Terproteksi oleh JWT Token untuk mendapatkan tokennya bisa melakukan call API:
```
curl -H 'Content-Type: application/json' \
      -d '{ "name":"nama user"}' \
      -X POST \
      http://127.0.0.1/auth/login
```

2. Response dari url akan seperti ini :
```
{
  "access_token": "access token"
}
```

3. Jadikan access token sebagai bearer token.
