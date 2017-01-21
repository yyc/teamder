$(document).ready(function() {
    $('#submitProject').click(function(e) {

        // Email regex match string
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    	// extract values
        var creatorName = $('#creatorName').val();
        var creatorEmail = $('#creatorEmail').val();
        var projectName = $('#projectName').val();
    	var teamSize = $('#teamSize').val();
    	var emails = $('#inviteEmails').val().split(",");

        // validate creator name
        if (!creatorName.trim()) {
            $('#create_error').html('Error: Please enter your name.');
            $('#create_error').css({'display': 'block'});
            return;
        }

        // validate creator email
        if (!re.test(creatorEmail)) {
            $('#create_error').html('Error: Your email \'' + creatorEmail + '\' is invalid.');
            $('#create_error').css({'display': 'block'});
            return;
        }

    	// validate project name
    	if (!projectName.trim()) {
            $('#create_error').html('Error: Project name is required.');
            $('#create_error').css({'display': 'block'});
            return;
		}

        // validate max. team size
        function isInt(value) {
          return !isNaN(value) &&
                 parseInt(Number(value)) == value &&
                 !isNaN(parseInt(value, 10));
        }

        if (!isInt(teamSize) || teamSize <= 1) {
            $('#create_error').html('Error: Invalid team size.');
            $('#create_error').css({'display': 'block'});
            return;
    	}

    	// validate user emails
    	for (i in emails) {
    		var email = emails[i].trim();
    		if (!re.test(email)) {
                $('#create_error').html('Error: Invalid email \'' + email + '\'.');
                $('#create_error').css({'display': 'block'});
                return;
    		}
    	}

    	// send email

    	// create project in backend
        $.ajax({
            type: 'POST',
            url: '/projects',
            data: {
                'creator_name': creatorName,
                'creator_email': creatorEmail,
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
