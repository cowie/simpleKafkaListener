
const express = require('express');
const path = require('path');
const Kafka = require('no-kafka');
const fs = require('fs');
const {Pool, Client} = require('pg');

fs.writeFileSync('./client.crt', process.env.KAFKA_CLIENT_CERT);
fs.writeFileSync('./client.key', process.env.KAFKA_CLIENT_CERT_KEY);

const consumer = new Kafka.SimpleConsumer({
    connectionString: process.env.KAFKA_URL,
    ssl: {
      certFile: './client.crt',
      keyFile: './client.key',
    },
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:{
    rejectUnauthorized:false
  }
});
pool.on('error', (err, client) => {
  console.error('Had an error on the PG idle pool', err);
});

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use('/', (req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const dataHandler = function(messageSet, topic, partition){
    messageSet.forEach(function(m){
        //do stuff
        console.log(topic, partition, m.offset, m.message.value.toString('utf8'));
        pool.connect((err, client, done) => {
          //eventPayload shortcut
          let eP = m.message.value.payload.after;
          if(err) throw err;
          client.query('INSERT INTO "public.account"(id,billingcountry,accountsource,billingpostalcode,billingcity,billingstate,description,billinglatitude,website,phone,fax,createddate,billingstreet,lastmodifieddate,external_id__c,name,billinglongitude,sfid,score__c) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)',
          [billingcountry,eP.accountsource,eP.billingpostalcode,eP.billingcity,eP.billingstate,eP.description,eP.billinglatitude,eP.website,eP.phone,eP.fax,eP.createddate,eP.billingstreet,eP.lastmodifieddate,eP.external_id__c,eP.name,eP.billinglongitude,eP.sfid,eP.score__c], (err, res) => {
            done();
            if(err){
              console.error(err);
            }else{
              console.log('Insert completed probably maybe');
            }
          });
        });
    });
};
return consumer.init().then(function(){
  console.log(`${process.env.KAFKA_PREFIX}${process.env.KAFKA_TOPIC}`)
    return consumer.subscribe(`${process.env.KAFKA_PREFIX}${process.env.KAFKA_TOPIC}`, [0,1], dataHandler);
})
