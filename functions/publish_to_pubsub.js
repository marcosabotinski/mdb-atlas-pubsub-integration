exports = async function(changeEvent) {
  
  const http = context.services.get("myhttp");
  const endpoint = `https://pubsub.googleapis.com/v1/projects/${context.values.get("gcp_project")}/topics/${context.values.get("pubsub_topic")}:publish`;
  
  jsonString = JSON.stringify(changeEvent);
  buffer = Buffer.from(jsonString);
  messagedata = buffer.toString('base64');
  bearer = "Bearer " + context.values.get("akey");
  
  pubsubenvelope = {
    "messages": [
      {
        "attributes": {
          "source": "mdb_realm"
        },
        "data": messagedata
      }]
  };
  
  logm = await http.post({
    url: endpoint,
    headers: {
      "Content-Type": [ "application/json" ],
      "Authorization": [
          bearer
        ]
    },
    body: pubsubenvelope,
    encodeBodyAsJSON: true
  })
  .then(response => {
    const ejson_body = EJSON.parse(response.body.text());
    return ejson_body;
  });
  
  console.log(JSON.stringify(logm))
  return
}
