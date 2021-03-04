DOCKER_ID=$(docker run -d --rm \
  -p 9222:3000 \
  -e "CONNECTION_TIMEOUT=600000" \
  -v "$(pwd)/storybook-static/:/opt/storybook-static" \
  browserless/chrome)

yarn test --useStderr --update-snapshot

docker kill $DOCKER_ID