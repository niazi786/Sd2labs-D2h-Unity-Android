#pragma strict

public class DealerDetails
{
	public var m_strContactPerson	:	String;
	public var m_strPhone1			:	String;
	public var m_strPhone2			:	String;
	public var m_strPhone3			:	String;
	public var m_strPinCode			:	String;
	public var m_strState			:	String;
	public var m_strStoreAddress	:	String;
	public var m_strStoreName		:	String;
	public var m_strTown			:	String;
	public var m_strVendorName		:	String;
}

public class COffer
{
	public var m_strDuration		:	String;
	public var m_strPrice			:	String;
	public var m_strExtraDays		:	String;
}

public class CPackageWithOffers
{
	public var m_strPackageName		:	String;
	public var m_strPackagePrice	:	String;
	public var m_strOfferRegion		:	String;
	public var m_iOffersCount		:	int;
	public var m_objArrayOfOffers	:	COffer[];
}

var	m_objScriptAPIHandler			:	ScriptAPIHandler;
var m_objScriptAnimation			:	ScriptAnimation;
var m_objVoucherRechargeAPIPacket	:	CWebAPIPacket;
var	m_objRechargeLocatorAPIPacket	:	CWebAPIPacket;
var m_objRechargeOffersAPIPacket	:	CWebAPIPacket;
var m_objGetBalanceAPIPacket		:	CWebAPIPacket;
static var	gs_arrDealerDetails		:	DealerDetails[];
static var	g_arrCPackageWithOffers	:	CPackageWithOffers[];

private var m_strCustomerId			:	String;
private var m_strUUID				:	String;
private var m_strCurrentBalance		:	String;
var m_strMessageNote				:	String;

var m_strVoucherSNo					:	String;
var m_strVoucherPin					:	String;
var	m_strRechargeAmount				:	String;
var m_strInputVoucherSNo			:	String;
var m_strInputVoucherPin			:	String;
var	m_strInputRechargeAmount		:	String;

static var g_bDealersListAvailable	:	boolean;
static var g_bOffersListAvailable	:	boolean;//dasji@ccfa.co.in

var	m_bDisplayNote					:	boolean;
var m_bVoucherRechargeInProgress	:	boolean;
var m_bFetchDealersInProgress		:	boolean;
var m_bFetchOffersInProgress		:	boolean;
var m_bGetBalanceInProgress			:	boolean;
var m_bDealerDetailsPopUpEnabled	:	boolean;


var m_fHeightHeader					:	float;
var m_fHeightDiv					:	float;
var	m_fWidthButtonA					:	float;
var	m_fWidthButtonB					:	float;
var	m_fWidthButtonC					:	float;
var m_fGAP							:	float;
var m_fHeightDealersGrid			:	float;
var	m_fWidthGUIGroup				:	float;
var m_fHeightGUIGroup				:	float;
var m_fHeightGUIElement				:	float;
var	m_fWidthPopup					:	float;
var m_fHeightPopup					:	float;
var m_fDeltaAngleOfRotation			:	float;

var m_iActivePackage				:	int;
var m_iActiveOffer					:	int;
var m_iDealersCount					:	int;
static var g_iPackagesWithOffersCount		:	int;
var m_iLongPressTicksCount			: 	int;
var m_iSelectedDealerIndex			:	int;
static var m_iSelectedBoxIndex		:	int;

var m_skinRefreshButton				:	GUISkin;
var m_skinRechargeScreen			:	GUISkin;

var m_fontRegular					:	Font;
var m_fontBold						:	Font;

var m_tex2DPurple					:	Texture2D;
var m_tex2DLightPurple				:	Texture2D;
var m_tex2DOrange					:	Texture2D;
var m_tex2DWhite					:	Texture2D;
var m_tex2DBlack					:	Texture2D;
var m_tex2DPurpleWhite				:	Texture2D;
var m_tex2DGray						:	Texture2D;
var m_tex2DPopUpBackground			:	Texture2D;
var m_tex2DHorizontalDots			:	Texture2D;

var m_tex2DServerError				:	Texture2D;
var m_tex2DLocationPointer			:	Texture2D;
var m_tex2DCreditCard				:	Texture2D;
var m_tex2DWhiteCreditCard			:	Texture2D;
var m_tex2DHeptStar					:	Texture2D;
var m_tex2DMouse					:	Texture2D;
var m_tex2DVoucher					:	Texture2D;
var m_tex2DPackageBox				:	Texture2D;
//var m_tex2DRechargeOfferBanner		:	Texture2D;

var m_v2DealersListScroll_X			:	Vector2;
var m_v2PivotPoint					:	Vector2;

var m_objKeyboardAmount				:	TouchScreenKeyboard;
var m_objKeyboardVoucherPin			:	TouchScreenKeyboard;
var m_objKeyboardVoucherSNo			:	TouchScreenKeyboard;

function Start () 
{
	m_strCustomerId 				=	PlayerPrefs.GetString("CustomerId");
	m_strUUID						=	PlayerPrefs.GetString("DeviceUID");
	m_strCurrentBalance				=	PlayerPrefs.GetString("Balance");
	
	tracking("Recharge");
	
	if(ScriptProfilePage.g_iActiveScreenId == 7)
	{
		m_iSelectedBoxIndex	=	5;
		//PlayerPrefs.SetString("HeaderTitle","");
		ScriptProfilePage.g_iActiveScreenId	=	3;
		StartCoroutine(RefreshBalance(0.0));
	}
	else if(ScriptProfilePage.g_iActiveScreenId == 8)
	{
		m_iSelectedBoxIndex	=	6;
		//PlayerPrefs.SetString("HeaderTitle","");
		ScriptProfilePage.g_iActiveScreenId	=	3;
		StartCoroutine(RefreshBalance(0.0));
	}
	else
	{
		if(m_iSelectedBoxIndex <= 0)
		{
			m_iSelectedBoxIndex	= 0;
		}
		//StartCoroutine(TrackEvent(0.1));
	}
	
	//PlayerPrefs.SetInt("ActiveScreenId",3);
	ScriptProfilePage.g_iActiveScreenId	=	3;
	
	m_objScriptAPIHandler 			=	GetComponent(ScriptAPIHandler);
    m_objScriptAnimation 			=	GetComponent(ScriptAnimation);
	
	m_strMessageNote				=	"";
	m_bDisplayNote					=	false;
	m_bVoucherRechargeInProgress	=	false;
	m_bFetchDealersInProgress		=	false;
	m_bFetchOffersInProgress		=	false;
	
	m_iDealersCount					=	0;
	
	if(g_iPackagesWithOffersCount <= 0)
	{
		g_iPackagesWithOffersCount		=	0;
	}
	m_iSelectedDealerIndex			=	-1;
	m_iActivePackage				=	0;
	m_iActiveOffer					=	0;
	
	InitTextfields();
}

function InitTextfields()
{
	m_strVoucherSNo				=	"Enter the last 4 digits of Recharge Coupon Voucher Serial Number";
	m_strVoucherPin			 	=	"Enter the 12-digit Recharge Coupon Voucher Pin";
	m_strRechargeAmount			=	"500";//"Enter Recharge Amount (INR)";
}
function ClearTextfieldsIfAny()
{
	if(m_strVoucherSNo != "" || m_strVoucherPin	!= "" || m_strRechargeAmount != "")
	{
		m_strVoucherSNo	=	"";
		m_strVoucherPin	=	"";
		m_strRechargeAmount	=	"";
	}
}
function ClearMessageNoteIfAny()
{
	if(m_bDisplayNote || m_strMessageNote != "")
	{
		m_bDisplayNote	=	false;
		m_strMessageNote	=	"";
	}
}
function RefreshBalance(fWait : float)
{
	yield WaitForSeconds(fWait);
	
	// "{\"uuId\":\"97182345\"}"
	var strAPIURL					=	ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
    var strAPIMethod				=	"user/GetUserBalanceAndRechargeDueDate";
    var strInput					=	"{\"uuId\":\"" + m_strUUID + "\"}";
    
    m_objGetBalanceAPIPacket		=	new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    
    m_bGetBalanceInProgress	=	true;
    m_objScriptAPIHandler.InvokeReSTfulAPI(m_objGetBalanceAPIPacket);
}
function HandleGetBalanceAPIResponse()
{
	var strGetBalanceResult		:	String;
	var strGetNextRechargeDate	:	String;
	if(m_objGetBalanceAPIPacket.m_strResponseCode == "200 OK")
	{
		if(m_objGetBalanceAPIPacket.m_strOutput != "")
		{
			var N = JSON.Parse(m_objGetBalanceAPIPacket.m_strOutput);
			if(N == null)
			{
				return "NULL JSON";
			}
			else
			{
				//Debug.Log("Reassembled: " + N.ToString());
				if(N.ToString() == "{}")
				{
					return "Empty JSON";
				}
				
				strGetBalanceResult	=	N["CustomerBalance"];
				strGetNextRechargeDate 	=	N["GetNextRechargeDate"];
		
				//strGetBalanceResult = m_objGetBalanceAPIPacket.m_strOutput;
			
				var fBalance	:	float	=	parseFloat(strGetBalanceResult);
				fBalance = -1*fBalance;
				strGetBalanceResult	=	fBalance.ToString("f2");
				
				if(fBalance > parseFloat(m_strCurrentBalance))
				{
					PlayerPrefs.SetString("Balance", strGetBalanceResult);
					PlayerPrefs.SetString("NextRechargeDate",strGetNextRechargeDate);
				}
			}
		}
	}
	else
	{
		strGetBalanceResult	=	"Connection Error : " + m_objGetBalanceAPIPacket.m_strResponseCode;
		print(strGetBalanceResult);
	}
	m_bGetBalanceInProgress	=	false;
	m_objGetBalanceAPIPacket.m_bResponseReceived	=	false;
}
function Update () 
{
	if(Input.GetKeyDown(KeyCode.Escape))
	{
		if(m_bVoucherRechargeInProgress == true)
		{
			if(m_objVoucherRechargeAPIPacket.m_bResponseReceived == true) // result aa gaya : Ok button dikh raha hai
			{
				PostVoucherRechargeActions();
			}
			return;
		}
		
		if(m_iSelectedBoxIndex == 0)
		{
			Application.LoadLevel("SceneHomePage");
		}
		else if(m_iSelectedBoxIndex == 1)
		{
			if(m_bDealerDetailsPopUpEnabled)
			{
				m_bDealerDetailsPopUpEnabled 	= 	false;
				m_iSelectedDealerIndex			=	-1;
			}
			else
			{
				m_iSelectedBoxIndex--;
			}
		}
		else if(m_iSelectedBoxIndex == 4	||	m_iSelectedBoxIndex == 5	||	m_iSelectedBoxIndex == 6)
		{
			InitTextfields();
			ClearMessageNoteIfAny();
			m_iSelectedBoxIndex	=	2;
		}
		else
		{
			ClearMessageNoteIfAny();
			m_iSelectedBoxIndex = 0;
		}
	}
}

function OnGUI ()
{
	if(m_iSelectedBoxIndex == 0)
	{
		RenderRechargeScreenForIPHONE();
	}
	else if(m_iSelectedBoxIndex == 1)
	{
		if(!g_bDealersListAvailable)
		{
			if(!m_bFetchDealersInProgress)
			{
				FetchRechargeDealersList();
			}
			else
			{
				if(m_objRechargeLocatorAPIPacket.m_bResponseReceived)
				{
					ProcessRechargeLocatorAPIResponse();
				}
				else
				{
					RenderPleaseWaitSplash("Recharge Counters & Dealers");
				}
			}
		}
		else
		{
			RenderRechargeDealersList();
		}
	}
	else if(m_iSelectedBoxIndex == 2)
	{
		RenderRechargeNow();
	}
	else if(m_iSelectedBoxIndex == 3)
	{
		if(g_bOffersListAvailable)
		{
			RenderRechargeOffers();
		}
		else
		{
			if(!m_bFetchOffersInProgress)
			{
				if(m_objRechargeOffersAPIPacket.m_strErrorMessage == "")
				{
					FetchRechargeOffersList();
				}
				else
				{
					ShowRechargeOffersAPIError();
				}
			}
			else
			{
				if(m_objRechargeOffersAPIPacket.m_bResponseReceived)
				{
					ProcessRechargeOffersAPIResponse();
				}
				else
				{
					RenderPleaseWaitSplash("Recharge Offers");
				}
			}
		}
	}
	else if(m_iSelectedBoxIndex == 4)
	{
		if(!m_bGetBalanceInProgress)
		{
			RenderRechargeVoucher();
		}
		else
		{
			if(m_objGetBalanceAPIPacket.m_bResponseReceived)
			{
				HandleGetBalanceAPIResponse();
			}
			else
			{
				//animate
				RenderPleaseWaitSplash("Recharge Voucher");
			}
		}
	}
	else if(m_iSelectedBoxIndex == 5)
	{
		if(!m_bGetBalanceInProgress)
		{
			RenderRechargeViaNBCC("Recharge : Net Banking", 1);
		}
		else
		{
			if(m_objGetBalanceAPIPacket.m_bResponseReceived)
			{
				HandleGetBalanceAPIResponse();
			}
			else
			{
				//animate
				RenderPleaseWaitSplash("Recharge : Net Banking");
			}
		}
	}
	else if(m_iSelectedBoxIndex == 6)
	{
		if(!m_bGetBalanceInProgress)
		{
			RenderRechargeViaNBCC("Recharge : Credit Card", 2);
		}
		else
		{
			if(m_objGetBalanceAPIPacket.m_bResponseReceived)
			{
				HandleGetBalanceAPIResponse();
			}
			else
			{
				//animate
				RenderPleaseWaitSplash("Recharge : Credit Card");
			}
		}
	}
	
	
}

function RenderRechargeScreenForIPHONE()
{
	var fUnitY	:	float	=	Screen.height/12.8;
	m_fHeightHeader		 	=	1.3*fUnitY;
	m_fGAP					=	0.125*fUnitY;
	m_fHeightDiv			=	0.5*(Screen.height - 3*m_fGAP - 2*m_fHeightHeader);
	m_fWidthButtonA			=	0.25*(Screen.width - 3*m_fGAP);
	m_fWidthButtonB			=	0.75*(Screen.width - 3*m_fGAP);
	m_fWidthButtonC			=	Screen.width - 2*m_fGAP;
	
	GUI.skin = m_skinRechargeScreen;
	//*************************	Header	***********************//
	RenderHeader("Recharge");
		
	//*************************	Box A : Recharge Counters & Dealers	***********************//
	GUI.BeginGroup(Rect(m_fGAP,m_fHeightHeader + m_fGAP,m_fWidthButtonA,m_fHeightDiv));
		m_skinRechargeScreen.button.wordWrap			=	true;
		m_skinRechargeScreen.button.fontSize			=	Mathf.Min(Screen.width,m_fHeightHeader)/2.0;
		m_skinRechargeScreen.button.font				=	m_fontRegular;
		m_skinRechargeScreen.button.contentOffset.x		=	0.0;
		SkinButtonInLightPurpleOrange();
		
		var guicontentsBoxAButton	:	GUIContent = new GUIContent("Recharge Counters & Dealers",m_tex2DLocationPointer);
		if(GUI.Button(Rect(0, 0, m_fWidthButtonA, m_fHeightDiv),guicontentsBoxAButton))
		{
			m_iSelectedBoxIndex = 1;
			tracking("Recharge -> Recharge Counters & Dealers");
		}
	GUI.EndGroup();
	
	//*************************	Box B : Recharge Now	***********************//
	GUI.BeginGroup(Rect(m_fWidthButtonA + 2*m_fGAP,m_fHeightHeader + m_fGAP,m_fWidthButtonB,m_fHeightDiv));
	
		SkinButtonInPurpleOrange();
		m_skinRechargeScreen.button.fontSize 			= 	Mathf.Min(Screen.width,m_fHeightHeader)/2.0;
		var guicontentsRechargeNow : GUIContent 		= 	new GUIContent("Recharge Now",m_tex2DWhiteCreditCard);
		if(GUI.Button(Rect(0,0,m_fWidthButtonB,m_fHeightDiv), guicontentsRechargeNow))
		{
			m_iSelectedBoxIndex = 2;
			tracking("Recharge -> Recharge Now");
		}
	GUI.EndGroup();	
				
	//*************************	Box C : Recharge Offers ***********************//
	GUI.BeginGroup(Rect(m_fGAP,m_fHeightHeader + m_fGAP + m_fHeightDiv + m_fGAP,m_fWidthButtonC,m_fHeightDiv));
		
		SkinButtonInLightPurpleOrange();
		m_skinRechargeScreen.button.fontSize 			= 	Mathf.Min(Screen.width,m_fHeightHeader)/2.0;
		var guicontentsRechargeOffers : GUIContent 		= 	new GUIContent("Recharge Offers",m_tex2DHeptStar);
		if(GUI.Button(Rect(0,0,m_fWidthButtonC,m_fHeightDiv), guicontentsRechargeOffers))
		{
			m_iSelectedBoxIndex = 3;
			tracking("Recharge -> Recharge Offers");
		}
	GUI.EndGroup();
	GUI.skin = null;
}

function RenderHeader(strCaption	:	String)
{
	//*************************	Header	***********************//
	GUI.BeginGroup(Rect(0,0,Screen.width,m_fHeightHeader));
		SkinBoxInPurple();
		m_skinRechargeScreen.box.fontSize 			= 	Mathf.Min(Screen.width,m_fHeightHeader)/1.5;
		m_skinRechargeScreen.box.font			= 	m_fontRegular;	
		GUI.Box(Rect(0,0,Screen.width,m_fHeightHeader),strCaption);
	GUI.EndGroup();
}

function SkinBoxInPurple()
{
	m_skinRechargeScreen.box.normal.background	=	m_tex2DPurple;
	m_skinRechargeScreen.box.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.box.hover.background	=	m_tex2DPurple;
	m_skinRechargeScreen.box.hover.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.box.active.background	=	m_tex2DPurple;
	m_skinRechargeScreen.box.active.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.box.alignment			=	TextAnchor.MiddleCenter;
}

function SkinBoxInLightPurple()
{
	m_skinRechargeScreen.box.normal.background	=	m_tex2DLightPurple;
	m_skinRechargeScreen.box.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.box.hover.background	=	m_tex2DLightPurple;
	m_skinRechargeScreen.box.hover.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.box.active.background	=	m_tex2DLightPurple;
	m_skinRechargeScreen.box.active.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.box.alignment			=	TextAnchor.MiddleCenter;
}

function SkinBoxInBlack()
{
	m_skinRechargeScreen.box.normal.background	=	m_tex2DBlack;
	m_skinRechargeScreen.box.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.box.hover.background	=	m_tex2DBlack;
	m_skinRechargeScreen.box.hover.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.box.active.background	=	m_tex2DBlack;
	m_skinRechargeScreen.box.active.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.box.alignment			=	TextAnchor.MiddleLeft;
}


function SkinBoxInWhite()
{
	m_skinRechargeScreen.box.normal.background	=	m_tex2DWhite;
	m_skinRechargeScreen.box.normal.textColor	=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	m_skinRechargeScreen.box.hover.background	=	m_tex2DWhite;
	m_skinRechargeScreen.box.hover.textColor	=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	m_skinRechargeScreen.box.active.background	=	m_tex2DWhite;
	m_skinRechargeScreen.box.active.textColor	=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	m_skinRechargeScreen.box.alignment			=	TextAnchor.MiddleCenter;
}

function SkinButtonInPurpleOrange()
{
	m_skinRechargeScreen.button.normal.background		=	m_tex2DPurple;
	m_skinRechargeScreen.button.hover.background		=	m_tex2DOrange;
	m_skinRechargeScreen.button.active.background		=	m_tex2DOrange;
	m_skinRechargeScreen.button.normal.textColor		=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.button.hover.textColor			=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.button.active.textColor		=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.button.alignment				=	TextAnchor.MiddleCenter;
}

function SkinButtonInLightPurpleOrange()
{
	m_skinRechargeScreen.button.normal.background		=	m_tex2DLightPurple;
	m_skinRechargeScreen.button.hover.background		=	m_tex2DOrange;
	m_skinRechargeScreen.button.active.background		=	m_tex2DOrange;
	m_skinRechargeScreen.button.normal.textColor		=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.button.hover.textColor			=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.button.active.textColor		=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.button.alignment				=	TextAnchor.MiddleCenter;
}

function SkinButtonInWhiteOrange()
{
	m_skinRechargeScreen.button.normal.background		=	m_tex2DWhite;
	m_skinRechargeScreen.button.hover.background		=	m_tex2DOrange;
	m_skinRechargeScreen.button.active.background		=	m_tex2DOrange;
	m_skinRechargeScreen.button.normal.textColor		=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	m_skinRechargeScreen.button.hover.textColor			=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.button.active.textColor		=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.button.alignment				=	TextAnchor.MiddleCenter;
}

function SkinButtonTransparent()
{
	m_skinRechargeScreen.button.normal.background		=	m_tex2DPurple;
	m_skinRechargeScreen.button.hover.background		=	m_tex2DPurple;
	m_skinRechargeScreen.button.active.background		=	m_tex2DPurple;
	m_skinRechargeScreen.button.normal.textColor		=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.button.hover.textColor			=	Color(192/255.0F,192/255.0F,192/255.0F,255/255.0F);
	m_skinRechargeScreen.button.active.textColor		=	Color(192/255.0F,192/255.0F,192/255.0F,255/255.0F);
	m_skinRechargeScreen.button.alignment				=	TextAnchor.MiddleCenter;
}

function SkinButtonAsATextfield()
{
	m_skinRechargeScreen.button.normal.background 		= 	m_tex2DWhite;
	m_skinRechargeScreen.button.hover.background 		= 	m_tex2DWhite;
	m_skinRechargeScreen.button.active.background 		= 	m_tex2DWhite;
	m_skinRechargeScreen.button.normal.textColor 		= 	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
	m_skinRechargeScreen.button.hover.textColor 		= 	Color(128/255.0F,128/255.0F,128/255.0F,255/255.0F);
	m_skinRechargeScreen.button.active.textColor 		= 	Color(128/255.0F,128/255.0F,128/255.0F,255/255.0F);
	m_skinRechargeScreen.button.font					= 	m_fontRegular;
	m_skinRechargeScreen.button.fontSize 				=	Screen.width/35.0;
	m_skinRechargeScreen.button.alignment				=	TextAnchor.MiddleCenter;
	m_skinRechargeScreen.button.contentOffset.x			=	0;
}

function SkinTextfieldAsATextfield()
{	
	m_skinRechargeScreen.textField.normal.background	=	m_tex2DWhite;
	m_skinRechargeScreen.textField.hover.background		=	m_tex2DWhite;
	m_skinRechargeScreen.textField.active.background	=	m_tex2DWhite;
	m_skinRechargeScreen.textField.normal.textColor		=	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
	m_skinRechargeScreen.textField.hover.textColor		=	Color(128/255.0F,128/255.0F,128/255.0F,255/255.0F);
	m_skinRechargeScreen.textField.active.textColor		=	Color(128/255.0F,128/255.0F,128/255.0F,255/255.0F);
	m_skinRechargeScreen.textField.alignment			=	TextAnchor.MiddleCenter;
	m_skinRechargeScreen.textField.fontSize				=	Screen.width/35.0;
	m_skinRechargeScreen.textField.font					=	m_fontRegular;
	m_skinRechargeScreen.textField.contentOffset.x		=	0;//Screen.width/40.0;
		
	m_skinRechargeScreen.settings.cursorColor			=	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
}

function RenderBackground(tex2DBackground	:	Texture2D)
{
	GUI.BeginGroup(Rect(0, m_fHeightHeader, Screen.width, Screen.height - 2*m_fHeightHeader));
	
		SkinBoxInWhite();
		GUI.Box(Rect(0,0,Screen.width,Screen.height - 2*m_fHeightHeader),"");
		
	GUI.EndGroup();
}

function RenderRechargeNow()
{
	var fUnitY	:	float	=	Screen.height/12.8;
	m_fHeightHeader		 	=	1.3*fUnitY;
	m_fGAP					=	0.125*fUnitY;
	m_fHeightDiv			=	0.5*(Screen.height - 3*m_fGAP - 2*m_fHeightHeader);
	m_fWidthButtonA			=	0.35*(Screen.width - 3*m_fGAP);
	m_fWidthButtonB			=	0.65*(Screen.width - 3*m_fGAP);
	m_fWidthButtonC			=	Screen.width - 2*m_fGAP;
	
	GUI.skin = m_skinRechargeScreen;
	//*************************	Header	***********************//
	RenderHeader("Recharge Now");
			
	//*************************	Box A : Net Banking	***********************//
	GUI.BeginGroup(Rect(m_fGAP,m_fHeightHeader + m_fGAP,m_fWidthButtonA,m_fHeightDiv));
		SkinButtonInLightPurpleOrange();
		m_skinRechargeScreen.button.wordWrap			=	true;
		m_skinRechargeScreen.button.fontSize			=	Mathf.Min(Screen.width,m_fHeightHeader)/2.0;
		m_skinRechargeScreen.button.font				=	m_fontRegular;
		
		var guicontentsBoxAButton	:	GUIContent = new GUIContent("Net Banking",m_tex2DMouse);
		if(GUI.Button(Rect(0, 0, m_fWidthButtonA, m_fHeightDiv),guicontentsBoxAButton))
		{	tracking("Balance => Recharge Now => Net Banking");
			m_iSelectedBoxIndex = 5;
		}
	GUI.EndGroup();
	
	//*************************	Box B : Recharge Voucher	***********************//
	GUI.BeginGroup(Rect(m_fGAP + m_fWidthButtonA + m_fGAP,m_fHeightHeader + m_fGAP,m_fWidthButtonB,m_fHeightDiv));
	
		SkinButtonInPurpleOrange();
		m_skinRechargeScreen.button.fontSize 			= 	Mathf.Min(Screen.width,m_fHeightHeader)/2.0;
		var guicontentsBoxBButton : GUIContent 			= 	new GUIContent("Recharge Voucher",m_tex2DVoucher);
		if(GUI.Button(Rect(0,0,m_fWidthButtonB,m_fHeightDiv), guicontentsBoxBButton))
		{	tracking("Balance => Recharge Now =>Recharge Voucher");
			m_iSelectedBoxIndex = 4;
		}
	GUI.EndGroup();	
				
	//*************************	Box C : Credit Card ***********************//
	GUI.BeginGroup(Rect(m_fGAP,m_fHeightHeader + m_fGAP + m_fHeightDiv + m_fGAP,m_fWidthButtonC,m_fHeightDiv));
		
		SkinButtonInLightPurpleOrange();
		m_skinRechargeScreen.button.fontSize 			= 	Mathf.Min(Screen.width,m_fHeightHeader)/2.0;
		var guicontentsBoxCButton : GUIContent 			= 	new GUIContent("Credit Card",m_tex2DWhiteCreditCard);
		if(GUI.Button(Rect(0,0,m_fWidthButtonC,m_fHeightDiv), guicontentsBoxCButton))
		{	tracking("Balance => Recharge Now =>Credit Card");
			m_iSelectedBoxIndex	= 6;
		}
	GUI.EndGroup();
	
	//*************************	Box D : Footer ***********************//
	GUI.BeginGroup(Rect(m_fHeightHeader,Screen.height/2.0 + m_fGAP + m_fHeightDiv,m_fWidthButtonC,m_fHeightHeader));
		
		if(m_bDisplayNote)
			GUI.Label(Rect(0,0,m_fWidthButtonC,m_fHeightHeader),"Note: " + m_strMessageNote);
	GUI.EndGroup();
	
	GUI.skin = null;
}

function RenderRechargeViaNBCC(strHeaderTitle	:	String, iRoute	:	int)
{
	var fUnitY	:	float	=	Screen.height/12.8;
	m_fHeightHeader		 	=	1.3*fUnitY;
	m_fGAP					=	0.125*fUnitY;
	m_fWidthGUIGroup		=	Screen.width - 5*m_fHeightHeader;
	m_fHeightGUIGroup		=	Screen.height - 6*m_fHeightHeader;
	m_fHeightGUIElement		=	(m_fHeightGUIGroup - 2*m_fGAP)/3.0;
	
	GUI.skin = m_skinRechargeScreen;
	
	//*************************	Header	***********************//
	RenderHeader(strHeaderTitle);
	
	//*************************	Amount | Submit Button ***********************//
	GUI.BeginGroup(Rect(2.5*m_fHeightHeader,3.5*m_fHeightHeader,m_fWidthGUIGroup,m_fHeightGUIGroup));
		
		
		//SkinTextfieldAsATextfield();
		//m_strRechargeAmount	=	GUI.TextField(Rect(0, 0, m_fWidthGUIGroup, m_fHeightGUIElement),m_strRechargeAmount);
		
		SkinButtonAsATextfield();
		if(GUI.Button(Rect(0, 0, m_fWidthGUIGroup, m_fHeightGUIElement),m_strRechargeAmount))
		{
			m_objKeyboardAmount	=	TouchScreenKeyboard.Open(m_strInputRechargeAmount,TouchScreenKeyboardType.NumberPad,false,false,false,false,"Enter Recharge Amount(INR)");
		}
		if(m_objKeyboardAmount)
		{
			if(m_objKeyboardAmount.done)
			{
				if(m_objKeyboardAmount.text == "")
				{
					m_strRechargeAmount	= "Enter Recharge Amount (INR)";
				}
				else
				{
					m_strRechargeAmount	= m_objKeyboardAmount.text;
				}
				m_objKeyboardAmount	= null;
			}
			else if(m_objKeyboardAmount.active)
			{
				m_strRechargeAmount	= m_strInputRechargeAmount;
			}
		}
		
		SkinButtonInPurpleOrange();
		m_skinRechargeScreen.button.fontSize = Mathf.Min(Screen.width,m_fHeightHeader)/2.0;
		if(GUI.Button(Rect(0, (m_fHeightGUIElement + m_fGAP), m_fWidthGUIGroup, m_fHeightGUIElement),"Submit"))
		{	Identify();
			tracking("Submit");
			ClearMessageNoteIfAny();
			if(IfValidAmount() && IfEnoughAmount())
			{
				if(iRoute == 1)
				{	
					tracking("Balance => Recharge Now => - Net Banking Browser ",m_strRechargeAmount);
					ScriptProfilePage.g_iActiveScreenId	=	7;
					PlayerPrefs.SetString("HeaderTitle","Net Banking");
					PlayerPrefs.SetString("BrowserURL", "http://m.videocond2h.com/net_banking.aspx?CustomerID=" + m_strCustomerId + "&Amount=" + m_strRechargeAmount + "&RequestFrom=1");
					Application.LoadLevel("SceneInAppBrowser");
				}
				else if(iRoute	==	2)
				{	
					tracking("Balance => Recharge Now => - Credit Card Browser ",m_strRechargeAmount);
					ScriptProfilePage.g_iActiveScreenId	=	8;
					PlayerPrefs.SetString("HeaderTitle","Credit Card");
					PlayerPrefs.SetString("BrowserURL", "http://m.videocond2h.com/credit_card.aspx?CustomerID=" + m_strCustomerId + "&Amount=" + m_strRechargeAmount + "&RequestFrom=1");
					Application.LoadLevel("SceneInAppBrowser");
				}
			}
		}
		if(m_bDisplayNote)
		{	tracking(m_strMessageNote);
			m_skinRechargeScreen.label.normal.textColor		=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
			m_skinRechargeScreen.label.fontSize 			= 	m_fHeightHeader/3.5;
			m_skinRechargeScreen.label.font					=	m_fontRegular;
			m_skinRechargeScreen.label.alignment			=	TextAnchor.UpperLeft;
			GUI.Label(Rect(0,2*m_fHeightGUIElement + m_fGAP,m_fWidthGUIGroup,m_fHeightHeader),m_strMessageNote);
		}
	GUI.EndGroup();
}
function IfValidAmount()	:	boolean
{
	var iLength :	int	=	m_strRechargeAmount.Length;
	
	for(var i = 0; i < iLength; i++)
	{
		if((m_strRechargeAmount[i] > 47 && m_strRechargeAmount[i] < 58) == false)
		{
			m_bDisplayNote	=	true;
			m_strMessageNote	=	"Invalid Amount: Please enter a numeric recharge amount (Min INR 200)";
			break;
		}
	}
	return !m_bDisplayNote;
}

function IfEnoughAmount()	:	boolean
{
	var iAmount	:	int	= 0;
	if(m_strRechargeAmount != "")
	{
		iAmount = parseInt(m_strRechargeAmount);
	}
	
	if(iAmount < 200)
	{
		m_bDisplayNote	=	true;
		m_strMessageNote	=	"Insufficient Amount " +iAmount+ ": Please enter the minimum recharge amount of INR 200";
	}
	return !m_bDisplayNote;
}

function RenderRechargeVoucher()
{
	var fUnitY	:	float	=	Screen.height/12.8;
	m_fHeightHeader		 	=	1.3*fUnitY;
	m_fGAP					=	0.125*fUnitY;
	m_fWidthGUIGroup		=	Screen.width - 5*m_fHeightHeader;
	m_fHeightGUIGroup		=	Screen.height - 5*m_fHeightHeader;
	m_fHeightGUIElement		=	(m_fHeightGUIGroup - 2*m_fGAP - m_fHeightHeader)/3.0; //-m_fHeightHeader : for footer note
	
	GUI.skin = m_skinRechargeScreen;
	
	//*************************	Header	***********************//
	RenderHeader("Recharge Voucher");
		
	//*************************	Serial No. Textfield | Voucher No. Textfield | Submit Button ***********************//
	GUI.enabled	=	!m_bVoucherRechargeInProgress;
	GUI.BeginGroup(Rect(2.5*m_fHeightHeader,3*m_fHeightHeader,m_fWidthGUIGroup,m_fHeightGUIGroup));
		
		/*SkinTextfieldAsATextfield();
		m_skinRechargeScreen.textField.fontSize				=	Screen.width/45.0;
		
		m_strVoucherPin	=	GUI.TextField(Rect(0, 0, m_fWidthGUIGroup, m_fHeightGUIElement),m_strVoucherPin);
		m_strVoucherSNo	=	GUI.TextField(Rect(0, m_fHeightGUIElement + m_fGAP, m_fWidthGUIGroup, m_fHeightGUIElement),m_strVoucherSNo);
		*/
		
		SkinButtonAsATextfield();
		m_skinRechargeScreen.button.fontSize				=	Screen.width/45.0;
		
		if(GUI.Button(Rect(0, 0, m_fWidthGUIGroup, m_fHeightGUIElement),m_strVoucherPin))
		{
			m_objKeyboardVoucherPin	=	TouchScreenKeyboard.Open(m_strInputVoucherPin,TouchScreenKeyboardType.NumberPad,false,false,false,false,"Enter the 12-digit Recharge Coupon Voucher Pin");
		}
		if(m_objKeyboardVoucherPin)
		{
			if(m_objKeyboardVoucherPin.done)
			{
				if(m_objKeyboardVoucherPin.text == "")
				{
					m_strVoucherPin	= "Enter the 12-digit Recharge Coupon Voucher Pin";
				}
				else
				{
					m_strVoucherPin	= m_objKeyboardVoucherPin.text;
				}
				m_objKeyboardVoucherPin	=	null;
			}
			else if(m_objKeyboardVoucherPin.active)
			{
				m_strVoucherPin = m_strInputVoucherPin;
			}
		}
		
		if(GUI.Button(Rect(0, m_fHeightGUIElement + m_fGAP, m_fWidthGUIGroup, m_fHeightGUIElement),m_strVoucherSNo))
		{
			m_objKeyboardVoucherSNo	=	TouchScreenKeyboard.Open(m_strInputVoucherSNo,TouchScreenKeyboardType.NumberPad,false,false,false,false,"Enter the last 4 digits of Recharge Coupon Voucher Serial Number");
		}
		if(m_objKeyboardVoucherSNo)
		{
			if(m_objKeyboardVoucherSNo.done)
			{
				if(m_objKeyboardVoucherSNo.text == "")
				{
					m_strVoucherSNo = "Enter the last 4 digits of Recharge Coupon Voucher Serial Number";
				}
				else
				{
					m_strVoucherSNo	= m_objKeyboardVoucherSNo.text;
				}
				m_objKeyboardVoucherSNo	=	null;
			}
			else if(m_objKeyboardVoucherSNo.active)
			{
				m_strVoucherSNo = m_strInputVoucherSNo;
			}
		}
		
		SkinButtonInPurpleOrange();
		m_skinRechargeScreen.button.fontSize 				= 	Mathf.Min(Screen.width,m_fHeightHeader)/1.75;
		if(GUI.Button(Rect(0, 2*(m_fHeightGUIElement + m_fGAP), m_fWidthGUIGroup, m_fHeightGUIElement),"Submit"))
		{
			ClearMessageNoteIfAny();
			
			if(ValidateVoucherPin(m_strVoucherPin) == 0)
			{
				m_bDisplayNote	=	true;
				m_strMessageNote	=	"Invalid Recharge Coupon Voucher Pin: Please check whether you have entered the correct 12-digit voucher pin.";
				tracking("Submit -> "+m_strMessageNote);
			}
			else if(ValidateVoucherSNo(m_strVoucherSNo) == 0)
			{
				m_bDisplayNote	=	true;
				m_strMessageNote	=	"Invalid Recharge Coupon Voucher Serial Number: Please check whether you have entered the last 4 digits of voucher serial number correctly.";
				tracking("Submit -> "+m_strMessageNote);
			}
			else if(ValidateVoucherPin(m_strVoucherPin) == 0 && ValidateVoucherSNo(m_strVoucherSNo) == 0)
			{
				m_bDisplayNote	=	true;
				m_strMessageNote	=	"Invalid Recharge Coupon Voucher Pin & Serial Number";
				tracking("Submit -> "+m_strMessageNote);
			}
			else
			{
				tracking("Recharge -> Recharge Now -> Voucher Recharge");
				DoVoucherRecharge();
			}
			
		}
		
		if(m_bDisplayNote)
		{
			m_skinRechargeScreen.label.normal.textColor		=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
			m_skinRechargeScreen.label.fontSize 			= 	m_fHeightHeader/3.5;
			m_skinRechargeScreen.label.font					=	m_fontRegular;
			m_skinRechargeScreen.label.alignment			=	TextAnchor.UpperLeft;
			GUI.Label(Rect(0,2*(m_fHeightGUIElement + m_fGAP) + m_fHeightGUIElement,m_fWidthGUIGroup,m_fHeightHeader),m_strMessageNote);
		}
		
	GUI.EndGroup();
	GUI.enabled	=	true;
	
	if(m_bVoucherRechargeInProgress)
	{	
		m_skinRechargeScreen.window.normal.background	=	null;
		GUI.ModalWindow(0,Rect(0,0,Screen.width,Screen.height),PopupShowingVoucherRechargeProgress,"");
	}
		
	GUI.skin = null;
}

function ValidateVoucherPin(strNumber : String)	:	int
{
	var iLength : int	=	strNumber.Length;
	
	if(iLength == 12)
	{
		for(var i = 0; i < iLength; i++)
		{
			if((strNumber[i] > 47 && strNumber[i] < 58) == false)
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

function ValidateVoucherSNo(strNumber : String)	:	int
{
	var iLength : int	=	strNumber.Length;
	
	if(iLength == 4)
	{
		for(var i = 0; i < iLength; i++)
		{
			if((strNumber[i] > 47 && strNumber[i] < 58) == false)
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

function DoVoucherRecharge()
{
	//http://<hostserver>/MobileEPGService/MobileEPGService.RechargeService.svc/Method/VoucherRecharge
	// Data = '{"VoucherPin":"1212121212","SerialNo":"2222222222222222","CustomerId":"100"}'
	// Method = POST
	//{
	//	VoucherRechargeResult: "Validation unsuccessful." or VoucherRechargeResult: "Invalid Customer Id."
	//}
	
	var strAPIURL					=	ScriptAPIs.g_strWebservicesAtD2H + "MobileEPGServices/";
    var strAPIMethod				=	"MobileEPGService.RechargeService.svc/Method/VoucherRecharge";
    var strInput					=	"{\"VoucherPin\":\"" + m_strVoucherPin + "\",\"SerialNo\":\"" + m_strVoucherSNo + "\",\"CustomerId\":\"" + m_strCustomerId + "\"}";
    
    m_objVoucherRechargeAPIPacket	=	new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    
    m_bVoucherRechargeInProgress	=	true;
    m_objScriptAPIHandler.InvokeReSTfulAPI(m_objVoucherRechargeAPIPacket);
}

function PopupShowingVoucherRechargeProgress()
{
	if(m_objVoucherRechargeAPIPacket.m_bResponseReceived)
	{
		var strVoucherRechargeResult : String;
		if(m_objVoucherRechargeAPIPacket.m_strResponseCode == "200 OK")
		{
			var N = JSON.Parse(m_objVoucherRechargeAPIPacket.m_strOutput);
			if(N == null)
			{
				strVoucherRechargeResult	=	"NULL JSON";
				print(strVoucherRechargeResult);
			}
			else
			{
				Debug.Log("Reassembled: " + N.ToString());
				if(N.ToString() == "{}")
				{
					strVoucherRechargeResult	=	"Empty JSON";
					print(strVoucherRechargeResult);
				}
				else
				{
					strVoucherRechargeResult = N["VoucherRechargeResult"];
					print(strVoucherRechargeResult);
				}
			}
		}
		else
		{
			strVoucherRechargeResult	=	"Connection Error : " + m_objVoucherRechargeAPIPacket.m_strResponseCode;
			print(strVoucherRechargeResult);
		}
		RenderPostVoucherRechargeResult(strVoucherRechargeResult);
	}
	else
	{
		m_objScriptAnimation.AnimationInfinity("voucher recharge is in progress...");
	}
}

function RenderPostVoucherRechargeResult(strVoucherRechargeResult	:	String)
{
	GUI.BeginGroup(Rect(2.5*m_fHeightHeader,3*m_fHeightHeader,m_fWidthGUIGroup,m_fHeightGUIGroup));
	
	m_skinRechargeScreen.box.normal.background	=	m_tex2DWhite;
	m_skinRechargeScreen.box.normal.textColor	=	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
	m_skinRechargeScreen.box.wordWrap			=	true;
	GUI.Box(Rect(0,0,m_fWidthGUIGroup,2*(m_fHeightGUIElement + m_fGAP)),strVoucherRechargeResult);
	
	if(GUI.Button(Rect(0, 2*(m_fHeightGUIElement + m_fGAP), m_fWidthGUIGroup, m_fHeightGUIElement),"OK"))
	{
		PostVoucherRechargeActions();
	}
	
	GUI.EndGroup();
}

function PostVoucherRechargeActions()
{
	StartCoroutine(RefreshBalance(0.0));
		
	m_bVoucherRechargeInProgress						=	false;
	m_objVoucherRechargeAPIPacket.m_bResponseReceived	=	false;
	InitTextfields();
	ClearMessageNoteIfAny();
}

function RenderRechargeOffers()
{
	GUI.skin = m_skinRechargeScreen;
	
	//*************************	Header	***********************//
	RenderHeader("Recharge Offers");
	
	//*************************	Rest of the Screen	***********************//
	var fContentWidth	:	float	=	Screen.width - 2*m_fGAP;
	var fContentHeight	:	float	=	Screen.height - 2*m_fHeightHeader - 4*m_fGAP;
	var fUnitY			:	float	=	fContentHeight/10.0;
	GUI.BeginGroup(Rect(m_fGAP,m_fHeightHeader + m_fGAP,fContentWidth,fContentHeight + 2.0*m_fGAP));
		
		SkinBoxInWhite();
		m_skinRechargeScreen.box.fontSize 			= 	Mathf.Min(fContentWidth,fUnitY)/1.5;
		m_skinRechargeScreen.box.font				= 	m_fontRegular;	
		GUI.Box(Rect(0,0,fContentWidth,fUnitY),g_arrCPackageWithOffers[m_iActivePackage].m_strOfferRegion);
		
		SkinBoxInPurple();
		GUI.Box(Rect(0,fUnitY + m_fGAP,fContentWidth,4*fUnitY),"");
		var guicontentPackage	:	GUIContent		=	new GUIContent("Package : " + g_arrCPackageWithOffers[m_iActivePackage].m_strPackageName,m_tex2DPackageBox);
		GUI.Box(Rect(0,2*fUnitY + m_fGAP,fContentWidth,2*fUnitY),guicontentPackage);
		//GUI.Box(Rect(0,3*fUnitY + m_fGAP,fContentWidth,2*fUnitY),g_arrCPackageWithOffers[m_iActivePackage].m_strPackageName);

		SkinButtonTransparent();
		m_skinRechargeScreen.button.fontSize 		= 	Mathf.Min(Screen.width,m_fHeightHeader)/1.25;
		
		if(GUI.Button(Rect(0,2.0*fUnitY + m_fGAP,0.65*fContentWidth/4.0,2*fUnitY),"<"))
		{
			if(m_iActivePackage > 0)
			{
				m_iActivePackage--;
			}
			else
			{
				m_iActivePackage	=	g_iPackagesWithOffersCount-1;
			}
			if(m_iActiveOffer > 0)
			{
				m_iActiveOffer	=	0;
			}
		}
		if(GUI.Button(Rect(fContentWidth - 0.65*fContentWidth/4.0,2.0*fUnitY + m_fGAP,0.65*fContentWidth/4.0,2*fUnitY),">"))
		{
			if(m_iActivePackage	<	g_iPackagesWithOffersCount-1)
			{
				m_iActivePackage++;
			}
			else
			{
				m_iActivePackage	=	0;
			}
			if(m_iActiveOffer > 0)
			{
				m_iActiveOffer	=	0;
			}
		}
		
		SkinBoxInLightPurple();
		GUI.Box(Rect(0,5*fUnitY + 2*m_fGAP,0.4*fContentWidth,3*fUnitY),"Monthly Price");
		GUI.Box(Rect(0,7*fUnitY + 2*m_fGAP,0.4*fContentWidth,3*fUnitY),"INR " + g_arrCPackageWithOffers[m_iActivePackage].m_strPackagePrice);
		
		SkinBoxInPurple();
		GUI.Box(Rect(0.4*fContentWidth + m_fGAP,fUnitY + m_fGAP + 4*fUnitY + m_fGAP,0.6*fContentWidth,2.0*fUnitY),g_arrCPackageWithOffers[m_iActivePackage].m_objArrayOfOffers[m_iActiveOffer].m_strDuration);
		GUI.Box(Rect(0.4*fContentWidth + m_fGAP,3.0*fUnitY + m_fGAP + 4*fUnitY + m_fGAP,0.6*fContentWidth,1.5*fUnitY),"INR " + g_arrCPackageWithOffers[m_iActivePackage].m_objArrayOfOffers[m_iActiveOffer].m_strPrice);
		SkinBoxInLightPurple();
		GUI.Box(Rect(0.4*fContentWidth + m_fGAP,4.5*fUnitY + m_fGAP + 4*fUnitY + m_fGAP,0.6*fContentWidth,1.5*fUnitY),"+" + g_arrCPackageWithOffers[m_iActivePackage].m_objArrayOfOffers[m_iActiveOffer].m_strExtraDays + " extra");
		SkinButtonTransparent();
		m_skinRechargeScreen.button.fontSize 				= 	Mathf.Min(Screen.width,m_fHeightHeader)/1.25;
		if(GUI.Button(Rect(0.4*fContentWidth + m_fGAP,1.75*fUnitY + m_fGAP + 4*fUnitY + m_fGAP,0.45*fContentWidth/5.0,2*fUnitY),"<"))
		{
			if(m_iActiveOffer > 0)
			{
				m_iActiveOffer--;
			}
			else
			{
				m_iActiveOffer	=	g_arrCPackageWithOffers[m_iActivePackage].m_iOffersCount - 1;
			}
		}
		if(GUI.Button(Rect(fContentWidth - 0.45*fContentWidth/5.0,1.75*fUnitY + m_fGAP + 4*fUnitY + m_fGAP,0.45*fContentWidth/5.0,2*fUnitY),">"))
		{
			if(m_iActiveOffer	<	g_arrCPackageWithOffers[m_iActivePackage].m_iOffersCount - 1)
			{
				m_iActiveOffer++;
			}
			else
			{
				m_iActiveOffer	=	0;
			}
		}

		//GUI.DrawTexture(Rect(0,5*fUnitY + 2*m_fGAP,fContentWidth,466*fContentWidth/1267.0),m_tex2DRechargeOfferBanner);
	GUI.EndGroup();
}



function RenderRechargeDealersList()
{
	m_fHeightDealersGrid = Screen.height - 4*m_fHeightHeader;
	
	GUI.skin = m_skinRechargeScreen;
	
	//*************************	Header	***********************//
	RenderHeader("Recharge Counters & Dealers");
	
	GUI.enabled	=	!m_bDealerDetailsPopUpEnabled;
	//*************************	Nearby Dealer List	***********************//
	GUI.BeginGroup(Rect(0,m_fHeightHeader,Screen.width,m_fHeightHeader));
		SkinBoxInBlack();
		m_skinRechargeScreen.box.fontSize 			= 	Mathf.Min(Screen.width,m_fHeightHeader)/2.5;
		m_skinRechargeScreen.box.font				= 	m_fontBold;
		m_skinRechargeScreen.box.contentOffset.x	=	Screen.width/25.0;
		GUI.Box(Rect(0,0,Screen.width,m_fHeightHeader),"Nearby Dealer List");
	GUI.EndGroup();
	
	//*************************	Grid of dealers	***********************//
	GUI.BeginGroup(Rect(0,2*m_fHeightHeader,Screen.width,m_fHeightDealersGrid));
	
		m_v2DealersListScroll_X = GUI.BeginScrollView(Rect(0,0,Screen.width,m_fHeightDealersGrid), m_v2DealersListScroll_X, Rect(0,0,3*Screen.width,m_fHeightDealersGrid));
		for(var i = 0; i < 6; i++)
		{
			if(i % 2 == 0)//purplish white button
			{
				m_skinRechargeScreen.button.normal.background	=	m_tex2DPurpleWhite;
			}
			else//grey button
			{
				m_skinRechargeScreen.button.normal.background	=	m_tex2DGray;
			}
			m_skinRechargeScreen.button.hover.background		=	m_tex2DOrange;
			m_skinRechargeScreen.button.active.background		=	m_tex2DOrange;
			m_skinRechargeScreen.button.alignment				=	TextAnchor.MiddleLeft;
			m_skinRechargeScreen.button.normal.textColor		=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
			m_skinRechargeScreen.button.fontSize 				= 	Mathf.Min(Screen.width,m_fHeightHeader)/2.75;
			m_skinRechargeScreen.button.contentOffset.x			=	Screen.width/25.0;

			if(GUI.Button(Rect(0, i*(m_fHeightDealersGrid/6.0), Screen.width, m_fHeightDealersGrid/6.0),gs_arrDealerDetails[i].m_strStoreName))
			{
				if(!m_bDealerDetailsPopUpEnabled)
				{
					m_iSelectedDealerIndex	=	i;
					m_bDealerDetailsPopUpEnabled	=	true;		
				}
			}
/*			if(GUI.RepeatButton(Rect(0, i*(m_fHeightDealersGrid/6.0), Screen.width, m_fHeightDealersGrid/6.0),gs_arrDealerDetails[i].m_strStoreName))
			{
				if(!m_bDealerDetailsPopUpEnabled)
				{
					m_iLongPressTicksCount++;
					m_iLongPressTicksCount = m_iLongPressTicksCount % 100;
				
					if(m_iLongPressTicksCount == 0)
					{
						print("popup");
						Handheld.Vibrate();
						
						m_iSelectedDealerIndex	=	i;
						m_bDealerDetailsPopUpEnabled	=	true;
						m_iLongPressTicksCount++;
					}
				}
			}
*/
		}
		GUI.EndScrollView();
		
	GUI.EndGroup();
	
	//*************************	DOTS in the footer	***********************//
	GUI.BeginGroup(Rect(0,2*m_fHeightHeader + m_fHeightDealersGrid,Screen.width,m_fHeightHeader));
	
		m_skinRechargeScreen.box.normal.background	=	m_tex2DWhite;
		m_skinRechargeScreen.box.alignment			=	TextAnchor.MiddleCenter;
		m_skinRechargeScreen.box.normal.textColor	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
		m_skinRechargeScreen.box.fontSize 			= 	Mathf.Min(Screen.width,m_fHeightHeader)/3.75;
		m_skinRechargeScreen.box.font				= 	m_fontRegular;
		m_skinRechargeScreen.box.contentOffset.x	=	0.0;
		GUI.Box(Rect(0,0,Screen.width,m_fHeightHeader),"Tap any dealer above to know the details.");//uncomment : m_tex2DHorizontalDots);
		
	GUI.EndGroup();
	
	GUI.enabled	=	true;
	
	if(m_bDealerDetailsPopUpEnabled)
	{
		m_fWidthPopup	=	0.7*Screen.width;
		m_fHeightPopup	=	0.5*Screen.height;
		
		m_skinRechargeScreen.window.normal.background	=	m_tex2DPopUpBackground;
		GUI.ModalWindow(m_iSelectedDealerIndex,Rect(0.5*(Screen.width - m_fWidthPopup),0.5*(Screen.height - m_fHeightPopup),m_fWidthPopup,m_fHeightPopup), PopUpDealerDetails, "", m_skinRechargeScreen.window);
	}

	GUI.skin = null;
}

function PopUpAPIErrorDetails(iWindowID	:	int)
{	
	m_skinRechargeScreen.label.normal.textColor		=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	m_skinRechargeScreen.label.fontSize 			= 	Mathf.Min(0.8*m_fWidthPopup,m_fHeightPopup/3.0)/4.0;
	m_skinRechargeScreen.label.font					=	m_fontBold;
	m_skinRechargeScreen.label.alignment			=	TextAnchor.MiddleLeft;
	
	var guicontentsPromptTitle	:	GUIContent 		=	new GUIContent("Server Error",m_tex2DServerError);
	GUI.Label(Rect(0.1*m_fWidthPopup,0,0.8*m_fWidthPopup,m_fHeightPopup/3.0),guicontentsPromptTitle);
	
	m_skinRechargeScreen.label.normal.textColor		=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
	m_skinRechargeScreen.label.fontSize 			= 	Mathf.Min(0.8*m_fWidthPopup,m_fHeightPopup/3.0)/5.0;
	m_skinRechargeScreen.label.font					=	m_fontRegular;
	m_skinRechargeScreen.label.alignment			=	TextAnchor.UpperLeft;
	GUI.Label(Rect(0.1*m_fWidthPopup,0.67*m_fHeightPopup/3.0 + m_fHeightPopup/12.0,0.8*m_fWidthPopup,m_fHeightPopup/3.0),m_objRechargeOffersAPIPacket.m_strErrorMessage);
	
	SkinButtonInPurpleOrange();
	if(GUI.Button(Rect(0.57*m_fWidthPopup,2*m_fHeightPopup/3.0 + m_fHeightPopup/12.0,0.33*m_fWidthPopup,m_fHeightPopup/6.0),"OK"))
	{
		m_iSelectedBoxIndex = 0;
	}
}

function PopUpDealerDetails(iWindowID : int)
{
	m_skinRechargeScreen.label.normal.background	=	null;
	m_skinRechargeScreen.label.hover.background		=	null;
	m_skinRechargeScreen.label.active.background	=	null;
	m_skinRechargeScreen.label.normal.textColor		=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	m_skinRechargeScreen.label.fontSize 			= 	Mathf.Min(Screen.width,m_fHeightHeader)/2.0;
	m_skinRechargeScreen.label.font					=	m_fontBold;
	m_skinRechargeScreen.label.alignment			=	TextAnchor.MiddleLeft;
	
	GUI.Label(Rect(0.1*m_fWidthPopup,0.1*m_fHeightPopup,0.8*m_fWidthPopup,0.25*m_fHeightPopup),gs_arrDealerDetails[iWindowID].m_strStoreName);
	
	m_skinRechargeScreen.label.normal.background	=	null;
	m_skinRechargeScreen.label.hover.background		=	null;
	m_skinRechargeScreen.label.active.background	=	null;
	m_skinRechargeScreen.label.normal.textColor		=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
	m_skinRechargeScreen.label.fontSize 			= 	Mathf.Min(Screen.width,m_fHeightHeader)/2.5;
	m_skinRechargeScreen.label.font					=	m_fontRegular;
	m_skinRechargeScreen.label.alignment			=	TextAnchor.UpperLeft;
	GUI.Label(Rect(0.1*m_fWidthPopup,0.30*m_fHeightPopup,0.8*m_fWidthPopup,0.75*m_fHeightPopup),gs_arrDealerDetails[iWindowID].m_strStoreAddress +"\n"+ gs_arrDealerDetails[iWindowID].m_strTown +", "+ gs_arrDealerDetails[iWindowID].m_strState +"\n"+ gs_arrDealerDetails[iWindowID].m_strPinCode );
	
	m_skinRechargeScreen.button.normal.background	=	null;
	m_skinRechargeScreen.button.hover.background	=	null;
	m_skinRechargeScreen.button.active.background	=	null;
	m_skinRechargeScreen.button.normal.textColor	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
	m_skinRechargeScreen.button.alignment			=	TextAnchor.MiddleCenter;
	m_skinRechargeScreen.button.contentOffset.x		=	0.0;

	if(GUI.Button(Rect(0.9*m_fWidthPopup,0,0.1*m_fWidthPopup,0.1*m_fWidthPopup),"X"))
	{
		m_bDealerDetailsPopUpEnabled	=	false;
		m_iSelectedDealerIndex			=	-1;
	}
	
	/*m_skinRechargeScreen.button.normal.background	=	m_tex2DPurple;
	m_skinRechargeScreen.button.hover.background	=	m_tex2DOrange;
	m_skinRechargeScreen.button.active.background	=	m_tex2DOrange;
	m_skinRechargeScreen.button.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinRechargeScreen.button.alignment			=	TextAnchor.MiddleCenter;
	GUI.Button(Rect(0.7*m_fWidthPopup,0.7*m_fHeightPopup,0.25*m_fWidthPopup,0.2*m_fHeightPopup),"View Map");*/
}

function FetchRechargeDealersList()
{
	var strAPIURL					=	ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
    var strAPIMethod				=	"recharge/GetRechargeLocatorByCustomerID";
    var strInput					=	"{\"uuId\":\"" + m_strUUID + "\"}";
    
    m_objRechargeLocatorAPIPacket	=	new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    m_bFetchDealersInProgress		=	true;
    m_objScriptAPIHandler.InvokeReSTfulAPI(m_objRechargeLocatorAPIPacket);
}

function FetchRechargeOffersList()
{
	var strAPIURL					=	ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
    var strAPIMethod				=	"offer/GetALLOfferbyType";
    var strInput					=	"{\"offerType\":\"LTR\"}";
    
    m_objRechargeOffersAPIPacket	=	new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    m_bFetchOffersInProgress		=	true;
    m_objScriptAPIHandler.InvokeReSTfulAPI(m_objRechargeOffersAPIPacket);
}

function RenderPleaseWaitSplash(strHeaderTitle	:	String)
{
	GUI.skin = m_skinRechargeScreen;
	
	RenderHeader(strHeaderTitle);
	RenderBackground(m_tex2DWhite);
	
	m_v2PivotPoint = Vector2(Screen.width/2,Screen.height/2);
	GUIUtility.RotateAroundPivot (m_fDeltaAngleOfRotation, m_v2PivotPoint); 
	GUI.Label(Rect(Screen.width/2 - 48.0,Screen.height/2 - 48.0, 96.0, 96.0),"",m_skinRefreshButton.label);
	m_fDeltaAngleOfRotation += 1.5;
	
	GUI.skin = null;
}

function ProcessRechargeOffersAPIResponse()
{
	if(m_objRechargeOffersAPIPacket.m_strResponseCode == "200 OK")
	{
		var N = JSON.Parse(m_objRechargeOffersAPIPacket.m_strOutput);
		if(N == null)
		{
			m_objRechargeOffersAPIPacket.m_strErrorMessage	=	"NULL JSON";
			print(m_objRechargeOffersAPIPacket.m_strErrorMessage);
		}
		else
		{
			Debug.Log("Reassembled: " + N.ToString());
			if(N.ToString() == "{}")
			{
				m_objRechargeOffersAPIPacket.m_strErrorMessage	=	"Empty JSON";
				print(m_objRechargeOffersAPIPacket.m_strErrorMessage);
			}
			else
			{
				while(N[g_iPackagesWithOffersCount] != null)
				{
					g_iPackagesWithOffersCount++;
				}
				
				print("Total packages giving offers: " + g_iPackagesWithOffersCount);
				g_arrCPackageWithOffers			=	new CPackageWithOffers[g_iPackagesWithOffersCount];
					
				for(var i = 0; i < g_iPackagesWithOffersCount; i++)
				{
					g_arrCPackageWithOffers[i]						=	new CPackageWithOffers();
					g_arrCPackageWithOffers[i].m_strPackageName		=	N[i]["offerPackageName"];
					g_arrCPackageWithOffers[i].m_strPackagePrice	=	N[i]["basePrice"];
					g_arrCPackageWithOffers[i].m_strOfferRegion		=	N[i]["offerRegion"];
					
					while(N[i]["offerContent"][g_arrCPackageWithOffers[i].m_iOffersCount] != null)
					{
						g_arrCPackageWithOffers[i].m_iOffersCount++;
					}
					
					print("Total Offers in " + g_arrCPackageWithOffers[i].m_strPackageName + " is : " + g_arrCPackageWithOffers[i].m_iOffersCount);
					g_arrCPackageWithOffers[i].m_objArrayOfOffers	=	new	COffer[g_arrCPackageWithOffers[i].m_iOffersCount];
					
					for(var j = 0; j < g_arrCPackageWithOffers[i].m_iOffersCount; j++)
					{
						g_arrCPackageWithOffers[i].m_objArrayOfOffers[j]				=	new	COffer();
						g_arrCPackageWithOffers[i].m_objArrayOfOffers[j].m_strDuration	=	N[i]["offerContent"][j]["duration"];
						g_arrCPackageWithOffers[i].m_objArrayOfOffers[j].m_strPrice		=	N[i]["offerContent"][j]["price"];
						g_arrCPackageWithOffers[i].m_objArrayOfOffers[j].m_strExtraDays	=	N[i]["offerContent"][j]["extra"];
					}
				}
				
				g_bOffersListAvailable	=	true;
			}
		}			
	}
	else
	{
		m_objRechargeOffersAPIPacket.m_strErrorMessage	=	"Connection Error : " + m_objRechargeOffersAPIPacket.m_strResponseCode;
		print(m_objRechargeOffersAPIPacket.m_strErrorMessage);
	}
	m_bFetchOffersInProgress							=	false;
	m_objRechargeOffersAPIPacket.m_bResponseReceived	=	false;
}

function ShowRechargeOffersAPIError()
{
	GUI.skin	=	m_skinRechargeScreen;
	
	m_fWidthPopup	=	Screen.width;
	m_fHeightPopup	=	Screen.height - 2.0*m_fHeightHeader;
	
	RenderHeader("Recharge Offers");
	RenderBackground(m_tex2DWhite);
		
	m_skinRechargeScreen.window.normal.background	=	null;
	GUI.ModalWindow(0,Rect(0.0,m_fHeightHeader,m_fWidthPopup,m_fHeightPopup), PopUpAPIErrorDetails, "", m_skinRechargeScreen.window);
	
	GUI.skin	=	null;
}

function ProcessRechargeLocatorAPIResponse()
{
	var strRechargeLocatorAPIResult	:	String	=	"";
	if(strRechargeLocatorAPIResult	==	"")
	{
		if(m_objRechargeLocatorAPIPacket.m_strResponseCode == "200 OK")
		{
			var N = JSON.Parse(m_objRechargeLocatorAPIPacket.m_strOutput);
			if(N == null)
			{
				strRechargeLocatorAPIResult	=	"NULL JSON";
				print(strRechargeLocatorAPIResult);
			}
			else
			{
				Debug.Log("Reassembled: " + N.ToString());
				if(N.ToString() == "{}")
				{
					strRechargeLocatorAPIResult	=	"Empty JSON";
					print(strRechargeLocatorAPIResult);
				}
				else
				{
					while(N["GetRechargeLocatorByCustomerIDResult"][m_iDealersCount] != null)
					{
						m_iDealersCount++;
					}
					
					gs_arrDealerDetails			=	new DealerDetails[m_iDealersCount];
					
					for(var i = 0; i < m_iDealersCount; i++)
					{
						gs_arrDealerDetails[i]						=	new DealerDetails();
						gs_arrDealerDetails[i].m_strContactPerson	=	N["GetRechargeLocatorByCustomerIDResult"][i]["ContactPerson"];
						gs_arrDealerDetails[i].m_strPhone1			=	N["GetRechargeLocatorByCustomerIDResult"][i]["Phone1"];
						gs_arrDealerDetails[i].m_strPhone2			=	N["GetRechargeLocatorByCustomerIDResult"][i]["Phone2"];
						gs_arrDealerDetails[i].m_strPhone3			=	N["GetRechargeLocatorByCustomerIDResult"][i]["Phone3"];
						gs_arrDealerDetails[i].m_strPinCode			=	N["GetRechargeLocatorByCustomerIDResult"][i]["PinCode"];
						gs_arrDealerDetails[i].m_strState			=	N["GetRechargeLocatorByCustomerIDResult"][i]["State"];
						gs_arrDealerDetails[i].m_strStoreAddress	=	N["GetRechargeLocatorByCustomerIDResult"][i]["StoreAddress"];
						gs_arrDealerDetails[i].m_strStoreName		=	N["GetRechargeLocatorByCustomerIDResult"][i]["StoreName"];
						gs_arrDealerDetails[i].m_strTown			=	N["GetRechargeLocatorByCustomerIDResult"][i]["Town"];
						gs_arrDealerDetails[i].m_strVendorName		=	N["GetRechargeLocatorByCustomerIDResult"][i]["VendorName"];
					}
					
					g_bDealersListAvailable								=	true;
					m_bFetchDealersInProgress							=	false;
					m_objRechargeLocatorAPIPacket.m_bResponseReceived	=	false;
				}
			}
		}
		else
		{
			GUI.skin	=	m_skinRechargeScreen;
		
			m_fWidthPopup	=	Screen.width;
			m_fHeightPopup	=	Screen.height - 2.0*m_fHeightHeader;
		
			RenderHeader("Recharge Counters & Dealers");
			RenderBackground(m_tex2DWhite);
			
			m_skinRechargeScreen.window.normal.background	=	null;
			GUI.ModalWindow(0,Rect(0.0,m_fHeightHeader,m_fWidthPopup,m_fHeightPopup), RenderPostRechargeLocatorAPIResult, "", m_skinRechargeScreen.window);
			//RenderPostRechargeLocatorAPIResult(strRechargeLocatorAPIResult);
			GUI.skin	=	null;
			print(strRechargeLocatorAPIResult);
		}
	}
}

function RenderPostRechargeLocatorAPIResult(iWindowID	:	int)
{
	m_skinRechargeScreen.label.normal.textColor		=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	m_skinRechargeScreen.label.fontSize 			= 	Mathf.Min(0.8*m_fWidthPopup,m_fHeightPopup/3.0)/4.0;
	m_skinRechargeScreen.label.font					=	m_fontBold;
	m_skinRechargeScreen.label.alignment			=	TextAnchor.MiddleLeft;
	
	var guicontentsPromptTitle	:	GUIContent 		=	new GUIContent("Server Error",m_tex2DServerError);
	GUI.Label(Rect(0.1*m_fWidthPopup,0,0.8*m_fWidthPopup,m_fHeightPopup/3.0),guicontentsPromptTitle);
	
	m_skinRechargeScreen.label.normal.textColor		=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
	m_skinRechargeScreen.label.fontSize 			= 	Mathf.Min(0.8*m_fWidthPopup,m_fHeightPopup/3.0)/5.0;
	m_skinRechargeScreen.label.font					=	m_fontRegular;
	m_skinRechargeScreen.label.alignment			=	TextAnchor.UpperLeft;
	GUI.Label(Rect(0.1*m_fWidthPopup,0.67*m_fHeightPopup/3.0 + m_fHeightPopup/12.0,0.8*m_fWidthPopup,m_fHeightPopup/3.0),"Connection Error : " + m_objRechargeLocatorAPIPacket.m_strResponseCode);
	
	SkinButtonInPurpleOrange();
	if(GUI.Button(Rect(0.57*m_fWidthPopup,2*m_fHeightPopup/3.0 + m_fHeightPopup/12.0,0.33*m_fWidthPopup,m_fHeightPopup/6.0),"OK"))
	{
		m_iSelectedBoxIndex = 0;
		m_bFetchDealersInProgress							=	false;
		m_objRechargeLocatorAPIPacket.m_bResponseReceived	=	false;
	}
}

//function TrackEvent(fWaitTime	:	float)
//{
//	yield WaitForSeconds(fWaitTime);
//	TE("Recharge");
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
	var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"traits\":{\"Balance\":\"" + balance + "\",\"NextRechargeDate\":\"" + nextRechargeDate +"\",\"RechargeAmount\":\"" + m_strRechargeAmount + "\" }}";
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

function tracking(strClickedOn : String,strRechargeAmount) {
	var objHeaders : Hashtable = new Hashtable();
	objHeaders.Add("Content-Type","application/json");
	var customerId = PlayerPrefs.GetString("CustomerId");
	Debug.Log("customerId :"+customerId);
	if(customerId.Length == 0 ) {
		customerId = "NOT_LOGGED_IN";
	}
	var balance = PlayerPrefs.GetString("Balance");
	//var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" +customerId + "\",\"event\":\"" + strClickedOn + "\"}";
	var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" +customerId + "\",\"properties\":{\"RechargeAmount\":\"" + strRechargeAmount +  "\"},\"event\":\"" + strClickedOn + "\"}";
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


