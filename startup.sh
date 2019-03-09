#!/bin/bash

set -e

>&2 echo "Waiting for RabbitMQ to start..."
/bin/bash ./wait-for-it.sh mq:5672 -- nginx -g 'daemon off;'