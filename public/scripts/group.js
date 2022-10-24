function createGroup(fields) {
    fetch(`/api/groups/${fields.name}`, {method: 'POST'})
      .then(showResponse)
      .catch(showResponse);
}

function changeGroupName(fields) {
    fetch(`/api/groups/${fields.old_name}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}

function addMember(fields) {
    fetch(`/api/groups/${fields.name}/members/${fields.id}`, {method: 'POST'})
      .then(showResponse)
      .catch(showResponse);
}

function removeMember(fields) {
    fetch(`/api/groups/${fields.name}/members/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
}

function deleteGroup(fields) {
    fetch(`/api/groups/${fields.name}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
}

function viewAllGroups(fields) {
    fetch('/api/groups', {method: 'GET'})
      .then(showResponse)
      .catch(showResponse);
}