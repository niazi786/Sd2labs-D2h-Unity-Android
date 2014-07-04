#pragma strict
//**********variables for lower Screen*********************//
var g_texBack						:	Texture2D;
var g_texHome						:	Texture2D;
var g_texLogout						:	Texture2D;
var g_texRecharge					:	Texture2D;
var g_texPackage					:	Texture2D;
var g_texHelp						:	Texture2D;
var g_texd2hCinema					:	Texture2D;
var g_texTVGuide					:	Texture2D;
var g_texFooterStrip				:	Texture2D;
var g_texActiveButton				:	Texture2D;
var g_skinFooter					:	GUISkin;

var m_iSelectedToggleIndex			:	int;
var m_fHeightStrip					:	float;
//******************For APIs***********************//
var g_objUUIDAPIHandler			:	CWebAPIPacket;
var g_objScriptAPIHandler		:	ScriptAPIHandler;
var m_objScriptProgramGuide		:	ScriptChannelSelection;

function Start ()
{
	//g_texFooterStrip = Resources.Load("bottom window") as Texture2D;
	m_iSelectedToggleIndex	=	ScriptProfilePage.g_iActiveScreenId;//PlayerPrefs.GetInt("ActiveScreenId");
	g_objScriptAPIHandler = GetComponent(ScriptAPIHandler);
}

function Update () {

}

function OnGUI()
{
	m_iSelectedToggleIndex	=	ScriptProfilePage.g_iActiveScreenId;
	CreateFooter();
}

function CreateFooter()
{
	//**********BOTTOM MENU ***********************//			
	GUI.skin = g_skinFooter ;
	
	g_skinFooter.button.padding.top	=	m_fHeightStrip/8.0;
	g_skinFooter.button.padding.bottom	=	m_fHeightStrip/8.0;
	 	
	var fUnitY	:	float = Screen.height/12.8;
	m_fHeightStrip		  =	1.3*fUnitY;


	GUI.BeginGroup(Rect(0,Screen.height - m_fHeightStrip,Screen.width,m_fHeightStrip));		
		GUI.DrawTexture(Rect(0,0,Screen.width,m_fHeightStrip),g_texFooterStrip);// footer background Texture
		
		//if current scene is webview : netbanking n cc	
		if(m_iSelectedToggleIndex == 7 || m_iSelectedToggleIndex == 8)
		{
			g_skinFooter.button.normal.background	=	null;
			g_skinFooter.button.hover.background	=	g_texActiveButton;
			g_skinFooter.button.active.background	=	g_texActiveButton;
			
			//var contentsHome : GUIContent = new GUIContent("Back",g_texBack);
			if(GUI.Button(Rect(Screen.width/9.0,0,Screen.width/9.0,m_fHeightStrip),g_texBack)) // link to recharge button
			{
				Application.LoadLevel("SceneRecharge");
			}
			GUI.enabled	=	false;
		}
		else
		{
			//Link to ProfilePage
			if(m_iSelectedToggleIndex == 0)
			{
				g_skinFooter.button.normal.background	=	g_texActiveButton;
			}
			else
			{
				g_skinFooter.button.normal.background	=	null;
			}
			var contentsHome : GUIContent = new GUIContent("Home",g_texHome);
			if(GUI.Button(Rect(Screen.width/9.0,0,Screen.width/9.0,m_fHeightStrip),g_texHome)) // link to profilePage
			{
				m_iSelectedToggleIndex	=	0;
				ScriptProfilePage.g_iActiveScreenId	=	m_iSelectedToggleIndex;
				//PlayerPrefs.SetInt("ActiveScreenId",m_iSelectedToggleIndex);
				Application.LoadLevel("sceneHomePage");
			}
		}
		
		//Link to TV Guide
		if(m_iSelectedToggleIndex == 1)
		{
			g_skinFooter.button.normal.background	=	g_texActiveButton;
		}
		else
		{
			g_skinFooter.button.normal.background	=	null;
		}
		var contentsTVGuide : GUIContent = new GUIContent("TV Guide",g_texTVGuide);
		if(GUI.Button(Rect(2*Screen.width/9.0,0,Screen.width/9.0,m_fHeightStrip),g_texTVGuide))// link to TV guide
		{
			m_iSelectedToggleIndex	=	1;
			ScriptProfilePage.g_iActiveScreenId	=	m_iSelectedToggleIndex;
			//PlayerPrefs.SetInt("ActiveScreenId",m_iSelectedToggleIndex);
			if(Application.loadedLevelName == "SceneChannelSelection")
			{
				m_objScriptProgramGuide = GetComponent(ScriptChannelSelection);
				m_objScriptProgramGuide.g_iRenderVideoPlayer = 0;
				m_objScriptProgramGuide.m_bFilterToggleState[0] = true;
				m_objScriptProgramGuide.ResetStateOfRestFilterToggles(0);
			}
			else
			{
				PlayerPrefs.SetInt("RenderVideoPlayer",0);
				Application.LoadLevel("SceneChannelSelection");
			}
		}
		
		//Link to D2H Cinema
		if(m_iSelectedToggleIndex == 2)
		{
			g_skinFooter.button.normal.background	=	g_texActiveButton;
		}
		else
		{
			g_skinFooter.button.normal.background	=	null;
		}
		var contentsd2hCinema : GUIContent = new GUIContent("d2h Cinema",g_texd2hCinema);
		if(GUI.Button(Rect(3*Screen.width/9.0,0,Screen.width/9.0,m_fHeightStrip),g_texd2hCinema)) // link to d2h Cinema
		{
			m_iSelectedToggleIndex	=	2;
			ScriptProfilePage.g_iActiveScreenId	=	m_iSelectedToggleIndex;
			//PlayerPrefs.SetInt("ActiveScreenId",m_iSelectedToggleIndex);
			if(Application.loadedLevelName == "SceneChannelSelection")
			{
				m_objScriptProgramGuide = GetComponent(ScriptChannelSelection);
				m_objScriptProgramGuide.g_iRenderVideoPlayer = 1;
			}
			else
			{
				PlayerPrefs.SetInt("RenderVideoPlayer",1);
				Application.LoadLevel("SceneChannelSelection");
			}
		}
		
		//Link to Recharge Page 	
		if(m_iSelectedToggleIndex == 3)
		{
			g_skinFooter.button.normal.background	=	g_texActiveButton;
		}
		else
		{
			g_skinFooter.button.normal.background	=	null;
		}
		var contentsRecharge : GUIContent = new GUIContent("Recharge",g_texRecharge);
		if(GUI.Button(Rect(4*Screen.width/9.0,0,Screen.width/9.0,m_fHeightStrip),g_texRecharge)) // link to Recharge
		{
			m_iSelectedToggleIndex	=	3;
			ScriptProfilePage.g_iActiveScreenId	=	m_iSelectedToggleIndex;
			//PlayerPrefs.SetInt("ActiveScreenId",m_iSelectedToggleIndex);
			Application.LoadLevel("sceneRecharge");
		}
		
		//Link to help Page
		if(m_iSelectedToggleIndex == 4	||	m_iSelectedToggleIndex == 9)
		{
			g_skinFooter.button.normal.background	=	g_texActiveButton;
		}
		else
		{
			g_skinFooter.button.normal.background	=	null;
		}
		var contentsHelp : GUIContent = new GUIContent("Help",g_texHelp);
		if(GUI.Button(Rect(5*Screen.width/9.0,0,Screen.width/9.0,m_fHeightStrip),g_texHelp)) // link to help)
		{
			m_iSelectedToggleIndex	=	4;
			ScriptProfilePage.g_iActiveScreenId	=	m_iSelectedToggleIndex;
			//PlayerPrefs.SetInt("ActiveScreenId",m_iSelectedToggleIndex);
			Application.LoadLevel("sceneHelp");
		}
		
		//link to Package Page
		if(m_iSelectedToggleIndex == 5)
		{
			g_skinFooter.button.normal.background	=	g_texActiveButton;
		}
		else
		{
			g_skinFooter.button.normal.background	=	null;
		}
		var contentsPackage : GUIContent = new GUIContent("Package",g_texPackage);
		if(GUI.Button(Rect(6*Screen.width/9.0,0,Screen.width/9.0,m_fHeightStrip),g_texPackage)) // link to packagePage
		{
			m_iSelectedToggleIndex	=	5;
			ScriptProfilePage.g_iActiveScreenId	=	m_iSelectedToggleIndex;
			//PlayerPrefs.SetInt("ActiveScreenId",m_iSelectedToggleIndex);
			Application.LoadLevel("scenePackage");
		}
		
		//Link to Quit
		if(m_iSelectedToggleIndex == 6)
		{
			g_skinFooter.button.normal.background	=	g_texActiveButton;
		}
		else
		{
			g_skinFooter.button.normal.background	=	null;
		}
		var contentsLogOut : GUIContent = new GUIContent("Log Out",g_texLogout);
		if(GUI.Button(Rect(7*Screen.width/9.0,0,Screen.width/9.0,m_fHeightStrip),g_texLogout)) // link to Quit
		{
			//Debug.Log("sdsdsdsdsdsdsdjkshfsjifhs");
			//Logout();
			m_iSelectedToggleIndex	=	6;
			ScriptProfilePage.g_iActiveScreenId	=	m_iSelectedToggleIndex;
			//PlayerPrefs.SetInt("ActiveScreenId",m_iSelectedToggleIndex);
			PlayerPrefs.SetString("HeaderTitle","Logout");
			Application.LoadLevel("SceneLogout");
		}
		
		GUI.enabled	=	true;
	
	GUI.EndGroup ();
	GUI.skin = null ;
}

//clears the guid from db
function Logout()
{
	var strUUID : String;
    strUUID = PlayerPrefs.GetString("DeviceUID");
    
    var strAPIURL = "http://ec2-54-251-161-31.ap-southeast-1.compute.amazonaws.com/api/v1/";
    var strAPIMethod = "user/logout";
    var strInput = "{\"uuId\":\"" + strUUID + "\"}";
    
    g_objUUIDAPIHandler = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    g_objScriptAPIHandler.InvokeReSTfulAPI(g_objUUIDAPIHandler);
}