# Kafka Creeper
## Ramblins
Meant to really pair well with a bordeaux or with that other cdc to kafka thing I wrote. Gives you somewhere to see in html when a new message hits your kafka topic. Like a real, real barebones requestbin.

## Setup
1. Get a Heroku Kafka bus going with a topic you want to attach this thing to.
2. Deploy using -> [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/cowie/simpleKafkaListener). Whatup. Enter your prefix(if needed) and topic name in the deploy screen.
3. `heroku open` or just load yourapp.herokuapp.com/ and index should appear, connected to your topic.
4. Have a producer produce a topic, and you should see the body appear in the html. 

## Breakdown
