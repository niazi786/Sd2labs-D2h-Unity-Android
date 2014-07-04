 	#pragma strict

function Start () 
{
	m_iSelectedBoxIndex = 0;
	m_iFrameId			= 0;
	m_iTimeRemaining	= 5;
	m_fMinBalance		= 50.0;
	
	m_strCustomerId				=	PlayerPrefs.GetString("CustomerId");
	m_strDeviceSerialNo			=	PlayerPrefs.GetString("ConnectionID");
	m_strCurrentBalance			=	PlayerPrefs.GetString("Balance");
	m_objScriptAPIHandler 		=	GetComponent(ScriptAPIHandler);
	
	tracking("Need Help");
	Debug.Log("Imran KHAN NIAZI...............");
	//StartCoroutine(TrackEvent(0.1));
}

function Update () 
{
	if(Input.GetKeyDown(KeyCode.Escape))
	{
		if(m_iSelectedBoxIndex > 0)
		{
			m_iSelectedBoxIndex = 0;
		}
		else
		{
			Application.LoadLevel("SceneHomePage");
		}
	}
}

function OnGUI ()
{
	//*************if any button is clicked************//
	if(m_iSelectedBoxIndex > 0)
		GUI.enabled	=	false;
	
	RenderHelpScreenForIPhone();
	
	GUI.enabled	=	true;

	if(m_iSelectedBoxIndex > 0)
	{
		GUI.ModalWindow(m_iSelectedBoxIndex,Rect(Screen.width/2.0 - m_fWidthPopup/2.0, Screen.height/2.0 - m_fHeightPopup/2.0, m_fWidthPopup, m_fHeightPopup), NeedHelpPrompt, "", m_skinHelpScreen.window);
	}
}

var m_objBalMismatchAPIPacket	:	CWebAPIPacket;
var m_objRefreshAPIPacket		:	CWebAPIPacket;
var m_objE16APIPacket			:	CWebAPIPacket;
var m_objE107APIPacket			:	CWebAPIPacket;

var	m_fGapX						:	float;
var	m_fGapY						:	float;

var m_fHeightHeader				:	float;

var	m_fWidthBoxA				:	float;
var	m_fWidthBoxB				:	float;
var	m_fWidthBoxC				:	float;

var	m_fHeightBoxA				:	float;
var	m_fHeightBoxC				:	float;

var m_fWidthPopup				:	float;
var m_fHeightPopup				:	float;
var m_fDeltaAngleOfRotation		:	float;

var m_fMinBalance				:	float;

var m_iSelectedBoxIndex			:	int;
var m_iFrameId					:	int;
var m_iTimeRemaining			:	int;
var m_iTimeStamp				:	int;

var m_strCustomerId				:	String;
var m_strDeviceSerialNo			:	String;
var m_strCurrentBalance			:	String;

var m_objScriptAPIHandler		:	ScriptAPIHandler;

var m_skinHelpScreen 			:	GUISkin;
var m_skinRefreshButton			:	GUISkin;

var m_fontRegular				:	Font;
var m_fontBold					:	Font;

var m_tex2DPurple				:	Texture2D;
var m_tex2DLightPurple			:	Texture2D;
var m_tex2DOrange				:	Texture2D;
var m_tex2DWhite				:	Texture2D;
var m_tex2DPopupBackground		:	Texture2D;

var m_tex2DQuestionMark			:	Texture2D;
var m_tex2DMoneyBag				:	Texture2D;
var m_tex2DNotAvailable			:	Texture2D;
var m_tex2DCaution				:	Texture2D;
var m_tex2DThumbsDown			:	Texture2D;
var m_tex2DPhoneReceiver		:	Texture2D;

var m_tex2DError1074			:	Texture2D;
var m_tex2DError1614			:	Texture2D;
//var	m_tex2DInfinityFrame		:	Texture2D;

function RenderHelpScreenForIPhone()
{
	var fUnitX	:	float	=	Screen.width/22.6;
	var fUnitY	:	float	=	Screen.height/12.8;
	
	m_fHeightHeader		 	=	1.3*fUnitY;
	
	m_fGapX					=	0.1*fUnitX;
	m_fWidthBoxA			=	8.0*fUnitX;
	m_fWidthBoxB			=	6.7*fUnitX;
	m_fWidthBoxC			=	7.5*fUnitX;
	
	m_fGapY					=	0.1*fUnitY;
	m_fHeightBoxA			=	5.4*fUnitY;
	m_fHeightBoxC			=	4.5*fUnitY;
	
	m_fWidthPopup			=	0.7*Screen.width;
	m_fHeightPopup			=	0.7*Screen.height;
	
	GUI.skin				=	m_skinHelpScreen;
	//*************************	Header	***********************//
	GUI.BeginGroup(Rect(0,0,Screen.width,m_fHeightHeader));
		
		m_skinHelpScreen.box.alignment			=	TextAnchor.MiddleCenter;
		m_skinHelpScreen.box.normal.background	=	m_tex2DPurple;
		m_skinHelpScreen.box.normal.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinHelpScreen.box.fontSize 			=	Mathf.Min(Screen.width,m_fHeightHeader)/1.5;
		m_skinHelpScreen.box.font			=	m_fontRegular;	
		GUI.Box(Rect(0,0,Screen.width,m_fHeightHeader),"Need Help");
	GUI.EndGroup();
	
	//*************************	Box A : Help For Using Product	***********************//
	GUI.BeginGroup(Rect(0 + m_fGapX, m_fHeightHeader + m_fGapY, m_fWidthBoxA, m_fHeightBoxA));
		
		m_skinHelpScreen.button.normal.background	=	m_tex2DPurple;
		m_skinHelpScreen.button.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinHelpScreen.button.hover.background	=	m_tex2DOrange;
		m_skinHelpScreen.button.active.background	=	m_tex2DOrange;
		m_skinHelpScreen.button.fontSize			=	Mathf.Min(Screen.width,m_fHeightHeader)/1.75;
		m_skinHelpScreen.button.font				=	m_fontRegular;
		
		var guicontentsBoxAButton	:	GUIContent = new GUIContent("Help for using Product",m_tex2DQuestionMark);
		if(GUI.Button(Rect(0, 0, m_fWidthBoxA, m_fHeightBoxA),guicontentsBoxAButton))
		{
			//m_iSelectedBoxIndex = 1;
			//Application.OpenURL("https://s3.amazonaws.com/epginfinityxml/FAQ/videocon_d2h.png");
			//PlayerPrefs.SetString("HeaderTitle","Need Help > FAQs");
			tracking("Help -> Help for using Product");
			ScriptProfilePage.g_iActiveScreenId = 9;
			PlayerPrefs.SetString("BrowserURL", "https://s3.amazonaws.com/epginfinityxml/FAQ/videocon_d2h.png");
			Application.LoadLevel("SceneInAppBrowser");
		}	
	GUI.EndGroup();
	
	//*************************	Box B : Account Balance Issues	***********************//
	GUI.BeginGroup(Rect(0 + m_fGapX + m_fWidthBoxA + m_fGapX, m_fHeightHeader + m_fGapY, m_fWidthBoxB, m_fHeightBoxA));
		
		m_skinHelpScreen.button.normal.background	=	m_tex2DLightPurple;
		//m_skinHelpScreen.button.normal.textColor	=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
		
		var guicontentsBoxBButton	:	GUIContent = new GUIContent("Account Balance Issues",m_tex2DMoneyBag);
		if(GUI.Button(Rect(0, 0, m_fWidthBoxB, m_fHeightBoxA),guicontentsBoxBButton))
		{
			tracking("Help -> Account Balance Issues");
			
			LogComplaintForBalanceMismatch();
			
			m_iSelectedBoxIndex = 2;
			m_iFrameId			= 6;
		}	
	GUI.EndGroup();
	
	//*************************	Box C : Unable to view	***********************//
	GUI.BeginGroup(Rect(0 + m_fGapX + m_fWidthBoxA + m_fGapX + m_fWidthBoxB + m_fGapX, m_fHeightHeader + m_fGapY, m_fWidthBoxC, m_fHeightBoxC));
		
		m_skinHelpScreen.button.normal.background	=	m_tex2DPurple;
		//m_skinHelpScreen.button.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		
		var guicontentsBoxCButton	:	GUIContent = new GUIContent("I am seeing E16 -4 error",m_tex2DNotAvailable);
		if(GUI.Button(Rect(0, 0, m_fWidthBoxC, m_fHeightBoxC),guicontentsBoxCButton))
		{
			tracking("Help -> E16 -4 error");
			
			m_iSelectedBoxIndex = 3;
			m_iFrameId			= 1;
		}	
	GUI.EndGroup();
	
	//*************************	Box D : I am seeing 107 -4 error	***********************//
	GUI.BeginGroup(Rect(0 + m_fGapX, m_fHeightHeader + m_fGapY + m_fHeightBoxA + m_fGapY, m_fWidthBoxA, m_fHeightBoxC));
		
		m_skinHelpScreen.button.normal.background	=	m_tex2DLightPurple;
		//m_skinHelpScreen.button.normal.textColor	=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
		
		var guicontentsBoxDButton	:	GUIContent = new GUIContent("I am seeing 107 -4 error",m_tex2DCaution);
		if(GUI.Button(Rect(0, 0, m_fWidthBoxA, m_fHeightBoxC),guicontentsBoxDButton))
		{
			tracking("Help -> 107 -4 error");
			
			m_iSelectedBoxIndex = 4;
			m_iFrameId = 1;
		}	
	GUI.EndGroup();
	
	//*************************	Box E : Recharge Failure	***********************//
	GUI.BeginGroup(Rect(0 + m_fGapX + m_fWidthBoxA + m_fGapX, m_fHeightHeader + m_fGapY + m_fHeightBoxA + m_fGapY, m_fWidthBoxB, m_fHeightBoxC));
		
		m_skinHelpScreen.button.normal.background	=	m_tex2DPurple;
		//m_skinHelpScreen.button.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		
		var guicontentsBoxEButton	:	GUIContent = new GUIContent("Recharge Failure",m_tex2DThumbsDown);
		if(GUI.Button(Rect(0, 0, m_fWidthBoxB, m_fHeightBoxC),guicontentsBoxEButton))
		{
			tracking("Help -> Recharge Failure");
			
			m_iSelectedBoxIndex = 5;
			m_iFrameId			= 1;
		}	
	GUI.EndGroup();
	
	//*************************	Box F : Contact Info	***********************//
	GUI.BeginGroup(Rect(0 + m_fGapX + m_fWidthBoxA + m_fGapX + m_fWidthBoxB + m_fGapX, m_fHeightHeader + m_fGapY + m_fHeightBoxC + m_fGapY, m_fWidthBoxC, m_fHeightBoxA));
		
		m_skinHelpScreen.button.normal.background	=	m_tex2DLightPurple;
		
		var guicontentsBoxFButton	:	GUIContent = new GUIContent("Contact Info",m_tex2DPhoneReceiver);
		if(GUI.Button(Rect(0, 0, m_fWidthBoxC, m_fHeightBoxA),guicontentsBoxFButton))
		{
			//TE("Help -> Contact Info");
			
			m_iSelectedBoxIndex = 6;
		}	
	GUI.EndGroup();
}

function NeedHelpPrompt(iWindowID	:	int)
{	
	InitSkinForHelpPrompts();
	
	//close popup
	m_skinHelpScreen.button.font				=	m_fontRegular;	
	m_skinHelpScreen.button.normal.background	=	null;
	m_skinHelpScreen.button.active.background	=	null;
	m_skinHelpScreen.button.hover.background	=	null;
	m_skinHelpScreen.button.normal.textColor	=	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
	
	if(GUI.Button(Rect(0.9*m_fWidthPopup,0,0.1*m_fWidthPopup,0.1*m_fWidthPopup),"X"))
	{
		m_iSelectedBoxIndex = -1;
	}
	
	SkinButtonAsAButton();
	RenderHelpPrompts(iWindowID);
}
function InitSkinForHelpPrompts()
{
	m_skinHelpScreen.label.alignment			=	TextAnchor.MiddleCenter;
	m_skinHelpScreen.label.normal.background	=	null;
	m_skinHelpScreen.label.normal.textColor  	=	Color(128/255.0F,128/255.0F,128/255.0F,255/255.0F);
	m_skinHelpScreen.label.fontSize 			=	Mathf.Min(m_fWidthPopup,m_fHeightPopup)/12.0;
	m_skinHelpScreen.label.font			=	m_fontRegular;
	
	m_skinHelpScreen.button.fontSize 			=	Mathf.Min(m_fWidthPopup,m_fHeightPopup)/12.0;
	m_skinHelpScreen.button.font			=	m_fontRegular;
}
function RenderHelpPrompts(iBoxID	:	int)
{
	switch(iBoxID)
	{
		case 1:
			SlidePromptsForUsingProduct();
			break;
		case 2:
			SlidePromptsForAccountBalanceIssues();
			break;
		case 3:
			SlidePromptsForUnableToView();
			break;
		case 4:
			SlidePromptsFor1074Error();
			break;
		case 5:
			SlidePromptsForRechargeFailure();
			break;
		case 6:
			SlidePromptsForContactInfo();
			break;
		default:
			break;
	}
}

function SlidePromptsForUsingProduct()
{
}

function SlidePromptsForAccountBalanceIssues()
{
	if(m_iFrameId == 4)
	{
		m_skinHelpScreen.textField.normal.background 	= 	m_tex2DWhite;
		m_skinHelpScreen.textField.hover.background 	= 	m_tex2DWhite;
		m_skinHelpScreen.textField.active.background 	= 	m_tex2DWhite;
		m_skinHelpScreen.textField.focused.background 	= 	m_tex2DWhite;
		
		m_skinHelpScreen.textField.normal.textColor 	=	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
		GUI.TextField(Rect(0.1*m_fWidthPopup,0.1*m_fHeightPopup,0.8*m_fWidthPopup,0.15*m_fHeightPopup),"Subject");
		GUI.TextField(Rect(0.1*m_fWidthPopup,0.3*m_fHeightPopup,0.8*m_fWidthPopup,0.45*m_fHeightPopup),"Comment");
		
		if(GUI.Button(Rect(0.65*m_fWidthPopup,0.8*m_fHeightPopup,0.25*m_fWidthPopup,0.15*m_fHeightPopup),"Raise SR"))
		{
			m_iFrameId = 5;
		}
	}
	if(m_iFrameId == 5)
	{
		m_skinHelpScreen.label.normal.textColor  	=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
		m_skinHelpScreen.label.fontSize 			=	Mathf.Min(m_fWidthPopup,m_fHeightPopup)/9.0;
		GUI.Label(Rect(0.1*m_fWidthPopup,0.3*m_fHeightPopup,0.8*m_fWidthPopup,0.2*m_fHeightPopup),"Thank you");
		
		m_skinHelpScreen.label.normal.textColor  	=	Color(128/255.0F,128/255.0F,128/255.0F,255/255.0F);
		m_skinHelpScreen.label.alignment 			=	TextAnchor.MiddleCenter;
		m_skinHelpScreen.label.fontSize 			=	Mathf.Min(m_fWidthPopup,m_fHeightPopup)/18.0;
		GUI.Label(Rect(0.1*m_fWidthPopup,0.4*m_fHeightPopup,0.8*m_fWidthPopup,0.4*m_fHeightPopup),"Your SR has been raised with SR ID 123456.\nOur technical guy will visit you within 24 hours.");
		tracking("SR has been raised");
		if(GUI.Button(Rect(0.65*m_fWidthPopup,0.8*m_fHeightPopup,0.25*m_fWidthPopup,0.15*m_fHeightPopup),"OK"))
		{
			m_iFrameId = 0;
			m_iSelectedBoxIndex = 0;
		}
	}
	if(m_iFrameId == 6)	//prompt : wait splash + registering complaint via API
	{
		m_skinHelpScreen.label.normal.textColor  	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
		m_skinHelpScreen.label.alignment 			=	TextAnchor.MiddleCenter;
		m_skinHelpScreen.label.fontSize 			=	Mathf.Min(m_fWidthPopup,m_fHeightPopup)/12.0;
		if(m_objBalMismatchAPIPacket.m_bResponseReceived == false)
		{
			GUI.Label(Rect(0.1*m_fWidthPopup,0.5*m_fHeightPopup,0.8*m_fWidthPopup,0.4*m_fHeightPopup),"Please wait while we register your complaint for the account balance issues.");
			
			//GUI.DrawTexture(Rect(0.3*m_fWidthPopup,0.0*m_fHeightPopup,0.4*m_fWidthPopup,0.4*m_fWidthPopup),m_tex2DInfinityFrame);
			RenderPleaseWaitSplash(Screen.width/2.0 - m_fWidthPopup/2.0 + 0.3*m_fWidthPopup,Screen.height/2.0 - m_fHeightPopup/2.0 + 0.1*m_fHeightPopup,0.15*m_fWidthPopup,0.15*m_fWidthPopup);
		}
		else
		{
			GUI.Label(Rect(0.1*m_fWidthPopup,0.2*m_fHeightPopup,0.8*m_fWidthPopup,0.4*m_fHeightPopup),"Thank you! Your complaint has been registered.");
			tracking("complaint has been registered.");
			if(GUI.Button(Rect(0.65*m_fWidthPopup,0.7*m_fHeightPopup,0.25*m_fWidthPopup,0.15*m_fHeightPopup),"OK"))
			{
				m_iFrameId = 0;
				m_iSelectedBoxIndex = 0;
			}
		}
	}
}

function LogComplaintForBalanceMismatch()
{
	var strAPIURL = ScriptAPIs.g_strWebservicesAtD2H + "MobileEPGServices/";
    var strAPIMethod = "MobileEPGService.ComplaintService.svc/Method/LogComplaintForBalanceMismatch";
    var strInput = "{\"CustomerId\":\"" + m_strCustomerId + "\",\"DeviceSerialNo\":\"" + m_strDeviceSerialNo + "\"}";
    
    m_objBalMismatchAPIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    m_objScriptAPIHandler.InvokeReSTfulAPI(m_objBalMismatchAPIPacket);
}

function SlidePromptsForUnableToView()
{
	if(m_iFrameId == 1)
	{
		GUI.DrawTexture(Rect(0.25*m_fWidthPopup,0.1*m_fHeightPopup,0.5*m_fWidthPopup,0.35*m_fHeightPopup),m_tex2DError1614);
		
		var strMessage	:	String;
		if(parseFloat(m_strCurrentBalance) < m_fMinBalance)
		{
			m_skinHelpScreen.label.fontSize 			=	Mathf.Min(0.8*m_fWidthPopup,0.3*m_fHeightPopup)/4.5;
			strMessage	=	"Your current balance is low : INR" + m_strCurrentBalance +"\nPlease recharge your account to get back the service.";
			GUI.Label(Rect(0.1*m_fWidthPopup,0.475*m_fHeightPopup,0.8*m_fWidthPopup,0.3*m_fHeightPopup),strMessage);
			tracking("Your current balance is low");
			if(GUI.Button(Rect(0.325*m_fWidthPopup,0.8*m_fHeightPopup,0.35*m_fWidthPopup,0.15*m_fHeightPopup),"Recharge"))
			{
				Application.LoadLevel("sceneRecharge");
			}
		}
		else
		{
			strMessage	=	"Please keep your STB ON and click the Fix button below.";
			GUI.Label(Rect(0.1*m_fWidthPopup,0.5*m_fHeightPopup,0.8*m_fWidthPopup,0.2*m_fHeightPopup),strMessage);
			
			if(GUI.Button(Rect(0.325*m_fWidthPopup,0.75*m_fHeightPopup,0.35*m_fWidthPopup,0.15*m_fHeightPopup),"Fix"))
			{
				tracking("FIX");
				RefreshAPI("Reauthorize");
				
				m_iFrameId = 2;
				
				m_iTimeStamp = Time.time;
			}
		}
	}
	
	if(m_iFrameId == 2)
	{
		GUI.Label(Rect(0.1*m_fWidthPopup,0.6*m_fHeightPopup,0.8*m_fWidthPopup,0.2*m_fHeightPopup),"Please wait while we try to fix the issue.");
		
		m_skinHelpScreen.label.normal.textColor  	=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
		m_iTimeRemaining = 10 - (Time.time - m_iTimeStamp);
		GUI.Label(Rect(0.375*m_fWidthPopup,0.8*m_fHeightPopup,0.25*m_fWidthPopup,0.15*m_fHeightPopup),m_iTimeRemaining + "sec...");
		
		//GUI.DrawTexture(Rect(0.3*m_fWidthPopup,0.0*m_fHeightPopup,0.4*m_fWidthPopup,0.4*m_fWidthPopup),m_tex2DInfinityFrame);
		RenderPleaseWaitSplash(Screen.width/2.0 - m_fWidthPopup/2.0 + 0.3*m_fWidthPopup,Screen.height/2.0 - m_fHeightPopup/2.0 + 0.1*m_fHeightPopup,0.15*m_fWidthPopup,0.15*m_fWidthPopup);
		
		if(m_iTimeRemaining <= 0)
		{
			m_iFrameId = 3;
		}
	}
		
	if(m_iFrameId == 3)
	{
		GUI.Label(Rect(0.1*m_fWidthPopup,0.2*m_fHeightPopup,0.8*m_fWidthPopup,0.4*m_fHeightPopup),"Please check whether your issue is now resolved or not?");
		
		if(GUI.Button(Rect(0.55*m_fWidthPopup,0.7*m_fHeightPopup,0.3*m_fWidthPopup,0.15*m_fHeightPopup),"No"))
		{	tracking("Issue is now Resolved --> NO-->Log Complaint for E16");
			LogComplaintForE16();
			m_iFrameId = 5;
		}
		
		if(GUI.Button(Rect(0.15*m_fWidthPopup,0.7*m_fHeightPopup,0.3*m_fWidthPopup,0.15*m_fHeightPopup),"Yes"))
		{	tracking("Issue is now resolved --> Yes" );
			m_iSelectedBoxIndex = 0;
			m_iFrameId = 0;
		}
	}
	
	if(m_iFrameId == 4)
	{
		m_skinHelpScreen.textField.normal.background 	= 	m_tex2DWhite;
		m_skinHelpScreen.textField.hover.background 	= 	m_tex2DWhite;
		m_skinHelpScreen.textField.active.background 	= 	m_tex2DWhite;
		m_skinHelpScreen.textField.focused.background 	= 	m_tex2DWhite;
		
		m_skinHelpScreen.textField.normal.textColor 	=	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
		GUI.TextField(Rect(0.1*m_fWidthPopup,0.1*m_fHeightPopup,0.8*m_fWidthPopup,0.15*m_fHeightPopup),"Subject");
		GUI.TextField(Rect(0.1*m_fWidthPopup,0.3*m_fHeightPopup,0.8*m_fWidthPopup,0.45*m_fHeightPopup),"Comment");
		
		if(GUI.Button(Rect(0.65*m_fWidthPopup,0.8*m_fHeightPopup,0.25*m_fWidthPopup,0.15*m_fHeightPopup),"Raise SR"))
		{
			tracking("Raise SR");
			m_iFrameId = 5;
		}
	}
	
	if(m_iFrameId == 5)
	{
		m_skinHelpScreen.label.normal.textColor  	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
		m_skinHelpScreen.label.alignment 			=	TextAnchor.MiddleCenter;
		m_skinHelpScreen.label.fontSize 			=	Mathf.Min(m_fWidthPopup,m_fHeightPopup)/12.0;
		if(m_objE16APIPacket.m_bResponseReceived == false)
		{	
			GUI.Label(Rect(0.1*m_fWidthPopup,0.5*m_fHeightPopup,0.8*m_fWidthPopup,0.4*m_fHeightPopup),"Please wait while we register your complaint.");
			
			//GUI.DrawTexture(Rect(0.3*m_fWidthPopup,0.0*m_fHeightPopup,0.4*m_fWidthPopup,0.4*m_fWidthPopup),m_tex2DInfinityFrame);
			RenderPleaseWaitSplash(Screen.width/2.0 - m_fWidthPopup/2.0 + 0.3*m_fWidthPopup,Screen.height/2.0 - m_fHeightPopup/2.0 + 0.1*m_fHeightPopup,0.15*m_fWidthPopup,0.15*m_fWidthPopup);
		}
		else
		{
			tracking("Thank you! Your complaint has been registered.");
			GUI.Label(Rect(0.1*m_fWidthPopup,0.2*m_fHeightPopup,0.8*m_fWidthPopup,0.4*m_fHeightPopup),"Thank you! Your complaint has been registered.");
			if(GUI.Button(Rect(0.65*m_fWidthPopup,0.7*m_fHeightPopup,0.25*m_fWidthPopup,0.15*m_fHeightPopup),"OK"))
			{
				m_iFrameId = 0;
				m_iSelectedBoxIndex = 0;
			}
		}
	}
}
//strCommand	:	Refresh | Reauthorize | UpdateMyAccount
function RefreshAPI(strCommand	:	String)
{
	var strAPIURL = ScriptAPIs.g_strWebservicesAtD2H + "MobileEPGServices/";
    var strAPIMethod = "MobileEPGService.DeviceService.svc/Method/SendMobileCommandToSpecificDevice";
    var strInput = "{\"CustomerID\":\"" + m_strCustomerId + "\",\"SerialNo\":\"" + m_strDeviceSerialNo + "\",\"CommandName\":\"" + strCommand + "\"}";
    
    m_objRefreshAPIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    m_objScriptAPIHandler.InvokeReSTfulAPI(m_objRefreshAPIPacket);
}

function LogComplaintForE16()
{
	var strAPIURL = ScriptAPIs.g_strWebservicesAtD2H + "MobileEPGServices/";
    var strAPIMethod = "MobileEPGService.ComplaintService.svc/Method/LogComplaintForE16";
    var strInput = "{\"CustomerId\":\"" + m_strCustomerId + "\",\"DeviceSerialNo\":\"" + m_strDeviceSerialNo + "\"}";
    
    m_objE16APIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    m_objScriptAPIHandler.InvokeReSTfulAPI(m_objE16APIPacket);
}

function LogComplaintForE107()
{
	var strAPIURL = ScriptAPIs.g_strWebservicesAtD2H + "MobileEPGServices/";
    var strAPIMethod = "MobileEPGService.ComplaintService.svc/Method/LogComplaintForE107";
    var strInput = "{\"CustomerId\":\"" + m_strCustomerId + "\",\"DeviceSerialNo\":\"" + m_strDeviceSerialNo + "\"}";
    
    m_objE107APIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    m_objScriptAPIHandler.InvokeReSTfulAPI(m_objE107APIPacket);
}

function SlidePromptsFor1074Error()
{
	if(m_iFrameId == 1)
	{
		GUI.DrawTexture(Rect(0.25*m_fWidthPopup,0.1*m_fHeightPopup,0.5*m_fWidthPopup,0.35*m_fHeightPopup),m_tex2DError1074);
		
		GUI.Label(Rect(0.1*m_fWidthPopup,0.5*m_fHeightPopup,0.8*m_fWidthPopup,0.2*m_fHeightPopup),"Please keep your STB ON and click the Fix button below.");
		
		if(GUI.Button(Rect(0.325*m_fWidthPopup,0.75*m_fHeightPopup,0.35*m_fWidthPopup,0.15*m_fHeightPopup),"Fix"))
		{	tracking("Fix");
			RefreshAPI("Refresh");
			
			m_iFrameId = 2;
			
			m_iTimeStamp = Time.time;
		}
	}
	if(m_iFrameId == 2)
	{
		GUI.Label(Rect(0.1*m_fWidthPopup,0.6*m_fHeightPopup,0.8*m_fWidthPopup,0.2*m_fHeightPopup),"Please wait while we try to fix the issue.");
		
		m_skinHelpScreen.label.normal.textColor  	=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
		m_iTimeRemaining = 10 - (Time.time - m_iTimeStamp);
		GUI.Label(Rect(0.375*m_fWidthPopup,0.8*m_fHeightPopup,0.25*m_fWidthPopup,0.15*m_fHeightPopup),m_iTimeRemaining + "sec...");
		
		//GUI.DrawTexture(Rect(0.3*m_fWidthPopup,0.0*m_fHeightPopup,0.4*m_fWidthPopup,0.4*m_fWidthPopup),m_tex2DInfinityFrame);
		RenderPleaseWaitSplash(Screen.width/2.0 - m_fWidthPopup/2.0 + 0.3*m_fWidthPopup,Screen.height/2.0 - m_fHeightPopup/2.0 + 0.1*m_fHeightPopup,0.15*m_fWidthPopup,0.15*m_fWidthPopup);
		
		if(m_iTimeRemaining <= 0)
		{
			m_iFrameId = 3;
		}
	}
		
	if(m_iFrameId == 3)
	{
		GUI.Label(Rect(0.1*m_fWidthPopup,0.2*m_fHeightPopup,0.8*m_fWidthPopup,0.4*m_fHeightPopup),"Please check whether your issue is now resolved or not?");
		
		if(GUI.Button(Rect(0.55*m_fWidthPopup,0.7*m_fHeightPopup,0.3*m_fWidthPopup,0.15*m_fHeightPopup),"No"))
		{	tracking("check whether your issue is now resolved --> NO--> Complaint for E107 Logged");
			LogComplaintForE107();
			m_iFrameId = 5;
		}
		
		if(GUI.Button(Rect(0.15*m_fWidthPopup,0.7*m_fHeightPopup,0.3*m_fWidthPopup,0.15*m_fHeightPopup),"Yes"))
		{	tracking("check whether your issue is now resolved --> Yes-->");
			m_iSelectedBoxIndex = 0;
			m_iFrameId = 0;
		}
	}
	if(m_iFrameId == 4)
	{
		m_skinHelpScreen.textField.normal.background 	= 	m_tex2DWhite;
		m_skinHelpScreen.textField.hover.background 	= 	m_tex2DWhite;
		m_skinHelpScreen.textField.active.background 	= 	m_tex2DWhite;
		m_skinHelpScreen.textField.focused.background 	= 	m_tex2DWhite;
		
		m_skinHelpScreen.textField.normal.textColor 	=	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
		GUI.TextField(Rect(0.1*m_fWidthPopup,0.1*m_fHeightPopup,0.8*m_fWidthPopup,0.15*m_fHeightPopup),"Subject");
		GUI.TextField(Rect(0.1*m_fWidthPopup,0.3*m_fHeightPopup,0.8*m_fWidthPopup,0.45*m_fHeightPopup),"Comment");
		
		if(GUI.Button(Rect(0.65*m_fWidthPopup,0.8*m_fHeightPopup,0.25*m_fWidthPopup,0.15*m_fHeightPopup),"Raise SR"))
		{	tracking("Rasie SR");
			m_iFrameId = 5;
		}
	}
	if(m_iFrameId == 5)
	{
		m_skinHelpScreen.label.normal.textColor  	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
		m_skinHelpScreen.label.alignment 			=	TextAnchor.MiddleCenter;
		m_skinHelpScreen.label.fontSize 			=	Mathf.Min(m_fWidthPopup,m_fHeightPopup)/12.0;
		if(m_objE107APIPacket.m_bResponseReceived == false)
		{
			GUI.Label(Rect(0.1*m_fWidthPopup,0.5*m_fHeightPopup,0.8*m_fWidthPopup,0.4*m_fHeightPopup),"Please wait while we register your complaint.");
			
			//GUI.DrawTexture(Rect(0.3*m_fWidthPopup,0.0*m_fHeightPopup,0.4*m_fWidthPopup,0.4*m_fWidthPopup),m_tex2DInfinityFrame);
			RenderPleaseWaitSplash(Screen.width/2.0 - m_fWidthPopup/2.0 + 0.3*m_fWidthPopup,Screen.height/2.0 - m_fHeightPopup/2.0 + 0.1*m_fHeightPopup,0.15*m_fWidthPopup,0.15*m_fWidthPopup);
		}
		else
		{	tracking("Your complaint has been registered.");
			GUI.Label(Rect(0.1*m_fWidthPopup,0.2*m_fHeightPopup,0.8*m_fWidthPopup,0.4*m_fHeightPopup),"Thank you! Your complaint has been registered.");
			if(GUI.Button(Rect(0.65*m_fWidthPopup,0.7*m_fHeightPopup,0.25*m_fWidthPopup,0.15*m_fHeightPopup),"OK"))
			{
				m_iFrameId = 0;
				m_iSelectedBoxIndex = 0;
			}
		}
	}
}

function SlidePromptsForRechargeFailure()
{
	if(m_iFrameId == 1)
	{
		m_skinHelpScreen.label.normal.textColor  	=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
		m_skinHelpScreen.label.alignment 			=	TextAnchor.MiddleCenter;
		m_skinHelpScreen.label.fontSize 			=	Mathf.Min(m_fWidthPopup,m_fHeightPopup)/9.0;
		m_skinHelpScreen.label.font			=	m_fontBold;
		GUI.Label(Rect(0.1*m_fWidthPopup,0.125*m_fHeightPopup,0.8*m_fWidthPopup,0.2*m_fHeightPopup),"Recharge Failure");
		
		m_skinHelpScreen.label.normal.textColor  	=	Color(128/255.0F,128/255.0F,128/255.0F,255/255.0F);
		m_skinHelpScreen.label.alignment 			=	TextAnchor.MiddleCenter;
		m_skinHelpScreen.label.fontSize 			=	Mathf.Min(m_fWidthPopup,m_fHeightPopup)/12.0;
		m_skinHelpScreen.label.font			=	m_fontRegular;
		GUI.Label(Rect(0,0.4*m_fHeightPopup,m_fWidthPopup,0.2*m_fHeightPopup),"Please keep your STB ON and click the Fix button below.");
		
		m_skinHelpScreen.button.fontSize 			=	Mathf.Min(m_fWidthPopup,m_fHeightPopup)/12.0;
		if(GUI.Button(Rect(0.3*m_fWidthPopup,0.7*m_fHeightPopup,0.4*m_fWidthPopup,0.15*m_fHeightPopup),"Fix"))
		{	tracking("Fix");
			RefreshAPI("Reauthorize");
			m_iFrameId = 2;
			m_iTimeStamp = Time.time;
		}
	}
	if(m_iFrameId == 2)
	{
		m_skinHelpScreen.label.normal.textColor  	=	Color(128/255.0F,128/255.0F,128/255.0F,255/255.0F);
		m_skinHelpScreen.label.alignment 			=	TextAnchor.MiddleCenter;
		m_skinHelpScreen.label.fontSize 			=	Mathf.Min(m_fWidthPopup,m_fHeightPopup)/12.0;
		m_skinHelpScreen.label.font			=	m_fontRegular;
		GUI.Label(Rect(0,0.6*m_fHeightPopup,m_fWidthPopup,0.2*m_fHeightPopup),"Please wait while we try to fix the issue.");
		
		m_skinHelpScreen.label.normal.textColor  	=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
		m_skinHelpScreen.label.fontSize 			=	Mathf.Min(m_fWidthPopup,m_fHeightPopup)/12.0;
		m_iTimeRemaining = 10 - (Time.time - m_iTimeStamp);
		GUI.Label(Rect(0.375*m_fWidthPopup,0.75*m_fHeightPopup,0.25*m_fWidthPopup,0.15*m_fHeightPopup),m_iTimeRemaining + "sec...");
		
		//GUI.DrawTexture(Rect(0.3*m_fWidthPopup,0.125*m_fHeightPopup,0.4*m_fWidthPopup,0.4*m_fWidthPopup),m_tex2DInfinityFrame);
		RenderPleaseWaitSplash(Screen.width/2.0 - m_fWidthPopup/2.0 + 0.3*m_fWidthPopup,Screen.height/2.0 - m_fHeightPopup/2.0 + 0.1*m_fHeightPopup,0.15*m_fWidthPopup,0.15*m_fWidthPopup);
		
		if(m_iTimeRemaining <= 0)
		{
			m_iFrameId = 3;
		}
	}
	if(m_iFrameId == 3)
	{	
		GUI.Label(Rect(0.1*m_fWidthPopup,0.2*m_fHeightPopup,0.8*m_fWidthPopup,0.4*m_fHeightPopup),"Please check whether your issue is now resolved or not?");
		
		if(GUI.Button(Rect(0.55*m_fWidthPopup,0.7*m_fHeightPopup,0.3*m_fWidthPopup,0.15*m_fHeightPopup),"No"))
		{	tracking("check whether your issue is now resolved --> NO--> Complaint for E107 Logged");
			LogComplaintForE107();
			m_iFrameId = 4;
		}
		
		if(GUI.Button(Rect(0.15*m_fWidthPopup,0.7*m_fHeightPopup,0.3*m_fWidthPopup,0.15*m_fHeightPopup),"Yes"))
		{	tracking("check whether your issue is now resolved --> Yes");
			m_iSelectedBoxIndex = 0;
			m_iFrameId = 0;
		}
	}
	if(m_iFrameId == 4)
	{
		m_skinHelpScreen.label.normal.textColor  	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
		m_skinHelpScreen.label.alignment 			=	TextAnchor.MiddleCenter;
		m_skinHelpScreen.label.fontSize 			=	Mathf.Min(m_fWidthPopup,m_fHeightPopup)/12.0;
		
		GUI.Label(Rect(0.1*m_fWidthPopup,0.2*m_fHeightPopup,0.8*m_fWidthPopup,0.4*m_fHeightPopup),"Thank you! Your complaint has been registered.");
		if(GUI.Button(Rect(0.65*m_fWidthPopup,0.7*m_fHeightPopup,0.25*m_fWidthPopup,0.15*m_fHeightPopup),"OK"))
		{	tracking("complaint has been registered.");
			m_iFrameId = 0;
			m_iSelectedBoxIndex = 0;
		}
	}
}

function SlidePromptsForContactInfo()
{
	m_skinHelpScreen.label.normal.textColor  	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
	m_skinHelpScreen.label.alignment 			=	TextAnchor.MiddleCenter;
	m_skinHelpScreen.label.fontSize 			=	Mathf.Min(m_fWidthPopup,m_fHeightPopup)/12.0;
	
	GUI.Label(Rect(0.1*m_fWidthPopup,0.2*m_fHeightPopup,0.8*m_fWidthPopup,0.4*m_fHeightPopup),"Please contact us for any query at 07355873558 or mail us at customercare@d2h.com");
	if(GUI.Button(Rect(0.65*m_fWidthPopup,0.7*m_fHeightPopup,0.25*m_fWidthPopup,0.15*m_fHeightPopup),"OK"))
	{
		m_iFrameId = 0;
		m_iSelectedBoxIndex = 0;
	}
}

function RenderPleaseWaitSplash(fX	:	float, fY	:	float, fDimX	:	float, fDimY	:	float)
{
	var v2PivotPoint :	Vector2		=	Vector2(fX,fY);
	GUIUtility.RotateAroundPivot (m_fDeltaAngleOfRotation, v2PivotPoint); 
	GUI.Label(Rect(fX - 0.5*fDimX,fY - 0.5*fDimY, fDimX, fDimY),"",m_skinRefreshButton.label);
	GUIUtility.RotateAroundPivot (0, v2PivotPoint); 
	m_fDeltaAngleOfRotation += 1.5;
}

function SkinButtonAsAButton()
{
	m_skinHelpScreen.button.normal.background 		= 	m_tex2DPurple;
	m_skinHelpScreen.button.hover.background 		= 	m_tex2DOrange;
	m_skinHelpScreen.button.active.background 		= 	m_tex2DOrange;
	m_skinHelpScreen.button.normal.textColor 		= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinHelpScreen.button.font				= 	m_fontRegular;
	m_skinHelpScreen.button.fontSize 				=	0.15*Mathf.Min(m_fWidthPopup,m_fHeightPopup)/1.5;
	m_skinHelpScreen.button.alignment				=	TextAnchor.MiddleCenter;
	m_skinHelpScreen.button.contentOffset.x			=	0.0;
}

//function TrackEvent(fWaitTime	:	float)
//{
//	yield WaitForSeconds(fWaitTime);
//	TE("Help");
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
function Identify(strClickedOn : String) {
	var objHeaders : Hashtable = new Hashtable();
	objHeaders.Add("Content-Type","application/json");
	var customerId = PlayerPrefs.GetString("CustomerId");
	var emailId = PlayerPrefs.GetString("EmailId");
	var balance = PlayerPrefs.GetString("Balance");
	var nextRechargeDate = PlayerPrefs.GetString("NextRechargeDate");
	//var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"email\":\"" + emailId + "\",\"balance\":\"" + balance +"\",\"nextRechargeDate\":\"" + nextRechargeDate +"\",\"event\":\"" + strClickedOn + "\"}";
	var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"traits\":{\"Error\":\"" + strClickedOn + "\"}}";
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
