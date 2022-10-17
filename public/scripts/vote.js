function vote(fields) {
    fetch(`/api/votes/${fields.id}`, {method: 'POST'})
      .then(showResponse)
      .catch(showResponse);
  }

function deleteVote(fields) {
    fetch(`/api/votes/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }