#pragma strict
import System.Linq;
import SimpleJSON;
import System.Collections.Generic;

//variables for skin
var m_skinDefault							:	GUISkin;
var m_skinForgotPassword					:	GUISkin;
var m_skinLoginTextfields					:	GUISkin;

//All about error prompt
public static var gs_skinErrorPrompt		:	GUISkin;
public static var gs_skinCrossButton		:	GUISkin;
public static var gs_tex2dCrossButton		:	Texture2D;
public static var gs_tex2dPromptTitle		:	Texture2D;

public class CWebAPIPacket
{
	public var m_strAPIURL 			:	String;
	public var m_strAPIMethod 		:	String;
	public var m_strInput			:	String;
	
	public var m_iConnectionStatus	:	int; //0 not connected, 1 connecting
	
	public var m_strOutput			:	String;
	public var m_strResponseCode	:	String;
	public var m_bResponseReceived 	:	boolean;
	
	public var m_strErrorMessage	:	String;
	public var m_iPromptState		:	int;
	public var m_strPromptTitle		:	String;
	public var m_strPromptMessage	:	String;
		
	public function CWebAPIPacket(	strAPIURL 		: String,
									strAPIMethod 	: String,
									strInput 		: String)
	{
		m_strAPIURL 		= strAPIURL;
		m_strAPIMethod 		= strAPIMethod;
		m_strInput			= strInput;
		m_iConnectionStatus = 0;
		m_strOutput			= "";
		m_strResponseCode	= "";
		m_bResponseReceived = false;
		m_strErrorMessage	= "";
		m_iPromptState		= 0; //0: prompt showing, -1 : retry, 1 : skip to next step
	}
	
	public function InitPrompt(strPromptTitle : String, strPromptMessage : String)
	{
		m_strPromptTitle	=	strPromptTitle;
		m_strPromptMessage	=	strPromptMessage;
	}
	
	public function ErrorPrompt(windowID : int)
	{
		var iBoxDimX = 0.8*Screen.width;
		var iBoxDimY = 0.8*Screen.height;
				
		ScriptMainPage.gs_skinErrorPrompt.label.fontSize	=	Mathf.Min(iBoxDimX,iBoxDimY)/12.5;
		ScriptMainPage.gs_skinErrorPrompt.label.fontStyle	= 	FontStyle.Bold;	
		ScriptMainPage.gs_skinErrorPrompt.label.normal.textColor = Color(103/255.0F,49/255.0F,141/255.0F,255/255.0F);
	
		
		ScriptMainPage.gs_skinErrorPrompt.button.fontSize	=	Mathf.Min(iBoxDimX,iBoxDimY)/10;
		//ScriptMainPage.gs_skinErrorPrompt.button.hover.background = ScriptMainPage.gs_tex2dPromptTitle;
		GUI.skin = ScriptMainPage.gs_skinErrorPrompt;
		GUI.BeginGroup(Rect(Screen.width/2 - iBoxDimX/2, Screen.height/2 - iBoxDimY/2, iBoxDimX, iBoxDimY),"");
		
			GUI.Box(Rect(0, 0, iBoxDimX, iBoxDimY),"");
			
			//Title
			var objGUIContentPromptTitle : GUIContent = new GUIContent(m_strPromptTitle, ScriptMainPage.gs_tex2dPromptTitle);
			GUI.Label(Rect(0.1*iBoxDimX, 0.1*iBoxDimY, 0.8*iBoxDimX, 0.2*iBoxDimY), objGUIContentPromptTitle);
			
			//change the font's size style color for the label
			ScriptMainPage.gs_skinErrorPrompt.label.fontSize			=	Mathf.Min(iBoxDimX,iBoxDimY)/17.5;
			ScriptMainPage.gs_skinErrorPrompt.label.fontStyle			= 	FontStyle.Normal;
			ScriptMainPage.gs_skinErrorPrompt.label.normal.textColor 	= 	Color(56/255.0F,56/255.0F,56/255.0F,255/255.0F);
			
			//Message
			GUI.Label(Rect(0.1*iBoxDimX, 0.3*iBoxDimY, 0.8*iBoxDimX, 0.4*iBoxDimY), m_strPromptMessage);
			
			//Buttons
			if(windowID == 0)//UUIDLook API failure
			{
				if(GUI.Button(Rect(0.1*iBoxDimX, 0.7*iBoxDimY ,0.35*iBoxDimX, 0.15*iBoxDimY),"Close App"))
				{
					Application.Quit();
				}
			}
			else// for rest others skippable API failures
			{
				if(GUI.Button(Rect(0.1*iBoxDimX, 0.7*iBoxDimY ,0.35*iBoxDimX, 0.15*iBoxDimY),"Skip"))
				{
					m_iPromptState = 1;
				}
			}
			
			//Retry option should always be there
			if(GUI.Button(Rect(0.55*iBoxDimX, 0.7*iBoxDimY, 0.35*iBoxDimX, 0.15*iBoxDimY),"Retry"))
			{
				m_iPromptState = -1;
			}
		
		GUI.EndGroup();
		GUI.skin = null;
		/*		
		//outside the group cos it would've clipped if it was put inside group
		ScriptMainPage.gs_skinCrossButton.button.alignment = TextAnchor.MiddleCenter;
		if(GUI.Button(Rect(0.1*Screen.width + iBoxDimX - 0.045*iBoxDimX, 0.1*Screen.height - 0.045*iBoxDimX, 0.09*iBoxDimX, 0.09*iBoxDimX),ScriptMainPage.gs_tex2dCrossButton, ScriptMainPage.gs_skinCrossButton.button))
		{
			m_iPromptState = 1;
		}*/
	}
}

public class CPresentProduct
{
	var m_strProductID							:	String;
	var m_strProductName						:	String;
	
	var m_strProductPrice						:	String;
	var m_objGetCommercialProductPriceAPIPacket	:	CWebAPIPacket;
	
	var m_objListChannels						:	List.<CChannelInfo>;
	var m_tex2dListIcons						:	List.<Texture2D>;
	var m_iChannelsCount						:	int;
	var m_objProductToChannelInfoAPIPacket		:	CWebAPIPacket;
	
	var m_objListAddOns							:	List.<CAddOn>;
	var m_iAddOnsCount							:	int;
	var m_objGetAddOnsAPIPacket					:	CWebAPIPacket;
}

public class CUpgradeOption
{
	var m_strProductID							:	String;
	var m_strProductName						:	String;
	
	var m_strProductPrice						:	String;
	var m_objGetCommercialProductPriceAPIPacket	:	CWebAPIPacket;
	
	var m_strMinBalance							:	String;
	
	var m_objListChannels						:	List.<CChannelInfo>;
	var m_tex2dListIcons						:	Texture2D[];
	var m_iChannelsCount						:	int;
	var m_objProductToChannelInfoAPIPacket		:	CWebAPIPacket;
	
	var m_objListAddOns							:	List.<CAddOn>;
	var m_iAddOnsCount							:	int;
	var m_iMinAddOns							:	int;
	var m_iMaxAddOns							:	int;
	var m_objGetAddOnsAPIPacket					:	CWebAPIPacket;
}

public class CDowngradeOption
{
	var m_strProductID							:	String;
	var m_strProductName						:	String;
	
	var m_strProductPrice						:	String;
	var m_objGetCommercialProductPriceAPIPacket	:	CWebAPIPacket;
	
	var m_strMinBalance							:	String;
	
	var m_objListChannels						:	List.<CChannelInfo>;
	var m_tex2dListIcons						:	Texture2D[];
	var m_iChannelsCount						:	int;
	var m_objProductToChannelInfoAPIPacket		:	CWebAPIPacket;
	
	var m_objListAddOns							:	List.<CAddOn>;
	var m_iAddOnsCount							:	int;
	var m_iMinAddOns							:	int;
	var m_iMaxAddOns							:	int;
	var m_objGetAddOnsAPIPacket					:	CWebAPIPacket;
}

public class CAddOn
{
	var m_strAddOnID							:	String;
	var m_strAddOnName							:	String;
	
	var m_strAddOnPrice							:	String;
	
	var m_bIsAddOnFree							:	boolean;
	
	var m_objListChannels						:	List.<CChannelInfo>;
	var m_tex2dListIcons						:	Texture2D[];
	var m_iChannelsCount						:	int;
	var m_objProductToChannelInfoAPIPacket		:	CWebAPIPacket;
	
	//whether subscribed or not
	var m_strSubscribed							:	String; //"true" or "false"
	
	//control variables for the Divs(buttons & labels) while selecting/deselecting Add-Ons on Upgrade|Downgrade
	var m_strAddOnButtonLabel					:	String;						
	var m_bShowChannels							:	boolean;
	var m_bAddOnSelected						:	boolean;
	var m_iShowChannelsTextureIndex				:	int; //0:SeeList(Orange), 1:SeeList(White), 2:AddOn(Orange)
}

//Screen_IDs:	0 : UUIDLookup, 1 : Login, 2 : Signup
var g_iScreenID					:	int			=	0;
var m_strStatusMessage			:	String;
/*************Login Screen***************/
var m_fGUILogoHeight		:	float;
var m_fGUILogoWidth			:	float;
var m_fGUIElementHeight		:	float;
var m_fGUIElementWidth		:	float;
var m_fGAP					:	float;

var g_texLogo 				:	Texture2D;
var m_strMaskedPassword		:	String;
var m_strLoginPassword	 	: 	String;
var m_strLoginEmailId 		: 	String;
var m_strInputPassword		:	String;
var m_strInputEmailId		:	String;

var g_strFooterNote			:	String;
var g_bRenderFooterNote		:	boolean;
/***************************************/

//objects to the API IO Packets
var g_objUUIDAPIPacket								:	CWebAPIPacket;
var g_objLoginAPIPacket								:	CWebAPIPacket;
var g_objRegisterationAPIPacket						:	CWebAPIPacket;

//Objects to attached scripts
var g_objScriptAPIHandler							:	ScriptAPIHandler;
var g_objScriptAnimation							:	ScriptAnimation;
 
//Static variables to be used across the whole project
static var gs_strUUID								:	String;
static var gs_strSCNumberField						:	String;
static var gs_strCustomerId							:	String;
static var gs_strPresentProductName					:	String;
static var gs_strPresentProductID					:	String;

function Start ()
{
	/*** Initialize Static Vars like Textures & Skins ***/
	gs_tex2dPromptTitle	=	Resources.Load("ConnectivityIssue") as Texture2D;
	gs_tex2dCrossButton	=	Resources.Load("CrossButton") as Texture2D;
	gs_skinErrorPrompt	=	Resources.Load("Skin_ErrorPrompt") as GUISkin;
	gs_skinCrossButton	=	Resources.Load("Skin_CrossButton") as GUISkin;
    
    InitLoginScreenParams();
    InitRegistrationScreenParams();
      
    g_objScriptAPIHandler = GetComponent(ScriptAPIHandler);
    g_objScriptAnimation = GetComponent(ScriptAnimation);
    
    //PlayerPrefs.DeleteKey("DeviceUID");
    //PlayerPrefs.DeleteKey("LoginToken");
    if(PlayerPrefs.HasKey("DeviceUID"))
    {    	
    	gs_strUUID = PlayerPrefs.GetString("DeviceUID");
//    	gs_strUUID = "KeyPresent_Yes_" + strUUID;
    }
    else
    {
    	var strDeviceID = SystemInfo.deviceUniqueIdentifier;
    	var strAge = GetSystemAgeInTicks();
    	
    	PlayerPrefs.SetString("DeviceUID",strDeviceID + strAge);
    	gs_strUUID = PlayerPrefs.GetString("DeviceUID");
//    	gs_strUUID = "KeyPresent_No_" + strUUID;
    }
    print(gs_strUUID);
    
    if(PlayerPrefs.HasKey("Refresh"))
    {
    	var iRefreshVal	=	PlayerPrefs.GetInt("Refresh");
    	
    	if(iRefreshVal == 1)
    	{
    		DeleteCachedDetails();
    		
    		m_strLoginEmailId	=	PlayerPrefs.GetString("EmailId");
			m_strLoginPassword	=	PlayerPrefs.GetString("Password");
			
			m_strStatusMessage = "refreshing details...";
			
    		HitLoginAPI();
    		g_iScreenID = 1;
    		PlayerPrefs.SetInt("Refresh",0);
    	}
    }
}

function Update ()
{
	if (Input.GetKeyDown(KeyCode.Escape))
	{
		if(g_iScreenID == 2)
		{
			g_iScreenID = 1;
		}
		else
		{
			Application.Quit();
		}
	}
}

function OnGUI ()
{	 	
	GUI.skin = m_skinDefault;
	
	m_skinDefault.box.fontSize		=	Screen.width/50;
	m_skinDefault.button.fontSize	=	Screen.width/50;
	m_skinDefault.label.fontSize	=	Screen.width/35;
	
	/*** STEP 1: UUID LOOKUP ***/	
	if(g_iScreenID == 0)
	{
		m_strStatusMessage	=	"checking credentials...";
		if(DoesLoginTokenExist() == false)
		{
			g_iScreenID = 1;
		}
		else
		{
			if(IsLoginTokenValid())
			{
				LoadCacheValsToMemory();
				TakeMeHome();
			}
			else
			{
				g_iScreenID = 1;
			}
		}
	}
		
	if(g_iScreenID == 1)
	{
		if(g_objLoginAPIPacket.m_iConnectionStatus == 0)
		{
			RenderLoginScreen();
		}
		
		if(g_objLoginAPIPacket.m_bResponseReceived)
		{
			ProcessLoginAPIResponse(); //candidate for thread
			ClearResponseCodeAndJSON(g_objLoginAPIPacket);
		}
	}
	else if(g_iScreenID == 2)
	{
		if(g_objRegisterationAPIPacket.m_iConnectionStatus == 0)
		{
			RenderRegistrationScreen();
		}
		
		if(g_objRegisterationAPIPacket.m_bResponseReceived)
		{
			ProcessRegistrationAPIResponse();
			ClearResponseCodeAndJSON(g_objRegisterationAPIPacket);
		}
	}
		
	//show animation
	if((g_objRegisterationAPIPacket.m_iConnectionStatus == 1 || g_objLoginAPIPacket.m_iConnectionStatus == 1) || (g_iScreenID < 1 || g_iScreenID > 2))
	{
		g_objScriptAnimation.AnimationInfinity(m_strStatusMessage);
	}
	GUI.skin = null;
}

function InitLoginScreenParams()
{
	/********************************************/
	m_strMaskedPassword = "qwertyui";//"welcome123";//"videocon@123";//"bbcl@123";//"Password";
	m_strLoginPassword = "qwertyui";//"welcome123";//"videocon@123";//"bbcl@123";//"Password";
	m_strLoginEmailId = "qwe@sd.com";//"uday.krishan@lycos.com";//"test@exam.com //"rajat@johri.com";//"shashank.jha.it@d2h.com";//"Email Address";
	/********************************************/
}

var m_objKeyboardLoginEmailId	:	TouchScreenKeyboard;
var m_objKeyboardLoginPassword	:	TouchScreenKeyboard;
function RenderLoginScreen()
{
	ElasticLoginScreenDivs();
   	//m_skinDefault.button.fontSize			=	Mathf.Sqrt(Mathf.Pow(Screen.width,2.0) + Mathf.Pow(Screen.height,2.0))/(Screen.width + Screen.height);
   	//m_skinForgotPassword.button.fontSize	=	Mathf.Sqrt(Mathf.Pow(Screen.width,2.0) + Mathf.Pow(Screen.height,2.0))/(Screen.width + Screen.height);	
	GUI.skin = m_skinDefault;
	GUI.BeginGroup(Rect(0, 0, Screen.width, Screen.height),"");
	
	//Inserting Logo
	GUI.DrawTexture(Rect(Screen.width/2 - m_fGUIElementWidth/2,m_fGUIElementHeight,m_fGUILogoWidth,m_fGUILogoHeight),g_texLogo);// to draw d2h Logo
	
	//Forgot Password button
	m_skinForgotPassword.button.fontStyle	=	FontStyle.Normal;
   	m_skinForgotPassword.button.fontSize	=	Mathf.Min(m_fGUILogoWidth,m_fGUILogoHeight)/2.5;
   	m_skinForgotPassword.button.alignment 	=	TextAnchor.LowerCenter;
	if(GUI.Button(Rect(Screen.width/2 + m_fGUIElementWidth/2 - m_fGUILogoWidth,m_fGUIElementHeight,m_fGUILogoWidth,m_fGUILogoHeight),"Forgot Password",m_skinForgotPassword.button))
	{	//tracking("Forgot Password");
		//invoke forgot password API
		Application.OpenURL("http://m.videocond2h.com/forgot_password.aspx");
	}
	
	//Textfields: Email Address Field and Password Field
	//m_skinDefault.textField.fontSize		=	Screen.width/35;
	//m_strLoginEmailId = GUI.TextField(Rect(Screen.width/2 - m_fGUIElementWidth/2, 2*m_fGUIElementHeight, m_fGUIElementWidth, m_fGUIElementHeight - m_fGAP),m_strLoginEmailId);
	//m_strLoginPassword = GUI.PasswordField(Rect(Screen.width/2 - m_fGUIElementWidth/2, 3*m_fGUIElementHeight, m_fGUIElementWidth, m_fGUIElementHeight - m_fGAP),m_strLoginPassword,"*"[0],25);
	
	SkinButtonAsATextfield();
	if(GUI.Button(Rect(Screen.width/2 - m_fGUIElementWidth/2, 2*m_fGUIElementHeight, m_fGUIElementWidth, m_fGUIElementHeight - m_fGAP),m_strLoginEmailId,m_skinLoginTextfields.button))
	{	
		m_objKeyboardLoginEmailId	=	TouchScreenKeyboard.Open(m_strInputEmailId,TouchScreenKeyboardType.EmailAddress,false,false,false,false,"Email Address");
	}
	
	if(m_objKeyboardLoginEmailId)
	{
		if(m_objKeyboardLoginEmailId.done)
		{
			if(m_objKeyboardLoginEmailId.text == "")
			{
				m_strLoginEmailId	=	"Email Address";
			}
			else
			{
				m_strLoginEmailId	=	m_objKeyboardLoginEmailId.text;
			}
			m_objKeyboardLoginEmailId	=	null;
		}
		else if(m_objKeyboardLoginEmailId.active)
		{
			m_strLoginEmailId	=	m_strInputEmailId;
		}
	}
	
	if(GUI.Button(Rect(Screen.width/2 - m_fGUIElementWidth/2, 3*m_fGUIElementHeight, m_fGUIElementWidth, m_fGUIElementHeight - m_fGAP),m_strMaskedPassword,m_skinLoginTextfields.button))
	{
		m_objKeyboardLoginPassword	=	TouchScreenKeyboard.Open(m_strInputPassword,TouchScreenKeyboardType.Default,false,false,true,false,"Password");
	}
	
	if(m_objKeyboardLoginPassword)
	{
		if(m_objKeyboardLoginPassword.done)
		{
			if(m_objKeyboardLoginPassword.text == "")
			{
				m_strLoginPassword	=	"Password";
			}
			else
			{
				m_strLoginPassword	=	m_objKeyboardLoginPassword.text;
				AssignMaskedPassword(m_strLoginPassword.Length);
			}
			m_objKeyboardLoginPassword	=	null;
		}
		else if(m_objKeyboardLoginPassword.active)
		{
			m_strLoginPassword	=	m_strInputPassword;
		}
	}
	
	//Register and Login Buttons
	m_skinDefault.button.fontSize	=	Mathf.Min(m_fGUIElementWidth/2,m_fGUIElementHeight)/2.25;
	if(GUI.Button(Rect(Screen.width/2 - m_fGUIElementWidth/2, 4*m_fGUIElementHeight, m_fGUIElementWidth/2 - m_fGAP/2, m_fGUIElementHeight - m_fGAP),"Register"))
	{
		//Application.LoadLevel("SceneRegistrationPage");
		InitRegistrationScreenParams();
		if(g_bRenderFooterNote)
		{
			g_bRenderFooterNote = false;
			g_strFooterNote = "";
		}
		g_iScreenID = 2;
		//Debug.Log("Render Registration screen");
	}
	//LoginButton
	if(GUI.Button(Rect(Screen.width/2 + m_fGAP/2, 4*m_fGUIElementHeight, m_fGUIElementWidth/2 - m_fGAP/2, m_fGUIElementHeight - m_fGAP),"Login"))
	{
		//tracking("Login");
		
		if(g_bRenderFooterNote)
		{
			g_bRenderFooterNote = false;
			g_strFooterNote = "";
			//g_strParsingStatus = "";
		}
		
		if(m_strLoginEmailId == "" || m_strLoginEmailId == "Email Address" || m_strLoginPassword == "Password" || m_strLoginPassword == "")
		{
			g_strFooterNote = "*Please enter the mandatory fields you have left blank.";
			g_bRenderFooterNote = true;
		}
		else
		{	
			//Debug.Log("invoke login API");
			m_strStatusMessage = "logging in...";
			HitLoginAPI();
		}
	}
	
	if(g_bRenderFooterNote)
	{
		m_skinDefault.label.fontSize			=	Screen.width/60;
		GUI.Label(Rect(Screen.width/2 - m_fGUIElementWidth/2, 5*m_fGUIElementHeight, m_fGUIElementWidth, m_fGUIElementHeight),g_strFooterNote);
	}
	//group ends here
	GUI.skin = null ;
	GUI.EndGroup ();
}

function ElasticLoginScreenDivs()
{
	/************* LOGIN SCREEN *************/
    //	logo image aspect ratio : 4/1
	//	1+4+1 Grids/Rows to be made:	EmptyHeader | Logo | EmailID | Password | Buttons | EmptyFooter
	m_fGUILogoHeight = Screen.height/6.0;
	
	//thus the width must be such width:height = 7/2, ie width = (7/2)*height
	m_fGUILogoWidth = 890*m_fGUILogoHeight/249;
	
	m_fGUILogoHeight = 0.66*m_fGUILogoHeight;
	m_fGUILogoWidth = 0.66*m_fGUILogoWidth;
	
	//Logo is 1/2 of the textfield's width
	m_fGUIElementWidth = 2.25*m_fGUILogoWidth;
	m_fGUIElementHeight = 1.5*m_fGUILogoHeight;
	
	//Gap between controls | GUI Elements
	m_fGAP = m_fGUIElementHeight / 12;
}

function HitLoginAPI()
{
	var strAPIURL = ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
    var strAPIMethod = "user/login";
    var strInput = "{\"uuId\":\""+ gs_strUUID + "\",\"userId\":\"" + m_strLoginEmailId + "\",\"password\":\"" + m_strLoginPassword + "\"}";
    
    g_objLoginAPIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    g_objScriptAPIHandler.InvokeReSTfulAPI(g_objLoginAPIPacket);
}

function ProcessLoginAPIResponse()
{
	if(g_objLoginAPIPacket.m_strResponseCode == "200 OK")
	{	
		if(g_objLoginAPIPacket.m_strOutput != "")
		{
			g_objLoginAPIPacket.m_strErrorMessage = ParseResponse(g_objLoginAPIPacket.m_strOutput);
			
			if(g_objLoginAPIPacket.m_strErrorMessage != "")
			{
				//footer lable message, notify the user about the problem
				g_strFooterNote = "Error: " + g_objLoginAPIPacket.m_strErrorMessage;
				//Debug.Log(g_strFooterNote);
				g_bRenderFooterNote = true;
			}
			else
			{
				//move forward and prefetch Channels | Products | Add-Ons | Pricing Details
				//Debug.Log("LoginAPI : Valid Response Aaya");
				
				SaveLoginToken();
				PlayerPrefs.SetString("EmailId",m_strLoginEmailId);
				PlayerPrefs.SetString("Password",m_strLoginPassword);
				
				m_strStatusMessage = "✓ logged in...";
				
				TakeMeHome();
				
				g_iScreenID	=	3;
			}
		}
		else//khaali response
		{
			//khaali response
			//Debug.Log("LoginAPI : Khaali Response Aaya");
			
			//footer lable message, notify the user about the problem
			g_strFooterNote = "Error: Something went wrong :( Please try to login again";
			//Debug.Log(g_strFooterNote);
			g_bRenderFooterNote = true;
		}
	}
	else if(g_objLoginAPIPacket.m_strResponseCode == "401 Unauthorized\r")
	{
		//footer lable message, asking him to press register button
		g_strFooterNote = "Please click Register button";
		//Debug.Log(g_strFooterNote);
		g_bRenderFooterNote = true;	
	}
	else //handle any other error message
	{
		//Debug.Log("LoginAPI : HTTP Error Aaya");
		//footer lable message, notify the user about the problem
		g_strFooterNote = "Connection Error: "+ g_objLoginAPIPacket.m_strResponseCode;
		//Debug.Log(g_strFooterNote);
		g_bRenderFooterNote = true;
	}
}

function ParseResponse(strResponse : String) : String
{
	var N = JSON.Parse(strResponse);
	
	if(N == null)
	{
		return "NULL JSON";
	}
	else
	{
		Debug.Log("Reassembled: " + N.ToString());
		if(N.ToString() == "{}")
		{
			return "Empty JSON";
		}
		
		var strStatus	=	N["status"];
		var strMessage 	=	N["message"];
		
		if(strStatus	==	"401")
		{
			return strMessage;
		}
		
		if(strMessage.Value == "UUID not found")
		{
			//Debug.Log("uuid found -" + strMessage);
			return "UUID_NOT_FOUND";
		}
		else if(strMessage.Value == "Server not Responding")
		{
			//Debug.Log("uuid found -" + strMessage);
			return "Server not responding";
		}
		else if(strMessage.Value == "Unauthorized")
		{
			//Debug.Log("uuid found -" + strMessage);
			return "401 - Unauthorized API Access";
		}
		else if(strMessage.Value == "Incorrect Credentials")
		{
			//Debug.Log("uuid found -" + strMessage);
			return "Incorrect Credentials. Please enter the correct email address and password.";
		}
	
		//connection id
		gs_strSCNumberField = N["RoomList"]["CurrentProduct"][0]["sCNumberField"];
		PlayerPrefs.SetString("ConnectionID",gs_strSCNumberField);
		//Debug.Log("ConnectionID: " + gs_strSCNumberField);
		
		//customer id
		gs_strCustomerId	=	N["CustomerId"];
		PlayerPrefs.SetString("CustomerId",gs_strCustomerId);
		//Debug.Log("CustomerId: " + gs_strCustomerId);
		
		//fb pic
		
		//name
		var strFirstName = N["FirstName"];
		var strMiddleName = N["MiddleName"];
		PlayerPrefs.SetString("Name",strFirstName + " " + strMiddleName);
		//Debug.Log("Name: " + strFirstName + " " + strMiddleName);
		
		var strEmailId = N["InternetUserIs"];
		PlayerPrefs.SetString("EmailId",strEmailId);
		
		//package
		gs_strPresentProductID = N["RoomList"]["CurrentProduct"][0]["productId"];
		gs_strPresentProductName = N["RoomList"]["CurrentProduct"][0]["productName"];
		PlayerPrefs.SetString("PresentPackageId",gs_strPresentProductID);
		PlayerPrefs.SetString("PresentPackageName",gs_strPresentProductName);
		Debug.Log("PackageId: " + gs_strPresentProductID + " and PackageName: " + gs_strPresentProductName);
		
		//balance
		var strBalance : String = N["Balance"]; //access object member
		
		var fBalance	:	float	=	parseFloat(strBalance);
		fBalance = -1*fBalance;
		
		strBalance	=	fBalance.ToString("f2");
		
		PlayerPrefs.SetString("Balance",strBalance);
		//Debug.Log("Balance: " + strBalance);
		
		//recharge in 'n' days
		var strNextRechargeDate = N["NextRechargeDate"];
		PlayerPrefs.SetString("NextRechargeDate",strNextRechargeDate);
		
		var strPostalCode = N["PostalCode"];
		PlayerPrefs.SetString("PostalCode",strPostalCode);
		//Debug.Log("NextRechargeDate" + strNextRechargeDate);
		
		var strContact = N["RTN1"];
		PlayerPrefs.SetString("RTN1",strContact);
		
		var strCity = N["SmallCity"];
		PlayerPrefs.SetString("SmallCity",strCity);
		
		var strState = N["State"];
		PlayerPrefs.SetString("State",strState);  
		//Identify("Login Successfull");
		//TrackEvent("loing");
		//("Login Successfull");
		//StartCoroutine(TrackEvent("LOGIN"));
		return "";
	}
}

var m_strCustomerID	:	String;
var m_strEmailID	:	String;
var m_strPassword	:	String;
var	m_strRePassword	:	String;
function InitRegistrationScreenParams()
{
	/********************************************/
	m_strCustomerID = "Customer ID";
	m_strEmailID 	= "Email Address";
	m_strPassword	= "Password";
	m_strRePassword	= "Re-Type Password";
	/********************************************/
}

function RenderRegistrationScreen()
{
	ElasticRegistrationScreenDivs();
	GUI.skin = m_skinDefault;
	GUI.BeginGroup(Rect(0, 0, Screen.width, Screen.height),"");
	
		//Inserting Logo
		GUI.DrawTexture(Rect(Screen.width/2 - m_fGUIElementWidth/2,0.5*m_fGUIElementHeight,m_fGUILogoWidth,m_fGUILogoHeight),g_texLogo);// to draw d2h Logo
	
		//Textfields: Customer ID | Email Address | Password & Confirm Password Field
		m_skinDefault.textField.fontSize	=	Screen.width/35;
		m_strCustomerID 	=	GUI.TextField(Rect(Screen.width/2 - m_fGUIElementWidth/2, 1.5*m_fGUIElementHeight, m_fGUIElementWidth, m_fGUIElementHeight - m_fGAP),m_strCustomerID);
		m_strEmailID 		=	GUI.TextField(Rect(Screen.width/2 - m_fGUIElementWidth/2, 2.5*m_fGUIElementHeight, m_fGUIElementWidth, m_fGUIElementHeight - m_fGAP),m_strEmailID);
		m_strPassword		=	GUI.PasswordField(Rect(Screen.width/2 - m_fGUIElementWidth/2, 3.5*m_fGUIElementHeight, m_fGUIElementWidth/2 - m_fGAP/2, m_fGUIElementHeight - m_fGAP),m_strPassword,"*"[0],25);
		m_strRePassword		=	GUI.PasswordField(Rect(Screen.width/2 + m_fGAP/2, 3.5*m_fGUIElementHeight, m_fGUIElementWidth/2 - m_fGAP/2, m_fGUIElementHeight - m_fGAP),m_strRePassword,"*"[0],25);
		
		//Back and Next Buttons
		m_skinDefault.button.fontSize	=	Mathf.Min(m_fGUIElementWidth/2,m_fGUIElementHeight)/2.25;
		//Back
		if(GUI.Button(Rect(Screen.width/2 - m_fGUIElementWidth/2, 4.5*m_fGUIElementHeight, m_fGUIElementWidth/2 - m_fGAP/2, m_fGUIElementHeight - m_fGAP),"Back"))
		{	//tracking("Back");
			if(g_bRenderFooterNote)
			{
				g_bRenderFooterNote = false;
				g_strFooterNote = "";
			}
			g_iScreenID = 1;
			//Debug.Log("Render Login screen");
		}
		//Next
		if(GUI.Button(Rect(Screen.width/2 + m_fGAP/2, 4.5*m_fGUIElementHeight, m_fGUIElementWidth/2 - m_fGAP/2, m_fGUIElementHeight - m_fGAP),"Next"))
		{	//tracking("Next");
			//hit registration API
			if(g_bRenderFooterNote)
			{
				g_bRenderFooterNote = false;
				g_strFooterNote = "";
			}
		
			if(m_strCustomerID == "" || m_strCustomerID == "Customer ID" || m_strEmailID == "" || m_strEmailID == "Email Address" || m_strPassword == "Password" || m_strPassword == "" || m_strRePassword == "Re-Type Password" || m_strRePassword == "")
			{
				g_strFooterNote = "*Please enter the mandatory fields you have left blank.";
				g_bRenderFooterNote = true;
			}
			else
			{
				if(IsCustomerIdNumeric())
				{
					if(m_strPassword == m_strRePassword)
					{	
						//Debug.Log("invoke registration API");
						m_strStatusMessage = "Registration in progress...";
						HitRegistrationAPI();
					}
					else
					{
						g_strFooterNote = "Your passwords do not match with each other.";
						g_bRenderFooterNote = true;
					}
				}
			}
		}
	
		if(g_bRenderFooterNote)
		{
			m_skinDefault.label.fontSize			=	Screen.width/60;
			GUI.Label(Rect(Screen.width/2 - m_fGUIElementWidth/2, 5.5*m_fGUIElementHeight, m_fGUIElementWidth, m_fGUIElementHeight),g_strFooterNote);
		}
		
	GUI.EndGroup();
	GUI.skin = null;
}

function IsCustomerIdNumeric() : boolean
{
	var iLength : int = m_strCustomerID.Length;
	
	for(var i = 0; i < iLength; i++)
	{
		if((m_strCustomerID[i] > 47 && m_strCustomerID[i] < 58) == false)
		{
			g_bRenderFooterNote	=	true;
			g_strFooterNote	=	"Invalid Customer Id: Please enter a numeric customer id.";
			break;
		}
	}
	return !g_bRenderFooterNote;
}

function ElasticRegistrationScreenDivs()
{
	/************* Registration SCREEN *************/
    //	logo image aspect ratio : 4/1
	//	1/2+5+1/2 Grids/Rows to be made:	EmptyHeader is half | Logo | CustomerID | EmailID | Password & Re-Password | Buttons | EmptyFooter is half
	m_fGUILogoHeight = Screen.height/6.0;
	
	//thus the width must be such width:height = 7/2, ie width = (7/2)*height
	m_fGUILogoWidth = 890*m_fGUILogoHeight/249.0;
	
	m_fGUILogoHeight = 0.66*m_fGUILogoHeight;
	m_fGUILogoWidth = 0.66*m_fGUILogoWidth;
	
	//Logo is 1/2.25 of the textfield's width
	m_fGUIElementWidth = 2.25*m_fGUILogoWidth;
	m_fGUIElementHeight = 1.5*m_fGUILogoHeight;
	
	//Gap between controls | GUI Elements
	m_fGAP = m_fGUIElementHeight / 12;
	/********************************************/
}

function HitRegistrationAPI()
{
	var strAPIURL = ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
    var strAPIMethod = "user/register";
    var strInput = "{\"customerId\":\""+ m_strCustomerID + "\",\"userId\":\"" + m_strEmailID + "\",\"password\":\"" + m_strRePassword + "\"}";
    
    g_objRegisterationAPIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    g_objScriptAPIHandler.InvokeReSTfulAPI(g_objRegisterationAPIPacket);
}

function ProcessRegistrationAPIResponse()
{
	if(g_objRegisterationAPIPacket.m_strResponseCode == "200 OK")
	{
		if(g_objRegisterationAPIPacket.m_strOutput != "")
		{
			//some response : check when API runs
			g_strFooterNote = g_objRegisterationAPIPacket.m_strOutput; //"Registration completed successfully! You can now login to your account.";
			//Debug.Log(g_strFooterNote);
			g_bRenderFooterNote = true;
			
			g_iScreenID = 1;
		}
		else//khaali response
		{
			//khaali response
			//Debug.Log("RegistrationAPI : Khaali Response Aaya");
			
			//footer lable message, notify the user about the problem
			g_strFooterNote = "Error: Something went wrong :( Please try to login again";
			//Debug.Log(g_strFooterNote);
			g_bRenderFooterNote = true;
		}
	}
	else //handle any other error message
	{
		//Debug.Log("LoginAPI : HTTP Error Aaya");
		//footer lable message, notify the user about the problem
		g_strFooterNote = "Connection Error: "+ g_objRegisterationAPIPacket.m_strResponseCode;
		//Debug.Log(g_strFooterNote);
		g_bRenderFooterNote = true;
	}
}

function ClearResponseCodeAndJSON(objAPIPacket : CWebAPIPacket)
{
	objAPIPacket.m_iConnectionStatus = 0;
	objAPIPacket.m_bResponseReceived = false;
	objAPIPacket.m_strOutput = "";
	objAPIPacket.m_strResponseCode = "";
	objAPIPacket.m_strErrorMessage = "";
}

function GetSystemAgeInTicks() : String
{
	var centuryBegin = new System.DateTime(2001, 1, 1);
	var currentDate  = System.DateTime.Now;

	var elapsedTicks = currentDate.Ticks - centuryBegin.Ticks;
	var elapsedSpan = new System.TimeSpan(elapsedTicks);

	//Debug.Log("Elapsed from the beginning of the century to {0:f}:" + currentDate);
	//Debug.Log("   {0:N0} nanoseconds" + elapsedTicks * 100);
	//Debug.Log("   {0:N0} ticks" + elapsedTicks);
	//Debug.Log("   {0:N2} seconds" + elapsedSpan.TotalSeconds);
	//Debug.Log("   {0:N2} minutes" + elapsedSpan.TotalMinutes);
	var strAge = "_" + elapsedSpan.Days + "d_" + elapsedSpan.Hours + "h_" + elapsedSpan.Minutes + "m_" + elapsedSpan.Seconds + "s";
	
	return strAge;
}

function DoesLoginTokenExist() : boolean
{
	//PlayerPrefs.DeleteKey("LoginToken");
	if(PlayerPrefs.HasKey("LoginToken"))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function SaveLoginToken()
{
	var centuryBegin 		=	new System.DateTime(2001, 1, 1);
	var currentDate  		=	System.DateTime.Now;
	var elapsedTicks 		=	currentDate.Ticks - centuryBegin.Ticks;    	
    
    PlayerPrefs.SetFloat("LoginToken",elapsedTicks);
}

function IsLoginTokenValid() : boolean
{
	//if the age of token is > 48hrs (or 47h | 59m | 59s)
	//return false
	
	var fLastTokenTicks		=	PlayerPrefs.GetFloat("LoginToken");
	
	var centuryBegin 		=	new System.DateTime(2001, 1, 1);
	var currentDate  		=	System.DateTime.Now;
	var elapsedTicks 		=	currentDate.Ticks - centuryBegin.Ticks;
	
	var fTokenAgeInTicks	=	elapsedTicks - fLastTokenTicks;
	
	var fTokenAgeSpanSince	= new System.TimeSpan(fTokenAgeInTicks);
	if(fTokenAgeSpanSince.TotalSeconds > 48*60*60)
	{
		return false;
	}
	//else
	//return true
	else
	{
		return true;
	}
}

function LoadCacheValsToMemory()
{
	gs_strSCNumberField 		=	PlayerPrefs.GetString("ConnectionID");
	
	gs_strCustomerId			=	PlayerPrefs.GetString("CustomerId");
	
	gs_strPresentProductID		=	PlayerPrefs.GetString("PresentPackageId");
	
	gs_strPresentProductName	=	PlayerPrefs.GetString("PresentPackageName");
	
	//Identify(gs_strPresentProductName);
	
	print("Loaded Values - SCNumberField : " + gs_strSCNumberField + ", CustomerId : " + gs_strCustomerId + ", PresentProductID : " + gs_strPresentProductID + ", PresentProductName : " + gs_strPresentProductName);
}

/*
function RenderErrorMessageScreen(strButtonOne : String, strButtonTwo : String, strMessage : String)
{
	if(g_bHault)
	{
		GUI.BeginGroup(Rect(0,0,Screen.width,Screen.height),"");
		
		GUI.Box(Rect(Screen.width/2 - Screen.width/3,Screen.height/2 - Screen.height/3,Screen.width/1.5,Screen.height/1.5),"Connectivity Issue");
		
		g_ScrollPosition = GUI.BeginScrollView (Rect (0+Screen.width/2 - Screen.width/3.5,0+Screen.height/2 - Screen.height/3.5,Screen.width/1.75,Screen.height/1.75),g_ScrollPosition, Rect (0, 0, Screen.width/2,Screen.height/2));
		GUI.Label (Rect(0,0,Screen.width/1.75,Screen.height/2),strMessage);
		GUI.EndScrollView ();
		
		if(GUI.Button(Rect(0 + Screen.width/2 - Screen.width/6 - Screen.width/12,0+Screen.height/1.125 - Screen.height/5,Screen.width/4.5,Screen.height/10),strButtonOne))
		{
			if( g_iPrefetchingStepsCompleted == 0)
			{				
				if(g_objUUIDAPIPacket.m_bResponseReceived)
				{
					ClearResponseCodeAndJSON(g_objUUIDAPIPacket);
					g_objScriptAPIHandler.InvokeReSTfulAPI(g_objUUIDAPIPacket);
				}
				else
				{
					g_objGetCommercialPresentProductPriceAPIPacket.m_bResponseReceived = true;
				}
			}
			
			if( g_iPrefetchingStepsCompleted == 1)
			{
				if(g_objGetCommercialPresentProductPriceAPIPacket.m_bResponseReceived)
				{
					ClearResponseCodeAndJSON(g_objGetCommercialPresentProductPriceAPIPacket);
					g_objScriptAPIHandler.InvokeReSTfulAPI(g_objGetCommercialPresentProductPriceAPIPacket);
				}
				else
				{
					g_objGetCommercialPresentProductPriceAPIPacket.m_bResponseReceived = true;
				}
					
				if(g_objPresentProductToChannelInfoAPIPacket.m_bResponseReceived)
				{
					ClearResponseCodeAndJSON(g_objPresentProductToChannelInfoAPIPacket);
					g_objScriptAPIHandler.InvokeReSTfulAPI(g_objPresentProductToChannelInfoAPIPacket);
				}
				else
				{
					g_objPresentProductToChannelInfoAPIPacket.m_bResponseReceived = true;
				}
					
				if(g_objGetUpgradeOptionsAPIPacket.m_bResponseReceived)
				{
					ClearResponseCodeAndJSON(g_objGetUpgradeOptionsAPIPacket);
					g_objScriptAPIHandler.InvokeReSTfulAPI(g_objGetUpgradeOptionsAPIPacket);
				}
				else
				{
					g_objGetUpgradeOptionsAPIPacket.m_bResponseReceived = true;
				}
					
				if(g_objGetDowngradeOptionsAPIPacket.m_bResponseReceived)
				{
					ClearResponseCodeAndJSON(g_objGetDowngradeOptionsAPIPacket);
					g_objScriptAPIHandler.InvokeReSTfulAPI(g_objGetDowngradeOptionsAPIPacket);
				}
				else
				{
					g_objGetDowngradeOptionsAPIPacket.m_bResponseReceived = true;
				}
			}
			
			if(g_iPrefetchingStepsCompleted == 2)
			{
				if(g_objGetCommercialPresentProductPriceAPIPacket.m_bResponseReceived)
				{
					ClearResponseCodeAndJSON(g_objGetCommercialPresentProductPriceAPIPacket);
					g_objScriptAPIHandler.InvokeReSTfulAPI(g_objGetCommercialPresentProductPriceAPIPacket);
				}
				else
				{
					g_objGetCommercialPresentProductPriceAPIPacket.m_bResponseReceived = true;
				}
			}
			
			g_bHault = false;
		}
			
		if(GUI.Button(Rect(0 + Screen.width/2 + Screen.width/27,0+Screen.height/1.125 - Screen.height/5,Screen.width/4.5,Screen.height/10),strButtonTwo))
		{
			Application.Quit();
		}
		GUI.EndGroup();
	}
}
*/

function SkinButtonAsATextfield()
{
	m_skinLoginTextfields.button.fontSize 				=	Screen.width/30.0;
	m_skinLoginTextfields.button.contentOffset.x		=	Screen.width/45.0;
}

function AssignMaskedPassword(iLength : int)
{
	m_strMaskedPassword = "";
	
	for(var i=0; i < iLength; i++)
	{
		m_strMaskedPassword += "*";
	}
}

function DeleteCachedDetails()
{
	if(PlayerPrefs.HasKey("EPGAllChannelsList"))
	{
		PlayerPrefs.DeleteKey("EPGAllChannelsList");
	}
}

function TakeMeHome()
{
	Constants.UserId	=	PlayerPrefs.GetString("EmailId");
	Application.LoadLevel("SceneHomePage");
}
function TrackEvent(strClickedOn : String)
{
	yield WaitForSeconds(0.1);
	tracking(strClickedOn);
}
//9edgcoigpu
//function Identify(strCustomerId : String)
//{
//	var objHeaders : Hashtable = new Hashtable();
//	objHeaders.Add("Content-Type","application/json");
//	
//	var strInput = "{\"secret\":\"9edgcoigpu\",\"userId\":\"" + strCustomerId + "\"}";
//	var body : byte[] = System.Text.Encoding.ASCII.GetBytes(strInput);
//	
//	var objWWWReq : WWW = new WWW("https://api.segment.io/v1/identify",body,objHeaders);
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
function Identify(strClickedOn : String) {
	var objHeaders : Hashtable = new Hashtable();
	objHeaders.Add("Content-Type","application/json");
	var customerId = PlayerPrefs.GetString("CustomerId");
	var emailId = PlayerPrefs.GetString("EmailId");
	var balance = PlayerPrefs.GetString("Balance");
	var presentPackageId = PlayerPrefs.GetString("PresentPackageId");
	var nextRechargeDate = PlayerPrefs.GetString("NextRechargeDate");
	var userName = PlayerPrefs.GetString("Name");
	//var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"email\":\"" + emailId + "\",\"balance\":\"" + balance +"\",\"nextRechargeDate\":\"" + nextRechargeDate +"\"}";
	var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"traits\":{\"email\":\"" + emailId + "\",\"balance\":\""+balance +"\",\"createdAt\":\"" + nextRechargeDate +"\",\"title\":\"" + presentPackageId +"\",\"username\":\"" + userName +"\",\"Name\":\"" + strClickedOn + "\"}}";
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
	//var balance = "199.00";
	
	objHeaders.Add("Content-Type","application/json");
	var presentPackageId = PlayerPrefs.GetString("PresentPackageId");
	var PresentPackageName = PlayerPrefs.GetString("PresentPackageName");
	var customerId = PlayerPrefs.GetString("CustomerId");
	var emailId = PlayerPrefs.GetString("EmailId");
	var balance = PlayerPrefs.GetString("Balance");
	var nextRechargeDate = PlayerPrefs.GetString("NextRechargeDate");
	var userName = PlayerPrefs.GetString("Name");
	
	Debug.Log("customerId :"+customerId);
	
	var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" +customerId + "\",\"properties\":{\"balance\":\"" + balance + "\",\"Name\":\"" + strClickedOn + "\"},\"event\":\"" + strClickedOn + "\"}";
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
