#pragma strict

var g_texLogo			: 	Texture2D;
var g_texLightViolet	:	Texture2D;
var g_texDarkViolet		:	Texture2D;
var g_texPicture		:	Texture2D;
var g_texWhite			:	Texture2D;
var g_texD2Hicon		: 	Texture2D;
var g_texBalance		:	Texture2D;
var g_texPackage		:	Texture2D;
var g_texTVguide		:	Texture2D;
var g_texCinema			:	Texture2D;

//variables to be displayed on HomePage Screen
var g_strText			:	String[];
var g_strName			:	String;
var m_strCustomerId		:	String;
var g_strPackage		:	String;
var g_strBalance		:	String;
var g_strRemainingDays	:	String;
var g_strNextRechargeDate : String;
//~variables

var g_skinWelcome		:	GUISkin;
var g_skinProfileID		:	GUISkin;
var g_skinProfilePic	:	GUISkin;
var g_SkinUserName		:	GUISkin;
var g_skinPackage		:	GUISkin;
var g_skinPackageDeals	:	GUISkin;
var g_skinBalance		:	GUISkin;
var g_skinD2hCinema		: 	GUISkin;
var g_Skin 				: 	GUISkin;
var g_skinTVGuide 		: 	GUISkin;
var g_skinAddOns		:	GUISkin;
var g_skinDays			:  	GUISkin;
var g_skinNeedHelp		:	GUISkin;
var g_skinMyd2h			:	GUISkin;

var m_fGUILogoHeight	:	float;
var m_fGUILogoWidth		:	float;

var m_fGAPX				:	float;
var m_fGAPY				:	float;

var m_fSmallGUIElementWidth			:	float;
var m_fNormalGUIElementWidth		:	float;

var m_fLargeGUIElementHeight		:	float;
var m_fLargeGUIElementHeight_I		:	float;
var m_fLargeGUIElementHeight_II		:	float;

var m_fNormalGUIElementHeight		:	float;
var m_fNormalGUIElementHeight_I		:	float;
var m_fNormalGUIElementHeight_II	:	float;
var m_trackCounter 					:	int;
public static var g_iActiveScreenId	:	int;

function Start ()
{	
	m_trackCounter = 0;
	m_strCustomerId = PlayerPrefs.GetString("CustomerId");
	g_strName = PlayerPrefs.GetString("Name");
	g_strPackage = PlayerPrefs.GetString("PresentPackageName");
	g_strBalance = PlayerPrefs.GetString("Balance");
	g_strNextRechargeDate = PlayerPrefs.GetString("NextRechargeDate");
	
	//	logo image aspect ratio : 4/1
	//	1+4+1 Grids/Rows to be made:	EmptyHeader | Logo | EmailID | Password | Buttons | EmptyFooter
	m_fGUILogoHeight = Screen.height/5;
	
	//thus the width must be such width:height = 7/2, ie width = (7/2)*height
	m_fGUILogoWidth = 890*m_fGUILogoHeight/249;
	
	//scale down
	m_fGUILogoHeight = 0.75*m_fGUILogoHeight;
	m_fGUILogoWidth = 0.75*m_fGUILogoWidth;
	
	//Logo is 1/2 of the textfield's width
	//m_fGUIElementWidth = 2.25*m_fGUILogoWidth;
	//m_fGUIElementHeight = 1.5*m_fGUILogoHeight;
	
	//Gap between controls | GUI Elements
	m_fGAPX = 0.005 * Screen.width;
	m_fGAPY = 0.01 * Screen.height;
	
	m_fSmallGUIElementWidth		 = 0.24375 * Screen.width;
	m_fNormalGUIElementWidth 	 = 0.4925 * Screen.width;
	
	m_fLargeGUIElementHeight	 = 0.32 * Screen.height;	
	m_fLargeGUIElementHeight_I	 = 0.21 * Screen.height;
	m_fLargeGUIElementHeight_II	 = 0.11 * Screen.height;
	
	m_fNormalGUIElementHeight	 = 0.21 * Screen.height;
	m_fNormalGUIElementHeight_I	 = 0.14 * Screen.height;
	m_fNormalGUIElementHeight_II = 0.07 * Screen.height;
	
	
	//Wish Good Morning | Good Afternoon | Good Evening
	WishUser();
}

function Update ()
{
	if (Input.GetKeyDown(KeyCode.Escape))
	{
		//PlayerPrefs.SetInt("ActiveScreenId",6);
		g_iActiveScreenId	=	6;
		PlayerPrefs.SetString("HeaderTitle","Logout");
		Application.LoadLevel("SceneLogout");//Application.Quit();
	}
}

function OnGUI ()
{	
//	var index : int = Time.time;
    
//    if(index % 2 == 0)
//    {
		RenderUIForIPHONE();
		if(m_trackCounter == 0){
			m_trackCounter++;
			tracking("Home");
			
		} else if(m_trackCounter == 1){
			m_trackCounter++;
			Identify();
			
		}
//	}
//	else
//	{
//		RenderUIForIPAD();
//	}
}

function RenderUIForIPHONE()
{
	//tracking("HOME_PAGE");
	
	GUI.BeginGroup(Rect(m_fGAPX,m_fGAPY,Screen.width,Screen.height),"");

//1st row	
	//1st Column >> Logo
	GUI.DrawTexture(Rect(m_fNormalGUIElementWidth/2 - m_fGUILogoWidth/2,m_fLargeGUIElementHeight/2 - m_fGUILogoHeight/2,m_fGUILogoWidth,m_fGUILogoHeight),g_texLogo); // for d2h LOGO
		
	//2nd Column >> welcome screen
	g_skinWelcome.button.fontSize = Mathf.Min(m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_I)/4.5;
	GUI.Label(Rect(m_fNormalGUIElementWidth + m_fGAPX,0,m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_I),g_strText[0],g_skinWelcome.button); // Welcome button
	
	g_skinProfileID.label.fontSize = Mathf.Min(m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_II)/2.5;
	//g_skinProfileID.label.fontStyle = FontStyle.Bold;
	GUI.Label(Rect(m_fNormalGUIElementWidth + m_fGAPX,m_fLargeGUIElementHeight_I,m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_II),m_strCustomerId,g_skinProfileID.label); // PROFILE ID
	
	//3rd Column >> Profile picture of the user
	GUI.Label(Rect(m_fNormalGUIElementWidth + 2*m_fGAPX + m_fSmallGUIElementWidth,0,m_fSmallGUIElementWidth,m_fLargeGUIElementHeight),g_texPicture,g_skinProfilePic.label);// for profile picture
	
	g_SkinUserName.label.fontSize = Mathf.Min(m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_I)/4.5;
	GUI.Label(Rect(m_fNormalGUIElementWidth + 2*m_fGAPX + m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_I,m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_II),g_strName,g_SkinUserName.label);//facebook user name

//2nd row	
	//1st Column >> package
	g_skinPackage.button.fontSize = Mathf.Min(m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_I)/4.5;
	g_skinPackage.button.padding.top	=	m_fNormalGUIElementHeight_I/10.0;
	g_skinPackage.button.padding.bottom	=	m_fNormalGUIElementHeight_I/10.0;
	var contentsBalance : GUIContent = new GUIContent(g_strText[1],g_texPackage);
	if(GUI.Button(Rect(0,m_fLargeGUIElementHeight + m_fGAPY,m_fNormalGUIElementWidth,m_fNormalGUIElementHeight_I),contentsBalance,g_skinPackage.button))// string which says "Package"
	{	//tracking(g_strText[1]);
		//PlayerPrefs.SetInt("ActiveScreenId",5);
		//TE("Home->Package");
		g_iActiveScreenId	=	5;
		Application.LoadLevel("ScenePackage");
	}
	
	g_skinPackageDeals.label.fontSize = Mathf.Min(m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_II)/2.5;
	//g_skinPackageDeals.label.fontStyle = FontStyle.Bold;
	GUI.Label(Rect(0,m_fLargeGUIElementHeight + m_fGAPY + m_fNormalGUIElementHeight_I,m_fNormalGUIElementWidth,m_fNormalGUIElementHeight_II),g_strPackage, g_skinPackageDeals.label);// for deals
		
	//2nd Column >> Balance
	g_skinBalance.button.fontSize = Mathf.Min(m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_I)/4.5;
	g_skinBalance.button.padding.top	=	m_fNormalGUIElementHeight_I/10.0;
	g_skinBalance.button.padding.bottom	=	m_fNormalGUIElementHeight_I/10.0;
	var contentBalance : GUIContent = new GUIContent(g_strText[2],g_texBalance);
	if(GUI.Button(Rect(m_fNormalGUIElementWidth + m_fGAPX,m_fLargeGUIElementHeight + m_fGAPY,m_fNormalGUIElementWidth,m_fNormalGUIElementHeight_I),contentBalance,g_skinBalance.button))//button for balance
	{
		//tracking(g_strText[2]);
		//PlayerPrefs.SetInt("ActiveScreenId",3);
		//TE("Home->Balance");
		g_iActiveScreenId	=	3;
		Application.LoadLevel("SceneBalance");
	}
	g_skinBalance.label.fontSize = Mathf.Min(m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_II)/2.5;
	GUI.Label(Rect(m_fNormalGUIElementWidth + m_fGAPX,m_fLargeGUIElementHeight + m_fGAPY + m_fNormalGUIElementHeight_I,m_fNormalGUIElementWidth,m_fNormalGUIElementHeight_II),"INR " +g_strBalance, g_skinBalance.label);// common skin for price

//3rd row		
	//1st column
	g_skinD2hCinema.button.fontSize = Mathf.Min(m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_I)/4.5;
	g_skinD2hCinema.button.padding.top		=	m_fNormalGUIElementHeight/4.5;
	g_skinD2hCinema.button.padding.bottom	=	m_fNormalGUIElementHeight/4.5;
	var contentsD2hCinema : GUIContent = new GUIContent(g_strText[3],g_texCinema);
	if(GUI.Button(Rect(0,m_fLargeGUIElementHeight + 2*m_fGAPY + m_fNormalGUIElementHeight,m_fNormalGUIElementWidth,m_fNormalGUIElementHeight),contentsD2hCinema,g_skinD2hCinema.button))// d2h cinema Text
	{	
		//tracking(g_strText[3]);
		//PlayerPrefs.SetInt("ActiveScreenId",2);
		//TE("Home->D2HCinema");
		g_iActiveScreenId	=	2;
		PlayerPrefs.SetInt("RenderVideoPlayer",1);
		Application.LoadLevel("SceneChannelSelection");
	}
	
	//2nd column
	g_skinTVGuide.button.fontSize = Mathf.Min(m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_I)/4.5;
	g_skinTVGuide.button.padding.top	=	m_fNormalGUIElementHeight/4.5;
	g_skinTVGuide.button.padding.bottom	=	m_fNormalGUIElementHeight/4.5;
	var contentsTVGuide : GUIContent = new GUIContent(g_strText[4],g_texTVguide);	
	if(GUI.Button(Rect(m_fNormalGUIElementWidth + m_fGAPX,m_fLargeGUIElementHeight + 2*m_fGAPY + m_fNormalGUIElementHeight,m_fNormalGUIElementWidth,m_fNormalGUIElementHeight),contentsTVGuide,g_skinTVGuide.button))// for TV Guide Button
	{
		//tracking(g_strText[4]);
		//PlayerPrefs.SetInt("ActiveScreenId",1);
		//TE("Home->Program Guide");
		g_iActiveScreenId	=	1;
		PlayerPrefs.SetInt("RenderVideoPlayer",0);
		Application.LoadLevel("SceneChannelSelection");
	}

//4th row	
	//1st column >> Add Ons
	g_skinAddOns.button.fontSize = Mathf.Min(m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_I)/4.5;
	if(GUI.Button(Rect(0,m_fLargeGUIElementHeight + 3*m_fGAPY + 2*m_fNormalGUIElementHeight,m_fSmallGUIElementWidth,m_fNormalGUIElementHeight),g_strText[5],g_skinAddOns.button))// for Add on button
	{
		//tracking(g_strText[5]);
		//PlayerPrefs.SetInt("ActiveScreenId",-1);
		//TE("Home->AddOns");
		g_iActiveScreenId	=	-1;
		Application.LoadLevel("SceneAddOns");
	}
	
	//2nd Column >> Recharge
	g_skinDays.button.fontSize = Mathf.Min(m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_I)/4.5;
	if(GUI.Button(Rect(0 + m_fGAPX + m_fSmallGUIElementWidth,m_fLargeGUIElementHeight + 3*m_fGAPY + 2*m_fNormalGUIElementHeight,m_fSmallGUIElementWidth,m_fNormalGUIElementHeight_I),g_strText[6],g_skinDays.button))	// similar skin is used for Recharge Button			
	{	//PlayerPrefs.SetInt("ActiveScreenId",3);
		//TE("Home->Recharge");
		g_iActiveScreenId	=	3;
		Application.LoadLevel("sceneRecharge");
	}
	
	g_skinDays.label.fontSize = Mathf.Min(m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_II)/3.0;
	//g_skinDays.button.fontStyle = FontStyle.Bold;
	GUI.Label(Rect(0 + m_fGAPX + m_fSmallGUIElementWidth,m_fLargeGUIElementHeight + 3*m_fGAPY + 2*m_fNormalGUIElementHeight + m_fNormalGUIElementHeight_I,m_fSmallGUIElementWidth,m_fNormalGUIElementHeight_II),"by "+g_strNextRechargeDate, g_skinDays.label);//for reamining days
	
	//3rd Column >> Need Help
	g_skinNeedHelp.button.fontSize = Mathf.Min(m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_I)/4.5;	
	if(GUI.Button(Rect(0 + 2*m_fGAPX + 2*m_fSmallGUIElementWidth,m_fLargeGUIElementHeight + 3*m_fGAPY + 2*m_fNormalGUIElementHeight,m_fSmallGUIElementWidth,m_fNormalGUIElementHeight),g_strText[7],g_skinNeedHelp.button)) // for need help button
	{	//PlayerPrefs.SetInt("ActiveScreenId",4);
		//TE("Home->Need Help");
		g_iActiveScreenId	=	4;
		Application.LoadLevel("SceneHelp");
	}
	
	//4th Column >> my D2h
	g_skinMyd2h.button.fontSize = Mathf.Min(m_fSmallGUIElementWidth,m_fLargeGUIElementHeight_I)/4.5;
	g_skinMyd2h.button.padding.top		=	m_fNormalGUIElementHeight/4.5;
	g_skinMyd2h.button.padding.bottom	=	m_fNormalGUIElementHeight/4.5;
	g_skinMyd2h.button.padding.left		=	m_fNormalGUIElementHeight/9.0;
	g_skinMyd2h.button.padding.right	=	m_fNormalGUIElementHeight/9.0;
	//var contentsMyD2H : GUIContent = new GUIContent("my",g_texD2Hicon);					
	if(GUI.Button(Rect(0 + 3*m_fGAPX + 3*m_fSmallGUIElementWidth,m_fLargeGUIElementHeight + 3*m_fGAPY + 2*m_fNormalGUIElementHeight,m_fSmallGUIElementWidth,m_fNormalGUIElementHeight),g_texD2Hicon, g_skinMyd2h.button))
	//if(GUI.Button(Rect(0, m_fGAPY, 2*m_fNormalGUIElementWidth, 4*m_fNormalGUIElementHeight),g_texD2Hicon, g_skinMyd2h.button))
	{
		//PlayerPrefs.SetInt("ActiveScreenId",-1);
		//TE("Home->myD2H");
		g_iActiveScreenId	=	-1;
		Application.LoadLevel("SceneMyd2h");
	}
	//GUI.Label(Rect(0 + 3*m_fGAPX + 3*m_fSmallGUIElementWidth,m_fLargeGUIElementHeight + 3*m_fGAPY + 2*m_fNormalGUIElementHeight,m_fSmallGUIElementWidth,m_fNormalGUIElementHeight),, g_skinMyd2h.label);// for d2h icon	
	GUI.EndGroup();
}

function WishUser()
{
	var iCurrentHour = System.DateTime.Now.Hour;
	if(iCurrentHour < 12)
	{
		g_strText[0] = "Good Morning!";
	}
	else if(iCurrentHour > 12 && iCurrentHour < 16)
	{
		g_strText[0] = "Good Afternoon!";
	}
	else
	{
		g_strText[0] = "Good Evening!";
	}
}

//9edgcoigpu LOKESH
//rrenb1jpxo IKN
function Identify() {
	var objHeaders : Hashtable = new Hashtable();
	objHeaders.Add("Content-Type","application/json");
	
	var presentPackageId = PlayerPrefs.GetString("PresentPackageId");
	var presentPackageName = PlayerPrefs.GetString("PresentPackageName");
	var customerId = PlayerPrefs.GetString("CustomerId");
	var emailId = PlayerPrefs.GetString("EmailId");
	var balance = PlayerPrefs.GetString("Balance");
	var nextRechargeDate = PlayerPrefs.GetString("NextRechargeDate");
	var userName = PlayerPrefs.GetString("Name");
	
	var postalCode = PlayerPrefs.GetString("PostalCode");	
	var contact = PlayerPrefs.GetString("RTN1");
	var city = PlayerPrefs.GetString("SmallCity");		
	var state = PlayerPrefs.GetString("State");
	//var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"email\":\"" + emailId + "\",\"balance\":\"" + balance +"\",\"nextRechargeDate\":\"" + nextRechargeDate +"\"}";
	//var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"email\":\"" + emailId + "\",\"balance\":\"" + balance +"\",\"nextRechargeDate\":\"" + nextRechargeDate +"\",\"event\":\"" + strClickedOn + "\"}";
	var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"traits\":{\"Username\":\"" + userName + "\",\"EmailId\":\"" + emailId + "\",\"PresentPackageId\":\"" + presentPackageId + "\","+
	"\"NextRechargeDate\":\"" + nextRechargeDate + "\",\"PresentPackageName\":\"" + presentPackageName + "\","+
	"\"PostalCode\":\"" + postalCode + "\",\"Contact\":\"" + contact + "\","+
	"\"City\":\"" + city + "\",\"State\":\"" + state + "\","+
	"\"Balance\":\"" + balance + "\"}}";
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
	var presentPackageName = PlayerPrefs.GetString("PresentPackageName");
	var customerId = PlayerPrefs.GetString("CustomerId");
	var emailId = PlayerPrefs.GetString("EmailId");
	var balance = PlayerPrefs.GetString("Balance");
	var nextRechargeDate = PlayerPrefs.GetString("NextRechargeDate");
	var userName = PlayerPrefs.GetString("Name");
	
	var postalCode = PlayerPrefs.GetString("PostalCode");	
	var contact = PlayerPrefs.GetString("RTN1");
	var city = PlayerPrefs.GetString("SmallCity");		
	var state = PlayerPrefs.GetString("State");
	
	Debug.Log("customerId :"+customerId);
	
	var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" +customerId + "\",\"properties\":{\"Username\":\"" + userName + "\",\"EmailId\":\"" + emailId + "\",\"PresentPackageId\":\"" + presentPackageId + "\","+
	"\"NextRechargeDate\":\"" + nextRechargeDate + "\",\"PresentPackageName\":\"" + presentPackageName + "\","+
	"\"PostalCode\":\"" + postalCode + "\",\"Contact\":\"" + contact + "\","+
	"\"City\":\"" + city + "\",\"State\":\"" + state + "\","+
	"\"Balance\":\"" + balance + "\"},\"event\":\"" + strClickedOn + "\"}";
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
