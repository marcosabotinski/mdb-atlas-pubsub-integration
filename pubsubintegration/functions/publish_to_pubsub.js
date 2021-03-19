exports = async function(changeEvent) {
  
  const http = context.services.get("myhttp");
  const endpoint = `https://pubsub.googleapis.com/v1/projects/${context.values.get("gcp_project")}/topics/${context.values.get("pubsub_topic")}:publish`;
  
  jsonString = JSON.stringify(changeEvent);
  buffer = Buffer.from(jsonString);
  messagedata = buffer.toString('base64');
  bearer = "Bearer " + context.values.get("access_token");
  pubsubenvelope = {
    "messages": [
      {
        "attributes": {
          "source": "mdb_realm"
        },
        "data": messagedata
      }]
  };
  
  response = await http.post({
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
    return EJSON.parse(response.body.text());
  });
  
  console.log(JSON.stringify(response))
  return
}
