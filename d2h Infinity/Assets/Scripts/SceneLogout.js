#pragma strict
var m_skinLogoutScreen	:	GUISkin;
var m_tex2DPurple		:	Texture2D;
var m_tex2DWhite		:	Texture2D;
var m_tex2DOrange		:	Texture2D;
var m_tex2DLightPurple	:	Texture2D;

var	m_fontRegular		:	Font;

var m_strEmailId		:	String;
var	m_fHeightHeader		:	float;
var m_bLogoutInProgress	:	boolean;
var m_bCacheClearingInProgress	:	boolean;
var m_objUUIDAPIHandler		:	CWebAPIPacket;
var m_objScriptAPIHandler	:	ScriptAPIHandler;
var m_objScriptAnimation	:	ScriptAnimation;
function Start () 
{
	m_objScriptAPIHandler 	=	GetComponent(ScriptAPIHandler);
	m_objScriptAnimation	=	GetComponent(ScriptAnimation);
	
	m_strEmailId			=	PlayerPrefs.GetString("EmailId");
	
	m_bLogoutInProgress		=	false;
	m_bCacheClearingInProgress	=	false;
}

function Update () 
{
	if (Input.GetKeyDown(KeyCode.Escape))
	{
		Application.LoadLevel("SceneHomePage");
	}
	
	if(m_bCacheClearingInProgress)
	{	
		StartCoroutine(ClearCache(2.0));
	}
}

function OnGUI()
{
	if(m_bLogoutInProgress == false)
	{
		RenderUI();
	}
	else
	{
		if(m_objUUIDAPIHandler.m_bResponseReceived == false)
		{
			m_objScriptAnimation.AnimationInfinity("loggin out...");
		}
		else
		{
			if(m_objUUIDAPIHandler.m_strResponseCode == "200 OK")
			{
				//clear token | close app
				m_objScriptAnimation.AnimationInfinity("clearing cache...");
				
				m_bCacheClearingInProgress	=	true;
			}
			else
			{
				RenderAPIError();
			}
		}
	}
}

function RenderUI()
{
	var fUnitY	:	float	=	Screen.height/12.8;
	m_fHeightHeader		 	=	1.3*fUnitY;
	
	GUI.skin	=	m_skinLogoutScreen;
	GUI.BeginGroup(Rect(0,0,Screen.width,m_fHeightHeader));
		SkinBoxInPurple();
		m_skinLogoutScreen.box.fontSize 		= 	Mathf.Min(Screen.width,m_fHeightHeader)/1.5;
		m_skinLogoutScreen.box.font			= 	m_fontRegular;	
		GUI.Box(Rect(0,0,Screen.width,m_fHeightHeader),"Close/Logout");
	GUI.EndGroup();
	
	GUI.BeginGroup(Rect(0,m_fHeightHeader,Screen.width,Screen.height - 2.0*m_fHeightHeader));
	
	SkinWhiteButton();
	if(GUI.Button(Rect(m_fHeightHeader,m_fHeightHeader,0.495*Screen.width - m_fHeightHeader,Screen.height - 4.0*m_fHeightHeader),"Close App"))
	{
		Application.Quit();
	}
	
	SkinPurpleButton();
	if(GUI.Button(Rect(0.505*Screen.width,m_fHeightHeader,0.49*Screen.width - m_fHeightHeader,Screen.height - 4.0*m_fHeightHeader),"Logout\n(" + m_strEmailId + ")"))
	{
		HitLogoutAPI();
		//ClearCache();
	}
	GUI.EndGroup();
	GUI.skin	=	null;
}

function SkinBoxInPurple()
{
	m_skinLogoutScreen.box.normal.background	=	m_tex2DPurple;
	m_skinLogoutScreen.box.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinLogoutScreen.box.hover.background	=	m_tex2DPurple;
	m_skinLogoutScreen.box.hover.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinLogoutScreen.box.active.background	=	m_tex2DPurple;
	m_skinLogoutScreen.box.active.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinLogoutScreen.box.alignment			=	TextAnchor.MiddleCenter;
}

function SkinWhiteButton()
{
	m_skinLogoutScreen.button.normal.background 	= 	m_tex2DWhite;
	m_skinLogoutScreen.button.hover.background 		= 	m_tex2DOrange;
	m_skinLogoutScreen.button.active.background 	= 	m_tex2DOrange;
	m_skinLogoutScreen.button.normal.textColor 		= 	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	m_skinLogoutScreen.button.hover.textColor 		= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinLogoutScreen.button.active.textColor 		= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinLogoutScreen.button.font					= 	m_fontRegular;
	m_skinLogoutScreen.button.fontSize 				=	Mathf.Min(m_fHeightHeader,m_fHeightHeader)/1.75;
	m_skinLogoutScreen.button.alignment				=	TextAnchor.MiddleCenter;
	m_skinLogoutScreen.button.contentOffset.x		=	0.0;
}

function SkinPurpleButton()
{
	m_skinLogoutScreen.button.normal.background 	= 	m_tex2DPurple;
	m_skinLogoutScreen.button.hover.background 		= 	m_tex2DOrange;
	m_skinLogoutScreen.button.active.background 	= 	m_tex2DOrange;
	m_skinLogoutScreen.button.normal.textColor 		= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinLogoutScreen.button.hover.textColor 		= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinLogoutScreen.button.active.textColor 		= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinLogoutScreen.button.font					= 	m_fontRegular;
	m_skinLogoutScreen.button.fontSize 				=	Mathf.Min(m_fHeightHeader,m_fHeightHeader)/1.75;
	m_skinLogoutScreen.button.alignment				=	TextAnchor.MiddleCenter;
	m_skinLogoutScreen.button.contentOffset.x		=	0.0;
}

function ClearCache(fWait	:	float)
{
	yield fWait;
	
	if(PlayerPrefs.HasKey("LoginToken"))
	{
		PlayerPrefs.DeleteKey("LoginToken");
	}
	/*if(PlayerPrefs.HasKey("DeviceUID"))
	{
		PlayerPrefs.DeleteKey("DeviceUID");
	}*/
	if(PlayerPrefs.HasKey("EmailId"))
	{
		PlayerPrefs.DeleteKey("EmailId");
	}
	if(PlayerPrefs.HasKey("Password"))
	{
		PlayerPrefs.DeleteKey("Password");
	}
	if(PlayerPrefs.HasKey("ConnectionID"))
	{
		PlayerPrefs.DeleteKey("ConnectionID");
	}
	if(PlayerPrefs.HasKey("CustomerId"))
	{
		PlayerPrefs.DeleteKey("CustomerId");
	}
	if(PlayerPrefs.HasKey("Name"))
	{
		PlayerPrefs.DeleteKey("Name");
	}
	if(PlayerPrefs.HasKey("PresentPackageId"))
	{
		PlayerPrefs.DeleteKey("PresentPackageId");
	}
	if(PlayerPrefs.HasKey("PresentPackageName"))
	{
		PlayerPrefs.DeleteKey("PresentPackageName");
	}
	if(PlayerPrefs.HasKey("PresentPackagePrice"))
	{
		PlayerPrefs.DeleteKey("PresentPackagePrice");
	}
	if(PlayerPrefs.HasKey("Balance"))
	{
		PlayerPrefs.DeleteKey("Balance");
	}
	if(PlayerPrefs.HasKey("NextRechargeDate"))
	{
		PlayerPrefs.DeleteKey("NextRechargeDate");
	}
	Application.LoadLevel("SceneMainPage");
}

function HitLogoutAPI()
{
	var strUUID : String;
    strUUID = PlayerPrefs.GetString("DeviceUID");
    
    var strAPIURL = ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
    var strAPIMethod = "user/logout";
    var strInput = "{\"uuId\":\"" + strUUID + "\"}";
    
    m_objUUIDAPIHandler =	new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    m_bLogoutInProgress	=	true;
    m_objScriptAPIHandler.InvokeReSTfulAPI(m_objUUIDAPIHandler);
}

function RenderAPIError()
{
	
}