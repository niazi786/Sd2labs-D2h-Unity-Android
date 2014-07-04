#pragma strict

var	m_strHeaderTitle	:	String;
var m_skinHeader		:	GUISkin;
var m_tex2DPurple		:	Texture2D;
var	m_fontRegular		:	Font;
var	m_fHeightHeader		:	float;

function Start ()
{
	if(ScriptProfilePage.g_iActiveScreenId == 7)
	{
		m_strHeaderTitle = "Net Banking";
		StartCoroutine(TrackEventNB(0.1));
	}
	else if(ScriptProfilePage.g_iActiveScreenId == 8)
	{
		m_strHeaderTitle = "Credit Card";
		StartCoroutine(TrackEventCC(0.1));
	}
	else if(ScriptProfilePage.g_iActiveScreenId == 9)
	{
		m_strHeaderTitle = "Need Help > FAQs";//PlayerPrefs.GetString("HeaderTitle");
	}
}

function Update () 
{
	if (Input.GetKeyDown(KeyCode.Escape))
	{
		if(m_strHeaderTitle == "Net Banking" || m_strHeaderTitle == "Credit Card")
		{
			Application.LoadLevel("SceneRecharge");
		}
		else if(m_strHeaderTitle == "Need Help > FAQs")
		{
			ScriptProfilePage.g_iActiveScreenId	=	4;
			Application.LoadLevel("SceneHelp");
		}
	}
}

function OnGUI()
{
	var fUnitY	:	float	=	Screen.height/12.8;
	m_fHeightHeader		 	=	1.3*fUnitY;
	RenderHeader(m_strHeaderTitle);
}

function RenderHeader(strCaption	:	String)
{
	//*************************	Header	***********************//
	GUI.skin	=	m_skinHeader;
	GUI.BeginGroup(Rect(0,0,Screen.width,m_fHeightHeader));
		SkinBoxInPurple();
		m_skinHeader.box.fontSize 		= 	Mathf.Min(Screen.width,m_fHeightHeader)/1.5;
		m_skinHeader.box.font			= 	m_fontRegular;	
		GUI.Box(Rect(0,0,Screen.width,m_fHeightHeader),strCaption);
	GUI.EndGroup();
	GUI.skin	=	null;
}

function SkinBoxInPurple()
{
	m_skinHeader.box.normal.background	=	m_tex2DPurple;
	m_skinHeader.box.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinHeader.box.hover.background	=	m_tex2DPurple;
	m_skinHeader.box.hover.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinHeader.box.active.background	=	m_tex2DPurple;
	m_skinHeader.box.active.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinHeader.box.alignment			=	TextAnchor.MiddleCenter;
}

var m_strCustomerId	:	String;
function TrackEventNB(fWaitTime	:	float)
{
	yield WaitForSeconds(fWaitTime);
	m_strCustomerId = PlayerPrefs.GetString("CustomerId");
	TE("Recharge -> Recharge Now -> Net Banking");
}

function TrackEventCC(fWaitTime	:	float)
{
	yield WaitForSeconds(fWaitTime);
	m_strCustomerId = PlayerPrefs.GetString("CustomerId");
	TE("Recharge -> Recharge Now -> Credit Card");
}

//9edgcoigpu
function TE(strEvent : String)
{
	var objHeaders : Hashtable = new Hashtable();
	objHeaders.Add("Content-Type","application/json");
	
	var strInput = "{\"secret\":\"9edgcoigpu\",\"userId\":\"" + m_strCustomerId + "\",\"event\":\"" + strEvent + "\"}";
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