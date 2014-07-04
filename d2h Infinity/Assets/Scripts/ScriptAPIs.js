#pragma strict

static var g_strWebservicesAtEC2		:	String;
static var g_strWebservicesAtD2H		:	String;
function Start () 
{
	//g_strWebservicesAtEC2	=	"http://www.d2hinfinity.in/"; 
	g_strWebservicesAtEC2   =   "http://ec2-54-251-161-31.ap-southeast-1.compute.amazonaws.com/";
	//g_strWebservicesAtD2H	=	"http://203.223.176.33:8000/";
	g_strWebservicesAtD2H   =   "http://203.223.176.33:9000/"; //8000(live) | 9000(staging)
}

function Update () {

}