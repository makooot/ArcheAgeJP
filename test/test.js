LOG_ID = "log";
function EQ(title, a, b)
{
	title = text_to_cdata(title);
	var element = document.createElement('pre');
	element.innerHTML = is_same(a, b) ? 
			"Success:" + title :
			"Fail: " + title + "\n-- "+to_string(a)+"\n-- "+to_string(b);
	document.getElementById(LOG_ID).appendChild(element);
}

function is_same(a, b)
{
	if(typeof(a)!=typeof(b)) {
		return false;
	}
	switch(typeof(a)) {
	case "undefined":
	case "boolean":
	case "number":
	case "string":
		return a==b;
	case "function":
		return a===b;
	case "object":
		if(typeof(a.length) =="number" && typeof(b.length) =="number") {
			if(a.length!=b.length) {
				return false;
			}
			for(var i=0; i<a.length; i++) {
				if(!is_same(a[i], b[i])) {
					return false;
				}
			}
			return true;
		}
		return false;
	}
	return false;
}

function to_string(obj)
{
	switch(typeof(obj)) {
	case "undefined":
		return "<i>undefined</i>";
	case "boolean":
		return obj ? "true" : "false";
	case "number":
		return obj;
	case "string":
		return "\"" + text_to_cdata(obj.replace(/["\n\t]/g, "\\$&")) + "\"";
	case "function":
		return "<i>function</i>";
	case "object":
		if(isArray(obj)) {
			var r = [];
			for(var i=0; i<obj.length; i++) {
				r.push(to_string(obj[i]));
			}
			return "[" + r.join(", ") + "]";
		} else {
			r = [];
			for(var i in obj) {
				r.push(i+":"+to_string(obj[i]));
			}
			return "{" + r.join(", ") + "}";
		}
	}
}
function isArray(obj) {  
	return Object.prototype.toString.call(obj) === '[object Array]';  
};


function text_to_cdata(s)
{
	s = s.replace(/&/g, "&amp;");
	s = s.replace(/</g, "&lt;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/"/g, "&quot;");
	return s;
}
