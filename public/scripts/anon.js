function switchToAnon() {
    fetch('/api/anon/session', {method: 'POST'})
      .then(showResponse)
      .catch(showResponse);
}

function switchFromAnon() {
    fetch('/api/anon/session', {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}