function vote(fields) {
    fetch(`/api/votes/${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }

function deleteVote(fields) {
    fetch(`/api/votes/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }

function votesByFreet(fields) {
    fetch(`/api/votes${fields.id}`, {method: 'GET'})
      .then(showResponse)
      .catch(showResponse);
}