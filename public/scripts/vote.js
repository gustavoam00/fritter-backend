function vote(fields) {
    fetch(`/api/vote/${fields.id}`, {method: 'POST'})
      .then(showResponse)
      .catch(showResponse);
}

function deleteVote(fields) {
    fetch(`/api/vote/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
}

function votesByFreet(fields) {
    fetch(`/api/vote/${fields.id}`, {method: 'GET'})
      .then(showResponse)
      .catch(showResponse);
}