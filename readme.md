# Kafka Creeper - Streaming Data Connector Version
## Ramblins
Meant to really pair well with a bordeaux or with that other cdc to kafka thing I wrote. Gives you somewhere to see in html when a new message hits your kafka topic. Like a real, real barebones requestbin. Also remember much like lunch, there's no free kafka.

## Setup 
1. Follow the instructions here - https://devcenter.heroku.com/articles/heroku-data-connectors - to set up the data connector, Initial postgres instance (the one that feeds data TO Kafka) and the Kafka bus. Make sure to note the Kafka Prefix (for mult-tenant, low $ plans), and the Topic configured (heroku:data:connectors:info MYAPP). You need that next.
2. Deploy this app using -> [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/cowie/simpleKafkaListener). Punch in the info you got above.
3. Load your app in the Heroku dashboard. Attach the existing Kafka bus to the app, and also create a new PG instance (the one getting data FROM Kafka) and attach to this app. Restart ya dynos.
4. Look at app.js[47] - This is the insert SQL going to PG, which means you need to create a table that fits this, or alter it accordingly.
5. Open your command line and heroku logs --tail and start altering some data to see it pipe down, or use Postico/etc to see the second PG start to fill up

## Breakdown
