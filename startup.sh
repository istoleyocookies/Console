#!/bin/bash

set -e

if [ ! -f /opt/faction/certs/api.key ]; then
  mkdir -p /opt/faction/certs/
  openssl req -newkey rsa:4096 -x509 -keyout /opt/faction/certs/api.key -out /opt/faction/certs/api.pem -days 365 -nodes -subj "/O='The Faction Team'/OU='FactionC2'/CN='factionc2'"
fi
>&2 echo "Waiting for RabbitMQ to start..."
/bin/bash ./wait-for-it.sh mq:5672 -- nginx -g 'daemon off;'