$(document).ready(function() {
    $('#submitProject').click(function(e) {

    	// extract values
    	var projectName = $('#projectName').val();
    	var teamSize = $('#numTeams').val();
    	var emails = $('#inviteEmails').val().split(",");

    	// validate
    	if (!projectName.trim()) {
    		alert("Project name required!");
		}


        if (teamSize <= 0) {
    		alert("Invalid team size.");
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
        $.ajax({
            type: 'POST',
            url: '/projects',
            data: {
                'project_name': projectName,
                'team_size' : teamSize,
                'emails' : emails
            },
            success: function(msg) {
                window.location.href = status.html;
            }
        });
    });
});
