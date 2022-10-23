function react(fields) {
    fetch(`/api/reaction/${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}

function deleteReaction(fields) {
    fetch(`/api/reaction/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
}

function reactionsByFreet(fields) {
    fetch(`/api/reaction/${fields.id}`, {method: 'GET'})
      .then(showResponse)
      .catch(showResponse);
}