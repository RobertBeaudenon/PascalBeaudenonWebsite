<!--

function hideEmail(user,domain,subject,theclass) {
	var contact = user+"&#64;"+domain
	var email = user
	var emailHost = domain
	var emailSubject = subject
	var extraclass = " class=\""+theclass+"\""
	document.write("<a" + extraclass + " href=\"" + "mail" + "to:" + email + "&#64;" + emailHost + "?subject=" + emailSubject +"\">" + contact + "</a>")
	}

//-->