$(document).ready(function() {

    // Email regex match string
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    function isInt(value) {
      return !isNaN(value) &&
             parseInt(Number(value)) == value &&
             !isNaN(parseInt(value, 10));
    }

    // Validate new project
    $('#submitProject').click(function(e) {

    	var creatorName = $('#creatorName').val();
        var creatorEmail = $('#creatorEmail').val();
        var projectName = $('#projectName').val();
        var projectDesc = $('#projectDesc').val();
    	var teamSize = $('#teamSize').val();
    	var emails = $('#inviteEmails').val().split(",");
        var skillList = $('#skillList').val();

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

        // validate project description
    	if (!projectDesc.trim()) {
            $('#create_error').html('Error: Project description is required.');
            $('#create_error').css({'display': 'block'});
            return;
		}

        // validate max. team size
        if (!isInt(teamSize) || teamSize <= 1) {
            $('#create_error').html('Error: Invalid team size.');
            $('#create_error').css({'display': 'block'});
            return;
    	}

        // validate skills list
        if (!skillList.trim()) {
            $('#create_error').html('Error: List of skills should not be empty.');
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

        // Send AJAX request with information
        $.ajax({
            type: 'POST',
            url: '/projects/new',
            contentType: 'application/json',
            data: JSON.stringify({
                'creator_name': creatorName,
                'creator_email': creatorEmail,
                'project_name': projectName,
                'project_desc':projectDesc,
                'team_size' : teamSize,
                'email_list' : emails,
                'skill_list' : skillList
            }),
            success: function(msg) {
                $('#create_error').css({'display' : 'none'});
            }
        }).done(function(data) {
            alert('An email has been sent you and all invitees will receive an invitation as well. Please check your email for further details.');
            window.location.href = '/';
        });
    });

    var rangeSlider = function(){
        var slider = $('.range-slider'),
            range = $('.range-slider__range'),
            value = $('.range-slider__value');

        slider.each(function(){

          value.each(function(){
            var el = $(this);
            var value = el.prev().attr('value');
            el.html(value);
          });

          range.on('input', function(){
            $(this).next(value).html(this.value);
          });
        });
    };

    rangeSlider();

    $('#submitJoin').click(function(e){
        var joinerName = $('#joinerName').val();
        var joinerAbout = $('#joinerAbout').val();
        var joinerNumSkills = $('#joinerNumSkills').val();

        // validate joinerName
        if (!joinerName.trim()) {
            $('#create_error').html('Error: Please enter your name.');
            $('#create_error').css({'display': 'block'});
            return;
        }

        // validate joinerAbout
        if (!joinerAbout.trim() || joinerAbout.length > 140) {
            $('#create_error').html('Error: Skills should not be empty or longer than 140 characters.');
            $('#create_error').css({'display': 'block'});
            return;
        }

        // validate joinerSkills
        var joinerSkills = new Array();
        for (var i = 0; i < joinerNumSkills; i++) {
            var skillRating = $('#joinerSkill' + i).val();
            if (!isInt(skillRating) || skillRating < 1 || skillRating > 10) {
                $('#create_error').html('Error: Invalid skill rating!');
                $('#create_error').css({'display': 'block'});
                return;
            }
            joinerSkills[i] = skillRating;
        }

        // Send AJAX request to join
        $.ajax({
            type: 'POST',
            url: '/projects/join',
            contentType: 'application/json',
            data: JSON.stringify({
                'joiner_name': joinerName,
                'joiner_about': joinerAbout,
                'joiner_skills': joinerSkills
            }),
            success: function(msg) {
                $('#create_error').css({'display' : 'none'});
            }
        }).done(function(data) {
            window.location.href = '/projects/match';
        });

        $('#create_error').css({'display' : 'none'});
    });

    $('#submitMatch').click(function(e){
        var matchNumPersons = $('#matchNumPersons').val();
        var matchedPeopleIndex = new Array();
        var matchedCount = 0;
        $('#match-container input:checked').each(function() {
           if (this.value != 'Off') {
              matchedPeopleIndex[matchedCount++] = this.value;
           }
       });

       // Send AJAX request to join
       $.ajax({
           type: 'POST',
           url: '/match',
           contentType: 'application/json',
           data: JSON.stringify({
               'matched_people_index':matchedPeopleIndex
           }),
           success: function(msg) {
               $('#create_error').css({'display' : 'none'});
           }
       });

    });
});
