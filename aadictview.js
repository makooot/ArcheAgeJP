dictdata = "";
function aadict_init(data_filename, result_id)
{
	read_dict_data(data_filename);
}
function read_dict_data(filename)
{
	var req = new XMLHttpRequest();
	req.open("GET", filename, true);
	req.onload = function() {
		dictdata = req.responseText.split(/\n/);
	}
	req.send();
}
function search(key, result_id)
{
	var result = simple_match(key)
	document.getElementById(result_id).innerHTML = "<div>" + key + "の検索結果</div>" + basic_format(result);
}

function simple_match(key)
{
	var result = new Array();
	for(i in dictdata) {
		s = dictdata[i];
		if(s.indexOf(key)>=0) {
			result.push(s);
		}
	}
	return result;
}

function basic_format(result)
{
	var s = "";
	s += "<pre>"
	for(var i in result) {
		var r = result[i];
		r = textToCDATA(r)
//		r = r.replace(/^[^【]+/, "<a href=\"#\" onclick=\"search('$&', 'result'); return false;\">$&</a>");
		r = r.replace(/【/g, "\n    【");
		r = r.replace(/▽/g, "\n        ▽");
		r = r + "\n \n";
		s += r;
	}
	s += "</pre>";
	return s;
}

function textToCDATA(s)
{
	s = s.replace(/&/g, "&amp;");
	s = s.replace(/</g, "&lt;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/"/g, "&quot;");
	return s;
}
