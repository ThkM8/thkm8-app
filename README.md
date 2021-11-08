# thkm8

> A GitHub App built with [Probot](https://github.com/probot/probot) that A GitHub App to simplify the git pull requests flow and guarantee the team standards

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t thkm8 .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> thkm8
```

## Contributing

If you have suggestions for how thkm8 could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2021 Fabrizio Silvestri <fabri.silve.fs@gmail.com>
