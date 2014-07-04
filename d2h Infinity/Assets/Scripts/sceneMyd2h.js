#pragma strict
var m_bRenderUpdateDOBPopUp		:	boolean;
var m_bRenderUpdateAddressPopUp	:	boolean;
var m_bRenderUpdateEmailPopUp	:	boolean;
var m_bRenderUpdateRTNPopUp		:	boolean;
var m_bRenderAPIErrorPrompt		:	boolean;

var m_bCustomerDetailsAvialable	:	boolean;

var m_strCustomerId				:	String;
var m_strFooterNote1			:	String;
var m_strFooterNote2			:	String;

var m_objScriptAPIHandler			:	ScriptAPIHandler;
var m_objCustomerDetailsAPIPacket	:	CWebAPIPacket;
function Start () 
{
	m_strDOB			= "";
	m_strAddress		= "";
	m_strEmailID		= "";
	m_strRTN			= "";
	m_strSecondaryRTN	= "";
	
	m_strFooterNote1	= "";
	m_strFooterNote2	= "";
	
	m_bCustomerDetailsAvialable	=	false;
	
	m_strCustomerId				=	PlayerPrefs.GetString("CustomerId");
	m_objScriptAPIHandler 		=	GetComponent(ScriptAPIHandler);
	FetchCustomerDetails();
	
	m_bRenderUpdateDOBPopUp 	= 	false;
	m_bRenderUpdateAddressPopUp	=	false;
	m_bRenderUpdateEmailPopUp	=	false;
	m_bRenderUpdateRTNPopUp 	= 	false;
	m_bRenderAPIErrorPrompt		=	false;
	tracking("MyD2h");
//	StartCoroutine(TrackEvent(0.1));
}

function FetchCustomerDetails()
{
	var strAPIURL = ScriptAPIs.g_strWebservicesAtD2H + "MobileEPGServices/";
    var strAPIMethod = "MobileEPGService.CustomerService.svc/Method/GetCustomerDetailbyID";
    var strInput = "{\"CustomerId\":\"" + m_strCustomerId + "\"}";
    
    m_objCustomerDetailsAPIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    m_objScriptAPIHandler.InvokeReSTfulAPI(m_objCustomerDetailsAPIPacket);
}

function ProcessCustomerDetailsAPIResponse()	:	int
{
	var iErrorCode	:	int;
	if(m_objCustomerDetailsAPIPacket.m_strResponseCode == "200 OK")
	{
		var N = JSON.Parse(m_objCustomerDetailsAPIPacket.m_strOutput);
		if(N == null)
		{
			m_objCustomerDetailsAPIPacket.m_strErrorMessage	=	"NULL JSON	:	No data available at server.";
			//print(m_objCustomerDetailsAPIPacket.m_strErrorMessage);
			iErrorCode	=	0;
		}
		else
		{
			//Debug.Log("Reassembled: " + N.ToString());
			if(N.ToString() == "{}")
			{
				m_objCustomerDetailsAPIPacket.m_strErrorMessage	=	"Empty JSON	:	No data available at server.";
				//print(m_objCustomerDetailsAPIPacket.m_strErrorMessage);
				iErrorCode	=	0;
			}
			else
			{
				//parsing
				
				//hardcoding
				m_strDOB			= N["GetCustomerDetailByIDResult"]["DateofBirth"];
				m_strAddress		= N["GetCustomerDetailByIDResult"]["Street"];
				m_strAddress		= m_strAddress + ", " + N["GetCustomerDetailByIDResult"]["SmallCity"];
				m_strAddress		= m_strAddress + ", " + N["GetCustomerDetailByIDResult"]["BigCity"];
				m_strAddress		= m_strAddress + ", " + N["GetCustomerDetailByIDResult"]["State"];
				m_strEmailID		= N["GetCustomerDetailByIDResult"]["InternetUserIs"];
				
				if(m_strEmailID == null)
				{
					m_strEmailID	=	PlayerPrefs.GetString("EmailId");
				}
				m_strRTN			= N["GetCustomerDetailByIDResult"]["RTN1"];
				m_strSecondaryRTN	= N["GetCustomerDetailByIDResult"]["RTN2"];
				
				iErrorCode	= 200;
			}
		}
	}
	else
	{
		m_objCustomerDetailsAPIPacket.m_strErrorMessage	=	"Connection Error : " + m_objCustomerDetailsAPIPacket.m_strResponseCode;
		//print(m_objCustomerDetailsAPIPacket.m_strErrorMessage);
		
		iErrorCode	=	300;
	}
	
	m_objCustomerDetailsAPIPacket.m_bResponseReceived 	= 	false;
	return iErrorCode;
}

function Update () 
{ 
	if(Input.GetKeyDown(KeyCode.Escape))
	{
		if(m_bRenderUpdateDOBPopUp || m_bRenderUpdateAddressPopUp || m_bRenderUpdateEmailPopUp || m_bRenderUpdateRTNPopUp)
		{
			m_bRenderUpdateDOBPopUp 	= false;
			m_bRenderUpdateAddressPopUp = false;
			m_bRenderUpdateEmailPopUp	= false;
			m_bRenderUpdateRTNPopUp		= false;
		}
		else
		{
			Application.LoadLevel("SceneHomePage");
		}
	}
}

function OnGUI ()
{
	if(m_bCustomerDetailsAvialable == false)
	{
		GUI.enabled	=	false;
		if(m_objCustomerDetailsAPIPacket.m_bResponseReceived)
		{
			var iErrorCode : int = ProcessCustomerDetailsAPIResponse();
			
			if(iErrorCode != 200)
			{
				m_bRenderAPIErrorPrompt = true;
			}
			m_bCustomerDetailsAvialable	=	true;
		}
	}
	
	if(m_bRenderUpdateDOBPopUp || m_bRenderUpdateAddressPopUp || m_bRenderUpdateEmailPopUp || m_bRenderUpdateRTNPopUp || m_bRenderAPIErrorPrompt)
	{
		GUI.enabled	=	false;
	}
	RenderMyD2HScreenForIPHONE();
	
	GUI.enabled	=	true;
	
	if(m_bRenderAPIErrorPrompt)
	{
		GUI.ModalWindow(0,Rect(0.0, m_fHeightHeader, Screen.width, Screen.height - 2.0*m_fHeightHeader), RenderAPIErrorPrompt, "", m_skinMyD2HScreen.window);
	}
	
	if(m_bRenderUpdateDOBPopUp)
	{
		GUI.ModalWindow(0,Rect(Screen.width/2.0 - m_fWidthPopup/2.0, Screen.height/2.0 - m_fHeightPopup/2.0, m_fWidthPopup, m_fHeightPopup), RenderUpdateDOBPopUp, "", m_skinMyD2HScreen.window);
	}
	
	if(m_bRenderUpdateAddressPopUp)
	{
		GUI.ModalWindow(0,Rect(Screen.width/2.0 - m_fWidthPopup/2.0, Screen.height/2.0 - m_fHeightPopup/2.0, m_fWidthPopup, m_fHeightPopup), RenderUpdateAddressPopUp, "", m_skinMyD2HScreen.window);
	}
	
	if(m_bRenderUpdateEmailPopUp)
	{
		GUI.ModalWindow(0,Rect(Screen.width/2.0 - m_fWidthPopup/2.0, Screen.height/2.0 - m_fHeightPopup/2.0, m_fWidthPopup, m_fHeightPopup), RenderUpdateEmailPopUp, "", m_skinMyD2HScreen.window);
	}
	
	if(m_bRenderUpdateRTNPopUp)
	{
		GUI.ModalWindow(0,Rect(Screen.width/2.0 - m_fWidthPopup/2.0, Screen.height/2.0 - m_fHeightPopup/2.0, m_fWidthPopup, m_fHeightPopup), RenderUpdateRTNPopUp, "", m_skinMyD2HScreen.window);
	}
	
	if(m_bCustomerDetailsAvialable == false)
	{
		GUI.depth = 1;
		GUI.Box(Rect(0,m_fHeightHeader,Screen.width,Screen.height - 2*m_fHeightHeader),"",m_skinRefreshButton.box);
		RenderPleaseWaitSplash(Screen.width/2.0, Screen.height/2.0);
	}
}

var m_fDeltaAngleOfRotation			:	float;
var m_skinRefreshButton				:	GUISkin;
function RenderPleaseWaitSplash(fX	:	float, fY	:	float)
{
	var v2PivotPoint :	Vector2		=	Vector2(fX,fY);
	GUIUtility.RotateAroundPivot (m_fDeltaAngleOfRotation, v2PivotPoint); 
	GUI.Label(Rect(fX - 48.0,fY - 48.0, 96.0, 96.0),"",m_skinRefreshButton.label);
	GUIUtility.RotateAroundPivot (0, v2PivotPoint); 
	m_fDeltaAngleOfRotation += 1.5;
}

var m_fHeightHeader				:	float;
var m_fHeightDiv				:	float;
var m_fWidthDOBDiv				:	float;
var m_fWidthAddressDiv			:	float;
var m_fWidthEmailDiv			:	float;
var m_fWidthRTNDiv				:	float;

var m_fGapX						:	float;
var m_fGapY						:	float;

var m_fWidthPopup				:	float;
var m_fHeightPopup				:	float;

var m_strDOB					:	String;
var m_strAddress				:	String;
var m_strEmailID				:	String;
var m_strRTN					:	String;
var m_strSecondaryRTN			:	String;

var m_skinMyD2HScreen			:	GUISkin;

var m_fontRegular				:	Font;
var m_fontBold					:	Font;

var m_tex2DPurple				:	Texture2D;
var m_tex2DLightPurple			:	Texture2D;
var m_tex2DOrange				:	Texture2D;
var m_tex2DWhite				:	Texture2D;
var m_tex2DPopupBackground		:	Texture2D;

var m_tex2DCake					:	Texture2D;
var m_tex2DHut					:	Texture2D;
var m_tex2DPurpleHut			:	Texture2D;
var m_tex2DLetter				:	Texture2D;
var m_tex2DIPhone				:	Texture2D;
var m_tex2DPurpleIPhone			:	Texture2D;
var m_tex2DServerError			:	Texture2D;

var m_objKeyboardEmailID		:	TouchScreenKeyboard;
var m_objKeyboardRTN1			:	TouchScreenKeyboard;
var m_objKeyboardRTN2			:	TouchScreenKeyboard;

function RenderMyD2HScreenForIPHONE()
{
	var fUnitX	:	float	=	Screen.width/22.6;
	var fUnitY	:	float	=	Screen.height/12.8;
	
	m_fWidthDOBDiv			=	10.15*fUnitX;
	m_fWidthAddressDiv		=	12.15*fUnitX;
	m_fWidthEmailDiv		=	11.15*fUnitX;
	m_fWidthRTNDiv			=	11.15*fUnitX;
	m_fGapX					=	00.1*fUnitX;
	
	m_fHeightHeader		 	=	1.3*fUnitY;
	m_fHeightDiv			=	4.95*fUnitY;
	m_fGapY					=	0.1*fUnitY;
		
	m_fWidthPopup			=	0.8*Screen.width;
	m_fHeightPopup			=	0.8*Screen.height;

	GUI.skin				=	m_skinMyD2HScreen;
	//*************************	Header	***********************//
	GUI.BeginGroup(Rect(0,0,Screen.width,m_fHeightHeader));
		
		m_skinMyD2HScreen.box.alignment			= TextAnchor.MiddleCenter;
		m_skinMyD2HScreen.box.normal.background = m_tex2DPurple;
		m_skinMyD2HScreen.box.normal.textColor  = Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinMyD2HScreen.box.fontSize 			= Mathf.Min(Screen.width,m_fHeightHeader)/1.5;
		m_skinMyD2HScreen.box.font				= m_fontRegular;	
		GUI.Box(Rect(0,0,Screen.width,m_fHeightHeader),"My d2h");
	GUI.EndGroup();
	
	//*************************	Date of Birth DIV	***********************//
	GUI.BeginGroup(Rect(0 + m_fGapX, m_fHeightHeader + m_fGapY, m_fWidthDOBDiv, m_fHeightDiv));
		
		/*m_skinMyD2HScreen.button.normal.background 	=	m_tex2DWhite;
		m_skinMyD2HScreen.button.normal.textColor 	=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
		m_skinMyD2HScreen.button.hover.background 	=	null;
		m_skinMyD2HScreen.button.active.background 	=	null;
		m_skinMyD2HScreen.button.fontSize 			=	Mathf.Min(Screen.width,m_fHeightHeader)/1.75;
		m_skinMyD2HScreen.button.font				=	m_fontRegular;
		m_skinMyD2HScreen.button.alignment			=	TextAnchor.MiddleCenter;*/
		SkinButtonAsATile(m_tex2DWhite);
		
		var guicontentsDOBButton	:	GUIContent	=	new GUIContent("Date of Birth",m_tex2DCake);
		if(GUI.Button(Rect(0, 0, m_fWidthDOBDiv, m_fHeightDiv),guicontentsDOBButton))
		{
			//m_bRenderUpdateDOBPopUp = true;
		}
		
		m_skinMyD2HScreen.box.fontSize	=	Mathf.Min(Screen.width,m_fHeightHeader)/2.5;
		m_skinMyD2HScreen.box.font	=	m_fontBold;
		GUI.Box(Rect(0, 4*m_fHeightDiv/5.0, m_fWidthDOBDiv, m_fHeightDiv/5.0),m_strDOB);
	GUI.EndGroup();
	
	//*************************	Address DIV	***********************//
	GUI.BeginGroup(Rect(0 + m_fGapX + m_fWidthDOBDiv + m_fGapX, m_fHeightHeader + m_fGapY, m_fWidthAddressDiv, m_fHeightDiv));
		
		//m_skinMyD2HScreen.button.normal.background = m_tex2DLightPurple;
		var strAddress	:	String	=	m_strAddress;
		SkinButtonAsAButton(m_tex2DLightPurple);
		var guicontentsAddressButton	:	GUIContent = new GUIContent("Address",m_tex2DHut);
		if(GUI.Button(Rect(0, 0, m_fWidthAddressDiv, m_fHeightDiv),guicontentsAddressButton))
		{
			tracking("MyD2H -> View Address");
			m_bRenderUpdateAddressPopUp	=	true;
		}
		
		if(strAddress.Length > 30)
		{
			strAddress	=	strAddress.Substring(0,35) + "...";
		}
	//
		//(strAddres)
		m_skinMyD2HScreen.box.normal.background = m_tex2DPurple;
		GUI.Box(Rect(0, 4*m_fHeightDiv/5.0, m_fWidthAddressDiv, m_fHeightDiv/5.0),strAddress);
	GUI.EndGroup();
	
	//*************************	Email DIV	***********************//
	GUI.BeginGroup(Rect(0 + m_fGapX, m_fHeightHeader + m_fGapY + m_fHeightDiv + m_fGapY, m_fWidthEmailDiv, m_fHeightDiv));
		
		//m_skinMyD2HScreen.button.normal.background = m_tex2DWhite;
		//m_skinMyD2HScreen.button.normal.textColor = Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
		SkinButtonAsATile(m_tex2DWhite);
		var guicontentsEmailButton	:	GUIContent = new GUIContent("Email",m_tex2DLetter);
		if(GUI.Button(Rect(0, 0, m_fWidthEmailDiv, m_fHeightDiv),guicontentsEmailButton))
		{
				//m_bRenderUpdateEmailPopUp	=	true;
		}
		
		m_skinMyD2HScreen.box.normal.background = m_tex2DPurple;
		GUI.Box(Rect(0, 4*m_fHeightDiv/5.0, m_fWidthEmailDiv, m_fHeightDiv/5.0),m_strEmailID);
	GUI.EndGroup();
	
	//*************************	RTN DIV	***********************//
	GUI.BeginGroup(Rect(0 + m_fGapX + m_fWidthEmailDiv + m_fGapX, m_fHeightHeader + m_fGapY + m_fHeightDiv + m_fGapY, m_fWidthRTNDiv, m_fHeightDiv));
		
		/*m_skinMyD2HScreen.button.normal.background 	= 	m_tex2DLightPurple;
		m_skinMyD2HScreen.button.normal.textColor	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinMyD2HScreen.button.hover.background 	=	m_tex2DOrange;
		m_skinMyD2HScreen.button.hover.textColor	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinMyD2HScreen.button.active.background 	=	m_tex2DOrange;
		m_skinMyD2HScreen.button.active.textColor	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);*/
		SkinButtonAsAButton(m_tex2DLightPurple);
		var guicontentsRTNButton	:	GUIContent = new GUIContent("Update RTN\nSecondary RTN",m_tex2DIPhone);
		if(GUI.Button(Rect(0, 0, m_fWidthRTNDiv, m_fHeightDiv),guicontentsRTNButton))
		{
			tracking("MyD2H -> Update RTN");
			m_bRenderUpdateRTNPopUp = true;
		}
		//Identify(m_strRTN , m_strSecondaryRTN);
		GUI.Box(Rect(0, 4*m_fHeightDiv/5.0, m_fWidthRTNDiv, m_fHeightDiv/5.0),m_strRTN +"  "+ m_strSecondaryRTN);
	GUI.EndGroup();
}

function RenderAPIErrorPrompt(iWindowID : int)
{
	var	fWidthPopup		:	float	=	Screen.width;
	var	fHeightPopup	:	float	=	Screen.height	-	2.0*m_fHeightHeader;
	
	m_skinMyD2HScreen.box.fontSize 					=	Mathf.Min(0.8*fWidthPopup,fHeightPopup/3.0)/4.0;
	m_skinMyD2HScreen.box.alignment					=	TextAnchor.MiddleLeft;
	m_skinMyD2HScreen.box.normal.background			=	null;
	m_skinMyD2HScreen.box.normal.textColor			=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	
	var guicontentsPromptTitle	:	GUIContent 		=	new GUIContent("Server Error",m_tex2DServerError);
	GUI.Box(Rect(0.1*fWidthPopup,0,0.8*fWidthPopup,fHeightPopup/3.0),guicontentsPromptTitle);

	m_skinMyD2HScreen.label.fontSize 				=	Mathf.Min(0.8*fWidthPopup,fHeightPopup/3.0)/5.0;
	m_skinMyD2HScreen.label.alignment				=	TextAnchor.UpperLeft;
	m_skinMyD2HScreen.label.normal.background		=	null;
	m_skinMyD2HScreen.label.normal.textColor		=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
	
	GUI.Label(Rect(0.1*fWidthPopup,0.67*fHeightPopup/3.0 + fHeightPopup/12.0,0.8*fWidthPopup,fHeightPopup/3.0),m_objCustomerDetailsAPIPacket.m_strErrorMessage);
	
	SkinButtonAsAButton(m_tex2DPurple);
	if(GUI.Button(Rect(0.57*fWidthPopup,2*fHeightPopup/3.0 + fHeightPopup/12.0,0.33*fWidthPopup,fHeightPopup/6.0),"OK"))
	{
		Application.LoadLevel("SceneHomePage");
	}
	
	//close button
	//RenderCloseButton(0);
}

var m_bDisplayDOBScroll	:	boolean[];
var m_strDOBFormat		:	String[];	//02|Oct|1985

function RenderUpdateDOBPopUp(iWindowID : int)
{
	m_skinMyD2HScreen.box.fontSize 					=	Mathf.Min(0.8*m_fWidthPopup,m_fHeightPopup/3.0)/3.0;
	m_skinMyD2HScreen.box.alignment					=	TextAnchor.LowerLeft;
	m_skinMyD2HScreen.box.normal.background			=	null;
	m_skinMyD2HScreen.box.normal.textColor			=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	
	var guicontentsDOBButton	:	GUIContent = new GUIContent("Date of Birth",m_tex2DCake);
	GUI.Box(Rect(0.1*m_fWidthPopup,0,0.8*m_fWidthPopup,m_fHeightPopup/3.0),guicontentsDOBButton);

	SkinTextfieldAsATextfield();	
	m_strDOB = GUI.TextField(Rect(0.1*m_fWidthPopup,m_fHeightPopup/3.0 + m_fHeightPopup/12.0,0.8*m_fWidthPopup,m_fHeightPopup/6.0),m_strDOB);
	
/*	
	SkinButtonAsATextfield();
	if(GUI.Button(Rect(0.1*m_fWidthPopup,m_fHeightPopup/3.0 + m_fHeightPopup/12.0,0.25*m_fWidthPopup,m_fHeightPopup/6.0),m_strDOBFormat[0]))
	{
		m_bDisplayDOBScroll[0]	=	!m_bDisplayDOBScroll[0];
	}
	if(m_bDisplayDOBScroll[0])//display list of dates : vertical grid 1 to 31
	{
		var iDate	=	RenderDates();
		if(iDate > 0)
		{
			m_strDOBFormat[0]	=	iDate.ToString();
			m_bDisplayDOBScroll[0] = false;
		}
	}
	
	if(GUI.Button(Rect(0.1*m_fWidthPopup + 0.25*m_fWidthPopup + 0.01*m_fWidthPopup,m_fHeightPopup/3.0 + m_fHeightPopup/12.0,0.25*m_fWidthPopup,m_fHeightPopup/6.0),m_strDOBFormat[1]))
	{
		m_bDisplayDOBScroll[1]	=	!m_bDisplayDOBScroll[1];
	}
	if(m_bDisplayDOBScroll[1])//display list of month : vertical grid Jan to Dec
	{
		var iMonth	=	RenderMonths();
		if(iMonth > 0)
		{
			m_strDOBFormat[1]	=	iMonth.ToString();
			m_bDisplayDOBScroll[1] = false;
		}
	}
	
	if(GUI.Button(Rect(0.1*m_fWidthPopup + 0.50*m_fWidthPopup + 0.02*m_fWidthPopup,m_fHeightPopup/3.0 + m_fHeightPopup/12.0,0.25*m_fWidthPopup,m_fHeightPopup/6.0),m_strDOBFormat[2]))
	{
		m_bDisplayDOBScroll[2]	=	!m_bDisplayDOBScroll[2];
	}
	if(m_bDisplayDOBScroll[2])//display list of year : vertical grid current year - 100 to till current year
	{
		var iYear	=	RenderYears();
		if(iYear > 0)
		{
			m_strDOBFormat[2]	=	iYear.ToString();
			m_bDisplayDOBScroll[2] = false;
		}
	}
*/	
	SkinButtonAsAButton(m_tex2DPurple);
	if(GUI.Button(Rect(0.57*m_fWidthPopup,2*m_fHeightPopup/3.0 + m_fHeightPopup/12.0,0.33*m_fWidthPopup,m_fHeightPopup/6.0),"Update"))
	{
		//Identify("RTN1:"+m_strRTN+"  RTN2:"+m_strSecondaryRTN);
		//hit the API and when the result is 200 Ok then call the next statement
		UpdateDOB();
		m_bRenderUpdateDOBPopUp = false;
	}
	
	//close button
	RenderCloseButton(1);
}

var m_v2ArrayOfDateScrolls_Y	:	Vector2[];
var m_strArrayOfDates			:	String[];
function RenderDates()
{
	var rectViewPort	:	Rect	=	Rect(0.1*m_fWidthPopup,m_fHeightPopup/3.0 + m_fHeightPopup/12.0 + m_fHeightPopup/6.0,0.25*m_fWidthPopup,2*m_fHeightPopup/6.0);
	var	rectFullScroll	:	Rect	=	rectViewPort;
	rectFullScroll.height			=	(31/2.0)*rectViewPort.height;
	
	m_v2ArrayOfDateScrolls_Y[0] = GUI.BeginScrollView(rectViewPort,m_v2ArrayOfDateScrolls_Y[0],rectFullScroll);// added to update for Touch
					
	//selection grid that displays all the dates vertically in just one column
	var iIndexOfDate	=	GUI.SelectionGrid(rectFullScroll,-1,m_strArrayOfDates,1);
	
	//horizontal scroll ends here
	GUI.EndScrollView();
	
	return iIndexOfDate + 1;
}

var m_strArrayOfMonths			:	String[];
function RenderMonths()
{
	var rectViewPort	:	Rect	=	Rect(0.1*m_fWidthPopup + 0.26*m_fWidthPopup,m_fHeightPopup/3.0 + m_fHeightPopup/12.0 + m_fHeightPopup/6.0,0.25*m_fWidthPopup,2*m_fHeightPopup/6.0);
	var	rectFullScroll	:	Rect	=	rectViewPort;
	rectFullScroll.height			=	(12/2.0)*rectViewPort.height;
	
	m_v2ArrayOfDateScrolls_Y[1] = GUI.BeginScrollView(rectViewPort,m_v2ArrayOfDateScrolls_Y[1],rectFullScroll);// added to update for Touch
					
	//selection grid that displays all the dates vertically in just one column
	var iIndexOfMonth	=	GUI.SelectionGrid(rectFullScroll,-1,m_strArrayOfMonths,1);
	
	//horizontal scroll ends here
	GUI.EndScrollView();
	
	return iIndexOfMonth + 1;
}

var m_strArrayOfYears			:	String[];
function RenderYears()
{
	var rectViewPort	:	Rect	=	Rect(0.1*m_fWidthPopup + 0.52*m_fWidthPopup,m_fHeightPopup/3.0 + m_fHeightPopup/12.0 + m_fHeightPopup/6.0,0.25*m_fWidthPopup,2*m_fHeightPopup/6.0);
	var	rectFullScroll	:	Rect	=	rectViewPort;
	rectFullScroll.height			=	(100/2.0)*rectViewPort.height;
	
	m_v2ArrayOfDateScrolls_Y[2] = GUI.BeginScrollView(rectViewPort,m_v2ArrayOfDateScrolls_Y[2],rectFullScroll);// added to update for Touch
					
	//selection grid that displays all the dates vertically in just one column
	var iIndexOfYear	=	GUI.SelectionGrid(rectFullScroll,-1,m_strArrayOfYears,1);
	
	//horizontal scroll ends here
	GUI.EndScrollView();
	
	return iIndexOfYear + 1;
}

function RenderUpdateAddressPopUp(iWindowID : int)
{
	m_skinMyD2HScreen.box.fontSize 					=	Mathf.Min(0.8*m_fWidthPopup,m_fHeightPopup/3.0)/4.5;
	m_skinMyD2HScreen.box.alignment					=	TextAnchor.MiddleLeft;
	m_skinMyD2HScreen.box.normal.background			=	null;
	m_skinMyD2HScreen.box.normal.textColor			=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	
	var guicontentsAddressButton	:	GUIContent = new GUIContent("Address",m_tex2DPurpleHut);
	GUI.Box(Rect(0.1*m_fWidthPopup,m_fHeightPopup/6.0,0.8*m_fWidthPopup,m_fHeightPopup/6.0),guicontentsAddressButton);
	
	m_skinMyD2HScreen.box.alignment					=	TextAnchor.MiddleLeft;
	m_skinMyD2HScreen.box.fontSize 					=	Mathf.Min(0.8*m_fWidthPopup,m_fHeightPopup/3.0)/7.5;
	m_skinMyD2HScreen.box.normal.textColor			=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
	GUI.Box(Rect(0.1*m_fWidthPopup,1.5*m_fHeightPopup/6.0,0.8*m_fWidthPopup,3.0*m_fHeightPopup/6.0),m_strAddress);
	
	SkinButtonAsAButton(m_tex2DPurple);
	if(GUI.Button(Rect(0.57*m_fWidthPopup,4.5*m_fHeightPopup/6.0,0.33*m_fWidthPopup,m_fHeightPopup/6.0),"OK"))
	{
		//hit the API and when the result is 200 Ok then call the next statement
		m_bRenderUpdateAddressPopUp = false;
	}
	
	//close button
	RenderCloseButton(2);
}

function RenderUpdateEmailPopUp(iWindowID : int)
{
	m_skinMyD2HScreen.box.fontSize 					=	Mathf.Min(0.8*m_fWidthPopup,m_fHeightPopup/3.0)/3.0;
	m_skinMyD2HScreen.box.alignment					=	TextAnchor.LowerLeft;
	m_skinMyD2HScreen.box.normal.background			=	null;
	m_skinMyD2HScreen.box.normal.textColor			=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	
	var guicontentsEmailButton	:	GUIContent = new GUIContent("Email",m_tex2DLetter);
	GUI.Box(Rect(0.1*m_fWidthPopup,0,0.8*m_fWidthPopup,m_fHeightPopup/3.0),guicontentsEmailButton);
	
	//button as a textfield
	SkinButtonAsATextfield();
	if(GUI.Button(Rect(0.1*m_fWidthPopup,m_fHeightPopup/3.0 + m_fHeightPopup/12.0,0.8*m_fWidthPopup,m_fHeightPopup/6.0), m_strEmailID))
	{
		m_objKeyboardEmailID = TouchScreenKeyboard.Open(m_strEmailID, TouchScreenKeyboardType.URL);
	}
    if(m_objKeyboardEmailID)
    {
    	m_strEmailID = m_objKeyboardEmailID.text;
    }
	//m_strEmailID = GUI.TextField(Rect(0.1*m_fWidthPopup,m_fHeightPopup/3.0 + m_fHeightPopup/12.0,0.8*m_fWidthPopup,m_fHeightPopup/6.0),m_strEmailID);
	
	//button as a button
	SkinButtonAsAButton(m_tex2DPurple);
	if(GUI.Button(Rect(0.57*m_fWidthPopup,2*m_fHeightPopup/3.0 + m_fHeightPopup/12.0,0.33*m_fWidthPopup,m_fHeightPopup/6.0),"Update"))
	{
		//hit the API and when the result is 200 Ok then call the next statement
		m_bRenderUpdateEmailPopUp = false;
	}
	
	//close button
	RenderCloseButton(3);
}

function RenderUpdateRTNPopUp(iWindowID : int)
{
	//close button
	RenderCloseButton(4);
	
	if(m_objUpdateRTN1APIPacket.m_bResponseReceived && m_objUpdateRTN2APIPacket.m_bResponseReceived)
	{
		m_skinMyD2HScreen.box.normal.background		=	null;
		m_skinMyD2HScreen.box.alignment				=	TextAnchor.UpperLeft;
		m_skinMyD2HScreen.box.normal.textColor		=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
		m_skinMyD2HScreen.box.fontSize 				=	Mathf.Min(0.8*m_fWidthPopup,1.25*m_fHeightPopup/10.0)/1.75;
		
		m_skinMyD2HScreen.label.normal.background	=	null;
		m_skinMyD2HScreen.label.alignment			=	TextAnchor.UpperLeft;
		m_skinMyD2HScreen.label.normal.textColor	=	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
		m_skinMyD2HScreen.label.fontSize 			=	Mathf.Min(0.8*m_fWidthPopup,1.25*m_fHeightPopup/10.0)/2.25;
		
		var strRTN1APIResult	:	String;
		if(m_objUpdateRTN1APIPacket.m_strResponseCode == "200 OK")
		{
			var N = JSON.Parse(m_objUpdateRTN1APIPacket.m_strOutput);
			strRTN1APIResult	=	N["UpdatePrimaryRTNResult"];
		}
		else
		{
			strRTN1APIResult	=	m_objUpdateRTN1APIPacket.m_strResponseCode;
		}
		GUI.Box(Rect(0.1*m_fWidthPopup,0.1*m_fHeightPopup,0.8*m_fWidthPopup,0.125*m_fHeightPopup),"Primary RTN");
		GUI.Label(Rect(0.1*m_fWidthPopup,0.225*m_fHeightPopup,0.8*m_fWidthPopup,0.2*m_fHeightPopup),strRTN1APIResult);
		
		var strRTN2APIResult	:	String;
		if(m_objUpdateRTN2APIPacket.m_strResponseCode == "200 OK")
		{
			var M = JSON.Parse(m_objUpdateRTN2APIPacket.m_strOutput);
			strRTN2APIResult	=	M["UpdateSecondaryRTNResult"];
		}
		else
		{
			strRTN2APIResult	=	m_objUpdateRTN1APIPacket.m_strResponseCode;
		}
		GUI.Box(Rect(0.1*m_fWidthPopup,0.425*m_fHeightPopup,0.8*m_fWidthPopup,0.125*m_fHeightPopup),"Secondary RTN");
		GUI.Label(Rect(0.1*m_fWidthPopup,0.55*m_fHeightPopup,0.8*m_fWidthPopup,0.2*m_fHeightPopup),strRTN2APIResult);
		
		SkinButtonAsAButton(m_tex2DPurple);
		if(GUI.Button(Rect(0.57*m_fWidthPopup,0.75*m_fHeightPopup,0.33*m_fWidthPopup,1.75*m_fHeightPopup/10.0),"OK"))
		{
			m_objUpdateRTN1APIPacket.m_bResponseReceived	=	false;
			m_objUpdateRTN2APIPacket.m_bResponseReceived	=	false;
			
			m_objUpdateRTN1APIPacket.m_iConnectionStatus 	=	0;
			m_objUpdateRTN2APIPacket.m_iConnectionStatus 	=	0;
			
			m_bRenderUpdateRTNPopUp = false;
		}
	}
	else
	{
		if(m_objUpdateRTN1APIPacket.m_iConnectionStatus == 1 && m_objUpdateRTN2APIPacket.m_iConnectionStatus == 1)
		{
			RenderPleaseWaitSplash(m_fWidthPopup/2.0, m_fHeightPopup/2.0);
		}
		else
		{
			m_skinMyD2HScreen.box.normal.background			=	null;
			m_skinMyD2HScreen.box.alignment					=	TextAnchor.MiddleLeft;
			m_skinMyD2HScreen.box.normal.textColor			=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
			m_skinMyD2HScreen.box.fontSize 					=	Mathf.Min(0.8*m_fWidthPopup,1.25*m_fHeightPopup/10.0)/1.75;
		
			var guicontentsRTNButton	:	GUIContent = new GUIContent("Update RTN",m_tex2DPurpleIPhone);
			GUI.Box(Rect(0.1*m_fWidthPopup,1*m_fHeightPopup/10.0,0.8*m_fWidthPopup,1.25*m_fHeightPopup/10.0),guicontentsRTNButton);
			
			if(m_strFooterNote1	!= "")
			{
				m_skinMyD2HScreen.label.normal.background	=	null;
				m_skinMyD2HScreen.label.alignment			=	TextAnchor.MiddleCenter;
				m_skinMyD2HScreen.label.normal.textColor	=	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
				m_skinMyD2HScreen.label.fontSize 			=	Mathf.Min(0.8*m_fWidthPopup,1.25*m_fHeightPopup/10.0)/2.5;
				GUI.Label(Rect(0.5*m_fWidthPopup,1*m_fHeightPopup/10.0,0.4*m_fWidthPopup,1.25*m_fHeightPopup/10.0),m_strFooterNote1);
			}
			
			SkinButtonAsATextfield();
			if(GUI.Button(Rect(0.1*m_fWidthPopup,2.25*m_fHeightPopup/10.0,0.8*m_fWidthPopup,1.75*m_fHeightPopup/10.0), m_strRTN))
			{
				m_objKeyboardRTN1 = TouchScreenKeyboard.Open(m_strRTN, TouchScreenKeyboardType.PhonePad, false, false, false, false, "Primary RTN");
			}
		    if(m_objKeyboardRTN1)
		    {
		    	if(m_objKeyboardRTN1.done)
		    	{
		    		if(ValidatePhoneNumber(m_objKeyboardRTN1.text) == 0)
		    		{
		    			m_strFooterNote1	=	"Invalid phone number format.";
		    		}
		    		else
		    		{
		    			m_strRTN = m_objKeyboardRTN1.text;
		    		}
		    		m_objKeyboardRTN1 = null;
		    	}
		    }
			//m_strRTN = GUI.TextField(Rect(0.1*m_fWidthPopup,2.25*m_fHeightPopup/10.0,0.8*m_fWidthPopup,1.75*m_fHeightPopup/10.0),m_strRTN);
			
			var guicontentsSecondaryRTNButton	:	GUIContent = new GUIContent("Secondary RTN",m_tex2DPurpleIPhone);
			GUI.Box(Rect(0.1*m_fWidthPopup,4.25*m_fHeightPopup/10.0,0.8*m_fWidthPopup,1.25*m_fHeightPopup/10.0),guicontentsSecondaryRTNButton);
			
			if(m_strFooterNote2	!= "")
			{
				m_skinMyD2HScreen.label.normal.background	=	null;
				m_skinMyD2HScreen.label.alignment			=	TextAnchor.MiddleCenter;
				m_skinMyD2HScreen.label.normal.textColor	=	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
				m_skinMyD2HScreen.label.fontSize 			=	Mathf.Min(0.8*m_fWidthPopup,1.25*m_fHeightPopup/10.0)/2.5;
				GUI.Label(Rect(0.5*m_fWidthPopup,4.25*m_fHeightPopup/10.0,0.4*m_fWidthPopup,1.25*m_fHeightPopup/10.0),m_strFooterNote2);
			}
			
			if(GUI.Button(Rect(0.1*m_fWidthPopup,5.5*m_fHeightPopup/10.0,0.8*m_fWidthPopup,1.75*m_fHeightPopup/10.0), m_strSecondaryRTN))
			{
				m_objKeyboardRTN2 = TouchScreenKeyboard.Open(m_strSecondaryRTN, TouchScreenKeyboardType.PhonePad, false, false, false, false, "Secondary RTN");
			}
		    if(m_objKeyboardRTN2)
		    {
		    	if(m_objKeyboardRTN2.done)
		    	{
		    		if(ValidatePhoneNumber(m_objKeyboardRTN2.text) == 0)
		    		{
		    			m_strFooterNote2	=	"Invalid phone number format.";
		    		}
		    		else
		    		{
		    			m_strSecondaryRTN = m_objKeyboardRTN2.text;
		    		}
		    		m_objKeyboardRTN2 = null;
		    	}
		    }
			//m_strSecondaryRTN = GUI.TextField(Rect(0.1*m_fWidthPopup,5.5*m_fHeightPopup/10.0,0.8*m_fWidthPopup,1.75*m_fHeightPopup/10.0),m_strSecondaryRTN);
			
			SkinButtonAsAButton(m_tex2DPurple);
			if(GUI.Button(Rect(0.57*m_fWidthPopup,7.75*m_fHeightPopup/10.0,0.33*m_fWidthPopup,1.75*m_fHeightPopup/10.0),"Update"))
			{
				//put a check for phone no. validation
				if(ValidatePhoneNumber(m_strRTN) == 0)
				{
					m_strFooterNote1	=	"Invalid phone number format.";
				}
				else if(ValidatePhoneNumber(m_strSecondaryRTN) == 0)
				{		
					m_strFooterNote2	=	"Invalid phone number format.";
				}
				else
				{
					m_strFooterNote1	=	"";
					m_strFooterNote2	=	"";
					//hit the API and when the result is 200 Ok then call the next statement
					//Identify("RTN1:"+m_strRTN+"  RTN2:"+m_strSecondaryRTN);
					Identify(m_strRTN , m_strSecondaryRTN);
					UpdateRTN1();
					UpdateRTN2();
				}
			}
		}
	}
}
function ValidatePhoneNumber(strNumber : String)	:	int
{
	if(strNumber == null)
	{
		return 0;
	}
	
	var iLength : int	=	strNumber.Length;
	
	if(iLength == 11)
	{
		if(strNumber[0] != '0')
		{
			return 0;
		}
	}
	else if(iLength == 12)
	{
		if(strNumber[0] != '9' || strNumber[1] != '1')
		{
			return 0;
		}
	}
	else if(iLength == 13)
	{
		if(strNumber[0] != '+' || strNumber[1] != '9' || strNumber[2] != '1')
		{
			return 0;
		}
	}
	
	if(iLength == 10)//>= 10 && iLength <= 13)
	{
		for(var i = 0; i < iLength; i++)
		{
			if(strNumber[i] > 47 && strNumber[i] < 58)
			{
				//print("int hai");
			}
			else if(iLength == 13 && i == 0)
			{
				if(strNumber[i] != "+")
				{
					return 0;
				}
			}
			else
			{
				//print("non int");
				return 0;
			}
		}
		return 1;
	}
	else
	{
		return 0;
	}
}

function RenderCloseButton(iPopId	:	int)
{
	m_skinMyD2HScreen.button.normal.background 	= null;
	m_skinMyD2HScreen.button.normal.textColor	= Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	m_skinMyD2HScreen.button.hover.background 	= null;
	m_skinMyD2HScreen.button.active.background 	= null;
	m_skinMyD2HScreen.button.fontSize 			= Mathf.Min(m_fWidthPopup,m_fHeightPopup)/15.0;
	m_skinMyD2HScreen.button.font			= m_fontBold;
	if(GUI.Button(Rect(0.9*m_fWidthPopup,0,0.1*m_fWidthPopup,0.1*m_fWidthPopup),"X"))
	{
		switch(iPopId)
		{
			case 0:
				m_bRenderAPIErrorPrompt		=	false;
				break;
				
			case 1:
				m_bRenderUpdateDOBPopUp		=	false;
				break;
			
			case 2:
				m_bRenderUpdateAddressPopUp	=	false;
				break;
			
			case 3:
				m_bRenderUpdateEmailPopUp	=	false;
				break;
			
			case 4:
				m_bRenderUpdateRTNPopUp 	=	false;
				break;
		}
	}
}

var m_objUpdateRTN1APIPacket	:	CWebAPIPacket;
function UpdateRTN1()
{
	var strAPIURL = ScriptAPIs.g_strWebservicesAtD2H + "MobileEPGServices/";
    var strAPIMethod = "MobileEPGService.CustomerService.svc/Method/UpdatePrimaryRTN";
    var strInput = "{\"CustomerId\":\"" + m_strCustomerId + "\",\"NewRtn\":\"" + m_strRTN + "\"}";
    
    m_objUpdateRTN1APIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    m_objScriptAPIHandler.InvokeReSTfulAPI(m_objUpdateRTN1APIPacket);
}

var m_objUpdateRTN2APIPacket	:	CWebAPIPacket;
function UpdateRTN2()
{
	var strAPIURL = ScriptAPIs.g_strWebservicesAtD2H + "MobileEPGServices/";
    var strAPIMethod = "MobileEPGService.CustomerService.svc/Method/UpdateSecondaryRTN";
    var strInput = "{\"CustomerId\":\"" + m_strCustomerId + "\",\"NewRtn\":\"" + m_strSecondaryRTN + "\"}";
    
    m_objUpdateRTN2APIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    m_objScriptAPIHandler.InvokeReSTfulAPI(m_objUpdateRTN2APIPacket);
}

function UpdateDOB()
{
	var strAPIURL = ScriptAPIs.g_strWebservicesAtD2H + "MobileEPGServices/";
    var strAPIMethod = "MobileEPGService.CustomerService.svc/Method/UpdateDOB";
    var strInput = "{\"CustomerId\":\"" + m_strCustomerId + "\",\"DOB\":\"" + m_strDOB + "\"}";
    
    m_objCustomerDetailsAPIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    m_objScriptAPIHandler.InvokeReSTfulAPI(m_objCustomerDetailsAPIPacket);
}

function SkinButtonAsAButton(tex2DBaseColor	:	Texture2D)
{
	m_skinMyD2HScreen.button.normal.background 		= 	tex2DBaseColor;
	m_skinMyD2HScreen.button.hover.background 		= 	m_tex2DOrange;
	m_skinMyD2HScreen.button.active.background 		= 	m_tex2DOrange;
	m_skinMyD2HScreen.button.normal.textColor 		= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinMyD2HScreen.button.hover.textColor 		= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinMyD2HScreen.button.active.textColor 		= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinMyD2HScreen.button.font					= 	m_fontRegular;
	//m_skinMyD2HScreen.button.fontSize 				=	Mathf.Min(0.8*m_fWidthPopup,m_fHeightPopup/6.0)/2.5;
	m_skinMyD2HScreen.button.fontSize 				=	Mathf.Min(Screen.width,m_fHeightHeader)/1.75;
	m_skinMyD2HScreen.button.alignment				=	TextAnchor.MiddleCenter;
	m_skinMyD2HScreen.button.contentOffset.x		=	0.0;
}

function SkinButtonAsATile(tex2DBaseColor	:	Texture2D)
{
	m_skinMyD2HScreen.button.normal.background 		= 	tex2DBaseColor;
	m_skinMyD2HScreen.button.hover.background 		= 	tex2DBaseColor;
	m_skinMyD2HScreen.button.active.background 		= 	tex2DBaseColor;
	m_skinMyD2HScreen.button.normal.textColor 		= 	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	m_skinMyD2HScreen.button.hover.textColor 		= 	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	m_skinMyD2HScreen.button.active.textColor 		= 	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	m_skinMyD2HScreen.button.font					= 	m_fontRegular;
	m_skinMyD2HScreen.button.fontSize 				=	Mathf.Min(Screen.width,m_fHeightHeader)/1.75;
	m_skinMyD2HScreen.button.alignment				=	TextAnchor.MiddleCenter;
	m_skinMyD2HScreen.button.contentOffset.x		=	0.0;
}

function SkinButtonAsATextfield()
{
	m_skinMyD2HScreen.button.normal.background 		= 	m_tex2DWhite;
	m_skinMyD2HScreen.button.hover.background 		= 	m_tex2DWhite;
	m_skinMyD2HScreen.button.active.background 		= 	m_tex2DWhite;
	m_skinMyD2HScreen.button.normal.textColor 		= 	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
	m_skinMyD2HScreen.button.hover.textColor 		= 	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
	m_skinMyD2HScreen.button.active.textColor 		= 	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
	m_skinMyD2HScreen.button.font					= 	m_fontRegular;
	m_skinMyD2HScreen.button.fontSize 				=	Mathf.Min(0.8*m_fWidthPopup,m_fHeightPopup/6.0)/2.5;
	m_skinMyD2HScreen.button.alignment				=	TextAnchor.MiddleLeft;
	m_skinMyD2HScreen.button.contentOffset.x		=	Mathf.Min(0.8*m_fWidthPopup,2*m_fHeightPopup/10.0)/5.0;
}

function SkinTextfieldAsATextfield()
{
	m_skinMyD2HScreen.textField.fontSize 			=	Mathf.Min(0.8*m_fWidthPopup,m_fHeightPopup/6.0)/2.5;
	m_skinMyD2HScreen.textField.alignment			=	TextAnchor.MiddleLeft;
	m_skinMyD2HScreen.textField.normal.textColor	=	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
	m_skinMyD2HScreen.textField.contentOffset.x		=	Mathf.Min(0.8*m_fWidthPopup,2*m_fHeightPopup/10.0)/5.0;
}

//function TrackEvent(fWaitTime	:	float)
//{
//	yield WaitForSeconds(fWaitTime);
//	TE("MyD2H");
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
function Identify(strRTN1 : String,strRTN2 :String) {
	var objHeaders : Hashtable = new Hashtable();
	objHeaders.Add("Content-Type","application/json");
	var customerId = PlayerPrefs.GetString("CustomerId");
	var emailId = PlayerPrefs.GetString("EmailId");
	var balance = PlayerPrefs.GetString("Balance");
	var nextRechargeDate = PlayerPrefs.GetString("NextRechargeDate");
	//var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"email\":\"" + emailId + "\",\"balance\":\"" + balance +"\",\"nextRechargeDate\":\"" + nextRechargeDate +"\",\"event\":\"" + strClickedOn + "\"}";
	var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"traits\":{\"Contact\":\"" + strRTN1 + "\",\"Contact2\":\"" + strRTN2 + "\"}}";
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

	var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" +customerId + "\",\"event\":\"" + strClickedOn + "\"}";
	
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
