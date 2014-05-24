//
// validator.js
// Copyright (c) 2014 HASHIGAYA, Makoto
// This software is released under the MIT License, see LICENSE
// http://opensource.org/licenses/mit-license.php
//

function validator(filename, result_id)
{
	var req = new XMLHttpRequest();
	req.open("GET", filename, true);
	req.onload = function() {
		dict_data = req.responseText.split((/\r\n|\r|\n/));
		dict_filename = filename;
		var result = validate(dict_data, filename);
		document.getElementById(result_id).innerHTML = "<pre>"+result.messages.join("\n")+"\nファイル:"+dict_filename+"\nエラー:"+result.error_number+"\n行数　: "+result.line_number+"</pre>";
	}
	req.send();
}

function validate(data, dict_filename)
{
	var result = {
		line_number : 0,
		error_number : 0,
		messages : new Array()
	};
	for(var i in data) {
		var line = data[i];
		result.line_number++;
		if(line=="") {
			continue;
		}
		if(!isValid(line)) {
			result.messages.push(text2CDATA(dict_filename)+"("+result.line_number+"):"+text2CDATA(line));
			result.error_number++;
		}
		
	}
	return result;
}
function isValid(data)
{
	if(data.match(/^【/)) return false;
	if(data.match(/^[^【]+】/)) return false;
	if(data.match(/【】/)) return false;
	if(data.match(/【[^】]+【/)) return false;
	if(data.match(/(【|】|▽)$/)) return false;
	var attributes = data.substr(data.indexOf("【")).split(/【[^】]*】/);
	for(var i in attributes) {
		var attribute = attributes[i];
		if(attribute.match(/^▽/)) {
			var values = attribute.substr(1).split(/▽/);
			for(var j in values) {
				var value = values[j];
				if(value.match(/x/)) { 
					if(!value.match(/[^x]+x([0-9]+|\?)(-[0-9]+|\?)?(\([^\)]+\))?(▽|$)/)) return false;
				}
			}
		} else {
			if(attribute.match(/▽/)) return false;
		}
	}

	return true;
}

function text2CDATA(s)
{
	s = s.replace(/&/g, "&amp;");
	s = s.replace(/</g, "&lt;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/"/g, "&quot;");
	return s;
}
