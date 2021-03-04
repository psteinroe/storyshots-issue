DOCKER_ID=$(docker run -d --rm \
  -p 9222:3000 \
  -e "CONNECTION_TIMEOUT=600000" \
  -v "$(pwd)/storybook-static/:/opt/storybook-static" \
  browserless/chrome)

if [[ "$CI" ]]; then
  DOCKER_HOST_IP=$(/sbin/ip route|awk '/default/ { print $3 }')
fi

HOST_IP=$DOCKER_HOST_IP yarn test --useStderr
docker kill $DOCKER_ID