//
// validator.js
// Copyright (c) 2014 HASHIGAYA, Makoto
// This software is released under the MIT License, see LICENSE
// http://opensource.org/licenses/mit-license.php
//

invalidAttributeError = new Error();

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
	if(data.match(/】【/)) return false;
	if(data.match(/【[^】]+【/)) return false;
	if(data.match(/(【|】|▽)$/)) return false;

	try {
		data.substr(data.indexOf("【")).replace(/【[^】]+】[^【]+/g, checkAttribute);
	} catch(e) {
		if(e===invalidAttributeError) {
			return false;
		} else {
			throw e;
		}
	}

	return true;
}

function checkAttribute(attribute)
{
	if(!isValidAttribute(attribute)) {
		throw invalidAttributeError;
	}
}

function isValidAttribute(attribute)
{
	if(!attribute.match(/【([^】]+)】(.+)/)) return false;
	var name = RegExp.$1;
	var value_raw = RegExp.$2;
	if(value_raw.match(/^[^▽]/)) {
		if(value_raw.match(/▽/)) return false;
	}
	switch(name) {
	case "材料":
		if(!are_valid_values(value_raw, is_valid_material)) return false;
		break;
	case "獲得物":
	case "加工時獲得物":
	case "伐採時獲得物":
	case "採集時獲得物":
		if(!are_valid_values(value_raw, is_valid_harvest)) return false;
		break;
	}
	return true;
}
function to_values_array(value_raw)
{
	if(value_raw.match(/^▽/)) {
		return value_raw.substr(1).split(/▽/);
	} else {
		return [ value_raw ];
	}
}
function are_valid_values(value_raw, checker)
{
	var values = to_values_array(value_raw);
	for(var j in values) {
		if(!checker(values[j])) return false;
	}
	return true;
}

function is_valid_harvest(s)
{
	return s=="?" || s.match(/[^x]+x([0-9]+|\?)(-([0-9]+|\?))?(\([^\)]+\))?$/);
}
function is_valid_material(s)
{
	return s.match(/[^x]+x([0-9]+|\?)$/);
}

function text2CDATA(s)
{
	s = s.replace(/&/g, "&amp;");
	s = s.replace(/</g, "&lt;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/"/g, "&quot;");
	return s;
}
