<!DOCTYPE html>
<script>
/*eval = function(code) {
	var s = document.createElement("script");
	s.type = "text/javascript";
	try {
		s.appendChild(document.createTextNode(code))
	} catch (ex) {
		s.text = code
	};
	document.body.appendChild(s);
};*/
/*var o;
(function(){
	var s=localStorage.getItem("ch:main");
	if(s&&s.length==<?=$arr['length']??die?>){
		o=eval(s);
	}else{
		var a=new XMLHttpRequest();
		a.open('GET',"main.js",true);
		a.onreadystatechange=function(){
			if (a.readyState==4&&a.status==200||a.status==304){
				s=a.responseText;
				localStorage.setItem("ch:main",s);
				o=eval(s);
			}
		};
		a.send();
	}
})();*/
//压缩后：
var o;!function(){
	var _,s=localStorage.getItem("ch:main");
	s&&<?=$arr['length']??die?>==s.length
	?
	o=eval(s)
	:
	(
		_=new XMLHttpRequest,_.open("GET","main.js",!0),
		_.onreadystatechange=function(){
			(4==_.readyState&&200==_.status||304==_.status)&&(s=_.responseText,localStorage.setItem("ch:main",s),o=eval(s))
		},
		_.send()
	)
}();
	
	
</script>