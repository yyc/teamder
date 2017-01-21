$(document).ready(function() {
    $('#submitProject').click(function(e) {

    	// extract values
    	var projectName = $('#projectName').val();
    	var numTeams = $('#numTeams').val();
    	var teamSize = $('#numTeams').val();
    	var emails = $('#inviteEmails').val().split(",");

    	// validate
    	if (!projectName.trim()) {
    		alert("Project name required!");
		}

    	if (Math.abs(emails.length - (numTeams * teamSize)) > numTeams/2) {
    		alert("Number of emails does not match with number of teams and size.");
    		return;
    	}

    	// validate email
    	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	for (i in emails) {
    		var email = emails[i].trim();
    		if (!re.test(email)) {
    			alert("invalid email: " + email);
    			return;
    		}
    	}

    	// send email

    	// create project in backend

    	window.location.href = "status.html";
    	
    });
});