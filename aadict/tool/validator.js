//
// validator.js
// Copyright (c) 2014 HASHIGAYA, Makoto
// This software is released under the MIT License, see LICENSE
// http://opensource.org/licenses/mit-license.php
//

function validator(filename, result_id)
{
	var hook = (function(filename, id) {
		return function(){
			var result = validate(dictdata, filename);
			document.getElementById(result_id).innerHTML = "<pre>"+result.messages.join("\n")+"\nファイル:"+filename+"\nエラー:"+result.error_number+"\n行数　: "+result.line_number+"</pre>";
		}
	})(filename, result_id);
	read_dict_data(filename, hook);
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
		var err = check(line);
		if(err) {
			result.messages.push(text2CDATA(dict_filename)+"("+result.line_number+"):"+text2CDATA(err.description));
			result.error_number++;
		}
		
	}
	return result;
}

function AAError(level_, description_) 
{
	this.level = level_;
	this.description = description_;
}

function check(data)
{
	if(data.match(/^【/)) return new AAError("E", "アイテム名がありません");
	if(data.match(/^[^【]+】/)) return new AAError("E", "\"【\"に対応していない\"】\"があります");
	if(data.match(/【[^】]+(【|$)/)) return new AAError("E", "\"【\"に対応する\"】\"がありません");
	if(data.match(/】[^【]*】/)) return new AAError("E", "\"【\"に対応していない\"】\"があります");
	
	var attributes = data.match(/【[^】]*】[^【]*/g);
	for(var i=0; i<attributes.length; i++) {
		var err = check_attribute(attributes[i]);
		if(err) {
			return err;
		}
	}

	return null;
}

function check_attribute(attribute)
{
	attribute.match(/(【[^】]*】)(.*)/);
	var name = RegExp.$1;
	var value_raw = RegExp.$2;

	if(name=="") return new AAError("E", "項目名がありません");
	if(value_raw=="") return new AAError("E", name+"の内容がありません");

	if(value_raw.match(/^[^▽]/)) {
		if(value_raw.match(/▽/)) return new AAError("E", name+"の内容で▽の使い方が誤っています");
	}
	switch(name) {
	case "【材料】":
	case "【配置材料】":
	case "【建造材料】":
		var err = check_values(value_raw, is_valid_material)
		if(err) {
			return new AAError(err.level, name+"の"+err.description);
		}
		break;
	case "【収穫物】":
	case "【獲得物】":
	case "【収穫時獲得物】":
	case "【加工時獲得物】":
	case "【伐採時獲得物】":
	case "【採集時獲得物】":
		var err = check_values(value_raw, is_valid_harvest);
		if(err) {
			return new AAError(err.level, name+"の"+err.description);
		}
	}

	return null;
}
function to_values_array(value_raw)
{
	if(value_raw.match(/^▽/)) {
		return value_raw.substr(1).split(/▽/);
	} else {
		return [ value_raw ];
	}
}
function check_values(value_raw, checker)
{
	var values = to_values_array(value_raw);
	for(var j in values) {
		if(!checker(values[j])) {
			return new AAError("E", values[j]+"に誤りがあります");
		}
	}
	return null;
}

function is_valid_harvest(s)
{
	return s=="?" || RegExp(/[^x]+x([0-9]+|\?)(-([0-9]+|\?))?(\([^\)]+\))?$/).test(s);
}
function is_valid_material(s)
{
	return RegExp(/[^x]+x([0-9]+)$/).test(s);
}

function text2CDATA(s)
{
	s = s.replace(/&/g, "&amp;");
	s = s.replace(/</g, "&lt;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/"/g, "&quot;");
	return s;
}
