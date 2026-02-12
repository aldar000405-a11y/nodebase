export function generateGoogleFormScript(webhookUrl: string) {
  const webhookUrlLiteral = JSON.stringify(webhookUrl);

  return `function onFormSubmit(e) {
  var formResponse = e.response;
  var itemResponses = formResponse.getItemResponses();

  var responses = {};
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    responses[itemResponse.getItem().getTitle()] = itemResponse.getResponse();
  }

  var payload = {
    formId: e.source.getId(),
    formTitle: e.source.getTitle(),
    responseId: formResponse.getId(),
    timestamp: formResponse.getTimestamp(),
    respondentEmail: formResponse.getRespondentEmail(),
    responses: responses
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };

  var WEBHOOK_URL = ${webhookUrlLiteral};

  UrlFetchApp.fetch(WEBHOOK_URL, options);
}
`;
}
