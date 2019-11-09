# probot-sandbox
[![Build Status](https://github.com/Kesin11/probot-sandbox/workflows/CI/badge.svg)](https://github.com/Kesin11/probot-sandbox/actions)

> A GitHub App built with [Probot](https://github.com/probot/probot) that My first probot app

## Setup

```sh
# Install dependencies
npm install

# Run typescript
npm run build

# Run the bot
npm start
```

## Setup docker

```sh
docker build  -t probot_sandbox:latest .

docker run -p 50000:50000 probot_sandbox:latest
```

## Contributing

If you have suggestions for how probot-sandbox could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2019 Kenta Kase <kesin1202000@gmail.com>
