#pragma strict

function Start () 
{
	g_strBalance = PlayerPrefs.GetString("Balance");
	g_strNextRechargeDate = PlayerPrefs.GetString("NextRechargeDate");
	m_strCustomerId = PlayerPrefs.GetString("CustomerId");
	Identify();
	tracking("Balance");
	//StartCoroutine(TrackEvent(0.1));
}

function Update ()
{
	if(Input.GetKeyDown(KeyCode.Escape))
	{
		Application.LoadLevel("SceneHomePage");
	}
}

//**variables for top menu*****//
var g_strBalance				:	String;
var g_strNextRechargeDate		:	String;
var m_strCustomerId				:	String;

//********Middle Menu********//
var g_texBanner					:	Texture2D;
var g_texRechargeNow			:	Texture2D;

var m_skinBalance				:	GUISkin;

var m_fontRegular				:	Font;
var m_fontBold					:	Font;

var m_fHeightHeader				:	float;
var m_fHeightDiv				:	float;
var m_fWidthBanner				:	float;
var m_fGAP						:	float;
function OnGUI ()
{
	var fUnitY	:	float	=	Screen.height/12.8;
	m_fHeightHeader		 	=	1.3*fUnitY;
	m_fGAP					=	0.125*fUnitY;
	m_fHeightDiv			=	0.5*(Screen.height - 2*m_fHeightHeader - 3*m_fGAP);
	m_fWidthBanner			=	Screen.width - 2*m_fGAP;
		
	
	GUI.skin = m_skinBalance;
	//*************************	Header	***********************//
	GUI.BeginGroup(Rect(0,0,Screen.width,m_fHeightHeader));
		m_skinBalance.box.fontSize 	= Mathf.Min(Screen.width,m_fHeightHeader)/1.5;
		m_skinBalance.box.font		= m_fontRegular;	
		GUI.Box(Rect(0,0,Screen.width,m_fHeightHeader),"Balance");
		
	GUI.EndGroup();
		
	//********Middle Menu*****************//
	GUI.BeginGroup(Rect(m_fGAP,m_fHeightHeader + m_fGAP,m_fWidthBanner/2.0,m_fHeightDiv));
		
		m_skinBalance.label.fontSize = Mathf.Min(Screen.width,m_fHeightHeader)/2.0;
		GUI.Label(Rect(0,0,m_fWidthBanner/2.0 + m_fGAP/2.0,m_fHeightDiv),"Current Balance\nINR " +g_strBalance);
		
		m_skinBalance.box.fontSize	= Mathf.Min(Screen.width,m_fHeightHeader)/2.75;
		m_skinBalance.box.font		= m_fontBold;	
		GUI.Box(Rect(0,3*m_fHeightDiv/4.0,m_fWidthBanner/2.0 + m_fGAP/2.0,m_fHeightDiv/4.0),"Recharge Due date - "+g_strNextRechargeDate);
	GUI.EndGroup();
	
	//*********2nd Column******************//
	GUI.BeginGroup(Rect(Screen.width/2.0,m_fHeightHeader + m_fGAP,m_fWidthBanner/2.0,m_fHeightDiv));
	
		m_skinBalance.button.fontSize = Mathf.Min(Screen.width,m_fHeightHeader)/2.0;
		var contentsRecharge : GUIContent = new GUIContent("Recharge Now",g_texRechargeNow);
		if(GUI.Button(Rect(m_fGAP,0,m_fWidthBanner/2.0 - m_fGAP,m_fHeightDiv), contentsRecharge))
		{	//tracking("Recharge Now");
			SceneRechargeNow.m_iSelectedBoxIndex	=	2;
			Application.LoadLevel("sceneRecharge");
		}
	GUI.EndGroup();	
				
	//*********Abhishek Bachchan Texture*************//	
	GUI.DrawTexture(Rect(m_fGAP,Screen.height/2.0 + m_fGAP/2.0,m_fWidthBanner,m_fHeightDiv),g_texBanner);
	GUI.skin = null;
	
}

//function TrackEvent(fWaitTime	:	float)
//{
//	yield WaitForSeconds(fWaitTime);
//	TE("Balance");
//}
//9edgcoigpu
//function TE(strEvent : String)
//{
//	var objHeaders : Hashtable = new Hashtable();
//	objHeaders.Add("Content-Type","application/json");
//	
//	var strInput = "{\"secret\":\"9edgcoigpu\",\"userId\":\"" + m_strCustomerId + "\",\"event\":\"" + strEvent + "\"}";
//	var body : byte[] = System.Text.Encoding.ASCII.GetBytes(strInput);
//	
//	var objWWWReq : WWW = new WWW("https://api.segment.io/v1/track",body,objHeaders);
//	yield objWWWReq;
//	
//	if(objWWWReq.error == null)
//	{
//		print("SegmentIO Result: "+objWWWReq.text);
//	}
//	else
//	{
//		print("SegmentIO API error: "+objWWWReq.error);
//	}
//}
//9edgcoigpu LOKESH
//rrenb1jpxo IKN
function Identify() {
	var objHeaders : Hashtable = new Hashtable();
	objHeaders.Add("Content-Type","application/json");
	var customerId = PlayerPrefs.GetString("CustomerId");
	var emailId = PlayerPrefs.GetString("EmailId");
	var balance = PlayerPrefs.GetString("Balance");
	var nextRechargeDate = PlayerPrefs.GetString("NextRechargeDate");
	var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"traits\":{\"Balance\":\"" + balance + "\",\"NextRechargeDate\":\"" + nextRechargeDate + "\"}}";
	Debug.Log(strInput);
	var body : byte[] = System.Text.Encoding.ASCII.GetBytes(strInput);
	
	var objWWWReq : WWW = new WWW("https://api.segment.io/v1/identify",body,objHeaders);
	yield objWWWReq;
	
	if(objWWWReq.error == null)
	{
		print("SegmentIO Result: "+objWWWReq.text);
	}
	else
	{
		print("SegmentIO API error: "+objWWWReq.error);
	}
}

function tracking(strClickedOn : String) {
	var objHeaders : Hashtable = new Hashtable();
	objHeaders.Add("Content-Type","application/json");
	var customerId = PlayerPrefs.GetString("CustomerId");
	Debug.Log("customerId :"+customerId);
	if(customerId.Length == 0 ) {
		customerId = "NOT_LOGGED_IN";
	}
	var balance = PlayerPrefs.GetString("Balance");
	//var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" +customerId + "\",\"event\":\"" + strClickedOn + "\"}";
	var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" +customerId + "\",\"event\":\"" + strClickedOn + "\"}";
	Debug.Log(strInput);

	var body : byte[] = System.Text.Encoding.ASCII.GetBytes(strInput);
	
	var objWWWReq : WWW = new WWW("https://api.segment.io/v1/track",body,objHeaders);
	yield objWWWReq;
	
	if(objWWWReq.error == null)
	{
		print("SegmentIO Result: "+objWWWReq.text);
	}
	else
	{
		print("SegmentIO API error: "+objWWWReq.error);
	}
}
