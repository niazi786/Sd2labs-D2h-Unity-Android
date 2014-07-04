/**************************************************************************************************************************/
// This Script hits all those APIs which are required so as to show the info on each page/scene of the EPG, the response is
// parsed and some keys are also dumped in the cache so that each of the API isn't required to be hit everytime, rather the
// key's value is fetched from the local cache.
/**************************************************************************************************************************/
#pragma strict


//var g_objCWebAPIPacket 	:	CWebAPIPacket;
function Start ()
{
}

function Update () {

}

function OnGUI	()
{	
/*
	if(GUI.Button(Rect(0,0,300,200),"HitAPI"))
	{
		var strAPIURL = "http://ec2-54-251-161-31.ap-southeast-1.compute.amazonaws.com/api/v1/";
		var strAPIMethod = "epg/getAllEpgByGenre";
		var strInput = "{\"genreId\":\"-1\", \"productId\":\"22\"}";
		
		g_objCWebAPIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
			
		if(g_objCWebAPIPacket)
		{
			InvokeReSTfulAPI(g_objCWebAPIPacket);
		}		
	}
	
	if(g_objCWebAPIPacket)
	{
		if(g_objCWebAPIPacket.m_bResponseReceived == true)
		{	
			print("ResponseCode: " + g_objCWebAPIPacket.m_strResponseCode + " Output: " + g_objCWebAPIPacket.m_strOutput);
			g_objCWebAPIPacket.m_bResponseReceived = false;
		}
	}
*/	
}

function InvokeReSTfulAPI(objCWebAPIPacket : CWebAPIPacket)
{
	//print("API: "+strAPI+" Input: "+strInput);
	var objHeaders : Hashtable = new Hashtable();
	objHeaders.Add("Content-Type","application/json");
	
	var body : byte[] = System.Text.Encoding.ASCII.GetBytes(objCWebAPIPacket.m_strInput);
	
	objCWebAPIPacket.m_iConnectionStatus = 1; //connecting to API
	
	var objWWWReq : WWW = new WWW(objCWebAPIPacket.m_strAPIURL + objCWebAPIPacket.m_strAPIMethod, body, objHeaders);
	yield objWWWReq;
	
	if(objWWWReq.error == null)
	{
		objCWebAPIPacket.m_strResponseCode = "200 OK";
	  	objCWebAPIPacket.m_strOutput = objWWWReq.text;
	}
	else
	{
	  	//objCWebAPIPacket.m_strResponseCode = objWWWReq.error;
	  	objCWebAPIPacket.m_strResponseCode = "There is a problem connecting to the server. Please ensure you have an active internet connection.";
	}
	objCWebAPIPacket.m_bResponseReceived = true;
	
	//print("InvokeReSTfulAPI(): Code:" + objCWebAPIPacket.m_strResponseCode + " and Response:" + objCWebAPIPacket.m_strOutput);
}