function TEST_ALL(test_suite)
{
	TEST_INIT();
	test_suite();
	TEST_RESULT();
}
function TEST_INIT()
{
	LOG_ID = "log";
	SUMMARY_ID = "summary";
	NUMBER_OF_TEST = 0;
	NUMBER_OF_SUCCESS = 0;
	
	LOG_ELEMENT = GET_LOG_ELEMENT(LOG_ID);
	if(!LOG_ELEMENT) {
		throw("id=\"" + LOG_ID + "\"のエレメントかbody エレメントが見つかりません。")
	}

	SUMMARY_ELEMENT = GET_LOG_ELEMENT(SUMMARY_ID);
	if(!SUMMARY_ELEMENT) {
		throw("id=\"" + SUMMARY_ID + "\"のエレメントかbody エレメントが見つかりません。")
	}

}
function TEST_RESULT()
{
	var element = document.createElement('pre');
	element.innerHTML = "Test: "+ NUMBER_OF_TEST +
						", <span style='color:green;'>Success:" + NUMBER_OF_SUCCESS + 
						"</span>, <span style='color:red;'>Fail:" + (NUMBER_OF_TEST - NUMBER_OF_SUCCESS) + 
						"</span>";
	SUMMARY_ELEMENT.appendChild(element);
}
function EQ(title, a, b)
{
	var element;
	NUMBER_OF_TEST++;
	if(IS_SAME(a, b)) {
		NUMBER_OF_SUCCESS++;
		element = CREATE_ELEMENT_FOR_SUCCESS(title);
	} else {
		element = CREATE_ELEMENT_FOR_FAIL(title, a, b);
	}
	LOG_ELEMENT.appendChild(element);
}

function GET_LOG_ELEMENT(id)
{
	var element = document.getElementById(id);
	if(!element) {
		element = document.getElementsByTagName("body");
		if(element) {
			element = element[0];
		} 
	}
	return element;
}

function CREATE_ELEMENT_FOR_SUCCESS(title)
{
	title = TEXT_TO_CDATA(title);
	var element = document.createElement('pre');
	element.innerHTML = "<span class='success_tag'>Success</span>:" + title;
	return element;
}

function CREATE_ELEMENT_FOR_FAIL(title, a, b)
{
	title = TEXT_TO_CDATA(title);
	var element = document.createElement('pre');
	element.innerHTML = "<span class='fail_tag'>Fail</span>: " + title + "\n-- "+TO_STRING(a)+"\n-- "+TO_STRING(b);
	return element;
}

function IS_SAME(a, b)
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
		if(a===null) {
			return b===null;
		}
		if((IS_ARRAY(a) && !IS_ARRAY(b)) || (!IS_ARRAY(a) && IS_ARRAY(b))) {
			return false;
		}
		if(IS_ARRAY(a) && IS_ARRAY(b)) {
			if(a.length!=b.length) {
				return false;
			}
			for(var i=0; i<a.length; i++) {
				if(!IS_SAME(a[i], b[i])) {
					return false;
				}
			}
			return true;
		} else {
			for(var i in a) {
				if(!IS_SAME(a[i], b[i])) {
					return false;
				}
			}
			for(var i in b) {
				if(!a[i])  { 
					return false;
				}
			}
			return true;
		}
	}
	return false;
}

function TO_STRING(obj)
{
	switch(typeof(obj)) {
	case "undefined":
		return "<i>undefined</i>";
	case "boolean":
	case "number":
		return obj.toString();
	case "string":
		return "\"" + TEXT_TO_CDATA(obj.replace(/["\n\t]/g, "\\$&")) + "\"";
	case "function":
		return "<i>function</i>";
	case "object":
		if(obj===null) {
			return "null";
		} else if(IS_ARRAY(obj)) {
			var r = [];
			for(var i=0; i<obj.length; i++) {
				r.push(TO_STRING(obj[i]));
			}
			return "[" + r.join(", ") + "]";
		} else {
			r = [];
			for(var i in obj) {
				r.push(i+":"+TO_STRING(obj[i]));
			}
			return "{" + r.join(", ") + "}";
		}
	}
}
function IS_ARRAY(obj) {  
	return (obj instanceof Array);
};


function TEXT_TO_CDATA(s)
{
	s = s.replace(/&/g, "&amp;");
	s = s.replace(/</g, "&lt;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/"/g, "&quot;");
	return s;
}
