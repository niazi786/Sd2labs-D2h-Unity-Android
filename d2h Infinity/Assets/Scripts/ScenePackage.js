#pragma strict
///// LOKESH //////////
class CPackagesChannelInfo
{
	var strServiceId	: String;
	var strChannelName	: String;
	var strImageId		: String;
	var strGenreId		: String;
	var strGenreName	: String;
}
class CAddOnsForUpgradedPackage
{
	var strLabel	: String;
	var bSelected	: boolean;
	var bShowList	: boolean;
	var iSeeListTextureIndex : int; //0:SeeList(Orange), 1:SeeList(White), 2:AddOn(Orange)
}

var g_strPopUpMessage				:	String;
var g_objListChannelInfo			= 	new List.<CPackagesChannelInfo>();

//Upgrade Downgrade Process
var g_objUpgradeDowngradeAPIPacket	:	CWebAPIPacket;

//Objects to attached scripts
var g_objScriptAPIHandler			:	ScriptAPIHandler;

//Password Entered for Upgrade | Downgrade
var g_strPassword					:	String;

//Popup Message
var g_strMessageInPopup				:	String;
var g_rectPopup						:	Rect;

//Screen_ID: 0 = Packages, 1 = PresentPackage, 2 = Upgrade Package, 3 = See Downgrade Options, 4 = Downgrade Package
var g_iScreenID						:	int;
var g_iSelectedUpgradeOptionIndex	:	int; //option selected for upgrade from Packages Screen
var g_iSelectedDowngradeOptionIndex	:	int; //option selected for downgrade from Packages Screen
var m_iIndexActiveGenre				:	int;

//////////////TOUCH Variables//////////////////////////
private var m_fSW					:	float;
private var m_fSH					:	float;

private var m_fPreviousDeltaX		:	float	= 0f;
private var m_fPreviousDeltaY 		:	float	= 0f;

private var m_fTimeStampWhenTouchPhaseEnded	:	float	=	0f;

var m_bIsSwipeActive				:	boolean;
var	m_bInitializeTouchAreas			:	boolean[];
var m_bFilterToggleState			:	boolean[];

///////////////////////////////////////////////////////
//Touch Areas :	Rectangles
//Screen_ID = 0 : For Packages Screen
var m_rectPackagesScreenScrollArea1					:	Rect; //For m_v2ScrollPresentPackageChannelsGridX
var m_rectPackagesScreenScrollArea2					:	Rect; //For m_v2ScrollUpgradePackageOptionsY & m_v2ScrollUpgradeOptionChannelsGridX

var m_fVelocityPPChannels2By3GridInX				:	float;
var g_fVelocityPackagesScreenScroll1_Y				:	float;
var m_fVelocityUpgradeOptionChannelsGridsInX				:	float;
var m_fVelocityUpgradeOptionsListInY				:	float;

private var m_v2ScrollPresentPackageChannelsGridX	:	Vector2;
private var m_v2ScrollUpgradePackageOptionsY		:	Vector2;
var m_v2ScrollUpgradeOptionChannelsGridX			:	Vector2[];

var m_iIndexLastUpgradeOptionSwiped					:	int;


//Screen_ID = 1 : For Present Package Screen
var m_rectPresentPackageScreenScrollArea1			:	Rect;
var m_rectPresentPackageScreenScrollArea2			:	Rect;
var m_rectPresentPackageScreenScrollArea3			:	Rect;
var m_rectFreeAddOnPopUpScrollArea					:	Rect;

var g_fVelocityPresentPackageScreenScroll1_X		:	float;
var g_fVelocityPresentPackageScreenScroll1_Y		:	float;
var g_fVelocityPresentPackageScreenScroll2_X		:	float;
var g_fVelocityPresentPackageScreenScroll2_Y		:	float;
var g_fVelocityPresentPackageScreenScroll3_X		:	float;
var g_fVelocityPresentPackageScreenScroll3_Y		:	float;
var g_fVelocityFreeAddOnPopUpScroll_X				:	float;

private var m_v2PresentPackageGenreListY				:	Vector2;
private var m_v2PresentPackageGenrewiseChannelsGridX	:	Vector2;//for 1st row
private var m_v2PresentPackageFreePaidAddOnsGridX			:	Vector2;// for 2nd row(addons)
private var m_v2PresentPackageAddOnChannelsGridX					:	Vector2;

//Screen_ID = 2 : For Upgrade Package Screen
var g_rectUpgradePackageScreenScrollArea1			:	Rect;
var g_rectUpgradePackageScreenScrollArea2			:	Rect;
var g_rectUpgradePackageScreenScrollArea3			:	Rect;
var g_fVelocityUpgradePackageScreenScroll1_X		:	float;
var g_fVelocityUpgradePackageScreenScroll1_Y		:	float;
var g_fVelocityUpgradePackageScreenScroll2_X		:	float;
var g_fVelocityUpgradePackageScreenScroll2_Y		:	float;
var g_fVelocityUpgradePackageScreenScroll3_X		:	float;
var g_fVelocityUpgradePackageScreenScroll3_Y		:	float;

//Screen ID = 3 : For See Downgrade Options Screen
var m_v2DowngradeOptionsScreenScroll1_X				:	Vector2;
var m_rectDowngradeOptionsScreenScrollViewPort1		:	Rect;
var m_fVelocityDowngradeOptionsScreenScroll1_X		:	float;

var m_v2DowngradeOptionsScreenScroll2_X				:	Vector2;
var m_rectDowngradeOptionsScreenScrollViewPort2		:	Rect;
var m_fVelocityDowngradeOptionsScreenScroll2_X		:	float;

//GUI Elements for Default Package Screen
var g_skinHeader									:	GUISkin;
var g_skinPackages									:	GUISkin; //default packages screen

var m_tex2dIconsPresentPackageChannels				:	Texture2D[];

//GUI Elements : Present Package Screen	
var g_iGenresCountInPresentPackage						:	int;
var g_strGenresNameInPresentPackage						:	String[];//		 = 	new List.<g_strOptions>();
var g_iGenreClicked										:	int;
var g_iChannelsCountInAGenre							:	int[];

//GUI Elements : Upgrade Package Screen
var g_strFreeAddOnButtonLabelInUpgradedPackage 			: 	String;

//GUI Elements : Downgrade Options Screen
var g_iChannelsCountInDowngradePackage					:	int;
var g_iCountFreeAddOnsSelectedForDowngrade				:	int;

var m_iChannelCountInSelectedPackageByActiveGenre		:	int;

//shared variables for both Upgrade & Downgrade Screen
var m_iSelectedAddOnsCountInSelectedPackage				:	int;
var m_iFreeAddOnsCountInSelectedPackage					:	int;
var m_iTotalAddOnsCountInSelectedPackage				:	int;	
///// ~LOKESH /////////

var Skin_LightVioletToOrange							:	GUISkin;
var Skin_DarkVioletToOrange								:	GUISkin;
private var g_strConnectionId 							: 	String;

var m_rectPackagesArea1ViewPort				 			: 	Rect;
var m_rectPackagesArea2ViewPort				 			: 	Rect;

var g_RectScrollFreeAddOn								: 	Rect;
var g_RectScrollDowngrade1stRow							: 	Rect;
var g_RectScrollDowngrade2ndRow							: 	Rect;

/**********************************************************************************/
//					Pre-Requisites for the PACKAGES SCREEN:
/**********************************************************************************/
//bools to check whether APIs have responded
var m_bAllUpgradeOptionsPriceFetched				:	boolean;
var m_bAllUpgradeOptionsChannelsFetched				:	boolean;
var m_bAllUpgradeOptionsAddOnsFetched				:	boolean;

var m_bAllDowngradeOptionsPriceFetched				:	boolean;
var m_bAllDowngradeOptionsChannelsFetched			:	boolean;
var m_bAllDowngradeOptionsAddOnsFetched				:	boolean;

//jugaadu
var m_iUAPI_1_ResponsesReceived						:	int = 0;
var m_iUAPI_2_ResponsesReceived						:	int = 0;
var m_iUAPI_3_ResponsesReceived						:	int = 0;
var m_iDAPI_1_ResponsesReceived						:	int = 0;
var m_iDAPI_2_ResponsesReceived						:	int = 0;
var m_iDAPI_3_ResponsesReceived						:	int = 0;

// ****** Present Package ****** //				// ****** Source API ****** //
//1. Package Name or ID					:			uuid_lookup | login
//2. Price + Tax PM						:			GetCommercialProductPriceByID
//3. No. of Channels in Package			:			ProductToChannelInfo
//4. All channels info					:			ProductToChannelInfo
//All about present package
static var m_listChannelsInPresentPack		= 	new List.<CChannelInfo>();
var m_strBalance					:	String;
var m_strPresentPackId				:	String;
var m_strPresentPackName			:	String;
static var m_strPresentPackPrice			:	String;
static var m_iCountChannelsInPresentPack	:	int;
var m_iChannelCountInPPActiveGenre	:	int;
	

// *** Upgrade Package Options *** //			// ****** Source API ****** //
static var m_listUpgradeOptions			= 	new List.<CUpgradeOption>();
static var m_strUpgradeOptionsAPIException	:	String;

//1. No. of Upgrade Package Options		:			GetProductsByCustomerId
static var m_iCountUpgradePacks			:	int;
 
//2. Name or ID of each package			:			GetProductsByCustomerId
static var	m_strUpgradePackageName				:			String[];

//3. Price + Tax PM						:			GetCommercialProductPriceByID
static var m_strUpgradePackagePrice			:			String[];

//4. No. of Channels					:			ProductToChannelInfo
static var m_iUpgradePackageChannelsCount		:			int[];

//5. All Channels Info					:			ProductToChannelInfo

// *** Downgrade Package Options *** //			// ****** Source API ****** //
static var m_listDowngradeOptions				= 	new List.<CDowngradeOption>();
static var m_strDowngradeOptionsAPIException	:	String;

//1. No. of Downgrade Package Options	:						?
static var m_iCountDowngradePacks				:	int;

//2. Name or ID of each package			:						?
static var	m_strDowngradePackageName			:			String[];

//3. Price + Tax PM						:			GetCommercialProductPriceByID
static var m_strDowngradePackagePrice			:			String[];

//4. No. of Channels					:			ProductToChannelInfo
static var m_iDowngradePackageChannelsCount	:			int[];

//5. All Channels Info					:			ProductToChannelInfo

/**********************************************************************************/



/**********************************************************************************/
//					Pre-Requisites for the PRESENT PACKAGE SCREEN:
/**********************************************************************************/

// ****** Header ****** //						// ****** Source API ****** //
//1. Present Package Name or ID			:			uuid_lookup | login
//2. Price + Tax PM						:			GetCommercialProductPriceByID

// *** Left Side Filter *** //
//1. Connection ID + Mirror IDs			:			uuid_lookup | login
//2. List Of All Genres					:			genres.txt

// *** Right-Top : Channels *** //
//1. All Channels Info (By Genre)		:			GetAllEpgByGenre

// *** Free Add-Ons Subscribe *** //
//1. All subscribed options in the		:			uuid_lookup | login
//	 present package
//2. Min Add-Ons Limit					:			GetAddOnsWithPriceByBasePackageId
//3. Max Add-Ons Limit					:			GetAddOnsWithPriceByBasePackageId
//4. No. of Channels					:			ProductToChannelInfo
//5. All Channels Info					:			ProductToChannelInfo

/**********************************************************************************/



/**********************************************************************************/
//					Pre-Requisites for the UPGRADE PACKAGE SCREEN:
/**********************************************************************************/

// ****** Header ****** //						// ****** Source API ****** //
//1. Upgrade Package Name or ID			:			GetProductsByCustomerId

//2. Price + Tax PM						:			GetCommercialProductPriceByID

// *** Left Side Filter *** //
//1. Connection ID + Mirror IDs			:			uuid_lookup | login
//2. List Of All Genres					:			genres.txt

// *** Right-Top : Channels *** //
//1. All Channels Info (By Genre)		:			GetAllEpgByGenre

// *** Free Add-Ons Available *** //
//1. Free Add-Ons options in the		:			GetDefaultAddOns
//	 upgrade package
//2. Min Add-Ons Limit					:					?
//3. Max Add-Ons Limit					:					?
//4. No. of Channels					:			ProductToChannelInfo
//5. All Channels Info					:			ProductToChannelInfo

// *** UPGRADE BUTTON : Process of Upgradation *** //
//1. Upgrade Package Button				:			ApplyUpgradeDowngrade
/**********************************************************************************/

/**********************************************************************************/
//					Pre-Requisites for the DOWNGRADE PACKAGE SCREEN:
/**********************************************************************************/

// *** DOWNGRADE BUTTON : Process of Degradation *** //
//1. Downgrade Package Button				:			ApplyUpgradeDowngrade
//9958437099
/**********************************************************************************/

var m_bResetIsOn	:	boolean;
var m_fAspectRatio	:	float;

function Start() 
{
	m_bResetIsOn	=	false;
	//collect the data already been fetched
	LoadStaticVariablesToInspectorVariables();
	g_strConnectionId 	=	PlayerPrefs.GetString("ConnectionID");
	m_strBalance		=	PlayerPrefs.GetString("Balance");
	tracking("Package");
	
	if(m_iPrefetchingStepsCompleted > 2)
	{
		m_iPrefetchingStepsCompleted	=	2;
	}
	
	g_objScriptAPIHandler = GetComponent(ScriptAPIHandler);
	
	m_bShowFilter		=	true;
	m_fDisplacementX	=	0.0;
	
	m_bIsSwipeActive	=	false;
	m_fSW				=	Screen.width;
	m_fSH				=	Screen.height;
	m_fAspectRatio		=	m_fSW/m_fSH;
	//Initially all touch areas are not initialized
	m_bInitializeTouchAreas			=	new boolean[4];	
	for(var i = 0; i < 4; i++)
	{
		m_bInitializeTouchAreas[i]	=	false;
	}
	
	// Pre-Requisites for the PRESENT PACKAGE SCREEN
	//By default: load Packages Screen when PACKAGES button is pressed in footer
	g_iScreenID = 0;
	
	//filters toggle states
	m_iIndexActiveGenre	=	0;
	InitFilterToggleState();
	ResetStateOfRestFilterToggles(0);
	
	m_iIndexLastUpgradeOptionSwiped = -1;
	
	g_boolSeeListButtonUpgardePressed =  false;
	
	g_texSeeListIndex = 0;
	
	/////////////////////////////////LOKESH | TOUCH : STARTS/////////////////////////////////
	//1.	Touch Starts: Packages Screen Scrolls Velocity for touch & scroll:	
	m_fVelocityPPChannels2By3GridInX = 0f;
	g_fVelocityPackagesScreenScroll1_Y = 0f;
	
	m_fVelocityUpgradeOptionChannelsGridsInX = 0f;
	m_fVelocityUpgradeOptionsListInY = 0f;
	//~		Touch ends
	
	//2.	Touch Starts: Present Package Screen rectangles & scroll velocities initialization
	g_fVelocityPresentPackageScreenScroll1_X = 0f;
	g_fVelocityPresentPackageScreenScroll1_Y = 0f;
	
	g_fVelocityPresentPackageScreenScroll2_X = 0f;
	g_fVelocityPresentPackageScreenScroll2_Y = 0f;
	
	g_fVelocityPresentPackageScreenScroll3_X = 0f;
	g_fVelocityPresentPackageScreenScroll3_Y = 0f;
	
	g_fVelocityFreeAddOnPopUpScroll_X	=	0f;
	//~ 	Touch ends
	
	//3.	Touch Starts: Upgrade Package Screen rectangles & scroll velocities initialization
	g_rectUpgradePackageScreenScrollArea1 = Rect(0,Screen.height/6,Screen.width/4,Screen.height-Screen.height/12-Screen.height/15-Screen.height/10);
	g_rectUpgradePackageScreenScrollArea2 = Rect(Screen.width/4,Screen.height/6,Screen.width- Screen.width/4,13*Screen.height/40);
	g_rectUpgradePackageScreenScrollArea3 = Rect(Screen.width/4,Screen.height/6 + 13*Screen.height/40 + Screen.height/12,Screen.width- Screen.width/4,13*Screen.height/40);;
	
	g_fVelocityUpgradePackageScreenScroll1_X = 0f;
	g_fVelocityUpgradePackageScreenScroll1_Y = 0f;
	
	g_fVelocityUpgradePackageScreenScroll2_X = 0f;
	g_fVelocityUpgradePackageScreenScroll2_Y = 0f;
	
	g_fVelocityUpgradePackageScreenScroll3_X = 0f;
	g_fVelocityUpgradePackageScreenScroll3_Y = 0f;
	//~ 	Touch ends
	////////////////////////////////TOUCH ENDS//////////////////////////////////
	
	
	g_RectScrollFreeAddOn = Rect(Screen.width/40,Screen.height/2.3,Screen.width-Screen.width/3.5,Screen.height/3);
	g_RectScrollDowngrade1stRow = Rect(0,Screen.height/8,Screen.width,(Screen.height-Screen.height/12-Screen.height/12- Screen.height/8)/2+ 2*Screen.height/100  );
	g_RectScrollDowngrade2ndRow =  Rect(0,Screen.height/8+(Screen.height-Screen.height/12-Screen.height/12- Screen.height/8)/2 ,Screen.width,(Screen.height-Screen.height/12-Screen.height/12- Screen.height/8)/2 + 2*Screen.height/100 );
	g_rectPopup = Rect(Screen.width/4,Screen.height/4,Screen.width/2, Screen.height/2);
	
	//StartCoroutine(TrackEvent(0.1));
}


//var g_RectPresentPack		:	Rect = new Rect(0,4*Screen.height/200,Screen.width/2.7 - Screen.width/150 ,Screen.height-Screen.height/5-Screen.height/10-Screen.height/12 - 2*Screen.height/200);
//var g_RectUpgradePakages	:	Rect = new Rect(Screen.width/2.7 + Screen.width/200,4*Screen.height/200,Screen.width/1.6 ,2*Screen.height/3.25);

function Update ()
{	
	if(Input.GetKeyDown(KeyCode.Escape))
	{
		if(g_iScreenID == 0)
		{
			if(m_iPrefetchingStepsCompleted < 3)
			{
				m_iPrefetchingStepsCompleted	=	0;
			}
			Application.LoadLevel("SceneHomePage");
		}
		else if(g_iScreenID == 1)
		{
			g_iScreenID--;
		}
		else if(g_iScreenID == 2)
		{
			if(m_iStartUpgradeDowngradeProcess == 1 || m_iStartUpgradeDowngradeProcess == -1)
			{
				if(m_iSlideId > 0 && m_iSlideId < 4)
				{
					m_iSlideId	=	0;
				}
				else
				{
					m_iSlideId	=	0;
					m_iStartUpgradeDowngradeProcess	= 0;
				}
			}
			else
			{
				g_iScreenID = 0;
			}
		}
		else if(g_iScreenID == 3)
		{
			g_iScreenID = 0;
		}
		else if(g_iScreenID == 4)
		{
			if(m_iStartUpgradeDowngradeProcess == 1 || m_iStartUpgradeDowngradeProcess == -1)
			{
				if(m_iSlideId > 0 && m_iSlideId < 4)
				{
					m_iSlideId	=	0;
				}
				else
				{
					m_iSlideId	=	0;
					m_iStartUpgradeDowngradeProcess	= 0;
				}
			}
			else
			{
				g_iScreenID--;
			}
		}
	}
	ProcessTouchForEachScreen(g_iScreenID);
	
	if(m_iPrefetchingStepsCompleted < 2 && m_bResetIsOn == false)
	{
		DownloadPackageDetails();
	}
	else if(m_iPrefetchingStepsCompleted == 2)
	{
		//present package
		LoadPresentPackagePrefetchedData();
		
		//upgrade options
		LoadUpgradeOptionsPrefetchedData();
		
		//downgrade options
		LoadDowngradeOptionsPrefetchedData();
		
		m_iPrefetchingStepsCompleted++;
	}
}
function ProcessTouchForEachScreen(iScreenID : int)
{
	switch(iScreenID)
	{
		case 0:
		ProcessTouchForPackagesScreen();
		break;
		
		case 1:
		ProcessTouchForPresentPackageScreen();
		break;
		
		case 2:
		ProcessTouchForUpgradePackageScreen();
		break;
		
		case 3:
		ProcessTouchForDowngradeOptionsScreen();
		break;
		
		case 4:
		ProcessTouchForUpgradePackageScreen();
		break;
		
		default:
		print("Default ProcessTouchForEachScreen()");
		break;
	}
}

function ProcessTouchForPackagesScreen()
{
	//if(m_bInitializeTouchAreas[0])
	//{
		for( var touch : Touch in Input.touches)
		{
			var v2TouchToGUIPos	: Vector2;
			v2TouchToGUIPos.x = touch.position.x;
			v2TouchToGUIPos.y = m_fSH - touch.position.y;
			
			if(m_rectPackagesScreenScrollArea2.Contains(v2TouchToGUIPos))
			{	
				var iUpgradeOptionNumber = GetUpgradeOptionIndexWrtTouch(v2TouchToGUIPos.y - Screen.height/12);
				m_iIndexLastUpgradeOptionSwiped = iUpgradeOptionNumber;
			}
		
			if (touch.phase == TouchPhase.Began)
			{
				m_fPreviousDeltaX = touch.deltaPosition.x;
				m_fPreviousDeltaY = touch.deltaPosition.y;
				
				/*if(m_fPreviousDeltaX > 0.01*m_fSW || m_fPreviousDeltaY > 0.01*m_fSH)
				{
					m_bIsSwipeActive = true;
				}*/
				m_bIsSwipeActive	=	false;
			}
			
			if (touch.phase == TouchPhase.Moved)
			{
				m_bIsSwipeActive = true;
				
				// dragging
				m_fPreviousDeltaY = touch.deltaPosition.y;
				m_fPreviousDeltaX = touch.deltaPosition.x;
				
				//swipe in Y
				if( Mathf.Abs( m_fPreviousDeltaY)> Mathf.Abs(m_fPreviousDeltaX))
				{						
					if(m_rectPackagesScreenScrollArea2.Contains(v2TouchToGUIPos))
						m_v2ScrollUpgradePackageOptionsY.y += 3.5*touch.deltaPosition.y;
				}
				else //swipe in X
				{
					if(m_rectPackagesScreenScrollArea1.Contains(v2TouchToGUIPos))
						m_v2ScrollPresentPackageChannelsGridX.x -= 3.5*touch.deltaPosition.x;
					
					if(m_rectPackagesScreenScrollArea2.Contains(v2TouchToGUIPos))
					{	
						m_v2ScrollUpgradeOptionChannelsGridX[m_iIndexLastUpgradeOptionSwiped].x -= 3.5*touch.deltaPosition.x;
					}
				}
			}
			
			if (touch.phase == TouchPhase.Stationary)
			{
				//print("Stationary : A finger is touching the screen but hasn't moved");
				m_bIsSwipeActive	=	false;
			}
			
			if (touch.phase == TouchPhase.Canceled)
			{
				m_fPreviousDeltaX = 0f;
				m_fPreviousDeltaY = 0f;
				
				m_bIsSwipeActive	=	false;
			}
			
			if (touch.phase == TouchPhase.Ended)
			{
				// impart momentum, using last delta as the starting velocity
				if( Mathf.Abs( m_fPreviousDeltaY) > Mathf.Abs(m_fPreviousDeltaX))
				{						
					if(m_rectPackagesScreenScrollArea2.Contains(v2TouchToGUIPos))
						m_fVelocityUpgradeOptionsListInY = m_fPreviousDeltaY/touch.deltaTime;
				}
				else
				{
					if(m_rectPackagesScreenScrollArea1.Contains(v2TouchToGUIPos))
						m_fVelocityPPChannels2By3GridInX = -m_fPreviousDeltaX/touch.deltaTime;
					
					if(m_rectPackagesScreenScrollArea2.Contains(v2TouchToGUIPos))
						m_fVelocityUpgradeOptionChannelsGridsInX = -m_fPreviousDeltaX/touch.deltaTime;
				}
				m_fTimeStampWhenTouchPhaseEnded = Time.time;
				
				m_bIsSwipeActive	=	false;
			}
		}
	
		///////// Apply residual velocity or inertia to the scrollers when swipe goes off ///////////
		var fInertiaDuration	:	float = 0.75;
		if (Input.touchCount == 0) //if this is a short touch
		{
			if ( m_fVelocityPPChannels2By3GridInX != 0.0f || m_fVelocityUpgradeOptionChannelsGridsInX != 0.0f || m_fVelocityUpgradeOptionsListInY != 0.0f)
			{			
				// slow down over time
				var t : float;
				t = Time.time;
				t = t - m_fTimeStampWhenTouchPhaseEnded;
				t = t / fInertiaDuration;
				
				var fFrameVelocityPPChannels2By3GridInX : float =	Mathf.Lerp(m_fVelocityPPChannels2By3GridInX, 0, t);
				m_v2ScrollPresentPackageChannelsGridX.x			+=	fFrameVelocityPPChannels2By3GridInX * Time.deltaTime;
				
				var fFrameVelocityUpgradeOptionChannelsGridsInX : float = Mathf.Lerp(m_fVelocityUpgradeOptionChannelsGridsInX, 0, t);
				var fFrameVelocityUpgradeOptionsListInY 		: float = Mathf.Lerp(m_fVelocityUpgradeOptionsListInY, 0, t);
				m_v2ScrollUpgradeOptionChannelsGridX[m_iIndexLastUpgradeOptionSwiped].x += fFrameVelocityUpgradeOptionChannelsGridsInX * Time.deltaTime;	
				m_v2ScrollUpgradePackageOptionsY.y += fFrameVelocityUpgradeOptionsListInY * Time.deltaTime;
				
				// after N seconds, we’ve stopped
				if (t >= fInertiaDuration)
				{
					m_bIsSwipeActive = false;
					
					m_fVelocityPPChannels2By3GridInX = 0.0f;
					
					m_fVelocityUpgradeOptionChannelsGridsInX = 0.0f;
					m_fVelocityUpgradeOptionsListInY = 0.0f;
				}
			}
			return;
		}
	//}
}
function ProcessTouchForPresentPackageScreen()
{
	//looping through all the finger touches and handles the touch(es) on their behaviour (tap,swipe,stopped,cancelled etc)
	for( var touch : Touch in Input.touches)
	{
		var v2TouchToGUIPos	: Vector2;
		v2TouchToGUIPos.x = touch.position.x;
		v2TouchToGUIPos.y = Screen.height - touch.position.y;
				
		if (touch.phase == TouchPhase.Began)
		{
			m_fPreviousDeltaX = touch.deltaPosition.x;
			m_fPreviousDeltaY = touch.deltaPosition.y;
		}
		if (touch.phase == TouchPhase.Canceled)
		{
			m_fPreviousDeltaX = 0f;
			m_fPreviousDeltaY = 0f;
		}
		if (touch.phase == TouchPhase.Moved)
		{
			// dragging
			m_fPreviousDeltaY = touch.deltaPosition.y;
			m_fPreviousDeltaX = touch.deltaPosition.x;
			
			//swipe in Y
			if( Mathf.Abs(m_fPreviousDeltaY) > Mathf.Abs(m_fPreviousDeltaX))
			{
				if(m_rectPresentPackageScreenScrollArea1.Contains(v2TouchToGUIPos))
					m_v2PresentPackageGenreListY.y += 3.5*touch.deltaPosition.y;
				
			}
			else //swipe in X
			{
				if(m_rectPresentPackageScreenScrollArea2.Contains(v2TouchToGUIPos))	
					m_v2PresentPackageGenrewiseChannelsGridX.x -= 3.5*touch.deltaPosition.x;
					
				if(m_rectPresentPackageScreenScrollArea3.Contains(v2TouchToGUIPos))	
					m_v2PresentPackageFreePaidAddOnsGridX.x -= 3.5*touch.deltaPosition.x;
					
				if(m_rectFreeAddOnPopUpScrollArea.Contains(v2TouchToGUIPos))
					m_v2PresentPackageAddOnChannelsGridX.x	-=	3.5*touch.deltaPosition.x;
			}
		}
		if (touch.phase == TouchPhase.Stationary)
		{
			print("Stationary : A finger is touching the screen but hasn't moved");
		}
		if (touch.phase == TouchPhase.Ended)
		{
			// impart momentum, using last delta as the starting velocity
			if( Mathf.Abs( m_fPreviousDeltaY) > Mathf.Abs(m_fPreviousDeltaX))
			{
				if(m_rectPresentPackageScreenScrollArea1.Contains(v2TouchToGUIPos))	   
					g_fVelocityPresentPackageScreenScroll1_Y = m_fPreviousDeltaY/touch.deltaTime;
			}
			else
			{
				if(m_rectPresentPackageScreenScrollArea2.Contains(v2TouchToGUIPos))
					g_fVelocityPresentPackageScreenScroll2_X = -m_fPreviousDeltaX/touch.deltaTime;
					
				if(m_rectPresentPackageScreenScrollArea3.Contains(v2TouchToGUIPos))
					g_fVelocityPresentPackageScreenScroll3_X = -m_fPreviousDeltaX/touch.deltaTime;
				
				if(m_rectFreeAddOnPopUpScrollArea.Contains(v2TouchToGUIPos))
					g_fVelocityFreeAddOnPopUpScroll_X = -m_fPreviousDeltaX/touch.deltaTime;
			}
			m_fTimeStampWhenTouchPhaseEnded = Time.time;
		}
	}
	
	///////// Apply residual velocity or inertia to the scrollers when swipe goes off ///////////
	var fInertiaDuration	:	float = 0.75;
	if (Input.touchCount == 0) //if this is a short touch
	{
		if ( g_fVelocityPresentPackageScreenScroll1_X != 0.0f || g_fVelocityPresentPackageScreenScroll1_Y != 0.0f || g_fVelocityPresentPackageScreenScroll2_X != 0.0f || g_fVelocityPresentPackageScreenScroll2_Y != 0.0f || g_fVelocityPresentPackageScreenScroll3_X != 0.0f || g_fVelocityPresentPackageScreenScroll3_Y != 0.0f || g_fVelocityFreeAddOnPopUpScroll_X != 0.0f)
		{			
			// slow down over time
			var t : float;
			t = Time.time;
			t = t - m_fTimeStampWhenTouchPhaseEnded;
			t = t / fInertiaDuration;
			
			var fFrameVelocityScroll1_Y : float = Mathf.Lerp(g_fVelocityPresentPackageScreenScroll1_Y, 0, t);	
			m_v2PresentPackageGenreListY.y += fFrameVelocityScroll1_Y * Time.deltaTime;
			
			var fFrameVelocityScroll2_X : float = Mathf.Lerp(g_fVelocityPresentPackageScreenScroll2_X, 0, t);
			m_v2PresentPackageGenrewiseChannelsGridX.x += fFrameVelocityScroll2_X * Time.deltaTime;	
			
			var fFrameVelocityScroll3_X : float = Mathf.Lerp(g_fVelocityPresentPackageScreenScroll3_X, 0, t);
			m_v2PresentPackageFreePaidAddOnsGridX.x += fFrameVelocityScroll3_X * Time.deltaTime;	
			
			var fFrameVelocityScroll4_X : float = Mathf.Lerp(g_fVelocityFreeAddOnPopUpScroll_X, 0, t);
			m_v2PresentPackageAddOnChannelsGridX.x += fFrameVelocityScroll4_X * Time.deltaTime;	
			
			// after N seconds, we’ve stopped
			if (t >= fInertiaDuration)
			{
				g_fVelocityPresentPackageScreenScroll1_Y = 0.0f;
				
				g_fVelocityPresentPackageScreenScroll2_X = 0.0f;
				
				g_fVelocityPresentPackageScreenScroll3_X = 0.0f;
				
				g_fVelocityFreeAddOnPopUpScroll_X	=	0.0f;
			}
		}
		return;
	}
}
function ProcessTouchForUpgradePackageScreen()
{
	//looping through all the finger touches and handles the touch(es) on their behaviour (tap,swipe,stopped,cancelled etc)
	for( var touch : Touch in Input.touches)
	{
		var v2TouchToGUIPos	: Vector2;
		v2TouchToGUIPos.x = touch.position.x;
		v2TouchToGUIPos.y = Screen.height - touch.position.y;
				
		if (touch.phase == TouchPhase.Began)
		{
			m_fPreviousDeltaX = touch.deltaPosition.x;
			m_fPreviousDeltaY = touch.deltaPosition.y;
		}
		if (touch.phase == TouchPhase.Canceled)
		{
			m_fPreviousDeltaX = 0f;
			m_fPreviousDeltaY = 0f;
		}
		if (touch.phase == TouchPhase.Moved)
		{
			// dragging
			m_fPreviousDeltaY = touch.deltaPosition.y;
			m_fPreviousDeltaX = touch.deltaPosition.x;
			
			//swipe in Y
			if( Mathf.Abs(m_fPreviousDeltaY) > Mathf.Abs(m_fPreviousDeltaX))
			{
				if(g_rectUpgradePackageScreenScrollArea1.Contains(v2TouchToGUIPos))
					m_v2PresentPackageGenreListY.y += 3.5*touch.deltaPosition.y;
			}
			else //swipe in X
			{
				if(g_rectUpgradePackageScreenScrollArea2.Contains(v2TouchToGUIPos))	
					m_v2PresentPackageGenrewiseChannelsGridX.x -= 3.5*touch.deltaPosition.x;
					
				if(g_rectUpgradePackageScreenScrollArea3.Contains(v2TouchToGUIPos))	
					m_v2PresentPackageFreePaidAddOnsGridX.x -= 3.5*touch.deltaPosition.x;
			}
		}
		if (touch.phase == TouchPhase.Stationary)
		{
			print("Stationary : A finger is touching the screen but hasn't moved");
		}
		if (touch.phase == TouchPhase.Ended)
		{
			// impart momentum, using last delta as the starting velocity
			if( Mathf.Abs(m_fPreviousDeltaY) > Mathf.Abs(m_fPreviousDeltaX))
			{
				if(g_rectUpgradePackageScreenScrollArea1.Contains(v2TouchToGUIPos))	   
					g_fVelocityUpgradePackageScreenScroll1_Y = m_fPreviousDeltaY/touch.deltaTime;
			}
			else
			{				
				if(g_rectUpgradePackageScreenScrollArea2.Contains(v2TouchToGUIPos))
					g_fVelocityUpgradePackageScreenScroll2_X = -m_fPreviousDeltaX/touch.deltaTime;
					
				if(g_rectUpgradePackageScreenScrollArea3.Contains(v2TouchToGUIPos))
					g_fVelocityUpgradePackageScreenScroll3_X = -m_fPreviousDeltaX/touch.deltaTime;
			}
			m_fTimeStampWhenTouchPhaseEnded = Time.time;
		}
	}
	
	///////// Apply residual velocity or inertia to the scrollers when swipe goes off ///////////
	var fInertiaDuration	:	float = 0.75;
	if (Input.touchCount == 0) //if this is a short touch
	{
		if ( g_fVelocityUpgradePackageScreenScroll1_X != 0.0f || g_fVelocityUpgradePackageScreenScroll1_Y != 0.0f || g_fVelocityUpgradePackageScreenScroll2_X != 0.0f || g_fVelocityUpgradePackageScreenScroll2_Y != 0.0f || g_fVelocityUpgradePackageScreenScroll3_X != 0.0f || g_fVelocityUpgradePackageScreenScroll3_Y != 0.0f)
		{			
			// slow down over time
			var t : float;
			t = Time.time;
			t = t - m_fTimeStampWhenTouchPhaseEnded;
			t = t / fInertiaDuration;
			
			var fFrameVelocityScroll1_Y : float = Mathf.Lerp(g_fVelocityUpgradePackageScreenScroll1_Y, 0, t);	
			m_v2PresentPackageGenreListY.y += fFrameVelocityScroll1_Y * Time.deltaTime;
			
			var fFrameVelocityScroll2_X : float = Mathf.Lerp(g_fVelocityUpgradePackageScreenScroll2_X, 0, t);
			m_v2PresentPackageGenrewiseChannelsGridX.x += fFrameVelocityScroll2_X * Time.deltaTime;	
			
			var fFrameVelocityScroll3_X : float = Mathf.Lerp(g_fVelocityUpgradePackageScreenScroll3_X, 0, t);
			m_v2PresentPackageFreePaidAddOnsGridX.x += fFrameVelocityScroll3_X * Time.deltaTime;	
			
			// after N seconds, we’ve stopped
			if (t >= fInertiaDuration)
			{
				g_fVelocityUpgradePackageScreenScroll1_Y = 0.0f;
				
				g_fVelocityUpgradePackageScreenScroll2_X = 0.0f;
				
				g_fVelocityUpgradePackageScreenScroll3_X = 0.0f;
			}
		}
		return;
	}
}
function ProcessTouchForDowngradeOptionsScreen()
{
	//looping through all the finger touches and handles the touch(es) on their behaviour (tap,swipe,stopped,cancelled etc)
	for( var touch : Touch in Input.touches)
	{
		var v2TouchToGUIPos	: Vector2;
		v2TouchToGUIPos.x = touch.position.x;
		v2TouchToGUIPos.y = Screen.height - touch.position.y;
				
		if (touch.phase == TouchPhase.Began)
		{
			m_fPreviousDeltaX = touch.deltaPosition.x;
			m_fPreviousDeltaY = touch.deltaPosition.y;
			
			/*if(m_fPreviousDeltaX >= 0.01*m_fSW || m_fPreviousDeltaY >= 0.01*m_fSH)
			{
				m_bIsSwipeActive = true;
			}*/
			m_bIsSwipeActive	=	false;
		}
		if (touch.phase == TouchPhase.Canceled)
		{
			m_fPreviousDeltaX = 0f;
			m_fPreviousDeltaY = 0f;
			
			m_bIsSwipeActive	=	false;
		}
		if (touch.phase == TouchPhase.Moved)
		{
			m_bIsSwipeActive = true;
			
			// dragging
			m_fPreviousDeltaY = touch.deltaPosition.y;
			m_fPreviousDeltaX = touch.deltaPosition.x;
			
			//swipe in X
			if( Mathf.Abs(m_fPreviousDeltaX) > Mathf.Abs(m_fPreviousDeltaY))
			{
				if(m_rectDowngradeOptionsScreenScrollViewPort1.Contains(v2TouchToGUIPos))	
					m_v2DowngradeOptionsScreenScroll1_X.x -= 3.5*touch.deltaPosition.x;
					
				if(m_rectDowngradeOptionsScreenScrollViewPort2.Contains(v2TouchToGUIPos))	
					m_v2DowngradeOptionsScreenScroll2_X.x -= 3.5*touch.deltaPosition.x;
			}
		}
		if (touch.phase == TouchPhase.Stationary)
		{
			//print("Stationary : A finger is touching the screen but hasn't moved");
			m_bIsSwipeActive	=	false;
		}
		if (touch.phase == TouchPhase.Ended)
		{
			// impart momentum, using last delta as the starting velocity
			if( Mathf.Abs(m_fPreviousDeltaX) > Mathf.Abs(m_fPreviousDeltaY))
			{
				if(m_rectDowngradeOptionsScreenScrollViewPort1.Contains(v2TouchToGUIPos))
					m_fVelocityDowngradeOptionsScreenScroll1_X = -m_fPreviousDeltaX/touch.deltaTime;
				
				if(m_rectDowngradeOptionsScreenScrollViewPort2.Contains(v2TouchToGUIPos))
					m_fVelocityDowngradeOptionsScreenScroll2_X = -m_fPreviousDeltaX/touch.deltaTime;
			}
			m_fTimeStampWhenTouchPhaseEnded = Time.time;
			m_bIsSwipeActive	=	false;
		}
	}
	
	///////// Apply residual velocity or inertia to the scrollers when swipe goes off ///////////
	var fInertiaDuration	:	float = 0.75;
	if (Input.touchCount == 0) //if this is a short touch
	{
		if ( m_fVelocityDowngradeOptionsScreenScroll1_X != 0.0f || m_fVelocityDowngradeOptionsScreenScroll2_X != 0.0f)
		{			
			// slow down over time
			var t : float;
			t = Time.time;
			t = t - m_fTimeStampWhenTouchPhaseEnded;
			t = t / fInertiaDuration;
			
			var fFrameVelocityScroll1_X : float = Mathf.Lerp(m_fVelocityDowngradeOptionsScreenScroll1_X, 0, t);			
			var fFrameVelocityScroll2_X : float = Mathf.Lerp(m_fVelocityDowngradeOptionsScreenScroll2_X, 0, t);
			
			m_v2DowngradeOptionsScreenScroll1_X.x += fFrameVelocityScroll1_X * Time.deltaTime;	
			m_v2DowngradeOptionsScreenScroll2_X.x += fFrameVelocityScroll2_X * Time.deltaTime;	
						
			// after N seconds, we’ve stopped
			if (t >= fInertiaDuration)
			{
				m_bIsSwipeActive = false;
				
				m_fVelocityDowngradeOptionsScreenScroll1_X = 0.0f;
				
				m_fVelocityDowngradeOptionsScreenScroll2_X = 0.0f;
			}
		}
		return;
	}
}

//***************skin for Middle Menu*************//
var g_texPurpleDownArrow		:	Texture2D;

function OnGUI ()
{
	if(m_iPrefetchingStepsCompleted	< 3)
	{
		RenderHeader("Packages");
		GUI.DrawTexture(Rect(0,m_fHeightHeader,m_fSW,m_fSW - 2.0*m_fHeightHeader),m_tex2DWhite);
		RenderPleaseWaitSplashAt(0.5*m_fSW, 0.5*m_fSH, 0.15*m_fSH, 0.15*m_fSH);
	}
	else
	{
		//*************for Default Screen**************//
		if(g_iScreenID == 0)
		{
			Packages();
		}
		
		//**************for Present Package Screen*********//
		if(g_iScreenID == 1)
		{
			//Fetch AddOns details for present package
			//DownloadAddOnsListForPresentPackage;
			//http://203.223.176.33:9000/MobileEPGServices/MobileEPGService.AddOnService.svc/Method/GetAddOnsByCustomerIdAndSCNo
			PresentPackage();
		}
		
		//*****************for Upgrade Screen************//
		if(g_iScreenID == 2)
		{
			UpgradePackage();
		}
			
		//*****************See Downgrade Options**********//
		if(g_iScreenID == 3)
		{
			RenderDowngradeOptions();
		}
		
		//*****************for Downgrade Package Screen**********//
		if(g_iScreenID == 4)
		{
			DownGradePackage();
		}
	}
}

var	m_bShowFilter		:	boolean;
var	m_fDisplacementX	:	float;
function ShowHideFilter()
{
	if(m_bShowFilter)
	{
		if(m_fDisplacementX < 0.0)
		{
			m_fDisplacementX += 25.0;
		}
		else if(m_fDisplacementX > 0.0)
		{
			m_fDisplacementX = 0.0;
		}
	}
	else
	{
		var fHiddenModeWidth	=	0.8 * Screen.width/24.4;
		if((m_fDisplacementX + m_fWidthFilterDiv - fHiddenModeWidth) > 0.0)
		{
			m_fDisplacementX -= 25.0;
		}
		else if((m_fDisplacementX + m_fWidthFilterDiv - fHiddenModeWidth) < 0.0)
		{
			m_fDisplacementX = -(m_fWidthFilterDiv - fHiddenModeWidth);
		}
	}
}

 //********************START OF THE DEFAULT SCREEN WHICH SHOWS DIFFERENT PAKAGES AND CURRENT PACKAGE************//
 function Packages()
 {
	RenderHeader("Packages");
 	RenderPresentPackageBox();
 	RenderUpgradeOptionsBox();
 	RenderSeeDowngradeOptionsBox();
 	return;			
 }
 
var m_fHeightHeader					:	float;

var m_fGapX							:	float;
var m_fWidthPresentPackageBox		:	float;
var m_fWidthUpgradeOptionsBox		:	float;
var m_fWidthDowngradeOptionsBox		:	float;

var m_fGapY							:	float;
var m_fHeightPresentPackageBox		:	float;
var m_fHeightUpgradeOptionsBox		:	float;
var m_fHeightDowngradeOptionsBox	:	float;

var m_skinPackagesScreen			:	GUISkin;

var m_fontRegular					:	Font;
var m_fontBold						:	Font;

var m_tex2DPurple					:	Texture2D;
var m_tex2DLightPurple				:	Texture2D;
var m_tex2DOrange					:	Texture2D;
var m_tex2DWhite					:	Texture2D;
var m_tex2DGrey						:	Texture2D;
var m_tex2DPopupBackground			:	Texture2D;
var m_tex2DNotAvailable				:	Texture2D;

var m_tex2DPackageBox				:	Texture2D;
var m_tex2DHorizontalWhiteDots		:	Texture2D;
var m_tex2DHorizontalBlackDots		:	Texture2D;
var m_tex2DVerticalWhiteDots		:	Texture2D;

function RenderPresentPackageBox()
{
	
	
	//*************************	Present Package Box	***********************//
	GUI.BeginGroup(Rect(0,m_fHeightHeader + m_fGapY,m_fWidthPresentPackageBox,m_fHeightPresentPackageBox));
		
		//m_skinPackagesScreen.box.alignment			=	TextAnchor.MiddleCenter;
		//m_skinPackagesScreen.box.normal.background	=	m_tex2DLightPurple;
		//m_skinPackagesScreen.box.normal.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		//m_skinPackagesScreen.box.fontSize 			=	Mathf.Min(Screen.width,m_fHeightHeader)/1.5;
		//m_skinPackagesScreen.box.font				=	m_fontRegular;
		SkinButtonAsATile(m_tex2DLightPurple);
		if(GUI.Button(Rect(0,0,m_fWidthPresentPackageBox,m_fHeightPresentPackageBox),"") && !m_bIsSwipeActive)
		{
			g_iScreenID = 1;
		}
		
		//package icon | name | price | no.
		m_skinPackagesScreen.label.normal.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinPackagesScreen.label.fontSize 			=	Mathf.Min(Screen.width,m_fHeightHeader)/3.5;
		m_skinPackagesScreen.label.font					=	m_fontBold;
		m_skinPackagesScreen.label.alignment			=	TextAnchor.MiddleLeft;
		m_skinPackagesScreen.label.contentOffset.x		=	m_fWidthPresentPackageBox/15.0;
		
		if(m_strPresentPackName == null)
		{
			m_strPresentPackName = "Present package info unavailable";
		}
		var guicontentPresentPackageName	:	GUIContent	=	new GUIContent(m_strPresentPackName +" (INR "+ m_strPresentPackPrice +" pm)\n"+ m_iCountChannelsInPresentPack +" Channels & Services",m_tex2DPackageBox);
		GUI.Label(Rect(0,0,m_fWidthPresentPackageBox,0.25*m_fHeightPresentPackageBox),guicontentPresentPackageName);
		
		//channels icons grid
		//this rect has to be in 3:2 aspect ratio
		m_rectPackagesArea1ViewPort = Rect(0.5*m_fWidthPresentPackageBox - 0.375*m_fHeightPresentPackageBox,0.25*m_fHeightPresentPackageBox,0.75*m_fHeightPresentPackageBox,0.5*m_fHeightPresentPackageBox);
		
		if(m_iCountChannelsInPresentPack > 0)
		{
			var iChannelsInARow	:	int		=	m_iCountChannelsInPresentPack/2;
			var fChannelsInARow	:	float	=	m_iCountChannelsInPresentPack/2.0;
			if(fChannelsInARow > iChannelsInARow)
			{
				iChannelsInARow++;
			}
			var rectPresentPackageChannelsCompleteGrid		=	m_rectPackagesArea1ViewPort;
			rectPresentPackageChannelsCompleteGrid.width	=	(iChannelsInARow/3.0)*m_rectPackagesArea1ViewPort.width;
			
			//grid displays icons of images : 2 rows x totalchannels/3 ki matrix
			m_skinPackagesScreen.verticalScrollbar.fixedWidth 		= 	0;
			m_skinPackagesScreen.horizontalScrollbar.fixedHeight 	= 	0;
			m_skinPackagesScreen.label.contentOffset.x				=	0.0;
			m_v2ScrollPresentPackageChannelsGridX = GUI.BeginScrollView(m_rectPackagesArea1ViewPort,m_v2ScrollPresentPackageChannelsGridX,rectPresentPackageChannelsCompleteGrid);// added to update for Touch
					
				var fDimX	:	float	=	m_rectPackagesArea1ViewPort.width/3.0;
				var fDimY	:	float	=	m_rectPackagesArea1ViewPort.height/2.0;
				var fPosX	:	float	=	0.0;
				var fPosY	:	float	=	0.0;
				for(var i = 0; i < m_iCountChannelsInPresentPack; i++)
				{
					if(i % 2 == 0)//0 2 4 6 8 10 = i/2
					{
						fPosX	=	m_rectPackagesArea1ViewPort.x + 0.5*i*fDimX;
						fPosY	=	m_rectPackagesArea1ViewPort.y + 0.0;
					}
					else//1 3 5 7 9...
					{
						fPosX	=	m_rectPackagesArea1ViewPort.x + 0.5*(i-1)*fDimX;
						fPosY	=	m_rectPackagesArea1ViewPort.y + fDimY;
					}
					
					var rectChannelIcon	:	Rect = Rect(fPosX,fPosY,fDimX,fDimY);
					
					if(IsChannelRectIntersectingPackagesArea1ViewPort(rectChannelIcon))
					{
						GUI.Label(rectChannelIcon,m_tex2dIconsPresentPackageChannels[i]);
						//print(i);
					}
				}
				
	
			GUI.EndScrollView();
			
			//Present Package Button	
			m_skinPackagesScreen.button.normal.background	=	m_tex2DPurple;
			m_skinPackagesScreen.button.hover.background	=	m_tex2DOrange;
			m_skinPackagesScreen.button.active.background	=	m_tex2DOrange;
			m_skinPackagesScreen.button.normal.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
			m_skinPackagesScreen.button.hover.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
			m_skinPackagesScreen.button.active.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
			m_skinPackagesScreen.button.fontSize 			=	Mathf.Min(m_fWidthPresentPackageBox,0.125*m_fHeightPresentPackageBox)/1.75;
			m_skinPackagesScreen.button.font				=	m_fontBold;
			m_skinPackagesScreen.button.alignment			=	TextAnchor.MiddleCenter;
			
			if(GUI.Button(Rect(0,(1-0.125)*m_fHeightPresentPackageBox,m_fWidthPresentPackageBox,0.125*m_fHeightPresentPackageBox),"Present Package >"))
			{
				//DownloadPPAOList();//hit API to download the free AddOns of the present package
				g_iScreenID = 1;
			}
			
			//Horizontal White Dots
			m_skinPackagesScreen.label.alignment			=	TextAnchor.MiddleCenter;
			m_skinPackagesScreen.label.contentOffset.x		=	0.0;
			GUI.Label(Rect(0,(1-0.125-0.125)*m_fHeightPresentPackageBox,m_fWidthPresentPackageBox,0.125*m_fHeightPresentPackageBox),m_tex2DHorizontalWhiteDots);
		}
		else
		{
			m_skinPackagesScreen.label.alignment			=	TextAnchor.MiddleCenter;
			m_skinPackagesScreen.label.contentOffset.x		=	0.0;
			m_skinPackagesScreen.label.font					=	m_fontRegular;
			m_skinPackagesScreen.label.fontSize 			=	Mathf.Min(Screen.width,m_fHeightHeader)/2.0;
			GUI.Label(m_rectPackagesArea1ViewPort,"Channels info currently unavailable");
			
			//Present Package Button	
			m_skinPackagesScreen.button.normal.background	=	m_tex2DPurple;
			m_skinPackagesScreen.button.hover.background	=	m_tex2DOrange;
			m_skinPackagesScreen.button.active.background	=	m_tex2DOrange;
			m_skinPackagesScreen.button.alignment			=	TextAnchor.MiddleCenter;
			m_skinPackagesScreen.button.normal.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
			m_skinPackagesScreen.button.hover.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
			m_skinPackagesScreen.button.active.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);			
			m_skinPackagesScreen.button.fontSize 			=	Mathf.Min(m_fWidthPresentPackageBox,0.125*m_fHeightPresentPackageBox)/1.75;
			m_skinPackagesScreen.button.font				=	m_fontBold;
			
			GUI.enabled = false;
			if(GUI.Button(Rect(0,(1-0.125)*m_fHeightPresentPackageBox,m_fWidthPresentPackageBox,0.125*m_fHeightPresentPackageBox),"Present Package >"))
			{
				//DownloadPPAOList();//hit API to download the free AddOns of the present package
				g_iScreenID = 1;
			}
			GUI.enabled = true;
		}
		
	GUI.EndGroup();
}

function RenderHeader(strTitle	:	String)
{
	var fUnitX	:	float			=	Screen.width/22.6;
	var fUnitY	:	float			=	Screen.height/12.8;
	
	m_fGapX							=	0.2*fUnitX;
	m_fWidthPresentPackageBox		=	9.5*fUnitX;
	m_fWidthUpgradeOptionsBox		=	12.5*fUnitX;
	m_fWidthDowngradeOptionsBox		=	22.6*fUnitX;
	
	m_fHeightHeader		 			=	1.3*fUnitY;
	m_fGapY							=	0.2*fUnitY;
	m_fHeightPresentPackageBox		=	7.84*fUnitY;
	m_fHeightUpgradeOptionsBox		=	8.04*fUnitY;
	m_fHeightDowngradeOptionsBox	=	1.96*fUnitY;
	
	GUI.skin						=	m_skinPackagesScreen;
	//*************************	 Header	 ***********************//
	GUI.BeginGroup(Rect(0,0,m_fSW,m_fHeightHeader));
		
		m_skinPackagesScreen.box.alignment			=	TextAnchor.MiddleCenter;
		m_skinPackagesScreen.box.normal.background	=	m_tex2DPurple;
		m_skinPackagesScreen.box.normal.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinPackagesScreen.box.fontSize 			=	Mathf.Min(m_fSW,m_fHeightHeader)/1.5;
		m_skinPackagesScreen.box.font				=	m_fontRegular;
		m_skinPackagesScreen.box.contentOffset.x	=	0;
		GUI.Box(Rect(0,0,m_fSW,m_fHeightHeader),strTitle);
		
	GUI.EndGroup();
}
function RenderUpgradeOptionsBox()
{
	//*************************	Upgrade Options Box	***********************//
	GUI.BeginGroup(Rect(m_fWidthPresentPackageBox + m_fGapX,m_fHeightHeader + m_fGapY,m_fWidthUpgradeOptionsBox + 2*m_fGapX,m_fHeightUpgradeOptionsBox));
		
		m_skinPackagesScreen.box.alignment			=	TextAnchor.MiddleCenter;
		m_skinPackagesScreen.box.normal.background	=	m_tex2DLightPurple;
		m_skinPackagesScreen.box.normal.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinPackagesScreen.box.fontSize 			=	Mathf.Min(Screen.width,m_fHeightHeader)/1.5;
		m_skinPackagesScreen.box.font				=	m_fontRegular;	
		//GUI.Box(Rect(0,0,m_fWidthUpgradeOptionsBox,m_fHeightUpgradeOptionsBox),"Upgrade Options");
		
		if(m_iCountUpgradePacks > 0 )
		{
			//Vertical Scroll Starts here
			m_rectPackagesArea2ViewPort					=	Rect(0,0,m_fWidthUpgradeOptionsBox,m_fHeightUpgradeOptionsBox);
			var rectPackagesArea2FullScroll	:	Rect 	= 	m_rectPackagesArea2ViewPort;
			rectPackagesArea2FullScroll.height			=	(m_iCountUpgradePacks/2.0)*m_fHeightUpgradeOptionsBox;
			
			m_v2ScrollUpgradePackageOptionsY = GUI.BeginScrollView(m_rectPackagesArea2ViewPort,m_v2ScrollUpgradePackageOptionsY,rectPackagesArea2FullScroll);// added to update for Touch
			
			for(var j=0; j<m_iCountUpgradePacks; j++)
			{
				var rectUpgradeOptionBlock	:	Rect	=	Rect(0,j*m_fHeightUpgradeOptionsBox/2.0,m_fWidthUpgradeOptionsBox,m_fHeightUpgradeOptionsBox/2.0 - m_fGapY);
				
				if(IsUpgradeOptionRectIntersectingPackagesArea2ViewPort(rectUpgradeOptionBlock))
				{
					//upgrade package j starts
					GUI.BeginGroup(Rect(rectUpgradeOptionBlock));
					
					//alternate boxes for each of the upgrade option:
					if(j%2== 0)
					{
						SkinButtonAsATile(m_tex2DLightPurple);
					}
					else
					{
						SkinButtonAsATile(m_tex2DPurple);
					}
					
					if(GUI.Button(Rect(0,0,m_fWidthUpgradeOptionsBox,m_fHeightUpgradeOptionsBox/2.0 - m_fGapY),"") && !m_bIsSwipeActive)
					{
						g_iSelectedUpgradeOptionIndex = j;
						m_iTotalAddOnsCountInSelectedPackage	=	m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_iAddOnsCount;
						m_iFreeAddOnsCountInSelectedPackage 	=	GetFreeAddOnCounts(1);
						HighlightAddOnsAlsoAddedInPP(1);
						g_iScreenID = 2;
					}
				
					//package icon | name | price | no.
					m_skinPackagesScreen.label.normal.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
					m_skinPackagesScreen.label.fontSize 			=	Mathf.Min(Screen.width,m_fHeightHeader)/3.5;
					m_skinPackagesScreen.label.font					=	m_fontBold;
					m_skinPackagesScreen.label.alignment			=	TextAnchor.MiddleLeft;
					m_skinPackagesScreen.label.contentOffset.x		=	m_fWidthPresentPackageBox/15.0;
					
					var guicontentUpgradeOption	:	GUIContent	=	new GUIContent(m_strUpgradePackageName[j] +" (INR "+ m_strUpgradePackagePrice[j] +" pm)\n"+ m_iUpgradePackageChannelsCount[j] +" Channels & Services",m_tex2DPackageBox);
					GUI.Label(Rect(0,0,0.65*m_fWidthUpgradeOptionsBox,(1/3.0)*(m_fHeightUpgradeOptionsBox/2.0 - m_fGapY)),guicontentUpgradeOption);
					
					//Rectangle : For Scroll or Error_Label
					var rectViewPortScroll	:	Rect	=	Rect(0.15*m_fWidthUpgradeOptionsBox, (1/3.0)*(m_fHeightUpgradeOptionsBox/2.0 - m_fGapY), 0.7*m_fWidthUpgradeOptionsBox, (7/12.0)*(m_fHeightUpgradeOptionsBox/2.0 - m_fGapY));
					
					//Upgrade Button | Icons grid for each of the upgrade option
					/*m_skinPackagesScreen.button.normal.background	=	null;
					m_skinPackagesScreen.button.normal.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
					m_skinPackagesScreen.button.hover.background	=	null;
					m_skinPackagesScreen.button.hover.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
					m_skinPackagesScreen.button.active.background	=	null;
					m_skinPackagesScreen.button.active.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
					
					m_skinPackagesScreen.label.fontSize 			=	Mathf.Min(0.4*m_fWidthUpgradeOptionsBox,(1/3.0)*(m_fHeightUpgradeOptionsBox/2.0 - m_fGapY))/2.0;
					m_skinPackagesScreen.label.alignment			=	TextAnchor.MiddleCenter;
					m_skinPackagesScreen.label.contentOffset.x		=	0.0;
					*/
					m_skinPackagesScreen.button.fontSize 			=	Mathf.Min(0.4*m_fWidthUpgradeOptionsBox,(1/3.0)*(m_fHeightUpgradeOptionsBox/2.0 - m_fGapY))/2.0;
					m_skinPackagesScreen.button.font				=	m_fontBold;
					if(m_iUpgradePackageChannelsCount[j] > 0)
					{
						//Upgrade button
						if(GUI.Button(Rect(0.7*m_fWidthUpgradeOptionsBox,0,0.3*m_fWidthUpgradeOptionsBox,(1/3.0)*(m_fHeightUpgradeOptionsBox/2.0 - m_fGapY)),"Upgrade  >"))
						{
							g_iSelectedUpgradeOptionIndex = j;
							m_iTotalAddOnsCountInSelectedPackage	=	m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_iAddOnsCount;
							m_iFreeAddOnsCountInSelectedPackage 	=	GetFreeAddOnCounts(1);
							HighlightAddOnsAlsoAddedInPP(1);
							g_iScreenID = 2;
						}
					
						//horizontal scroll starts
						var rectFullScroll		:	Rect	=	rectViewPortScroll;
						rectFullScroll.width			 	= 	(m_iUpgradePackageChannelsCount[j]/5.0)*rectViewPortScroll.width;
						
						//m_skinPackagesScreen.scrollView.normal.background = m_tex2DWhite;
						m_v2ScrollUpgradeOptionChannelsGridX[j] = GUI.BeginScrollView(rectViewPortScroll,m_v2ScrollUpgradeOptionChannelsGridX[j],rectFullScroll);// added to update for Touch
						
						//grid that displays all the channels horizontally in just one row
						m_skinPackagesScreen.label.contentOffset.x		=	0.0;
						
						var fDimX	:	float	=	rectViewPortScroll.width/5.0;
						var fDimY	:	float	=	rectViewPortScroll.height;
						var fPosX	:	float	=	0.0;
						var fPosY	:	float	=	0.0;
						for(var i = 0; i < m_iUpgradePackageChannelsCount[j]; i++)
						{
							fPosX	=	rectViewPortScroll.x + i*fDimX;
							fPosY	=	rectViewPortScroll.y + 0.0;
							
							var rectChannelIcon	:	Rect = Rect(fPosX,fPosY,fDimX,fDimY);
							
							if(IsChannelRectIntersectingGivenViewPort(rectChannelIcon, rectViewPortScroll, m_v2ScrollUpgradeOptionChannelsGridX[j]))
							{
								GUI.Label(rectChannelIcon,m_listUpgradeOptions[j].m_tex2dListIcons[i]);
							}
						}
						
						//horizontal scroll ends here
						GUI.EndScrollView();
						
						//horizontal dots:
						var rectDots	:	Rect	=	Rect(0, (m_fHeightUpgradeOptionsBox/2.0 - m_fGapY) - (2.5/12.0)*(m_fHeightUpgradeOptionsBox/2.0 - m_fGapY), m_fWidthUpgradeOptionsBox, 3.0*(1/12.0)*(m_fHeightUpgradeOptionsBox/2.0 - m_fGapY));
						
						m_skinPackagesScreen.label.alignment			=	TextAnchor.MiddleCenter;
						m_skinPackagesScreen.label.contentOffset.x		=	0.0;
						GUI.Label(rectDots,m_tex2DHorizontalWhiteDots);
					}
					else
					{
						m_skinPackagesScreen.label.contentOffset.x		=	0;
						m_skinPackagesScreen.label.alignment			=	TextAnchor.MiddleCenter;
						m_skinPackagesScreen.label.font					=	m_fontRegular;
						m_skinPackagesScreen.label.fontSize 			=	Mathf.Min(Screen.width,m_fHeightHeader)/2.0;
						GUI.Label(rectViewPortScroll,"Channels info currently unavailable.");
						
						//Upgrade button
						/*m_skinPackagesScreen.label.fontSize 			=	Mathf.Min(0.4*m_fWidthUpgradeOptionsBox,(1/3.0)*(m_fHeightUpgradeOptionsBox/2.0 - m_fGapY))/2.0;
						m_skinPackagesScreen.label.alignment			=	TextAnchor.MiddleCenter;
						m_skinPackagesScreen.label.contentOffset.x		=	0.0;*/
						//GUI.enabled = false;
						if(GUI.Button(Rect(0.7*m_fWidthUpgradeOptionsBox,0,0.3*m_fWidthUpgradeOptionsBox,(1/3.0)*(m_fHeightUpgradeOptionsBox/2.0 - m_fGapY)),"Upgrade  >"))
						{
							g_iSelectedUpgradeOptionIndex = j;
							m_iTotalAddOnsCountInSelectedPackage	=	m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_iAddOnsCount;
							m_iFreeAddOnsCountInSelectedPackage 	=	GetFreeAddOnCounts(1);
							HighlightAddOnsAlsoAddedInPP(1);
							g_iScreenID = 2;
						}
						//GUI.enabled = true;
					}	
					GUI.EndGroup();
					//upgrade package j ends
				}
			}
			//vertical scroll ends here
			GUI.EndScrollView();
			
			if(m_iCountUpgradePacks > 2)
			{
				//Vertical White Dots
				m_skinPackagesScreen.label.alignment			=	TextAnchor.MiddleCenter;
				m_skinPackagesScreen.label.contentOffset.x		=	0;
				GUI.Label(Rect(m_fWidthUpgradeOptionsBox - 1.5*m_fGapX,0.5*m_fHeightPresentPackageBox - 2.5*m_fGapX,5.0*m_fGapX,5.0*m_fGapX),m_tex2DVerticalWhiteDots);
			}
		}
		else
		{
			var strMessage	:	String			=	"Upgrade options currently unavailable.";
			m_skinPackagesScreen.box.fontSize 	=	Mathf.Min(m_fWidthUpgradeOptionsBox,m_fHeightUpgradeOptionsBox - m_fGapY)/12.5;
			m_skinPackagesScreen.box.font		=	m_fontRegular;
			
			if(m_strUpgradeOptionsAPIException != null)
			{
				if(m_strUpgradeOptionsAPIException.Length > 0)
				{
					strMessage	=	m_strUpgradeOptionsAPIException;
				}
			}
			GUI.Box(Rect(0,0,m_fWidthUpgradeOptionsBox,m_fHeightUpgradeOptionsBox - m_fGapY),strMessage);
		}	
					
	GUI.EndGroup();
	
	//initialize touch areas on the first frame
	if(m_bInitializeTouchAreas[0] == false)
	{
		/************ For iPhone ***************/
		//Present Package : Horizontal Scroll Area for channels Grid
		//i.e. m_rectPackagesScreenScrollArea1
		m_rectPackagesScreenScrollArea1 = Rect(0, m_fHeightHeader + m_fGapY + 0.25*m_fHeightPresentPackageBox, m_fWidthPresentPackageBox, 0.5*m_fHeightPresentPackageBox);
		m_rectPackagesScreenScrollArea2	= Rect(m_fWidthPresentPackageBox + m_fGapX,m_fHeightHeader + m_fGapY,m_fWidthUpgradeOptionsBox + 2*m_fGapX,m_fHeightUpgradeOptionsBox - m_fGapY);
		m_bInitializeTouchAreas[0] = true;
	}
}
function RenderSeeDowngradeOptionsBox()
{
	//*************************	Downgrade Options Box	***********************//
	GUI.BeginGroup(Rect(0,m_fHeightHeader + m_fGapY + m_fHeightPresentPackageBox + m_fGapY,m_fWidthDowngradeOptionsBox,m_fHeightDowngradeOptionsBox));
		
		m_skinPackagesScreen.button.alignment			=	TextAnchor.MiddleRight;
		m_skinPackagesScreen.button.normal.background	=	m_tex2DWhite;
		m_skinPackagesScreen.button.hover.background	=	m_tex2DOrange;
		m_skinPackagesScreen.button.active.background	=	m_tex2DOrange;
		
		if(GUI.Button(Rect(0,0,m_fWidthDowngradeOptionsBox,m_fHeightDowngradeOptionsBox),""))
		{
			g_iScreenID = 3;
		}
		
		m_skinPackagesScreen.label.normal.textColor  	=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
		m_skinPackagesScreen.label.fontSize 			=	Mathf.Min(m_fWidthDowngradeOptionsBox,m_fHeightDowngradeOptionsBox)/3.0;
		m_skinPackagesScreen.label.font					=	m_fontBold;
		GUI.Label(Rect(0,0,0.4*m_fWidthDowngradeOptionsBox,m_fHeightDowngradeOptionsBox),"Downgrade Packages");
		GUI.Label(Rect(0.4*m_fWidthDowngradeOptionsBox,0,0.6*m_fWidthDowngradeOptionsBox,m_fHeightDowngradeOptionsBox),"See Downgrade Options");
		
		if(m_fAspectRatio < 1.5)//ipad
		{
			GUI.Label(Rect(0.9125*m_fWidthDowngradeOptionsBox,0,0.035*m_fWidthDowngradeOptionsBox,m_fHeightDowngradeOptionsBox),g_texPurpleDownArrow);
		}
		else
		{
			GUI.Label(Rect(0.8875*m_fWidthDowngradeOptionsBox,0,0.035*m_fWidthDowngradeOptionsBox,m_fHeightDowngradeOptionsBox),g_texPurpleDownArrow);
		}

	GUI.EndGroup();
}

//*********for present package*******************//
var g_strPackagesType				:	String[];
var g_strDescriptionPackage			:	String[];

var g_skinPresentPackageGenreOptions	:	GUISkin;// same skin as in channels selection screen 1st column
var skin_PakageSelected					:	GUISkin;

var g_boolDescriptionPackage			:	boolean;

function PresentPackage()
{
	GUI.enabled		=	!m_bSeeAddOnsListPressed;
	
	ShowHideFilter();
	RenderHeaderPresentPackageScreen();
	RenderGenreFilters();
	RenderChannelsGridPresentPackageScreen();
	RenderAddOnsGridPresentPackageScreen();
	
	GUI.enabled		=	true;
	
	if(m_bSeeAddOnsListPressed)
	{
		m_fWidthPopup	=	0.8*Screen.width;
		m_fHeightPopup	=	0.4*Screen.height;
		m_rectFreeAddOnPopUpScrollArea = Rect(0.5*(Screen.width - m_fWidthPopup), 0.5*(Screen.height - m_fHeightPopup), m_fWidthPopup, m_fHeightPopup);
		
		m_skinPackagesScreen.window.normal.background	=	m_tex2DPopupBackground;
		GUI.ModalWindow(0,m_rectFreeAddOnPopUpScrollArea, PopUpShowChannelsOfTheTappedAddOn, "", m_skinPackagesScreen.window);
	}
	
	//initialize touch areas on the first frame
	if(m_bInitializeTouchAreas[1] == false)
	{
		/************ For iPhone ***************/
		var fUnitX	:	float	=	Screen.width/24.4;
 		var fUnitY	:	float 	=	Screen.height/12.8;
		//Present Package Screen
		//i.e. m_rectPackagesScreenScrollArea1
		m_rectPresentPackageScreenScrollArea1 = Rect(0.8*fUnitX, m_fHeightHeader + m_fHeightFilterButton + 1.2*fUnitY,	m_fWidthFilterButton, 7.9*fUnitY);
		m_rectPresentPackageScreenScrollArea2 = Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightHeader + m_fHeightHeader,m_fWidthChannelsGridDiv,m_fHeightChannelsGridDiv);
		m_rectPresentPackageScreenScrollArea3 = Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightHeader + m_fHeightHeader + m_fHeightChannelsGridDiv + m_fHeightHeader,m_fWidthAddOnsGridDiv,m_fHeightAddOnsGridDiv);
		
		m_bInitializeTouchAreas[1] = true;
	}
	return;
}

// variables for free add on function
var Skin_AddOns												:	GUISkin;
var g_texSeeListIndex										:	int ;
var g_texSeeList											:	Texture2D[]; //0 index : orange see list and 1 index : white see list and 2 : orange add on
var m_bSeeAddOnsListPressed									:	boolean;

//**********function for the present Package***************//
function RenderHeaderPresentPackageScreen()
{
	var fUnitX	:	float	=	Screen.width/24.4;
 	var fUnitY	:	float 	=	Screen.height/12.8;
	m_fHeightHeader		 	=	1.3*fUnitY;
	GUI.skin	=	m_skinPackagesScreen;
	//*************************	Header	***********************//
	GUI.BeginGroup(Rect(0,0,Screen.width,m_fHeightHeader));
		
		m_skinPackagesScreen.box.alignment			=	TextAnchor.MiddleCenter;
		m_skinPackagesScreen.box.normal.background	=	m_tex2DPurple;
		m_skinPackagesScreen.box.normal.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinPackagesScreen.box.fontSize 			=	Mathf.Min(Screen.width,m_fHeightHeader)/1.5;
		m_skinPackagesScreen.box.font				=	m_fontRegular;
		m_skinPackagesScreen.box.contentOffset.x	=	0;
		GUI.Box(Rect(0,0,Screen.width,m_fHeightHeader),m_strPresentPackName);
		
		m_skinPackagesScreen.label.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinPackagesScreen.label.fontSize 		=	Mathf.Min(Screen.width,m_fHeightHeader)/3.5;
		GUI.Label(Rect(0.75*Screen.width,0,0.25*Screen.width,m_fHeightHeader),"INR " + GetPresentPackagePrice() + " PM");
	GUI.EndGroup();
	GUI.skin	=	null;
}

var m_fWidthFilterDiv					:	float;
var m_fWidthFilterButton				:	float;
var m_fHeightFilterButton				:	float;
var m_fHeightFilterOptions				:	float;
var	m_strListGenres						:	String[];

//var m_tex2DFilterBackground				:	Texture2D;	//BACKGROUNDTEX
var m_tex2DFilterIcon					:	Texture2D;	//filter-icon
var m_tex2DFilterLeftArrow				:	Texture2D;	//filter-arrow-inside
var m_tex2DFilterRightArrow				:	Texture2D;	//filter-arrow-outside
var m_tex2DBorder						:	Texture2D;	//border

var m_skinFilterButton					:	GUISkin;	//Skin_FilterButton
var m_skinCustomerID					:	GUISkin;	//Channel_skinCustomerID
var m_skinGenresGrid					:	GUISkin;	//Skin_GenresGrid

function RenderGenreFilters()
{
	var fUnitX	:	float	=	Screen.width/24.4;
 	var fUnitY	:	float 	=	Screen.height/12.8;
 	
 	m_fWidthFilterDiv		=	5.8*fUnitX;
 		
	m_fWidthFilterButton	=	4.2*fUnitX;
	m_fHeightFilterButton	=	0.9*fUnitY;
	
	m_fHeightFilterOptions	=	9.2*fUnitY;
	
	//lokesh
 	//FOR GRADIENT in the first column
	//GUI.DrawTexture(Rect(0,0,m_fWidthFilterDiv,Screen.height), m_tex2DFilterBackground);
	//~lokesh
	
	//***********Arrow | Filters | Menu : Filter Button on TOP ***************//
	GUI.BeginGroup(Rect(m_fDisplacementX,m_fHeightHeader,m_fWidthFilterDiv,m_fHeightFilterButton),"");//creating the filters menu screen
	//GUI.Box(Rect(0,0,m_fWidthFilterDiv,m_fHeightFilterButton),"");//box for above group
	
	m_skinFilterButton.button.fontSize			=	Mathf.Min(m_fWidthFilterButton,m_fHeightFilterButton)/2.0;
	m_skinFilterButton.button.font				= 	m_fontBold;	
	m_skinFilterButton.button.normal.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	
	GUI.Label(Rect(0.8*fUnitX,0,m_fWidthFilterButton,m_fHeightFilterButton),m_tex2DFilterLeftArrow,m_skinFilterButton.label); //arrow icon
	GUI.Box(Rect(0.8*fUnitX,0,m_fWidthFilterButton,m_fHeightFilterButton),m_tex2DFilterIcon,m_skinFilterButton.box); //menu icon
	if(GUI.RepeatButton(Rect(0.8*fUnitX,0,m_fWidthFilterButton,m_fHeightFilterButton),"Filters",m_skinFilterButton.button))	//arrow icon
	{
		m_bShowFilter	=	false;
		for(var j = 0; j < 4; j++)
		{
			if(m_bInitializeTouchAreas[j])
					m_bInitializeTouchAreas[j]	=	false;
		}
	}
	
	if(m_bShowFilter	==	false)
	{
		if(GUI.RepeatButton(Rect(0.8*fUnitX + m_fWidthFilterButton,0,0.8*fUnitX,m_fHeightFilterButton),m_tex2DFilterRightArrow,m_skinFilterButton.button))//right arrow icon
		{
			m_bShowFilter	=	true;
			for(j = 0; j < 4; j++)
			{
				if(m_bInitializeTouchAreas[j])
					m_bInitializeTouchAreas[j]	=	false;
			}
		}
	}
	
	GUI.EndGroup();
	
	//***************Connection ID ************************************//
	GUI.BeginGroup(Rect(m_fDisplacementX,m_fHeightHeader + m_fHeightFilterButton,m_fWidthFilterDiv,m_fHeightFilterOptions));
	//GUI.Box(Rect(0,0,m_fWidthFilterDiv,m_fHeightFilterOptions),"");
	
	m_skinCustomerID.button.fontSize			=	Mathf.Min(m_fWidthFilterButton,m_fHeightFilterButton)/2.0;
	m_skinCustomerID.button.font				= 	m_fontBold;	
	m_skinCustomerID.button.normal.textColor 	= 	Color(100/255.0F,49/255.0F,140/255.0F,255/255.0F);
	
	GUI.DrawTexture(Rect(0,0,m_fWidthFilterDiv,3),m_tex2DBorder);//for line seperating Filter and the next column				
	GUI.Button(Rect(0.8*fUnitX,0.2*fUnitY,m_fWidthFilterButton,0.8*fUnitY),g_strConnectionId,m_skinCustomerID.button); // for connection ID
	
	GUI.EndGroup();
	
	//***************Scrollable circular grid : All Channels | Favorites | Genres******************//
	
	GUI.skin = m_skinGenresGrid;
	m_skinGenresGrid.toggle.fontSize			=	Mathf.Max(m_fWidthFilterButton,m_fHeightFilterButton)/9.0;
	m_skinGenresGrid.toggle.font				= 	m_fontRegular;	
	m_skinGenresGrid.toggle.normal.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	
	GUI.BeginGroup(Rect(m_fDisplacementX + 0.8*fUnitX, m_fHeightHeader + m_fHeightFilterButton + 1.2*fUnitY,	m_fWidthFilterButton, 7.9*fUnitY));
	
	m_v2PresentPackageGenreListY = GUI.BeginScrollView(Rect(0,0,m_fWidthFilterButton,7.9*fUnitY), m_v2PresentPackageGenreListY, Rect(0,0,m_fWidthFilterButton,24*1.16*fUnitY));//,g_styleHorizontalScrollbar,g_styleVerticalScrollbar);
		
		var strActiveGenre	:	String;
		for(var i=0; i<24; i++)
		{
			strActiveGenre	=	m_strListGenres[i];	
			if(strActiveGenre.Length > 14)
			{
				strActiveGenre	=	strActiveGenre.Substring(0,12) + "...";
			}
				
			m_bFilterToggleState[i]	=	GUI.Toggle(Rect(-0.025*m_fWidthFilterButton, i*1.16*fUnitY, 1.05*m_fWidthFilterButton, 1.16*fUnitY), m_bFilterToggleState[i], strActiveGenre);
			
			if(m_bFilterToggleState[i])
			{
				if(i != m_iIndexActiveGenre)
				{
					m_iIndexActiveGenre	=	i;
					ResetStateOfRestFilterToggles(m_iIndexActiveGenre);
					
					m_iChannelCountInPPActiveGenre	=	-1;
					m_iChannelCountInSelectedPackageByActiveGenre = -1;
					
					if(g_iScreenID == 1)
					{
						tracking("Packages -> Present Package -> Filter : " + strActiveGenre);
					}
					
					if(g_iScreenID == 2)
					{
						tracking("Packages -> Upgrade Package -> Filter : " + strActiveGenre);
					}
					
					if(g_iScreenID == 4)
					{
						tracking("Packages -> Downgrade Package -> Filter : " + strActiveGenre);
					}
				}
			}
			else
			{
				if(i == m_iIndexActiveGenre)
				{
					m_bFilterToggleState[i] = true;
				}
			}
		}
	GUI.EndScrollView();
		
	GUI.EndGroup();
	GUI.skin = null;
	
	if(m_bShowFilter	==	false)
	{
		//Show vertical dots to represent scroll
		GUI.DrawTexture(Rect(m_fDisplacementX + 0.8*fUnitX + m_fWidthFilterButton ,m_fHeightHeader + m_fHeightFilterButton + m_fHeightFilterOptions/2.0 - 0.4*fUnitX,0.8*fUnitX,0.8*fUnitX),m_tex2DVerticalWhiteDots);//vertical dots
		
		if(GUI.RepeatButton(Rect(0,m_fHeightHeader + m_fHeightFilterButton,0.8*fUnitX,9.4*fUnitY),"",m_skinFilterButton.button))//right arrow icon
		{
			m_bShowFilter	=	true;
			for(j = 0; j < 4; j++)
			{
				if(m_bInitializeTouchAreas[j])
					m_bInitializeTouchAreas[j]	=	false;
			}
		}
	}
}
function InitFilterToggleState()
{
	m_bFilterToggleState = new boolean[24];
	
	for(var i = 0; i < 24; i++)
	{
		m_bFilterToggleState[i] = false;
	}
}
function ResetStateOfRestFilterToggles(iExceptionIndex	:	int)
{
	for(var i=0; i<24; i++)
	{
		if(i != iExceptionIndex)
		{
			m_bFilterToggleState[i] = false;
		}
	}
}

var m_fWidthChannelsGridDiv		:	float;
var m_fHeightChannelsGridDiv	:	float;
function RenderChannelsGridPresentPackageScreen()
{
	var fUnitX	:	float		= 	Screen.width/24.4;
 	var fUnitY	:	float 		= 	Screen.height/12.8;
 	
 	m_fWidthChannelsGridDiv		=	18.6*fUnitX;
 	if(m_fDisplacementX < 0)
 	{
 		m_fWidthChannelsGridDiv -= m_fDisplacementX;
 	}
 	m_fHeightChannelsGridDiv	=	3.8*fUnitY;
 	
 	var fMarginScroll_X	:	float		=	0.05*m_fWidthChannelsGridDiv;
 	var fMarginScroll_Y	:	float		=	0.1*m_fHeightChannelsGridDiv;
 	var fWidthScroll	:	float		=	0.9*m_fWidthChannelsGridDiv;
 	var fHeightScroll	:	float		=	0.8*m_fHeightChannelsGridDiv;
 	
	GUI.skin	=	m_skinPackagesScreen;
	//*************************	Genre Title	***********************//
	GUI.BeginGroup(Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightHeader,m_fWidthChannelsGridDiv,m_fHeightHeader + m_fHeightChannelsGridDiv));
		
		m_skinPackagesScreen.box.alignment			=	TextAnchor.MiddleLeft;
		m_skinPackagesScreen.box.normal.background	=	m_tex2DWhite;
		m_skinPackagesScreen.box.normal.textColor  	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
		m_skinPackagesScreen.box.fontSize 			=	Mathf.Min(m_fWidthChannelsGridDiv,m_fHeightHeader)/2.5;
		m_skinPackagesScreen.box.font				=	m_fontRegular;
		m_skinPackagesScreen.box.contentOffset.x	=	0.5*fUnitX;
		GUI.Box(Rect(0,0,m_fWidthChannelsGridDiv,m_fHeightHeader),m_strListGenres[m_iIndexActiveGenre]);
		
		m_skinPackagesScreen.box.normal.background	=	m_tex2DGrey;
		GUI.Box(Rect(0,m_fHeightHeader,m_fWidthChannelsGridDiv,m_fHeightChannelsGridDiv),"");
		
		var rectViewPortScroll	=	Rect(fMarginScroll_X,m_fHeightHeader + fMarginScroll_Y,fWidthScroll,fHeightScroll);
		var rectFullScroll		=	Rect(0,0,fWidthScroll,fHeightScroll);
		
		//Scroll for horizontal channel icons grid
		if(m_iChannelCountInPPActiveGenre < 0)
		{
			m_iChannelCountInPPActiveGenre	=	GetChannelsCountInPPByActiveGenre();
		}
		else if(m_iChannelCountInPPActiveGenre	>	0)
		{
			rectFullScroll.width	=	(m_iChannelCountInPPActiveGenre/5.0)*rectViewPortScroll.width;
				
			m_skinPackagesScreen.scrollView.normal.background	=	null;
			m_v2PresentPackageGenrewiseChannelsGridX = GUI.BeginScrollView(rectViewPortScroll,m_v2PresentPackageGenrewiseChannelsGridX,rectFullScroll);//uncomment ,g_styleHorizontalScrollbar,g_styleVerticalScrollbar);// added to update for Touch
									
				RenderChannelsOfPPByActiveGenre(rectFullScroll);
				
			GUI.EndScrollView();
			
			if(m_iChannelCountInPPActiveGenre > 5)
			{
				//Horizontal Black Dots
				m_skinPackagesScreen.label.alignment			=	TextAnchor.MiddleCenter;
				m_skinPackagesScreen.label.contentOffset.x		=	0.0;
				GUI.Label(Rect(0,m_fHeightHeader + fHeightScroll,m_fWidthAddOnsGridDiv,3*fMarginScroll_Y),m_tex2DHorizontalBlackDots);
			}
		}
		else
		{
			m_skinPackagesScreen.box.fontSize 				=	Mathf.Min(m_fWidthAddOnsGridDiv,m_fHeightAddOnsGridDiv)/7.5;
			m_skinPackagesScreen.box.font					=	m_fontRegular;
			m_skinPackagesScreen.box.alignment				=	TextAnchor.MiddleCenter;
			GUI.Box(rectViewPortScroll,m_strPresentPackName + " does not have channels from the selected genre.");
		}
	
	GUI.EndGroup();
}

var m_fWidthAddOnsGridDiv		:	float;
var m_fHeightAddOnsGridDiv		:	float;
function RenderAddOnsGridPresentPackageScreen()
{
	var fUnitX	:	float		= 	Screen.width/24.4;
 	var fUnitY	:	float 		= 	Screen.height/12.8;
 	
 	m_fWidthAddOnsGridDiv		=	18.6*fUnitX;
 	if(m_fDisplacementX < 0)
 	{
 		m_fWidthAddOnsGridDiv -= m_fDisplacementX;
 	}
 	m_fHeightAddOnsGridDiv		=	3.8*fUnitY;
 	
 	var fMarginAddOn_X	:	float		=	0.05*m_fWidthAddOnsGridDiv;
 	var fMarginAddOn_Y	:	float		=	0.2*m_fHeightAddOnsGridDiv;
 	var fWidthAddOnBox	:	float		=	0.425*m_fWidthAddOnsGridDiv;
 	var fHeighAddOnBox	:	float		=	0.6*m_fHeightAddOnsGridDiv;
 	
	GUI.skin	=	m_skinPackagesScreen;
	//*************************	 Free AddOns Title	***********************//
	GUI.BeginGroup(Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightHeader + m_fHeightHeader + m_fHeightChannelsGridDiv,m_fWidthAddOnsGridDiv,m_fHeightHeader + m_fHeightAddOnsGridDiv));
		
		m_skinPackagesScreen.box.alignment			=	TextAnchor.MiddleLeft;
		m_skinPackagesScreen.box.normal.background	=	m_tex2DWhite;
		m_skinPackagesScreen.box.normal.textColor  	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
		m_skinPackagesScreen.box.fontSize 			=	Mathf.Min(m_fWidthChannelsGridDiv,m_fHeightHeader)/2.5;
		m_skinPackagesScreen.box.font			=	m_fontRegular;
		m_skinPackagesScreen.box.contentOffset.x	=	0.5*fUnitX;
		GUI.Box(Rect(0,0,m_fWidthAddOnsGridDiv,m_fHeightHeader),"ADD ONS (Both Paid and Free)");
		
		m_skinPackagesScreen.box.normal.background	=	m_tex2DGrey;
		GUI.Box(Rect(0,m_fHeightHeader,m_fWidthAddOnsGridDiv,m_fHeightAddOnsGridDiv),"");
		
		//Scroll for horizontal channel icons grid		
		if(m_iPPAOCount	>	0)
		{
			var rectViewPortScroll	=	Rect(0,m_fHeightHeader,m_fWidthAddOnsGridDiv,m_fHeightAddOnsGridDiv);
			var rectFullScroll		=	rectViewPortScroll;
			rectFullScroll.width	=	(m_iPPAOCount/2.0)*rectViewPortScroll.width;
			
			m_skinPackagesScreen.scrollView.normal.background	=	null;
			m_v2PresentPackageFreePaidAddOnsGridX = GUI.BeginScrollView(rectViewPortScroll,m_v2PresentPackageFreePaidAddOnsGridX,rectFullScroll);//uncomment ,g_styleHorizontalScrollbar,g_styleVerticalScrollbar);// added to update for Touch
			
				// FOR PRINTING THE AVAILABLE BUTTONS
				m_skinPackagesScreen.box.alignment			=	TextAnchor.MiddleCenter;
				m_skinPackagesScreen.box.normal.background	=	m_tex2DWhite;
				m_skinPackagesScreen.box.normal.textColor  	=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
				m_skinPackagesScreen.box.fontSize 			=	Mathf.Min(m_fWidthChannelsGridDiv,m_fHeightHeader)/2.5;
				m_skinPackagesScreen.box.font				=	m_fontRegular;
				m_skinPackagesScreen.box.contentOffset.x	=	0;
				
				for(var j=0;j<m_iPPAOCount;j++)
				{
					GUI.Box(Rect(fMarginAddOn_X + j*(fMarginAddOn_X + fWidthAddOnBox), m_fHeightHeader + fMarginAddOn_Y, 0.9*fWidthAddOnBox, fHeighAddOnBox),m_listPPAO[j].m_strAddOnName + "\nAdd On subscribed");//hardcoding
					
					if(GUI.Button(Rect(fMarginAddOn_X + j*(fMarginAddOn_X + fWidthAddOnBox) + 0.9*fWidthAddOnBox, m_fHeightHeader + fMarginAddOn_Y, 0.1*fWidthAddOnBox, fHeighAddOnBox),g_texSeeList[0],Skin_AddOns.button))
					{
						//implement popup and getproducttochannelinfo
						InstantiatePopUp(m_listPPAO[j].m_strAddOnID); //generic
					}
				}
		
			GUI.EndScrollView();
			
			//Horizontal Black Dots
			m_skinPackagesScreen.label.alignment			=	TextAnchor.MiddleCenter;
			m_skinPackagesScreen.label.contentOffset.x		=	0.0;
			GUI.Label(Rect(0,m_fHeightHeader + m_fHeightAddOnsGridDiv - 1.0*fMarginAddOn_Y,m_fWidthAddOnsGridDiv,1.5*fMarginAddOn_Y),m_tex2DHorizontalBlackDots);
		}
		else
		{
			if(m_objDownloadPPAOAPIPacket.m_bResponseReceived == false)
			{
				//if API in progress -> show splash
				if(m_bPPAOAPIInProgress)
				{
					RenderPleaseWaitSplashAt(0.5*m_fWidthAddOnsGridDiv, m_fHeightHeader + 0.5*m_fHeightAddOnsGridDiv, 0.1*m_fWidthAddOnsGridDiv, 0.1*m_fWidthAddOnsGridDiv);
				}
				else//else -> show response
				{
					m_skinPackagesScreen.box.alignment	=	TextAnchor.MiddleCenter;
					GUI.Box(Rect(0,m_fHeightHeader,m_fWidthAddOnsGridDiv,m_fHeightAddOnsGridDiv),"No Add-Ons found available in the current package.");
				}
			}
			else
			{
				ParsePPAOAPIResponse();
				m_bPPAOAPIInProgress	=	false;
			}
		}
	GUI.EndGroup();
}
	
//********************UpgradePackage PRESSED FROM THE DEFAULT SCREEN SIDE OPTIONS*************************//
var m_iStartUpgradeDowngradeProcess	:	int = 0;
var m_fWidthPopup			:	float;
var m_fHeightPopup			:	float;
function UpgradePackage()
{
	GUI.enabled		=	!m_bSeeAddOnsListPressed;
	
	ShowHideFilter();
	RenderHeaderUpgradeOrDowngradePackageScreen(1); 		//1: upgrade	-1:	downgrade
	RenderGenreFilters();
	RenderChannelsGridUpgradeOrDowngradePackageScreen(1);	//1: upgrade	-1: downgrade
	RenderAddOnsGridUpgradeOrDowngradePackageScreen(1);
	
	GUI.enabled		=	true;
	
	if(m_bSeeAddOnsListPressed)
	{
		m_fWidthPopup	=	0.8*Screen.width;
		m_fHeightPopup	=	0.4*Screen.height;
		
		GUI.skin			=	m_skinPackagesScreen;
		GUI.ModalWindow(0,Rect(0.5*(Screen.width - m_fWidthPopup),0.5*(Screen.height - m_fHeightPopup),m_fWidthPopup,m_fHeightPopup), PopUpShowChannelsOfTheTappedAddOn, "");
		GUI.skin			=	null;
	}
	
	if(m_iStartUpgradeDowngradeProcess != 0)
	{
		m_fWidthPopup		=	m_fWidthChannelsGridDiv;
		m_fHeightPopup		=	2.0*m_fHeightChannelsGridDiv + m_fHeightHeader;
		
		GUI.skin			=	m_skinPackagesScreen;
		GUI.ModalWindow(0,Rect(m_fDisplacementX + m_fWidthFilterDiv,2.0*m_fHeightHeader,m_fWidthPopup,m_fHeightPopup), RenderUpgradeOrDowngradePrompt, "");
		GUI.skin			=	null;
	}
	
	//initialize touch areas on the first frame
	if(m_bInitializeTouchAreas[2] == false)
	{
		/************ For iPhone ***************/
		var fUnitX	:	float	=	Screen.width/24.4;
 		var fUnitY	:	float 	=	Screen.height/12.8;
		//Upgrade Package Screen
		//i.e. Scroll Areas for filter | channels | addons
		g_rectUpgradePackageScreenScrollArea1 = Rect(0.8*fUnitX, m_fHeightHeader + m_fHeightFilterButton + 1.2*fUnitY,	m_fWidthFilterButton, 7.9*fUnitY);
		g_rectUpgradePackageScreenScrollArea2 = Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightHeader + m_fHeightHeader,m_fWidthChannelsGridDiv,m_fHeightChannelsGridDiv);
		g_rectUpgradePackageScreenScrollArea3 = Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightHeader + m_fHeightHeader + m_fHeightChannelsGridDiv + m_fHeightHeader,m_fWidthAddOnsGridDiv,m_fHeightAddOnsGridDiv);
		
		m_bInitializeTouchAreas[2] = true;
	}
	return;
}

// VARIABLES FOR FREE ADDONS WITH RESPECT TO UPGRADE SCENE
var Skin_AddOnsUpdate						:	GUISkin;
var g_boolSeeListButtonUpgardePressed		:	boolean;

var m_objAddOnToChannelInfoAPIPacket		:	CWebAPIPacket;
var m_bFetchAddOnToChannelInfoInProgress	:	boolean;
function InstantiatePopUp(strPackageId	:	String)
{	
	//No. & Name of channels in the input Product/Package
    var strAPIURL		:	String	=	ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
	var strAPIMethod	:	String	=	"product/ProductToChannelInfo";
    var strInput		:	String	=	"{\"productId\":\"" + strPackageId + "\"}";
    
    Debug.Log("Invoke API : " + strAPIURL + strAPIMethod + " - " + strInput);
    
    m_objAddOnToChannelInfoAPIPacket 		= 	new CWebAPIPacket(strAPIURL, strAPIMethod, strInput);
    m_bFetchAddOnToChannelInfoInProgress	=	true;
    g_objScriptAPIHandler.InvokeReSTfulAPI(m_objAddOnToChannelInfoAPIPacket);
    
    //opens up the popup window
    m_bSeeAddOnsListPressed	=	true;

}

function PopUpShowChannelsOfTheTappedAddOn()
{
	m_skinPackagesScreen.button.normal.textColor 	= 	Color(100/255.0F,49/255.0F,140/255.0F,255/255.0F);
	m_skinPackagesScreen.button.alignment			=	TextAnchor.MiddleCenter;
	m_skinPackagesScreen.button.fontSize 			=	Mathf.Min(0.2*m_fWidthPopup, 0.2*m_fHeightPopup)/1.625;
	m_skinPackagesScreen.button.font				=	m_fontRegular;
	if(GUI.Button(Rect(0.9*m_fWidthPopup,0,0.1*m_fWidthPopup,0.1*m_fWidthPopup),"X"))
	{
		m_iSizeOfChannelsListInTappedAddOn			=	0;
		m_bSeeAddOnsListPressed						=	false;
	}
	
	if(m_iSizeOfChannelsListInTappedAddOn == 0)
	{
		if(m_objAddOnToChannelInfoAPIPacket.m_bResponseReceived)
		{
			//parse json output, make m_bAddOnsChannelsListAvailable = true and m_bResponseReceived = false kardo
			ProcessAddOnsToChannelInfoAPIResponse();
			m_bFetchAddOnToChannelInfoInProgress	=	false;
		}
		else
		{
			//if m_bFetchAddOnToChannelInfoInProgress - show please wait splash
			if(m_bFetchAddOnToChannelInfoInProgress)
			{
				RenderPleaseWaitSplash();
			}
			else
			{
				m_skinPackagesScreen.box.alignment				=	TextAnchor.MiddleLeft;
				m_skinPackagesScreen.box.normal.background		=	null;
				m_skinPackagesScreen.box.normal.textColor  		=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
				m_skinPackagesScreen.box.fontSize 				=	Mathf.Min(m_fWidthChannelsGridDiv,m_fHeightHeader)/2.5;
				m_skinPackagesScreen.box.font				=	m_fontRegular;
				m_skinPackagesScreen.box.wordWrap				=	true;
				GUI.Box(Rect(0.1*m_fWidthPopup, 0.1*m_fHeightPopup, 0.8*m_fWidthPopup, 0.6*m_fHeightPopup),m_strAddOnToChannelInfoAPIResult);
				
				m_skinPackagesScreen.button.normal.background	=	m_tex2DPurple;
				m_skinPackagesScreen.button.hover.background	=	m_tex2DOrange;
				m_skinPackagesScreen.button.active.background	=	m_tex2DOrange;
				m_skinPackagesScreen.button.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
				m_skinPackagesScreen.button.fontSize 			=	Mathf.Min(0.2*m_fWidthPopup, 0.2*m_fHeightPopup)/2.0;
				m_skinPackagesScreen.button.font			=	m_fontRegular;
				m_skinPackagesScreen.button.alignment			=	TextAnchor.MiddleCenter;
				if(GUI.Button(Rect(0.7*m_fWidthPopup, 0.7*m_fHeightPopup, 0.2*m_fWidthPopup, 0.2*m_fHeightPopup),"OK"))
				{
					m_iSizeOfChannelsListInTappedAddOn			=	0;
					m_bSeeAddOnsListPressed						=	false;
				}
			}
		}
	}
	else//channels list aa gayi - render kardo ab
	{
		RenderAddOnChannelsList();
	}
}

var m_iSizeOfChannelsListInTappedAddOn	:	int;
var m_arrTex2DTappedAddOnChannelIcons	:	Texture2D[];
var m_strAddOnToChannelInfoAPIResult	:	String;
function ProcessAddOnsToChannelInfoAPIResponse()
{
	if(m_objAddOnToChannelInfoAPIPacket.m_strResponseCode == "200 OK")
	{
		var N = JSON.Parse(m_objAddOnToChannelInfoAPIPacket.m_strOutput);
		if(N == null)
		{
			m_strAddOnToChannelInfoAPIResult	=	"NULL JSON";
			print(m_strAddOnToChannelInfoAPIResult);
		}
		else
		{
			Debug.Log("Reassembled: " + N.ToString());
			if(N.ToString() == "{}")
			{
				m_strAddOnToChannelInfoAPIResult	=	"Empty JSON";
				print(m_strAddOnToChannelInfoAPIResult);
			}
			else
			{
				while(N[m_iSizeOfChannelsListInTappedAddOn] != null)
				{
					m_iSizeOfChannelsListInTappedAddOn++;
				}
				
				m_arrTex2DTappedAddOnChannelIcons	=	new Texture2D[m_iSizeOfChannelsListInTappedAddOn];
					
				for(var i = 0; i < m_iSizeOfChannelsListInTappedAddOn; i++)
				{
					m_arrTex2DTappedAddOnChannelIcons[i]	=	Resources.Load(N[i]["ServiceId"]) as Texture2D;	
			    	if(m_arrTex2DTappedAddOnChannelIcons[i]	== 	null)
			    	{
			    		m_arrTex2DTappedAddOnChannelIcons[i] 	= 	Resources.Load("000BLANK") as Texture2D;
			    		if(m_arrTex2DTappedAddOnChannelIcons[i]	== 	null)
			    		{
			    			print("Locha");
			    		}
			    	}
				}
			}
		}
	}
	else
	{
		m_strAddOnToChannelInfoAPIResult	=	"HTTP Error : " + m_objAddOnToChannelInfoAPIPacket.m_strResponseCode + ". Please try later.";
		print(m_strAddOnToChannelInfoAPIResult);
	}
	
	m_objAddOnToChannelInfoAPIPacket.m_bResponseReceived 	= 	false;
}

function RenderAddOnChannelsList()
{
	//Scroll for horizontal channel icons grid
	var fMarginScroll_X	:	float		=	0.05*m_fWidthPopup;
 	var fMarginScroll_Y	:	float		=	0.1*m_fHeightPopup;
 	var fWidthScroll	:	float		=	0.9*m_fWidthPopup;
 	var fHeightScroll	:	float		=	0.8*m_fHeightPopup;
 	
	var rectViewPortScroll	=	Rect(fMarginScroll_X,fMarginScroll_Y,fWidthScroll,fHeightScroll);
	var rectFullScroll		=	Rect(0,0,fWidthScroll,fHeightScroll);
	rectFullScroll.width	=	(m_iSizeOfChannelsListInTappedAddOn/5.0)*rectViewPortScroll.width;
		
	m_skinPackagesScreen.scrollView.normal.background	=	null;
	m_v2PresentPackageAddOnChannelsGridX = GUI.BeginScrollView(rectViewPortScroll,m_v2PresentPackageAddOnChannelsGridX,rectFullScroll);//uncomment ,g_styleHorizontalScrollbar,g_styleVerticalScrollbar);// added to update for Touch
							
		m_skinPackagesScreen.button.normal.background	=	null;
		m_skinPackagesScreen.button.hover.background	=	null;
		m_skinPackagesScreen.button.active.background	=	null;
		GUI.SelectionGrid(rectFullScroll,-1,m_arrTex2DTappedAddOnChannelIcons,m_iSizeOfChannelsListInTappedAddOn); /*not hardcoded_val : need to change*/
		
	GUI.EndScrollView();
	
	//Horizontal Black Dots
	m_skinPackagesScreen.label.alignment			=	TextAnchor.MiddleCenter;
	m_skinPackagesScreen.label.contentOffset.x		=	0.0;
	GUI.DrawTexture(Rect(m_fWidthPopup/2.0 - fMarginScroll_Y/2.0,m_fHeightPopup - 2*fMarginScroll_Y,2*fMarginScroll_Y,2*fMarginScroll_Y),m_tex2DHorizontalBlackDots);
}

var m_iSlideId			:	int;
var m_strInputPassword	:	String;
var m_strUpgradeDowngradeAPIResponse	:	String;
function RenderUpgradeOrDowngradePrompt(iWindowID	:	int)
{
	GUI.Box(Rect(0,0,m_fWidthPopup,m_fHeightPopup),"");
	
	if(m_iSlideId	==	0)
	{
		var strPrompt	:	String;
		var strUPgradeDowngrade	: String;
		if(m_iStartUpgradeDowngradeProcess == 1)
		{
			strPrompt	=	"Subscription to this pack costs INR " + GetSelectedUpgradePackagePrice() + " per month. Please enter your password and confirm.";
			strUPgradeDowngrade = "Upgrade";
		}
		else
		{
			strPrompt	=	"Subscription to this pack costs INR " + GetSelectedDowngradePackagePrice() + " per month. Please enter your password and confirm.";
			strUPgradeDowngrade = "Downgrade";
		}
		
		SkinLabel();
		GUI.Label(Rect(0.1*m_fWidthPopup, 0.1*m_fHeightPopup, 0.8*m_fWidthPopup, 0.3*m_fHeightPopup),strPrompt); 
		
		SkinTextField();
		m_strInputPassword = GUI.PasswordField(Rect(0.1*m_fWidthPopup,0.4*m_fHeightPopup,0.6*m_fWidthPopup,0.15*m_fHeightPopup),m_strInputPassword,"*"[0],25);
	
		SkinButtonAsAButton(m_tex2DPurple);
		if(GUI.Button(Rect(0.1*m_fWidthPopup,0.7*m_fHeightPopup,0.35*m_fWidthPopup,0.15*m_fHeightPopup),"Cancel"))
		{	tracking("Package->"+strUPgradeDowngrade+"Cancel");
			m_iStartUpgradeDowngradeProcess	=	0;
			m_iSlideId = 0;
		}
		
		if(GUI.Button(Rect(0.55*m_fWidthPopup,0.7*m_fHeightPopup,0.35*m_fWidthPopup,0.15*m_fHeightPopup),"Confirm"))
		{	tracking("Package->"+strUPgradeDowngrade+"Confirm");
			var strMinBal	:	String;
			var strPassword	:	String	=	PlayerPrefs.GetString("Password");
			if(m_strInputPassword == strPassword)
			{
				if(m_iStartUpgradeDowngradeProcess == 1)
				{
					strMinBal	=	GetSelectedUpgradePackageMinBal();
				}
				else
				{
					strMinBal	=	GetSelectedDowngradePackageMinBal();
				}
				
				if(IsEnoughBalance(strMinBal) == false)//if balance is less
				{
					m_iSlideId = 2;
				}
				else//if enough balance
				{
					HitUpgradeDowngradeAPI(m_iStartUpgradeDowngradeProcess);
					m_iSlideId = 3;
				}
			}
			else
			{
				m_iSlideId = 1;
			}
			m_strInputPassword	=	"";
		}
	}
	
	if(m_iSlideId == 1)//if wrong pwd
	{	tracking("Package->"+strUPgradeDowngrade+"Confirm->"+"Incorrect password!");
		SkinLabel();
		GUI.Label(Rect(0.1*m_fWidthPopup, 0.1*m_fHeightPopup, 0.8*m_fWidthPopup, 0.3*m_fHeightPopup),"Incorrect password! Please try again."); 
		
		SkinButtonAsAButton(m_tex2DPurple);
		if(GUI.Button(Rect(0.55*m_fWidthPopup,0.7*m_fHeightPopup,0.35*m_fWidthPopup,0.15*m_fHeightPopup),"Retry"))
		{
			m_iSlideId = 0;
		}
		
		if(GUI.Button(Rect(0.1*m_fWidthPopup,0.7*m_fHeightPopup,0.35*m_fWidthPopup,0.15*m_fHeightPopup),"Cancel"))
		{
			m_iStartUpgradeDowngradeProcess	=	0;
			m_iSlideId = 0;
		}
	}
	
	if(m_iSlideId == 2)//recharge now pe redirect karo
	{	tracking("Package->"+strUPgradeDowngrade+"Confirm->"+"Insufficient balance");
		SkinLabel();
		GUI.Label(Rect(0.1*m_fWidthPopup, 0.1*m_fHeightPopup, 0.8*m_fWidthPopup, 0.3*m_fHeightPopup),"You have insufficient balance. Please recharge your account to subscribe for this service."); 
		
		SkinButtonAsAButton(m_tex2DPurple);
		if(GUI.Button(Rect(0.55*m_fWidthPopup,0.7*m_fHeightPopup,0.35*m_fWidthPopup,0.15*m_fHeightPopup),"Recharge Now"))
		{
			Application.LoadLevel("sceneRecharge");
		}
		
		if(GUI.Button(Rect(0.1*m_fWidthPopup,0.7*m_fHeightPopup,0.35*m_fWidthPopup,0.15*m_fHeightPopup),"Later"))
		{
			m_iStartUpgradeDowngradeProcess	=	0;
			m_iSlideId = 0;
		}
	}
	
	if(m_iSlideId == 3)//hit Add/Remove AddOn API
	{
		if(g_objUpgradeDowngradeAPIPacket.m_bResponseReceived == false)
		{
			RenderPleaseWaitSplashAt(0.5*m_fWidthPopup, 0.5*m_fHeightPopup, 0.1*m_fHeightPopup, 0.1*m_fHeightPopup);
		}
		else
		{
			m_strUpgradeDowngradeAPIResponse	=	ParseUpgradeDowngradeAPIResponse();
			m_iSlideId = 4;
		}
	}
	
	if(m_iSlideId == 4)//success or failure message
	{	
		SkinLabel();
		var strAPIResponse	:	String;
		if(m_strUpgradeDowngradeAPIResponse	==	"Success.")
		{	tracking("Package->"+strUPgradeDowngrade+"Confirm->"+"Done successfully");
			strAPIResponse	=	"Subscription to this pack has been done successfully.";
		}
		else
		{	tracking("Package->"+strUPgradeDowngrade+"Confirm->failure->"+m_strUpgradeDowngradeAPIResponse);
			strAPIResponse	=	m_strUpgradeDowngradeAPIResponse;
		}
		GUI.Label(Rect(0.1*m_fWidthPopup, 0.1*m_fHeightPopup, 0.8*m_fWidthPopup, 0.3*m_fHeightPopup),strAPIResponse); 
		
		SkinButtonAsAButton(m_tex2DPurple);
		if(GUI.Button(Rect(0.55*m_fWidthPopup,0.7*m_fHeightPopup,0.35*m_fWidthPopup,0.15*m_fHeightPopup),"OK"))
		{
			if(m_strUpgradeDowngradeAPIResponse	==	"Success.")
			{
				PlayerPrefs.SetInt("Refresh",1);
				ResetPackages();
				Application.LoadLevel("SceneMainPage");
			}
			else
			{
				m_iStartUpgradeDowngradeProcess	=	0;
				m_iSlideId = 0;
			}
		}
	}
}

function IsEnoughBalance(strPackagePriceBuying	:	String)	:	boolean
{
	var fNetPackagePrice	:	float = parseFloat(strPackagePriceBuying);
	var fBalance			:	float = parseFloat(m_strBalance);
	
	if(fBalance >= fNetPackagePrice)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function HitUpgradeDowngradeAPI(iOption	:	int)
{
	var strAPIURL = ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
    var strAPIMethod = "product/ApplyUpgradeDowngrade";
    var strInput = "{\"uuId\":\"" +ScriptMainPage.gs_strUUID+ "\",\"UDObj\":{\"SmartCardWithPackage\":[{\"AddOns\":[" + m_strAddOnsListForUpgradeDowngrade + "],\"IsMirror\":\"false\",\"PackageID\":\"" +GetSelectedPackageId(iOption)+ "\",\"SCNumber\":\""+g_strConnectionId+"\"}]}}";
    
    g_objUpgradeDowngradeAPIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    g_objScriptAPIHandler.InvokeReSTfulAPI(g_objUpgradeDowngradeAPIPacket);
}

function ParseUpgradeDowngradeAPIResponse()	:	String
{
	if(g_objUpgradeDowngradeAPIPacket.m_strResponseCode == "200 OK")
	{
		var N = JSON.Parse(g_objUpgradeDowngradeAPIPacket.m_strOutput);
		if(N == null)
		{
			g_objUpgradeDowngradeAPIPacket.m_strErrorMessage	=	"NULL JSON";
			print(g_objUpgradeDowngradeAPIPacket.m_strErrorMessage);
			
			m_strUpgradeDowngradeAPIResponse	=	g_objUpgradeDowngradeAPIPacket.m_strErrorMessage;
		}
		else
		{
			Debug.Log("Reassembled: " + N.ToString());
			if(N.ToString() == "{}")
			{
				g_objUpgradeDowngradeAPIPacket.m_strErrorMessage	=	"Empty JSON";
				print(g_objUpgradeDowngradeAPIPacket.m_strErrorMessage);
				
				m_strUpgradeDowngradeAPIResponse	=	g_objUpgradeDowngradeAPIPacket.m_strErrorMessage;
			}
			else
			{
				//parse response here
				m_strUpgradeDowngradeAPIResponse	=	N["PackageUpgradeDowngradeResult"];
			}
		}
	}
	else
	{
		g_objUpgradeDowngradeAPIPacket.m_strErrorMessage	=	"HTTP Error : " + g_objUpgradeDowngradeAPIPacket.m_strResponseCode + ". Please try later.";
		print(g_objUpgradeDowngradeAPIPacket.m_strErrorMessage);
		
		m_strUpgradeDowngradeAPIResponse	=	g_objUpgradeDowngradeAPIPacket.m_strErrorMessage;
	}
	
	g_objUpgradeDowngradeAPIPacket.m_bResponseReceived 	= 	false;
	
	return m_strUpgradeDowngradeAPIResponse;
}

function ResetPackages()
{
	m_bResetIsOn	=	true;
	
	m_iPrefetchingStepsCompleted	=	0;
	
	m_listChannelsInPresentPack.Clear();	
	m_strPresentPackPrice			=	"";
	m_iCountChannelsInPresentPack	=	0;

	m_listUpgradeOptions.Clear();//new List.<CUpgradeOption>();
	if(m_strUpgradeOptionsAPIException)
	{
		m_strUpgradeOptionsAPIException	=	"";
	}
	m_iCountUpgradePacks			=	0;
	m_strUpgradePackageName			=	new String[0];
	m_strUpgradePackagePrice		=	new String[0];
	m_iUpgradePackageChannelsCount	=	new int[0];

	m_listDowngradeOptions.Clear();//new List.<CDowngradeOption>();
	if(m_strDowngradeOptionsAPIException)
	{
		m_strDowngradeOptionsAPIException	=	"";
	}
	m_iCountDowngradePacks				=	0;
	m_strDowngradePackageName			=	new String[0];
	m_strDowngradePackagePrice			=	new String[0];
	m_iDowngradePackageChannelsCount	=	new int[0];
	
	print("check");
}

var m_v2PivotPoint					:	Vector2;
var m_fDeltaAngleOfRotation			:	float;
var m_skinRefreshButton				:	GUISkin;
function RenderPleaseWaitSplash()
{
	m_v2PivotPoint = Vector2(m_fWidthPopup/2,m_fHeightPopup/2);
	GUIUtility.RotateAroundPivot (m_fDeltaAngleOfRotation, m_v2PivotPoint); 
	GUI.Label(Rect(m_fWidthPopup/2 - 32.0,m_fHeightPopup/2 - 32.0, 64.0, 64.0),"",m_skinRefreshButton.label);
	m_fDeltaAngleOfRotation += 1.5;
}

function RenderPleaseWaitSplashAt(fX	:	float, fY	:	float, fDimX	:	float, fDimY	:	float)
{
	var v2PivotPoint :	Vector2		=	Vector2(fX,fY);
	GUIUtility.RotateAroundPivot (m_fDeltaAngleOfRotation, v2PivotPoint); 
	//GUI.Label(Rect(fX - 0.5*fDimX,fY - 0.5*fDimY, fDimX, fDimY),"",m_skinRefreshButton.label);
	GUI.Label(Rect(fX - 48.0,fY - 48.0, 96.0, 96.0),"",m_skinRefreshButton.label);
	GUIUtility.RotateAroundPivot (0, v2PivotPoint); 
	m_fDeltaAngleOfRotation += 1.5;
}


function RenderHeaderUpgradeOrDowngradePackageScreen(iOption	:	int)	//1: upgrade	-1:	downgrade
{
	var fUnitX	:	float	=	Screen.width/24.4;
 	var fUnitY	:	float 	=	Screen.height/12.8;
	m_fHeightHeader		 	=	1.3*fUnitY;
	GUI.skin	=	m_skinPackagesScreen;
	//*************************	Header	***********************//
	GUI.BeginGroup(Rect(0,0,Screen.width,m_fHeightHeader));
		
		m_skinPackagesScreen.box.alignment			=	TextAnchor.MiddleCenter;
		m_skinPackagesScreen.box.normal.background	=	m_tex2DPurple;
		m_skinPackagesScreen.box.normal.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinPackagesScreen.box.fontSize 			=	Mathf.Min(Screen.width,m_fHeightHeader)/1.5;
		m_skinPackagesScreen.box.font				=	m_fontRegular;
		m_skinPackagesScreen.box.contentOffset.x	=	0;
		
		var strProductName	:	String;
		var strProductPrice	:	String;
		//uncommented
		if(iOption == 1)
		{	
			strProductName	=	m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_strProductName;
			strProductPrice	=	GetSelectedUpgradePackagePrice();
		}
		else
		{
			strProductName	=	m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_strProductName;
			strProductPrice	=	GetSelectedDowngradePackagePrice();
		}
		
		//commented
		//strProductName	=	"Platinum HD";
		GUI.Box(Rect(0,0,Screen.width,m_fHeightHeader),strProductName);
		
		m_skinPackagesScreen.label.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinPackagesScreen.label.fontSize 		=	Mathf.Min(Screen.width,m_fHeightHeader)/3.5;
		m_skinPackagesScreen.label.font				=	m_fontBold;
		m_skinPackagesScreen.label.alignment		=	TextAnchor.MiddleCenter;
		//commented
		//strProductPrice	=	"400+12.6%Tax=418.90";
		GUI.Label(Rect(0.75*Screen.width,0,0.25*Screen.width,m_fHeightHeader),"INR " + strProductPrice + " pm");
	GUI.EndGroup();
}

function RenderChannelsGridUpgradeOrDowngradePackageScreen(iOption	:	int)	//1: upgrade	-1:	downgrade
{
	var fUnitX	:	float		= 	Screen.width/24.4;
 	var fUnitY	:	float 		= 	Screen.height/12.8;
 	
 	m_fWidthChannelsGridDiv		=	18.6*fUnitX;
 	if(m_fDisplacementX < 0)
 	{
 		m_fWidthChannelsGridDiv -= m_fDisplacementX;
 	}
 	m_fHeightChannelsGridDiv	=	3.8*fUnitY;
 	
 	var fMarginScroll_X	:	float		=	0.05*m_fWidthChannelsGridDiv;
 	var fMarginScroll_Y	:	float		=	0.1*m_fHeightChannelsGridDiv;
 	var fWidthScroll	:	float		=	0.9*m_fWidthChannelsGridDiv;
 	var fHeightScroll	:	float		=	0.8*m_fHeightChannelsGridDiv;
 	
	GUI.skin	=	m_skinPackagesScreen;
	//*************************	Genre Title	***********************//
	GUI.BeginGroup(Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightHeader,m_fWidthChannelsGridDiv,m_fHeightHeader + m_fHeightChannelsGridDiv));
		
		m_skinPackagesScreen.box.alignment			=	TextAnchor.MiddleLeft;
		m_skinPackagesScreen.box.normal.background	=	m_tex2DWhite;
		m_skinPackagesScreen.box.normal.textColor  	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
		m_skinPackagesScreen.box.fontSize 			=	Mathf.Min(m_fWidthChannelsGridDiv,m_fHeightHeader)/2.5;
		m_skinPackagesScreen.box.font				=	m_fontRegular;
		m_skinPackagesScreen.box.contentOffset.x	=	0.5*fUnitX;
		GUI.Box(Rect(0,0,m_fWidthChannelsGridDiv,m_fHeightHeader),m_strListGenres[m_iIndexActiveGenre]);
		
		m_skinPackagesScreen.button.normal.background	=	m_tex2DWhite;
		m_skinPackagesScreen.button.normal.textColor	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
		m_skinPackagesScreen.button.hover.background	=	m_tex2DWhite;
		m_skinPackagesScreen.button.hover.textColor		=	Color(192/255.0F,192/255.0F,192/255.0F,255/255.0F);
		m_skinPackagesScreen.button.active.background	=	m_tex2DWhite;
		m_skinPackagesScreen.button.active.textColor	=	Color(192/255.0F,192/255.0F,192/255.0F,255/255.0F);		
		m_skinPackagesScreen.button.fontSize 			=	Mathf.Min(m_fWidthChannelsGridDiv,m_fHeightHeader)/2.5;
		m_skinPackagesScreen.button.font	 			=	m_fontBold;
		m_skinPackagesScreen.button.alignment			=	TextAnchor.MiddleCenter;
							
		var strAction	:	String;
		if(iOption == 1)
		{
			strAction	=	"Upgrade Package >";
		}
		else
		{
			strAction	=	"Downgrade Package >";
		}
		
		if(GUI.Button(Rect(0.6*m_fWidthChannelsGridDiv,0,0.4*m_fWidthChannelsGridDiv,m_fHeightHeader),strAction))
		{
			//Apply Upgrade or Downgrade
			ApplyUpgradeDowngrade(iOption);
			
		}
		
		m_skinPackagesScreen.box.normal.background	=	m_tex2DGrey;
		m_skinPackagesScreen.box.contentOffset.x	=	0.0;
		GUI.Box(Rect(0,m_fHeightHeader,m_fWidthChannelsGridDiv,m_fHeightChannelsGridDiv),"");
		
		//Scroll for horizontal channel icons grid
		var rectViewPortScroll	=	Rect(fMarginScroll_X,m_fHeightHeader + fMarginScroll_Y,fWidthScroll,fHeightScroll);
		var rectFullScroll		=	Rect(0,0,fWidthScroll,fHeightScroll);;
		
		if(m_iChannelCountInSelectedPackageByActiveGenre < 0)
		{
			m_iChannelCountInSelectedPackageByActiveGenre	=	GetChannelsCountInSelectedPackageByActiveGenre(iOption);
		}
		else if(m_iChannelCountInSelectedPackageByActiveGenre > 0)
		{
			rectFullScroll.width	=	(m_iChannelCountInSelectedPackageByActiveGenre/5.0)*rectViewPortScroll.width;
		}
			
		m_skinPackagesScreen.scrollView.normal.background	=	null;
		m_v2PresentPackageGenrewiseChannelsGridX = GUI.BeginScrollView(rectViewPortScroll,m_v2PresentPackageGenrewiseChannelsGridX,rectFullScroll);//uncomment ,g_styleHorizontalScrollbar,g_styleVerticalScrollbar);// added to update for Touch
								
			m_skinPackagesScreen.button.normal.background	=	null;
			m_skinPackagesScreen.button.hover.background	=	null;
			m_skinPackagesScreen.button.active.background	=	null;
			
			if(m_iChannelCountInSelectedPackageByActiveGenre <= 0)
			{
					//m_skinPackagesScreen.box.normal.textColor  	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
				m_skinPackagesScreen.box.fontSize 				=	Mathf.Min(m_fWidthAddOnsGridDiv,m_fHeightAddOnsGridDiv)/7.5;
				m_skinPackagesScreen.box.font					=	m_fontRegular;
				m_skinPackagesScreen.box.alignment				=	TextAnchor.MiddleCenter;
				GUI.Box(rectFullScroll,"This package does not have channels from the selected genre.");	
			}
			else
			{
				//GUI.SelectionGrid(rectFullScroll,-1,m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_tex2dListIcons,m_iUpgradePackageChannelsCount[g_iSelectedUpgradeOptionIndex]); /*not hardcoded_val : need to change*/
				RenderChannelsOfSelectedPackageByActiveGenre(iOption, rectFullScroll);	
			}
			
		GUI.EndScrollView();
		
		if(m_iChannelCountInSelectedPackageByActiveGenre > 5)
		{
			//Horizontal Black Dots
			m_skinPackagesScreen.label.alignment			=	TextAnchor.MiddleCenter;
			m_skinPackagesScreen.label.contentOffset.x		=	0.0;
			GUI.Label(Rect(0,m_fHeightHeader + fHeightScroll,m_fWidthAddOnsGridDiv,3*fMarginScroll_Y),m_tex2DHorizontalBlackDots);
		}
	GUI.EndGroup();
	GUI.skin	=	null;
}

function RenderAddOnsGridUpgradeOrDowngradePackageScreen(iOption	:	int)
{
	var fUnitX	:	float		= 	Screen.width/24.4;
 	var fUnitY	:	float 		= 	Screen.height/12.8;
 	
 	m_fWidthAddOnsGridDiv		=	18.6*fUnitX;
 	if(m_fDisplacementX < 0)
 	{
 		m_fWidthAddOnsGridDiv -= m_fDisplacementX;
 	}
 	m_fHeightAddOnsGridDiv		=	3.8*fUnitY;
 	
 	var fMarginAddOn_X	:	float		=	0.05*m_fWidthAddOnsGridDiv;
 	var fMarginAddOn_Y	:	float		=	0.2*m_fHeightAddOnsGridDiv;
 	var fWidthAddOnBox	:	float		=	0.425*m_fWidthAddOnsGridDiv;
 	var fHeighAddOnBox	:	float		=	0.6*m_fHeightAddOnsGridDiv;
 	
 	//Scroll for horizontal avialable AddOns grid
 	var iMinAddOn		:	int	=	0;
 	var iMaxAddOn		:	int	=	0;
	if(iOption == 1)
	{
		iMinAddOn	=	m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_iMinAddOns;
		iMaxAddOn	=	m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_iMaxAddOns;
	}
	else if(iOption == -1)
	{
		iMinAddOn	=	m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_iMinAddOns;
		iMaxAddOn	=	m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_iMaxAddOns;
	}
	
 	
	GUI.skin	=	m_skinPackagesScreen;
	//*************************	Free AddOns Title	***********************//
	GUI.BeginGroup(Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightHeader + m_fHeightHeader + m_fHeightChannelsGridDiv,m_fWidthAddOnsGridDiv,m_fHeightHeader + m_fHeightAddOnsGridDiv));
		
		m_skinPackagesScreen.box.alignment			=	TextAnchor.MiddleLeft;
		m_skinPackagesScreen.box.normal.background	=	m_tex2DWhite;
		m_skinPackagesScreen.box.normal.textColor  	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
		m_skinPackagesScreen.box.fontSize 			=	Mathf.Min(m_fWidthAddOnsGridDiv,m_fHeightHeader)/2.5;
		m_skinPackagesScreen.box.font				=	m_fontRegular;
		m_skinPackagesScreen.box.contentOffset.x	=	0.5*fUnitX;
		GUI.Box(Rect(0,0,0.65*m_fWidthAddOnsGridDiv,m_fHeightHeader),"FREE ADD ONS");
		
		//m_skinPackagesScreen.box.alignment			=	TextAnchor.MiddleCenter;
		m_skinPackagesScreen.box.contentOffset.x	=	0.0;
		m_skinPackagesScreen.box.normal.textColor  	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
		m_skinPackagesScreen.box.fontSize 			=	Mathf.Min(m_fWidthAddOnsGridDiv,m_fHeightHeader)/3.25;
		GUI.Box(Rect(0.65*m_fWidthAddOnsGridDiv,0,0.35*m_fWidthAddOnsGridDiv,m_fHeightHeader),"Selected Add-Ons: " +m_iSelectedAddOnsCountInSelectedPackage+ "\nAllowed Add-Ons: Min " + iMinAddOn + " Max " + iMaxAddOn);
		
		m_skinPackagesScreen.box.normal.background	=	m_tex2DGrey;
		GUI.Box(Rect(0,m_fHeightHeader,m_fWidthAddOnsGridDiv,m_fHeightAddOnsGridDiv),"");
		
		if(m_iFreeAddOnsCountInSelectedPackage > 0 )
		{
			var rectViewPortScroll	=	Rect(0,m_fHeightHeader,m_fWidthAddOnsGridDiv,m_fHeightAddOnsGridDiv);
			var rectFullScroll		=	rectViewPortScroll;
			rectFullScroll.width	=	(m_iFreeAddOnsCountInSelectedPackage/2.0)*rectViewPortScroll.width;
			
			m_skinPackagesScreen.scrollView.normal.background	=	null;
			m_v2PresentPackageFreePaidAddOnsGridX = GUI.BeginScrollView(rectViewPortScroll,m_v2PresentPackageFreePaidAddOnsGridX,rectFullScroll);//uncomment ,g_styleHorizontalScrollbar,g_styleVerticalScrollbar);// added to update for Touch
			
				// FOR PRINTING THE AVAILABLE BUTTONS
				m_skinPackagesScreen.toggle.alignment			=	TextAnchor.MiddleCenter;
				m_skinPackagesScreen.toggle.fontSize 			=	Mathf.Min(m_fWidthAddOnsGridDiv,m_fHeightHeader)/3.0;
				m_skinPackagesScreen.toggle.font				=	m_fontRegular;
				
				var iFreeAddOnCounter	:	int = 0;
				var iSelectedAddOnCount	:	int = 0;
				for(var j=0;j<m_iTotalAddOnsCountInSelectedPackage;j++)
				{
					var strAddOnCaption	:	String;
					if(iOption == 1)
					{
						if(m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListAddOns[j].m_bIsAddOnFree)
						{
							if(m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListAddOns[j].m_bAddOnSelected == false)
							{
								strAddOnCaption	=	m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListAddOns[j].m_strAddOnName;
							}
							else
							{
								strAddOnCaption	=	m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListAddOns[j].m_strAddOnName + "\nAdd On Selected";
								iSelectedAddOnCount++;
							}
							m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListAddOns[j].m_bAddOnSelected = GUI.Toggle(Rect(fMarginAddOn_X + iFreeAddOnCounter*(fMarginAddOn_X + fWidthAddOnBox), m_fHeightHeader + fMarginAddOn_Y, 0.9*fWidthAddOnBox, fHeighAddOnBox),m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListAddOns[j].m_bAddOnSelected,strAddOnCaption);//hardcoding
							if(GUI.Button(Rect(fMarginAddOn_X + iFreeAddOnCounter*(fMarginAddOn_X + fWidthAddOnBox) + 0.9*fWidthAddOnBox, m_fHeightHeader + fMarginAddOn_Y, 0.1*fWidthAddOnBox, fHeighAddOnBox),g_texSeeList[0],Skin_AddOns.button))
							{
								m_bSeeAddOnsListPressed	= true;
							}
							iFreeAddOnCounter++;
						}
					}
					else if(iOption == -1)
					{
						if(m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListAddOns[j].m_bIsAddOnFree)
						{
							if(m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListAddOns[j].m_bAddOnSelected == false)
							{
								strAddOnCaption	=	m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListAddOns[j].m_strAddOnName;
							}
							else
							{
								strAddOnCaption	=	m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListAddOns[j].m_strAddOnName + "\nAdd On Selected";
								iSelectedAddOnCount++;
							}
							m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListAddOns[j].m_bAddOnSelected = GUI.Toggle(Rect(fMarginAddOn_X + iFreeAddOnCounter*(fMarginAddOn_X + fWidthAddOnBox), m_fHeightHeader + fMarginAddOn_Y, 0.9*fWidthAddOnBox, fHeighAddOnBox),m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListAddOns[j].m_bAddOnSelected,strAddOnCaption);//hardcoding
							if(GUI.Button(Rect(fMarginAddOn_X + iFreeAddOnCounter*(fMarginAddOn_X + fWidthAddOnBox) + 0.9*fWidthAddOnBox, m_fHeightHeader + fMarginAddOn_Y, 0.1*fWidthAddOnBox, fHeighAddOnBox),g_texSeeList[0],Skin_AddOns.button))
							{
								m_bSeeAddOnsListPressed	= true;
							}
							iFreeAddOnCounter++;
						}
					}
					m_iSelectedAddOnsCountInSelectedPackage	=	iSelectedAddOnCount;
				}
		
			GUI.EndScrollView();
			
			//Horizontal Black Dots
			m_skinPackagesScreen.label.alignment			=	TextAnchor.MiddleCenter;
			m_skinPackagesScreen.label.contentOffset.x		=	0.0;
			GUI.Label(Rect(0,m_fHeightHeader + m_fHeightAddOnsGridDiv - 1.0*fMarginAddOn_Y,m_fWidthAddOnsGridDiv,1.5*fMarginAddOn_Y),m_tex2DHorizontalBlackDots);
		}
		else
		{
			var strErrorPrompt	=	"";
			if(iOption == 1)
			{
				strErrorPrompt	=	"Add-Ons unavailable for this package.";
			}
			else if(iOption == -1)
			{
				strErrorPrompt	=	"Add-Ons unavailable for this package.";
			}
			
			m_skinPackagesScreen.box.normal.textColor  		=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
			m_skinPackagesScreen.box.fontSize 				=	Mathf.Min(m_fWidthAddOnsGridDiv,m_fHeightAddOnsGridDiv)/7.5;
			m_skinPackagesScreen.box.font					=	m_fontRegular;
			m_skinPackagesScreen.box.alignment				=	TextAnchor.MiddleCenter;
			GUI.Box(Rect(0,m_fHeightHeader,m_fWidthAddOnsGridDiv,m_fHeightAddOnsGridDiv),strErrorPrompt);
		}
	GUI.EndGroup();
	GUI.skin	=	null;
}

//*******************for DownGrade Options*****************//]

private var g_ScrollerDowngradePackages_XAxis_1stRow			:	Vector2;
private var g_ScrollerDowngradePackages_XAxis_2ndRow			:	Vector2;
var g_texPurpleUpArrow											:	Texture2D;

function DownGradePackage()
{
	GUI.enabled	= !m_bSeeAddOnsListPressed;
	ShowHideFilter();
	RenderHeaderUpgradeOrDowngradePackageScreen(-1); 		//1: upgrade	-1:	downgrade
	RenderGenreFilters();
	RenderChannelsGridUpgradeOrDowngradePackageScreen(-1);	//1: upgrade	-1: downgrade
	RenderAddOnsGridUpgradeOrDowngradePackageScreen(-1);
	GUI.enabled	= false;
	
	if(m_bSeeAddOnsListPressed)
	{
		m_fWidthPopup	=	0.8*Screen.width;
		m_fHeightPopup	=	0.4*Screen.height;
		
		GUI.skin			=	m_skinPackagesScreen;
		GUI.ModalWindow(0,Rect(0.5*(Screen.width - m_fWidthPopup),0.5*(Screen.height - m_fHeightPopup),m_fWidthPopup,m_fHeightPopup), PopUpShowChannelsOfTheTappedAddOn, "");
		GUI.skin			=	null;
	}
	
	if(m_iStartUpgradeDowngradeProcess != 0)
	{
		m_fWidthPopup		=	m_fWidthChannelsGridDiv;
		m_fHeightPopup		=	2.0*m_fHeightChannelsGridDiv + m_fHeightHeader;
		
		GUI.skin			=	m_skinPackagesScreen;
		GUI.ModalWindow(0,Rect(m_fDisplacementX + m_fWidthFilterDiv,2.0*m_fHeightHeader,m_fWidthPopup,m_fHeightPopup), RenderUpgradeOrDowngradePrompt, "");
		GUI.skin			=	null;
	}
	
	//initialize touch areas on the first frame
	if(m_bInitializeTouchAreas[3] == false)
	{
		/************ For iPhone ***************/
		var fUnitX	:	float	=	Screen.width/24.4;
 		var fUnitY	:	float 	=	Screen.height/12.8;
		//Downgrade Package Screen
		//i.e. Scroll Areas for filter | channels | addons
		g_rectUpgradePackageScreenScrollArea1 = Rect(0.8*fUnitX, m_fHeightHeader + m_fHeightFilterButton + 1.2*fUnitY,	m_fWidthFilterButton, 7.9*fUnitY);
		g_rectUpgradePackageScreenScrollArea2 = Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightHeader + m_fHeightHeader,m_fWidthChannelsGridDiv,m_fHeightChannelsGridDiv);
		g_rectUpgradePackageScreenScrollArea3 = Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightHeader + m_fHeightHeader + m_fHeightChannelsGridDiv + m_fHeightHeader,m_fWidthAddOnsGridDiv,m_fHeightAddOnsGridDiv);
		
		m_bInitializeTouchAreas[3] = true;
	}
	return;
}

var	m_fWidthSeeUpgradeOptions		:	float;
var m_fHeightSeeUpgradeOptions		:	float;
var m_fWidthDowngradeOptionGrid1	:	float;
var m_fWidthDowngradeOptionGrid2	:	float;
var m_fHeightDowngradeOption		:	float;
function RenderDowngradeOptions()
{
	var fUnitX	:	float			=	Screen.width/22.6;
 	var fUnitY	:	float 			=	Screen.height/12.8;
	
	m_fGapX							=	0.2*fUnitX;
	m_fGapY							=	0.2*fUnitY;
	
	m_fHeightHeader		 			=	1.3*fUnitY;
	m_fWidthSeeUpgradeOptions		=	Screen.width;
	m_fHeightSeeUpgradeOptions		=	m_fHeightHeader;
	
	m_fWidthDowngradeOptionGrid1	=	(22/3.0)*fUnitX;
	m_fWidthDowngradeOptionGrid2	=	(11.1)*fUnitX;
	m_fHeightDowngradeOption		=	4.15*fUnitY;
	
	GUI.skin						=	m_skinPackagesScreen;
	
	//*************************	Header	***********************//
	GUI.BeginGroup(Rect(0,0,Screen.width,m_fHeightHeader + m_fHeightSeeUpgradeOptions));
		
		m_skinPackagesScreen.box.alignment			=	TextAnchor.MiddleCenter;
		m_skinPackagesScreen.box.normal.background	=	m_tex2DPurple;
		m_skinPackagesScreen.box.normal.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinPackagesScreen.box.fontSize 			=	Mathf.Min(Screen.width,m_fHeightHeader)/1.5;
		m_skinPackagesScreen.box.font				=	m_fontRegular;
		m_skinPackagesScreen.box.contentOffset.x	=	0;
		GUI.Box(Rect(0,0,Screen.width,m_fHeightHeader),"Packages");
		
		m_skinPackagesScreen.button.alignment			=	TextAnchor.MiddleRight;
		m_skinPackagesScreen.button.normal.background	=	m_tex2DWhite;
		m_skinPackagesScreen.button.hover.background	=	m_tex2DOrange;
		m_skinPackagesScreen.button.active.background	=	m_tex2DOrange;
		if(GUI.Button(Rect(0,m_fHeightHeader,m_fWidthSeeUpgradeOptions,m_fHeightSeeUpgradeOptions),""))
		{
			g_iScreenID = 0;
		}
		
		m_skinPackagesScreen.label.normal.textColor  	=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
		m_skinPackagesScreen.label.fontSize 			=	Mathf.Min(m_fWidthSeeUpgradeOptions,m_fHeightSeeUpgradeOptions)/2.0;
		m_skinPackagesScreen.label.font					=	m_fontBold;
		m_skinPackagesScreen.label.alignment			=	TextAnchor.MiddleCenter;
		GUI.Label(Rect(0,m_fHeightHeader,0.4*m_fWidthSeeUpgradeOptions,m_fHeightSeeUpgradeOptions),"Downgrade Packages");
		GUI.Label(Rect(0.4*m_fWidthSeeUpgradeOptions,m_fHeightHeader,0.6*m_fWidthSeeUpgradeOptions,m_fHeightSeeUpgradeOptions),"See Upgrade Options");
		GUI.Label(Rect(0.8875*m_fWidthSeeUpgradeOptions,m_fHeightHeader,0.035*m_fWidthSeeUpgradeOptions,m_fHeightSeeUpgradeOptions),g_texPurpleUpArrow);
	
	GUI.EndGroup();
	
	if(m_strDowngradeOptionsAPIException != null)
	{
		if(m_strDowngradeOptionsAPIException.Length	>	0)
		{
			SkinButtonAsATile(m_tex2DLightPurple);
			m_skinPackagesScreen.button.fontSize 	=	m_fHeightHeader/2.0;
			GUI.Button(Rect(0,m_fHeightHeader + m_fHeightSeeUpgradeOptions,m_fSW,m_fSH - 2.0*m_fHeightHeader - m_fHeightSeeUpgradeOptions),m_strDowngradeOptionsAPIException);
			GUI.skin	=	null;
			return;
		}
	}
	
	var iBoxCount	:	int	=	m_iCountDowngradePacks;
	if(iBoxCount < 5)
	{
		iBoxCount = 5;
	}
	//*************************	Grid 1	***********************//
	//GUI.BeginGroup(Rect(0,m_fHeightHeader + m_fHeightSeeUpgradeOptions + m_fGapY,Screen.width,m_fHeightDowngradeOption));
		
		var iGrid1BoxCount	:	int	=	0;
		for(var i = 0; i < iBoxCount; i++)
		{
			if(i % 5 != 3 && i % 5 != 4)
			{
				iGrid1BoxCount++;
			}
		}
		
		m_rectDowngradeOptionsScreenScrollViewPort1	=	Rect(0,m_fHeightHeader + m_fHeightSeeUpgradeOptions + m_fGapY,Screen.width,m_fHeightDowngradeOption);
		var rectFullScroll1		=	Rect(0,0,m_rectDowngradeOptionsScreenScrollViewPort1.width * (iGrid1BoxCount/3.0),m_fHeightDowngradeOption);
		
		m_skinPackagesScreen.scrollView.normal.background = null;
		m_v2DowngradeOptionsScreenScroll1_X = GUI.BeginScrollView(m_rectDowngradeOptionsScreenScrollViewPort1, m_v2DowngradeOptionsScreenScroll1_X, rectFullScroll1);
			
			var iX	:	int	=	0;
			var iY	:	int	=	0;
			for(i = 0; i < iGrid1BoxCount; i++)
			{
				if(i % 2 == 0)//light purple skin
				{
					//m_skinPackagesScreen.button.normal.background	=	m_tex2DLightPurple;
					SkinButtonAsATile(m_tex2DLightPurple);
				}
				else//purple skin
				{
					//m_skinPackagesScreen.box.normal.background	=	m_tex2DPurple;
					SkinButtonAsATile(m_tex2DPurple);
				}
				
				if(iX < 3)
				{
					iX++;
				}
				else
				{
					iX = 0;
					iY = iY + 2;
					iX++;
				}
				
				GUI.BeginGroup(Rect(i*(m_fWidthDowngradeOptionGrid1 + m_fGapX), 0, m_fWidthDowngradeOptionGrid1, m_fHeightDowngradeOption));
									
					if(i+iY >= m_iCountDowngradePacks)
					{
						GUI.enabled	=	false;
						
						m_skinPackagesScreen.button.fontSize		=	Mathf.Min(m_fWidthDowngradeOptionGrid1,m_fHeightDowngradeOption)/7.5;
						m_skinPackagesScreen.button.imagePosition	=	ImagePosition.ImageLeft;
						
						var objNABoxContent	:	GUIContent	=	new GUIContent("Package not available", m_tex2DNotAvailable);
						GUI.Button(Rect(0, 0, m_fWidthDowngradeOptionGrid1, m_fHeightDowngradeOption),objNABoxContent);
					}
					else
					{
						if(GUI.Button(Rect(0, 0, m_fWidthDowngradeOptionGrid1, m_fHeightDowngradeOption),"") && !m_bIsSwipeActive)
						{
							//RenderScreenToDowngradeToThisPackage("show_downgrade_button");
							g_iSelectedDowngradeOptionIndex	=	i+iY;
							m_iTotalAddOnsCountInSelectedPackage	=	m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_iAddOnsCount;
							m_iFreeAddOnsCountInSelectedPackage 	=	GetFreeAddOnCounts(-1);
							HighlightAddOnsAlsoAddedInPP(-1);
							g_iScreenID = 4;
						}
						
						m_skinPackagesScreen.label.normal.textColor		=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
						m_skinPackagesScreen.label.fontSize 			=	Mathf.Min(m_fWidthSeeUpgradeOptions,m_fHeightSeeUpgradeOptions)/2.5;
						m_skinPackagesScreen.label.font					=	m_fontBold;
						m_skinPackagesScreen.label.alignment			=	TextAnchor.LowerCenter;
						GUI.Label(Rect(0, 0, m_fWidthDowngradeOptionGrid1, m_fHeightDowngradeOption/4.0),GetUpgradeOrDowngradePackageNameByIndex(-1, i+iY));
						
						m_skinPackagesScreen.label.fontSize 			=	Mathf.Min(m_fWidthSeeUpgradeOptions,m_fHeightSeeUpgradeOptions)/3.0;
						m_skinPackagesScreen.label.font					=	m_fontRegular;
						m_skinPackagesScreen.label.alignment			=	TextAnchor.UpperCenter;
						GUI.Label(Rect(0, 0 + m_fHeightDowngradeOption/4.0, m_fWidthDowngradeOptionGrid1, m_fHeightDowngradeOption/4.0),GetUpgradeOrDowngradePackagePriceByIndex(-1, i+iY));
						
						//grid's centre (..+..) : disabled downgrade button when 0 channels (uncommented)
						RenderChannelsGridForDowngradeOption(0.5*m_fWidthDowngradeOptionGrid1, 0 + 2.5*m_fHeightDowngradeOption/4.0, 5*m_fHeightDowngradeOption/4.0, m_fHeightDowngradeOption/4.0,i+iY);
						
						m_skinPackagesScreen.button.normal.background	=	null;
						m_skinPackagesScreen.button.active.background	=	null;
						m_skinPackagesScreen.button.hover.background	=	null;
						m_skinPackagesScreen.button.fontSize 			=	Mathf.Min(m_fWidthSeeUpgradeOptions,m_fHeightSeeUpgradeOptions)/2.5;
						m_skinPackagesScreen.button.font				=	m_fontBold;
						m_skinPackagesScreen.button.alignment			=	TextAnchor.MiddleCenter;
						if(GUI.Button(Rect(0 + 0.4*m_fWidthDowngradeOptionGrid1, 0 + 3*m_fHeightDowngradeOption/4.0, 0.6*m_fWidthDowngradeOptionGrid1, m_fHeightDowngradeOption/4.0),"Downgrade >"))
						{
							g_iSelectedDowngradeOptionIndex	=	i+iY;
							m_iTotalAddOnsCountInSelectedPackage	=	m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_iAddOnsCount;
							m_iFreeAddOnsCountInSelectedPackage 	=	GetFreeAddOnCounts(-1);
							HighlightAddOnsAlsoAddedInPP(-1);
							g_iScreenID = 4;
						}
					}
				GUI.EndGroup();
				
				GUI.enabled	=	true;
			}
		
		GUI.EndScrollView();
		
	//GUI.EndGroup();
	
	//*************************	Grid 2	***********************//
	//GUI.BeginGroup(Rect(0,m_fHeightHeader + m_fHeightSeeUpgradeOptions + m_fGapY + m_fHeightDowngradeOption + m_fGapY,Screen.width,m_fHeightDowngradeOption));
		
		var iGrid2BoxCount	:	int	=	0;
		for(i = 0; i < iBoxCount; i++)
		{
			if(i % 5 == 3 || i % 5 == 4)
			{
				iGrid2BoxCount++;
			}
		}
		
		m_rectDowngradeOptionsScreenScrollViewPort2 = 	Rect(0,m_fHeightHeader + m_fHeightSeeUpgradeOptions + m_fGapY + m_fHeightDowngradeOption + m_fGapY,Screen.width,m_fHeightDowngradeOption);
		var rectFullScroll2		=	Rect(0,0,m_rectDowngradeOptionsScreenScrollViewPort2.width * (iGrid2BoxCount/2.0),m_fHeightDowngradeOption);
		
		m_skinPackagesScreen.scrollView.normal.background = null;
		m_v2DowngradeOptionsScreenScroll2_X = GUI.BeginScrollView(m_rectDowngradeOptionsScreenScrollViewPort2, m_v2DowngradeOptionsScreenScroll2_X, rectFullScroll2);
		
			iX	=	0;
			iY	=	3;
			for(i = 0; i < iGrid2BoxCount; i++)
			{
				if(i % 2 == 0)//light purple skin
				{
					//m_skinPackagesScreen.box.normal.background	=	m_tex2DLightPurple;
					SkinButtonAsATile(m_tex2DLightPurple);
				}
				else//purple skin
				{
					//m_skinPackagesScreen.box.normal.background	=	m_tex2DPurple;
					SkinButtonAsATile(m_tex2DPurple);
				}
				
				if(iX < 2)
				{
					iX++;
				}
				else
				{
					iX = 0;
					iY = iY + 3;
					iX++;
				}
				
				GUI.BeginGroup(Rect(i*(m_fWidthDowngradeOptionGrid2 + m_fGapX), 0, m_fWidthDowngradeOptionGrid2, m_fHeightDowngradeOption),"" + (i+iY));
										
					if(i+iY >= m_iCountDowngradePacks)
					{
						GUI.enabled	=	false;
						
						m_skinPackagesScreen.button.fontSize	=	Mathf.Min(m_fWidthDowngradeOptionGrid2,m_fHeightDowngradeOption)/7.5;
						m_skinPackagesScreen.button.imagePosition	=	ImagePosition.ImageLeft;
						
						objNABoxContent	=	new GUIContent("Package not available", m_tex2DNotAvailable);
						GUI.Button(Rect(0, 0, m_fWidthDowngradeOptionGrid2, m_fHeightDowngradeOption),objNABoxContent);
					}
					else
					{
						if(GUI.Button(Rect(0, 0, m_fWidthDowngradeOptionGrid2, m_fHeightDowngradeOption),"") && !m_bIsSwipeActive)
						{
							//RenderScreenToDowngradeToThisPackage("show_downgrade_button");
							g_iSelectedDowngradeOptionIndex			=	i+iY;
							m_iTotalAddOnsCountInSelectedPackage	=	m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_iAddOnsCount;
							m_iFreeAddOnsCountInSelectedPackage 	=	GetFreeAddOnCounts(-1);
							HighlightAddOnsAlsoAddedInPP(-1);
							g_iScreenID = 4;
						}

						m_skinPackagesScreen.label.normal.textColor		=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
						m_skinPackagesScreen.label.fontSize 			=	Mathf.Min(m_fWidthSeeUpgradeOptions,m_fHeightSeeUpgradeOptions)/2.5;
						m_skinPackagesScreen.label.font					=	m_fontBold;
						m_skinPackagesScreen.label.alignment			=	TextAnchor.LowerCenter;
						GUI.Label(Rect(0, 0, m_fWidthDowngradeOptionGrid2, m_fHeightDowngradeOption/4.0),GetUpgradeOrDowngradePackageNameByIndex(-1,i+iY));
						
						m_skinPackagesScreen.label.fontSize 			=	Mathf.Min(m_fWidthSeeUpgradeOptions,m_fHeightSeeUpgradeOptions)/3.0;
						m_skinPackagesScreen.label.font					=	m_fontRegular;
						m_skinPackagesScreen.label.alignment			=	TextAnchor.UpperCenter;
						GUI.Label(Rect(0, 0 + m_fHeightDowngradeOption/4.0, m_fWidthDowngradeOptionGrid2, m_fHeightDowngradeOption/4.0),GetUpgradeOrDowngradePackagePriceByIndex(-1,i+iY));
					
						//grid's centre (..+..)
						RenderChannelsGridForDowngradeOption(0.5*m_fWidthDowngradeOptionGrid2, 0 + 2.5*m_fHeightDowngradeOption/4.0, 5*m_fHeightDowngradeOption/4.0, m_fHeightDowngradeOption/4.0,i+iY);
	
						m_skinPackagesScreen.button.normal.background	=	null;
						m_skinPackagesScreen.button.active.background	=	null;
						m_skinPackagesScreen.button.hover.background	=	null;
						m_skinPackagesScreen.button.fontSize 			=	Mathf.Min(m_fWidthSeeUpgradeOptions,m_fHeightSeeUpgradeOptions)/2.5;
						m_skinPackagesScreen.button.font				=	m_fontBold;
						m_skinPackagesScreen.button.alignment			=	TextAnchor.MiddleCenter;
						if(GUI.Button(Rect(0 + 0.6*m_fWidthDowngradeOptionGrid2, 0 + 3*m_fHeightDowngradeOption/4.0, 0.4*m_fWidthDowngradeOptionGrid2, m_fHeightDowngradeOption/4.0),"Downgrade >"))
						{
							//RenderScreenToDowngradeToThisPackage("show_downgrade_button");
							g_iSelectedDowngradeOptionIndex			=	i+iY;
							m_iTotalAddOnsCountInSelectedPackage	=	m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_iAddOnsCount;
							m_iFreeAddOnsCountInSelectedPackage 	=	GetFreeAddOnCounts(-1);
							HighlightAddOnsAlsoAddedInPP(-1);
							g_iScreenID = 4;
						}
					}
				GUI.EndGroup();
			}
			
		GUI.EndScrollView();
		
	//GUI.EndGroup();
	
	GUI.skin	=	null;
}

var m_rectButton	:	Rect[];
function RenderChannelsGridForDowngradeOption(fPosX : float, fPosY : float, fDimX : float, fDimY : float, iPackageIndex : int)
{
	var fUnitsInX	:	float	=	fDimX/35.2;
	var fUnitsInY	:	float	=	fDimY/10.0;
	
	m_rectButton[0]	=	Rect(fPosX - 5.0*fUnitsInX - 7.0*fUnitsInX - 5.6*fUnitsInX, fPosY - 3.2*fUnitsInX, 6.4*fUnitsInX, 6.4*fUnitsInX);
	m_rectButton[4]	=	Rect(fPosX + 5.0*fUnitsInX + 7.0*fUnitsInX - 0.8*fUnitsInX, fPosY - 3.2*fUnitsInX, 6.4*fUnitsInX, 6.4*fUnitsInX);
	
	m_rectButton[1]	=	Rect(fPosX - 5.0*fUnitsInX - 7.0*fUnitsInX, fPosY - 4.0*fUnitsInX, 8.0*fUnitsInX, 8.0*fUnitsInX);
	m_rectButton[3]	=	Rect(fPosX + 5.0*fUnitsInX - 1.0*fUnitsInX, fPosY - 4.0*fUnitsInX, 8.0*fUnitsInX, 8.0*fUnitsInX);
	
	m_rectButton[2]	=	Rect(fPosX - 5.0*fUnitsInX, fPosY - 5.0*fUnitsInX, 10.0*fUnitsInX, 10.0*fUnitsInX);
	
	/*
	m_skinPackagesScreen.button.normal.background	=	m_tex2DOrange;
	m_skinPackagesScreen.button.hover.background	=	m_tex2DOrange;
	m_skinPackagesScreen.button.active.background	=	m_tex2DOrange;
	m_skinPackagesScreen.button.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinPackagesScreen.button.fontSize 			=	Mathf.Min(m_fWidthSeeUpgradeOptions,m_fHeightSeeUpgradeOptions)/2.5;
	m_skinPackagesScreen.button.font			=	FontStyle.Bold;
	m_skinPackagesScreen.button.alignment			=	TextAnchor.MiddleCenter;
	*/
	
	if(m_iDowngradePackageChannelsCount[iPackageIndex] >= 5)
	{				
		GUI.DrawTexture(m_rectButton[0],m_listDowngradeOptions[iPackageIndex].m_tex2dListIcons[0]);
		GUI.DrawTexture(m_rectButton[4],m_listDowngradeOptions[iPackageIndex].m_tex2dListIcons[4]);
		
		GUI.DrawTexture(m_rectButton[1],m_listDowngradeOptions[iPackageIndex].m_tex2dListIcons[1]);
		GUI.DrawTexture(m_rectButton[3],m_listDowngradeOptions[iPackageIndex].m_tex2dListIcons[3]);
		
		GUI.DrawTexture(m_rectButton[2],m_listDowngradeOptions[iPackageIndex].m_tex2dListIcons[2]);
	}
	else
	{
		//GUI.enabled	=	false;
		
		m_rectButton[2].x		=	fPosX - 5.0*fUnitsInX - 7.0*fUnitsInX - 5.6*fUnitsInX;
		m_rectButton[2].width	=	fDimX;
		GUI.Label(m_rectButton[2],"Channels info currently unavailable");
	}
}


/**********************************************************************************/
//					Pre-Requisites for the PACKAGES SCREEN:
/**********************************************************************************/

// ****** Present Package ****** //				// ****** Source API ****** //
//1. Package Name or ID					:			uuid_lookup | login
function GetPresentPackageName() : String
{
	return m_strPresentPackName;//PlayerPrefs.GetString("PresentPackageName");
}

function GetPresentPackageID() : String
{
	return m_strPresentPackId; //PlayerPrefs.GetString("PackageId"); //or ScriptMainPage.gs_strPresentProductID
}

//2. Price + Tax PM						:			GetCommercialProductPriceByID
function GetPresentPackagePrice() : String
{
	//var strInput = "{\"BasePackageId\":\"430\"}";
	//InvokeD2HRestfulAPI("UpgradeDowngradeService","GetCommercialProductPriceById",strInput);
	return m_strPresentPackPrice;
	
}

function GetPresentPackagePriceWithTax() : String
{
	//var strInput = "{\"BasePackageId\":\"430\"}";
	//InvokeD2HRestfulAPI("UpgradeDowngradeService","GetCommercialProductPriceById",strInput);
		
	var fPrice : float = parseFloat(m_strPresentPackPrice);
	var fNetPrice : float = fPrice + (12.36/100)*fPrice;
	
	return m_strPresentPackPrice + "+12.36%Tax = " + fNetPrice.ToString("f2");
	
}

//3. No. of Channels in Present Package	:			ProductToChannelInfo
//4. All channels info					:			ProductToChannelInfo

//5. No. of Add-Ons in Present Package	:			
//6. All channels info of the tapped Add-On:

// *** Upgrade Package Options *** //			// ****** Source API ****** //
//1. No. of Upgrade Package Options		:			GetProductsByCustomerId
//2. Name or ID of each package			:			GetProductsByCustomerId
//3. Price + Tax PM						:			GetCommercialProductPriceByID
//4. No. of Channels					:			ProductToChannelInfo
//5. All Channels Info					:			ProductToChannelInfo

/**********************************************************************************/
function GetSelectedUpgradePackageMinBal() : String
{
	return m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_strMinBalance;
}

function GetSelectedUpgradePackagePrice() : String
{
	return m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_strProductPrice;
}

function GetSelectedUpgradePackagePriceWithTax(iFullString	:	int) : String
{
	var fPrice : float = parseFloat(m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_strProductPrice);
	var fNetPrice : float = fPrice + (12.6/100)*fPrice;
	
	if(iFullString == 1)
	{
		return m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_strProductPrice + "+12.6%Tax = " + fNetPrice.ToString("f2");
	}
	else
	{
		return fNetPrice.ToString("f2");
	}
}

function GetSelectedDowngradePackageMinBal() : String
{
	return m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_strMinBalance;
}


function GetSelectedDowngradePackagePrice() : String
{
	return m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_strProductPrice;
}

function GetSelectedDowngradePackagePriceWithTax(iFullString	:	int) : String
{
	var fPrice : float = parseFloat(m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_strProductPrice);
	var fNetPrice : float = fPrice + (12.6/100)*fPrice;
	
	if(iFullString == 1)
	{
		return m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_strProductPrice + "+12.6%Tax = " + fNetPrice.ToString("f2");
	}
	else
	{
		return fNetPrice.ToString("f2");
	}
}

function GetSelectedPackageId(iOption	:	int)	:	String
{
	if(iOption == 1)
	{
		return m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_strProductID;
	}
	else
	{
		return m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_strProductID;
	}
}

function ApplyUpgradeDowngrade(iOption :	int)
{
	/********* **********/
	//check min n max
	var bRet : boolean = ValidateMinMaxCondition(iOption);
	
	if(bRet)
	{
		m_iStartUpgradeDowngradeProcess = iOption;
	}
	else
	{
		//display error Or take user's focus to Max|Min AddOns limit on the page
	}
}

var m_strAddOnsListForUpgradeDowngrade	:	String;
function ValidateMinMaxCondition(iOption	:	int)	:	boolean
{
	var iCountSelectedAddOns		:	int = 0;
	var iCountSelectedFreeAddOns	:	int = 0;
	
	var strConcatenatedAddOns	:	String = "";
	var strConcatenatedListOfCompatiblePaidAddOns	:	String	=	"";
	strConcatenatedListOfCompatiblePaidAddOns	=	GetListOfCompatiblePaidAddOns(iOption);
	
	if(iOption == 1)
	{
		for(var j=0;j<m_iTotalAddOnsCountInSelectedPackage;j++)
		{
			if(m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListAddOns[j].m_bAddOnSelected == true)
			{
				iCountSelectedAddOns++;
				
				if(iCountSelectedAddOns == 1)
				{
					strConcatenatedAddOns = "\"" + m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListAddOns[j].m_strAddOnID + "\"";
				}
				else if(iCountSelectedAddOns > 1)
				{
					strConcatenatedAddOns = strConcatenatedAddOns + ",\"" + m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListAddOns[j].m_strAddOnID +"\"";
				}
				
				if(m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListAddOns[j].m_bIsAddOnFree)
				{
					iCountSelectedFreeAddOns++;
				}
			}
		}
		
		if(	iCountSelectedFreeAddOns >= m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_iMinAddOns &&
			iCountSelectedFreeAddOns <= m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_iMaxAddOns)
		{
			if(strConcatenatedListOfCompatiblePaidAddOns != "")
			{
				m_strAddOnsListForUpgradeDowngrade	=	strConcatenatedAddOns	+	","	+	strConcatenatedListOfCompatiblePaidAddOns;
			}
			else
			{
				m_strAddOnsListForUpgradeDowngrade	=	strConcatenatedAddOns;
			}
			return true;
		}
		else
		{
			return false;
		}
	}
	else if(iOption == -1)
	{
		for(j=0;j<m_iTotalAddOnsCountInSelectedPackage;j++)
		{
			if(m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListAddOns[j].m_bAddOnSelected == true)
			{
				iCountSelectedAddOns++;
				
				if(iCountSelectedAddOns == 1)
				{
					strConcatenatedAddOns = "\"" + m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListAddOns[j].m_strAddOnID + "\"";
				}
				else if(iCountSelectedAddOns > 1)
				{
					strConcatenatedAddOns = strConcatenatedAddOns + "," + "\"" + m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListAddOns[j].m_strAddOnID + "\"";
				}
				
				if(m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListAddOns[j].m_bIsAddOnFree)
				{
					iCountSelectedFreeAddOns++;
				}
			}
		}
		
		if(	iCountSelectedFreeAddOns >= m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_iMinAddOns &&
			iCountSelectedFreeAddOns <= m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_iMaxAddOns)
		{
			if(strConcatenatedListOfCompatiblePaidAddOns != "")
			{
				m_strAddOnsListForUpgradeDowngrade	=	strConcatenatedAddOns	+	","	+	strConcatenatedListOfCompatiblePaidAddOns;
			}
			else
			{
				m_strAddOnsListForUpgradeDowngrade	=	strConcatenatedAddOns;
			}
			return true;
		}
		else
		{
			return false;
		}
	}
}

function GetUpgradeOptionIndexWrtTouch(v2TouchToGUIPosY : float) : int
{
	//each box height
	var iEachBoxHeight	:	int = Screen.height/3.25;
	
	//current scroll pos
	var iLowerLimit 	:	int = iEachBoxHeight - (m_v2ScrollUpgradePackageOptionsY.y % iEachBoxHeight);
	
	//upper limit: lowerlimit + box's height
	var iUpperLimit 	:	int = iLowerLimit + iEachBoxHeight;
	
	//index of the box on which the touch/swipe is done
	var iIndex 			: 	int	= m_v2ScrollUpgradePackageOptionsY.y / iEachBoxHeight;
	
	if(v2TouchToGUIPosY < iLowerLimit)
	{
		iIndex = iIndex;
	}
	
	if(iLowerLimit < v2TouchToGUIPosY  && v2TouchToGUIPosY < iUpperLimit)
	{
		iIndex++;
	}
	
	if(v2TouchToGUIPosY > iUpperLimit)
	{
		iIndex += 2;
	}
	print("TouchPosY: " + v2TouchToGUIPosY + " ScrollPosY : " + m_v2ScrollUpgradePackageOptionsY.y + " LoweLimit: " + iLowerLimit + " UpperLimit: " + iUpperLimit + " Index: " + iIndex);
	return iIndex;
}

function LoadPresentPackagePrefetchedData()
{
	m_strPresentPackId	= GetPresentPackageID();
	m_strPresentPackName = GetPresentPackageName();
	m_strPresentPackPrice = GetPresentPackagePrice();
	//m_iCountChannelsInPresentPack = m_iCountChannelsInPresentPack;
	m_iChannelCountInPPActiveGenre	= -1;
	
	//load icons
	m_tex2dIconsPresentPackageChannels = new Texture2D[m_iCountChannelsInPresentPack];
	for(var i = 0; i < m_iCountChannelsInPresentPack; i++)
    {        
        m_tex2dIconsPresentPackageChannels[i]		=	Resources.Load(m_listChannelsInPresentPack[i].strServiceName) as Texture2D;	
    	if(m_tex2dIconsPresentPackageChannels[i]	== 	null)
    	{
    		m_tex2dIconsPresentPackageChannels[i] 	= 	Resources.Load("000BLANK") as Texture2D;
    		if(m_tex2dIconsPresentPackageChannels[i]== 	null)
    		{
    			print("Locha");
    		}
    	}
    }
	g_iGenresCountInPresentPackage = 25; //hardcoded from text file
	
	StartCoroutine(DownloadPPAOList(0.0));
}
function GetChannelsCountInPPByActiveGenre()	:	int
{
	var iCount : int = 0;
	for(var i = 0; i < m_iCountChannelsInPresentPack; i++)
	{
		if(m_listChannelsInPresentPack[i].strGenreName == m_strListGenres[m_iIndexActiveGenre])
		{
			iCount++;
		}
	}
	return iCount;
}

function RenderChannelsOfPPByActiveGenre(rectFullScroll	:	Rect)
{
	var iCount : int = 0;

	m_skinPackagesScreen.button.normal.background	=	null;
	m_skinPackagesScreen.button.hover.background	=	null;
	m_skinPackagesScreen.button.active.background	=	null;
	m_skinPackagesScreen.button.alignment			=	TextAnchor.MiddleCenter;
	//GUI.SelectionGrid(rectFullScroll,-1,m_tex2DChannelIconsOfPPByActiveGenre,m_iChannelCountInPPActiveGenre); /*not hardcoded_val : need to change*/
	for(var i=0; i<m_iCountChannelsInPresentPack; i++)
	{
		if(m_listChannelsInPresentPack[i].strGenreName == m_strListGenres[m_iIndexActiveGenre])
		{
			GUI.Button(Rect(rectFullScroll.x + iCount*(rectFullScroll.width/m_iChannelCountInPPActiveGenre), rectFullScroll.y, rectFullScroll.width/m_iChannelCountInPPActiveGenre, rectFullScroll.height),m_tex2dIconsPresentPackageChannels[i]);
			iCount++;
		}
	}
}

//m_iUpgradePackageChannelsCount[g_iSelectedUpgradeOptionIndex | g_iSelectedDowngradeOptionIndex]
function GetChannelsCountInSelectedPackageByActiveGenre(iOption : int)	:	int
{
	var iCount : int = 0;
	if(iOption == 1)
	{
		for(var i = 0; i < m_iUpgradePackageChannelsCount[g_iSelectedUpgradeOptionIndex]; i++)
		{
			if(m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListChannels[i].strGenreName == m_strListGenres[m_iIndexActiveGenre])
			{
				iCount++;
			}
		}
	}
	else
	{
		for(i = 0; i < m_iDowngradePackageChannelsCount[g_iSelectedDowngradeOptionIndex]; i++)
		{
			if(m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListChannels[i].strGenreName == m_strListGenres[m_iIndexActiveGenre])
			{
				iCount++;
			}
		}
	}
	return iCount;
}

//rectFullScroll,-1,m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_tex2dListIcons,m_iUpgradePackageChannelsCount[g_iSelectedUpgradeOptionIndex]
function RenderChannelsOfSelectedPackageByActiveGenre(iOption : int, rectFullScroll	: Rect)
{
	var iCount : int = 0;

	m_skinPackagesScreen.button.normal.background	=	null;
	m_skinPackagesScreen.button.hover.background	=	null;
	m_skinPackagesScreen.button.active.background	=	null;
	
	if(iOption == 1)
	{
		for(var i=0; i<m_iUpgradePackageChannelsCount[g_iSelectedUpgradeOptionIndex]; i++)
		{
			if(m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListChannels[i].strGenreName == m_strListGenres[m_iIndexActiveGenre])
			{
				GUI.Button(Rect(rectFullScroll.x + iCount*(rectFullScroll.width/m_iChannelCountInSelectedPackageByActiveGenre), rectFullScroll.y, rectFullScroll.width/m_iChannelCountInSelectedPackageByActiveGenre, rectFullScroll.height),m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_tex2dListIcons[i]);
				
				iCount++;
			}
		}
	}
	else
	{
		for(i=0; i<m_iDowngradePackageChannelsCount[g_iSelectedDowngradeOptionIndex]; i++)
		{
			if(m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListChannels[i].strGenreName == m_strListGenres[m_iIndexActiveGenre])
			{
				GUI.Button(Rect(rectFullScroll.x + iCount*(rectFullScroll.width/m_iChannelCountInSelectedPackageByActiveGenre), rectFullScroll.y, rectFullScroll.width/m_iChannelCountInSelectedPackageByActiveGenre, rectFullScroll.height),m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_tex2dListIcons[i]);
				
				iCount++;
			}
		}
	}
}

/*		
function DownloadPresentPackageDetails()
{
	//ID:
	m_strPresentPackId	=	GetPresentPackageID();
	
	//Name:
	m_strPresentPackName	=	GetPresentPackageName();
	
	//Price:
	//DownloadPresentPackagePrice();
	
	//Channels Count | Name | Icons:
	//DownloadPresentPackageChannelInfo();
	
	//Genres:
	g_iGenresCountInPresentPackage = 25; //hardcoded from text file
}
*/

function LoadUpgradeOptionsPrefetchedData()
{
	m_iTotalAddOnsCountInSelectedPackage = 0;
	m_iChannelCountInSelectedPackageByActiveGenre	=	-1;
	
	//1. total no. of upgrade options available
	//m_iCountUpgradePacks 	=	m_iCountUpgradePacks;
	
	m_strUpgradePackageName			=	new String[m_iCountUpgradePacks];
	m_strUpgradePackagePrice		=	new String[m_iCountUpgradePacks];
	m_iUpgradePackageChannelsCount	=	new int[m_iCountUpgradePacks];
	m_v2ScrollUpgradeOptionChannelsGridX	=	new Vector2[m_iCountUpgradePacks];
	
	//load each upgrade package name | price | no. of channels | load icons
	for(var i = 0; i < m_iCountUpgradePacks; i++)
	{
		m_strUpgradePackageName[i]			=	m_listUpgradeOptions[i].m_strProductName;
		m_strUpgradePackagePrice[i]			=	m_listUpgradeOptions[i].m_strProductPrice;
		m_iUpgradePackageChannelsCount[i]	=	m_listUpgradeOptions[i].m_iChannelsCount;
		
		m_listUpgradeOptions[i].m_tex2dListIcons = new Texture2D[m_iUpgradePackageChannelsCount[i]];
		
		for(var j = 0; j < m_iUpgradePackageChannelsCount[i]; j++) 
		{
			var path = m_listUpgradeOptions[i].m_objListChannels[j].strServiceName;
        	var img = Resources.Load(path) as Texture2D;
        	if(img == null)
        	{
        		img = Resources.Load("000BLANK") as Texture2D;
        		if(img == null)
        		{
        			print("Locha");
        		}
        	}
        	m_listUpgradeOptions[i].m_tex2dListIcons[j] = img;
		}	
	}
}

function DownloadUpgradeOptionsDetails()
{
	//Array of Upgrade Options: Count | Name & ID of each | Price of each | ChannelInfo  of each - count|name|icons
	
	//Fetch Upgrade Options for the current user
    var strAPIURL = ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
    var strAPIMethod = "product/GetUpgradeDowngradeProductByCustomer";
    var strInput = "{\"uuId\":\"" + ScriptMainPage.gs_strUUID + "\",\"ProcessFlow\":\"UPGRADE\"}";
    
    Debug.Log("Invoke API : " + strAPIURL + strAPIMethod + " - " + strInput);
    m_objGetUpgradeOptionsAPIPacket = new CWebAPIPacket(strAPIURL, strAPIMethod, strInput);
    g_objScriptAPIHandler.InvokeReSTfulAPI(m_objGetUpgradeOptionsAPIPacket);
	
}

function LoadDowngradeOptionsPrefetchedData()
{
	g_iChannelsCountInDowngradePackage 		= 0;
	g_iCountFreeAddOnsSelectedForDowngrade 	= 0;
	m_iChannelCountInSelectedPackageByActiveGenre	=	-1;
	
	//1. total no. of downgrade options available
	//m_iCountDowngradePacks 			=	m_iCountDowngradePacks;
	
	m_strDowngradePackageName				=	new String[m_iCountDowngradePacks];
	m_strDowngradePackagePrice				=	new String[m_iCountDowngradePacks];
	m_iDowngradePackageChannelsCount		=	new int[m_iCountDowngradePacks];
	
	//load each upgrade package name | price | no. of channels | load icons
	for(var i = 0; i < m_iCountDowngradePacks; i++)
	{
		m_strDowngradePackageName[i]		=	m_listDowngradeOptions[i].m_strProductName;
		m_strDowngradePackagePrice[i]		=	m_listDowngradeOptions[i].m_strProductPrice;
		m_iDowngradePackageChannelsCount[i]	=	m_listDowngradeOptions[i].m_iChannelsCount;
		
		m_listDowngradeOptions[i].m_tex2dListIcons = new Texture2D[m_iDowngradePackageChannelsCount[i]];
		
		for(var j = 0; j < m_iDowngradePackageChannelsCount[i]; j++) 
		{
			var path = m_listDowngradeOptions[i].m_objListChannels[j].strServiceName;
        	var img = Resources.Load(path) as Texture2D;
        	if(img == null)
        	{
        		img = Resources.Load("000BLANK") as Texture2D;
        		if(img == null)
        		{
        			print("Locha");
        		}
        	}
        	m_listDowngradeOptions[i].m_tex2dListIcons[j] = img;
		}	
	}
	

}

function GetUpgradeOrDowngradePackageNameByIndex(iType : int, iIndex : int)	:	String
{
	//if iType == -1 : Downgrade
	if(iType == -1)
	{
		if(iIndex >= m_iCountDowngradePacks)
		{
			return "Package Name";
		}
		else
		{
			return m_strDowngradePackageName[iIndex];
		}
	}
	//if iType == 1 : Upgrade
	else if(iType == 1)
	{
		if(iIndex >= m_iCountUpgradePacks)
		{
			return "Package Name";
		}
		else
		{
			return m_strUpgradePackageName[iIndex];
		}
	}
}

function GetUpgradeOrDowngradePackagePriceByIndex(iType : int, iIndex : int)	:	String
{
	var fPrice : float		=	0.0;
	var fNetPrice : float	=	0.0;
	//if iType == -1 : Downgrade
	if(iType == -1)
	{
		if(iIndex >= m_iCountDowngradePacks)
		{
			return "Net Price";
		}
		else
		{
			/*
			fPrice = parseFloat(m_strDowngradePackagePrice[iIndex]);
			fNetPrice = fPrice + (12.36/100)*fPrice;
	
			return m_strDowngradePackagePrice[iIndex] + "+12.36%Tax = " + fNetPrice.ToString("f2") + " PM";
			*/
			return "INR " + m_strDowngradePackagePrice[iIndex] + " pm";
		}
	}
	//if iType == 1 : Upgrade
	else if(iType == 1)
	{
		if(iIndex >= m_iCountUpgradePacks)
		{
			return "Net Price";
		}
		else
		{
			/*
			fPrice = parseFloat(m_strUpgradePackagePrice[iIndex]);
			fNetPrice = fPrice + (12.36/100)*fPrice;
	
			return m_strUpgradePackagePrice[iIndex] + "+12.36%Tax = " + fNetPrice.ToString("f2") + " PM";
			*/
			return "INR " + m_strUpgradePackagePrice[iIndex] + " pm";
		}
	}
}

var m_objDownloadPPAOAPIPacket	:	CWebAPIPacket;
var m_bPPAOAPIInProgress		:	boolean;
var m_iPPAOCount				:	int;
var m_strPPAOAPIResult			:	String;
var m_listPPAO					:	List.<CAddOn>;

function DownloadPPAOList(fWaitTime	:	float)
{
	yield	WaitForSeconds(fWaitTime);
	
	var strCustomerId	:	String	=	PlayerPrefs.GetString("CustomerId");
	var strAPIURL		:	String	=	ScriptAPIs.g_strWebservicesAtD2H + "MobileEPGServices/";
	var strAPIMethod	:	String	=	"MobileEPGService.AddOnService.svc/Method/GetAddOnsByCustomerIdAndSCNo";
    var strInput		:	String	=	"{\"CustomerId\":\"" + strCustomerId + "\",\"SCNumber\":\"" + g_strConnectionId + "\"}";
    
    Debug.Log("Invoke API : " + strAPIURL + strAPIMethod + " - " + strInput);
    
    m_objDownloadPPAOAPIPacket 		= 	new CWebAPIPacket(strAPIURL, strAPIMethod, strInput);
    m_bPPAOAPIInProgress			=	true;
    g_objScriptAPIHandler.InvokeReSTfulAPI(m_objDownloadPPAOAPIPacket);
}

function ParsePPAOAPIResponse()
{
	if(m_objDownloadPPAOAPIPacket.m_strResponseCode == "200 OK")
	{
		var N = JSON.Parse(m_objDownloadPPAOAPIPacket.m_strOutput);
		if(N == null)
		{
			m_strPPAOAPIResult	=	"NULL JSON";
			print(m_strPPAOAPIResult);
		}
		else
		{
			Debug.Log("Reassembled: " + N.ToString());
			if(N.ToString() == "{}")
			{
				m_strPPAOAPIResult	=	"Empty JSON";
				print(m_strPPAOAPIResult);
			}
			else
			{
				while(N["GetAddOnsByCustomerIdAndSCNoResult"][m_iPPAOCount] != null)
				{
					m_iPPAOCount++;
				}
				print("Present Package AddOns Count : " + m_iPPAOCount);
				
				for(var i=0; i<m_iPPAOCount; i++)
				{
					m_listPPAO.Add(new CAddOn());
					m_listPPAO[i].m_strAddOnID		=	N["GetAddOnsByCustomerIdAndSCNoResult"][i]["CommercialProductId"];
					m_listPPAO[i].m_strAddOnName	=	N["GetAddOnsByCustomerIdAndSCNoResult"][i]["CommercialProductName"];
					m_listPPAO[i].m_strAddOnPrice	=	N["GetAddOnsByCustomerIdAndSCNoResult"][i]["Price"];
					
					if(parseFloat(m_listPPAO[i].m_strAddOnPrice) > 0.0)
					{
						m_listPPAO[i].m_bIsAddOnFree	=	false;
					}
					else
					{
						m_listPPAO[i].m_bIsAddOnFree	=	true;
					}
				}
			}
		}
	}
	else
	{
		m_strPPAOAPIResult	=	"HTTP Error : " + m_objDownloadPPAOAPIPacket.m_strResponseCode + ". Please try later.";
		print(m_strPPAOAPIResult);
	}
	
	m_objDownloadPPAOAPIPacket.m_bResponseReceived 	= 	false;	
}

function GetFreeAddOnCounts(iOption	:	int)	:	int//iOption -> 1 : upgrade | -1 : downgrade
{
	var iTotalAddOnsCount	:	int;
	var iFreeAddOnsCount	:	int = 0;
	if(iOption == 1)
	{
		iTotalAddOnsCount	=	m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_iAddOnsCount;/*NOT hardcoded_val*/
	}
	else
	{
		iTotalAddOnsCount	=	m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_iAddOnsCount;/*NOT hardcoded_val*/
	}
	
	for(var m = 0; m < iTotalAddOnsCount; m++)
	{
		if(iOption == 1)
		{
			if(m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListAddOns[m].m_bIsAddOnFree == true)
			{
				iFreeAddOnsCount++;
			}
		}
		else
		{
			if(m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListAddOns[m].m_bIsAddOnFree == true)
			{
				iFreeAddOnsCount++;
			}
		}
	}
	return iFreeAddOnsCount;
}

function GetListOfCompatiblePaidAddOns(iOption	:	int)	:	String
{
	var strConcatenatedListOfCompatiblePaidAddOns	:	String = "";
	var	iCountCompatiblePaidAddOns		:	int	=	0;
	var iAddOnsCountInSelectedPackage	:	int;
	
	if(iOption == 1)
	{
		iAddOnsCountInSelectedPackage	=	m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_iAddOnsCount;
	}
	else
	{
		iAddOnsCountInSelectedPackage	=	m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_iAddOnsCount;
	}
	
	for(var n = 0; n < m_iPPAOCount; n++)
	{
		for(var m = 0; m < iAddOnsCountInSelectedPackage; m++)
		{
			if(iOption == 1)
			{
				if(m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListAddOns[m].m_bIsAddOnFree == false)
				{
					if(m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListAddOns[m].m_strAddOnID == m_listPPAO[n].m_strAddOnID)
					{
						//compatible : add to forward addon list
						iCountCompatiblePaidAddOns++;
						if(iCountCompatiblePaidAddOns == 1)
						{
							strConcatenatedListOfCompatiblePaidAddOns = "\"" + m_listPPAO[n].m_strAddOnID + "\"";
						}
						else if(iCountCompatiblePaidAddOns > 1)
						{
							strConcatenatedListOfCompatiblePaidAddOns = strConcatenatedListOfCompatiblePaidAddOns + ",\"" + m_listPPAO[n].m_strAddOnID +"\"";
						}
					}
				}
			}
			else
			{
				if(m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListAddOns[m].m_bIsAddOnFree == false)
				{
					if(m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListAddOns[m].m_strAddOnID == m_listPPAO[n].m_strAddOnID)
					{
						//compatible : add to forward addon list
						iCountCompatiblePaidAddOns++;
						if(iCountCompatiblePaidAddOns == 1)
						{
							strConcatenatedListOfCompatiblePaidAddOns = "\"" + m_listPPAO[n].m_strAddOnID + "\"";
						}
						else if(iCountCompatiblePaidAddOns > 1)
						{
							strConcatenatedListOfCompatiblePaidAddOns = strConcatenatedListOfCompatiblePaidAddOns + ",\"" + m_listPPAO[n].m_strAddOnID +"\"";
						}
					}
				}
			}
		}
	}
	
	return strConcatenatedListOfCompatiblePaidAddOns;
}

function HighlightAddOnsAlsoAddedInPP(iOption	:	int)//1 : upgrade | -1 : downgrade
{
	var iAddOnsCountInSelectedPackage	:	int;
	if(iOption == 1)
	{
		iAddOnsCountInSelectedPackage	=	m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_iAddOnsCount;
	}
	else
	{
		iAddOnsCountInSelectedPackage	=	m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_iAddOnsCount;
	}
	
	for(var m = 0; m < iAddOnsCountInSelectedPackage; m++)
	{
		for(var n = 0; n < m_iPPAOCount; n++)
		{
			if(iOption == 1)
			{
				if(m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListAddOns[m].m_strAddOnID == m_listPPAO[n].m_strAddOnID)
				{
					m_listUpgradeOptions[g_iSelectedUpgradeOptionIndex].m_objListAddOns[m].m_bAddOnSelected = true;
				}
			}
			else
			{
				if(m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListAddOns[m].m_strAddOnID == m_listPPAO[n].m_strAddOnID)
				{
					m_listDowngradeOptions[g_iSelectedDowngradeOptionIndex].m_objListAddOns[m].m_bAddOnSelected = true;
				}
			}
		}
	}
}

function SkinButtonAsAButton(tex2DNormal	:	Texture2D)
{
	m_skinPackagesScreen.button.normal.background 	= 	tex2DNormal;
	m_skinPackagesScreen.button.hover.background 	= 	m_tex2DOrange;
	m_skinPackagesScreen.button.active.background 	= 	m_tex2DOrange;
	m_skinPackagesScreen.button.normal.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinPackagesScreen.button.hover.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinPackagesScreen.button.active.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinPackagesScreen.button.font				= 	m_fontRegular;
	m_skinPackagesScreen.button.fontSize 			=	Mathf.Min(0.8*m_fWidthPopup,m_fHeightPopup/5.0)/2.5;
	m_skinPackagesScreen.button.alignment			=	TextAnchor.MiddleCenter;
	m_skinPackagesScreen.button.contentOffset.x		=	0.0;
}

function SkinButtonAsATile(tex2DNormal	:	Texture2D)
{
	m_skinPackagesScreen.button.normal.background 	= 	tex2DNormal;
	m_skinPackagesScreen.button.hover.background 	= 	tex2DNormal;
	m_skinPackagesScreen.button.active.background 	= 	tex2DNormal;
	m_skinPackagesScreen.button.normal.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinPackagesScreen.button.hover.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinPackagesScreen.button.active.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinPackagesScreen.button.font				= 	m_fontRegular;
	m_skinPackagesScreen.button.fontSize 			=	Mathf.Min(0.8*m_fWidthPopup,m_fHeightPopup/5.0)/2.0;
	m_skinPackagesScreen.button.alignment			=	TextAnchor.MiddleCenter;
	m_skinPackagesScreen.button.contentOffset.x		=	0.0;
}

function SkinTextField()
{
	m_skinPackagesScreen.textField.alignment		=	TextAnchor.MiddleLeft;
	m_skinPackagesScreen.textField.fontSize			=	0.3*m_fHeightPopup/4.5;
	m_skinPackagesScreen.textField.contentOffset.x	=	0.3*m_fHeightPopup/9.0;
	m_skinPackagesScreen.textField.normal.textColor	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
	m_skinPackagesScreen.textField.hover.textColor	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
	m_skinPackagesScreen.textField.active.textColor	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
	m_skinPackagesScreen.textField.font				=	m_fontRegular;
}

function SkinLabel()
{
	m_skinPackagesScreen.label.alignment			=	TextAnchor.MiddleLeft;
	m_skinPackagesScreen.label.normal.textColor		=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
	m_skinPackagesScreen.label.fontSize				=	0.3*m_fHeightPopup/5.25;
	m_skinPackagesScreen.label.font					=	m_fontRegular;
}

function IsChannelRectIntersectingPackagesArea1ViewPort(rectContender	:	Rect)
{
	var v2PointTopLeft		:	Vector2 = Vector2(rectContender.xMin - m_v2ScrollPresentPackageChannelsGridX.x, rectContender.yMin - m_v2ScrollPresentPackageChannelsGridX.y);
	var v2PointTopRight		:	Vector2 = Vector2(rectContender.xMax - m_v2ScrollPresentPackageChannelsGridX.x, rectContender.yMin - m_v2ScrollPresentPackageChannelsGridX.y);
	var v2PointBottomRight	:	Vector2 = Vector2(rectContender.xMax - m_v2ScrollPresentPackageChannelsGridX.x, rectContender.yMax - m_v2ScrollPresentPackageChannelsGridX.y);
	var v2PointBottomLeft	:	Vector2 = Vector2(rectContender.xMin - m_v2ScrollPresentPackageChannelsGridX.x, rectContender.yMax - m_v2ScrollPresentPackageChannelsGridX.y);
	
	if(	m_rectPackagesArea1ViewPort.Contains(v2PointTopLeft)	|| 
		m_rectPackagesArea1ViewPort.Contains(v2PointTopRight)	||
		m_rectPackagesArea1ViewPort.Contains(v2PointBottomRight)	||
		m_rectPackagesArea1ViewPort.Contains(v2PointBottomLeft) )
		{
			return true;
		}
		else
		{
			return false;
		}
}

function IsUpgradeOptionRectIntersectingPackagesArea2ViewPort(rectContender	:	Rect)
{
	var v2PointTopLeft		:	Vector2 = Vector2(rectContender.xMin - m_v2ScrollUpgradePackageOptionsY.x, rectContender.yMin - m_v2ScrollUpgradePackageOptionsY.y);
	var v2PointTopRight		:	Vector2 = Vector2(rectContender.xMax - m_v2ScrollUpgradePackageOptionsY.x, rectContender.yMin - m_v2ScrollUpgradePackageOptionsY.y);
	var v2PointBottomRight	:	Vector2 = Vector2(rectContender.xMax - m_v2ScrollUpgradePackageOptionsY.x, rectContender.yMax - m_v2ScrollUpgradePackageOptionsY.y);
	var v2PointBottomLeft	:	Vector2 = Vector2(rectContender.xMin - m_v2ScrollUpgradePackageOptionsY.x, rectContender.yMax - m_v2ScrollUpgradePackageOptionsY.y);
	
	if(	m_rectPackagesArea2ViewPort.Contains(v2PointTopLeft)	|| 
		m_rectPackagesArea2ViewPort.Contains(v2PointTopRight)	||
		m_rectPackagesArea2ViewPort.Contains(v2PointBottomRight)	||
		m_rectPackagesArea2ViewPort.Contains(v2PointBottomLeft) )
		{
			return true;
		}
		else
		{
			return false;
		}
}

function IsChannelRectIntersectingGivenViewPort(rectContender	: Rect, rectViewPortScroll : Rect, v2ScrollUpgradeOptionChannelsGridX : Vector2)
{
	var v2PointTopLeft		:	Vector2 = Vector2(rectContender.xMin - v2ScrollUpgradeOptionChannelsGridX.x, rectContender.yMin - v2ScrollUpgradeOptionChannelsGridX.y);
	var v2PointTopRight		:	Vector2 = Vector2(rectContender.xMax - v2ScrollUpgradeOptionChannelsGridX.x, rectContender.yMin - v2ScrollUpgradeOptionChannelsGridX.y);
	var v2PointBottomRight	:	Vector2 = Vector2(rectContender.xMax - v2ScrollUpgradeOptionChannelsGridX.x, rectContender.yMax - v2ScrollUpgradeOptionChannelsGridX.y);
	var v2PointBottomLeft	:	Vector2 = Vector2(rectContender.xMin - v2ScrollUpgradeOptionChannelsGridX.x, rectContender.yMax - v2ScrollUpgradeOptionChannelsGridX.y);
	
	if(	rectViewPortScroll.Contains(v2PointTopLeft)	|| 
		rectViewPortScroll.Contains(v2PointTopRight)	||
		rectViewPortScroll.Contains(v2PointBottomRight)	||
		rectViewPortScroll.Contains(v2PointBottomLeft) )
		{
			return true;
		}
		else
		{
			return false;
		}
}


//////////////
var m_strCustomerId	:	String;
//function TrackEvent(fWaitTime	:	float)
//{
//	yield WaitForSeconds(fWaitTime);
//	m_strCustomerId = PlayerPrefs.GetString("CustomerId");
//	TE("Packages");
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

////////////////////////////////////////////////////////////////////////////////////////////////
static var m_iPrefetchingStepsCompleted	:	int;
function DownloadPackageDetails()
{
	// STEP 1: PRESENT PACKAGE PRICE | PRESENT PACKAGE CHANNELS | UPGRADE OPTIONS | DOWNGRADE OPTIONS ***/
	if(m_iPrefetchingStepsCompleted == 0)
	{
		if(m_objPresentPackagePriceAPIPacket && m_objPresentPackageChannelInfoAPIPacket)
		{
			//hit the API just for once and in the else wait for the response
			if(	m_objPresentPackagePriceAPIPacket.m_iConnectionStatus 				== 0 ||
				m_objPresentPackageChannelInfoAPIPacket.m_iConnectionStatus 		== 0 ||
				m_objGetUpgradeOptionsAPIPacket.m_iConnectionStatus 				== 0 ||
				m_objGetDowngradeOptionsAPIPacket.m_iConnectionStatus				== 0) //m_iConnectionStatus sets to 1, and remains 1 till we Clear()
			{
				PrefetchDetailsForPackagesScreen();//hit all the APIs for Packages Screen
			}
			else
			{
				if(	m_objPresentPackagePriceAPIPacket.m_bResponseReceived				== true	&&
					m_objPresentPackageChannelInfoAPIPacket.m_bResponseReceived 		== true	&&
					m_objGetUpgradeOptionsAPIPacket.m_bResponseReceived					== true &&
					m_objGetDowngradeOptionsAPIPacket.m_bResponseReceived				== true)
				{
					//Packages Screen - API No. 01
					//Debug.Log("ProcessPresentProductPriceAPI()");
					if(ProcessPresentProductPriceAPI() != 1)
					{
					//lokesh - march'14
					/*
						if(m_objPresentPackagePriceAPIPacket.m_iPromptState == 0) //render prompt
						{
							m_objPresentPackagePriceAPIPacket.ErrorPrompt(1);
							return;
						}
						else if(m_objPresentPackagePriceAPIPacket.m_iPromptState == -1) // take a step back
						{
							//Debug.Log("take a step back: PrefetchDetailsForPackagesScreen - Hit all the APIs for Packages Screen");
							ClearResponseCodeAndJSON(m_objPresentPackagePriceAPIPacket);
							m_objPresentPackagePriceAPIPacket.m_iPromptState = 0;
							return;
						}
						else if(m_objPresentPackagePriceAPIPacket.m_iPromptState == 1) // skip to next step: ProcessPresentProductToChannelInfoAPI()
						{
							//Debug.Log("skip to next step: ProcessPresentProductToChannelInfoAPI()");
						}
					*/
					}
					
					//Packages Screen - API No. 02
					//Debug.Log("ProcessPresentProductToChannelInfoAPI()");
					if(ProcessPresentProductToChannelInfoAPI() != 1)
					{
						//lokesh - march'14
						/*
						if(m_objPresentPackageChannelInfoAPIPacket.m_iPromptState == 0) //render prompt
						{
							m_objPresentPackageChannelInfoAPIPacket.ErrorPrompt(1);
							return;
						}
						else if(m_objPresentPackageChannelInfoAPIPacket.m_iPromptState == -1) // take a step back
						{
							//Debug.Log("take a step back: PrefetchDetailsForPackagesScreen - Hit all the APIs for Packages Screen");
							ClearResponseCodeAndJSON(m_objPresentPackageChannelInfoAPIPacket);
							m_objPresentPackageChannelInfoAPIPacket.m_iPromptState = 0;
							return;
						}
						else if(m_objPresentPackageChannelInfoAPIPacket.m_iPromptState == 1) // skip to next step: ProcessGetUpgradeOptionsAPI
						{
							//Debug.Log("skip to next step: ProcessGetUpgradeOptionsAPI()");
						}
						*/
					}				
					
					//Packages Screen - API No. 03
					//Debug.Log("ProcessGetUpgradeOptionsAPI()");
					if(ProcessGetUpgradeOptionsAPI() != 1)
					{
						//lokesh - march'14
						/*
						if(m_objGetUpgradeOptionsAPIPacket.m_iPromptState == 0) //render prompt
						{
							m_objGetUpgradeOptionsAPIPacket.ErrorPrompt(1);
							return;
						}
						else if(m_objGetUpgradeOptionsAPIPacket.m_iPromptState == -1) // take a step back
						{
							//Debug.Log("take a step back: PrefetchDetailsForPackagesScreen - Hit all the APIs for Packages Screen");
							ClearResponseCodeAndJSON(m_objGetUpgradeOptionsAPIPacket);
							m_objGetUpgradeOptionsAPIPacket.m_iPromptState = 0;
							return;
						}
						else if(m_objGetUpgradeOptionsAPIPacket.m_iPromptState == 1) // skip to next step: ProcessGetUpgradeOptionsAPI
						{
							//Debug.Log("skip to next step: ProcessGetDowngradeOptionsAPI");
						}
						*/
					}
										
					//Packages Screen - API No. 04
					//Debug.Log("ProcessGetDowngradeOptionsAPI()");
					if(ProcessGetDowngradeOptionsAPI() != 1)
					{
						//lokesh - march'14
						/*
						if(m_objGetDowngradeOptionsAPIPacket.m_iPromptState == 0) //render prompt
						{
							m_objGetDowngradeOptionsAPIPacket.ErrorPrompt(1);
							return;
						}
						else if(m_objGetDowngradeOptionsAPIPacket.m_iPromptState == -1) // take a step back
						{
							//Debug.Log("take a step back: ProcessGetDowngradeOptionsAPI - Hit all the APIs for Packages Screen");
							ClearResponseCodeAndJSON(m_objGetDowngradeOptionsAPIPacket);
							m_objGetDowngradeOptionsAPIPacket.m_iPromptState = 0;
							return;
						}
						else if(m_objGetDowngradeOptionsAPIPacket.m_iPromptState == 1) // skip to next step: ProcessGetUpgradeOptionsAPI
						{
							//Debug.Log("skip to next step: Upgrade|Downgrade Package Price/Channels/Add-Ons");
						}
						*/
					}
					
					//after all the skips, the control reaches to this point
					m_iPrefetchingStepsCompleted = 1;
				}	
			}
		}	
	}
	
	/*** STEP 2: UPGRADE PACKAGE PRICE | CHANNELS | ADD-ONS ---AND--- DOWNGRADE PACKAGE PRICE | CHANNELS | ADD-ONS ***/
	if(m_iPrefetchingStepsCompleted == 1)
	{
		if(m_iCountUpgradePacks > 0)
		{
			var iIndex_UAPI_1 : int = Time.time * 50;
	    	iIndex_UAPI_1 = iIndex_UAPI_1 % m_iCountUpgradePacks;
    					
			//check whether the price of all upgrade options has been fetched
			if(!m_bAllUpgradeOptionsPriceFetched)
			{
				if(m_listUpgradeOptions[iIndex_UAPI_1].m_objGetCommercialProductPriceAPIPacket.m_bResponseReceived)
				{
					//price fetch ho gaye hain, to ab variables mein daal do
					
					//candidate for thread
					ParseGetProductPriceByIdResponse(	m_listUpgradeOptions[iIndex_UAPI_1].m_objGetCommercialProductPriceAPIPacket.m_strOutput,
														iIndex_UAPI_1,
														true
													);
					if(m_listUpgradeOptions[iIndex_UAPI_1].m_objGetCommercialProductPriceAPIPacket.m_strErrorMessage != "")
					{
						m_listUpgradeOptions[iIndex_UAPI_1].m_strProductPrice = "0";
					}
					m_iUAPI_1_ResponsesReceived++;
					m_listUpgradeOptions[iIndex_UAPI_1].m_objGetCommercialProductPriceAPIPacket.m_bResponseReceived = false;
				}
				if(m_iUAPI_1_ResponsesReceived == m_iCountUpgradePacks)
				{				
					//Debug.Log("AllUpgradeOptionsPriceFetched");
					m_bAllUpgradeOptionsPriceFetched = true;
					
					//lokesh - march'14
					/*
					m_iPercentageCompleted	+=	15;
					m_strStatusMessage = "Downloading package details now..." + m_iPercentageCompleted + "% completed";
					*/
				}
			}
			
			//check whether the channels in all upgrade options has been fetched
			if(!m_bAllUpgradeOptionsChannelsFetched)
			{
				if(m_listUpgradeOptions[iIndex_UAPI_1].m_objProductToChannelInfoAPIPacket.m_bResponseReceived)
				{
					//saare channels ki info aa gayi, ab json parse karke variables mein daal do
					ParseProductToChannelInfoResponse( 	m_listUpgradeOptions[iIndex_UAPI_1].m_objProductToChannelInfoAPIPacket.m_strOutput,
														iIndex_UAPI_1,
														true
													);
													
					if(m_listUpgradeOptions[iIndex_UAPI_1].m_objProductToChannelInfoAPIPacket.m_strErrorMessage != "")
					{
						//GUI.ModalWindow(0,g_rectErrorPrompt,ErrorPrompt,"Upgradeable Package Channel Info" + g_objListUpgradeOptions[i].m_objProductToChannelInfoAPIPacket.m_strErrorMessage);
						m_listUpgradeOptions[iIndex_UAPI_1].m_iChannelsCount = 0;
						//g_bHault = true;
					}
					m_iUAPI_2_ResponsesReceived++;
					m_listUpgradeOptions[iIndex_UAPI_1].m_objProductToChannelInfoAPIPacket.m_bResponseReceived = false;
				}	
				
				if(m_iUAPI_2_ResponsesReceived == m_iCountUpgradePacks)
				{
					m_bAllUpgradeOptionsChannelsFetched = true;
					
					//lokesh - march'14
					/*
					m_iPercentageCompleted	+=	15;
					m_strStatusMessage = "Downloading package details now..." + m_iPercentageCompleted + "% completed";
					*/
				}
			}
			
			//check whether the add-ons of all upgrade options has been fetched
			if(!m_bAllUpgradeOptionsAddOnsFetched)
			{
				if(m_listUpgradeOptions[iIndex_UAPI_1].m_objGetAddOnsAPIPacket.m_bResponseReceived)
				{
					//saare addons ki info aa gayi, ab json parse karke variables mein daal do
					ParseGetAddOnsResponse(	m_listUpgradeOptions[iIndex_UAPI_1].m_objGetAddOnsAPIPacket.m_strOutput,
											iIndex_UAPI_1,
											true
											);
											
					if(m_listUpgradeOptions[iIndex_UAPI_1].m_objGetAddOnsAPIPacket.m_strErrorMessage != "")
					{
						//GUI.ModalWindow(0,g_rectErrorPrompt,ErrorPrompt,"Upgradeable Add Ons Info" + g_objListUpgradeOptions[i].m_objGetAddOnsAPIPacket.m_strErrorMessage);
						m_listUpgradeOptions[iIndex_UAPI_1].m_iAddOnsCount = 0;
						//g_bHault = true;
					}
					m_iUAPI_3_ResponsesReceived++;
					m_listUpgradeOptions[iIndex_UAPI_1].m_objGetAddOnsAPIPacket.m_bResponseReceived = false;
				}
				
				if(m_iUAPI_3_ResponsesReceived == m_iCountUpgradePacks)
				{
					//Debug.Log("AllUpgradeOptionsAddOnsFetched");
					m_bAllUpgradeOptionsAddOnsFetched = true;
					//lokesh - march'14
					/*
					m_iPercentageCompleted	+=	15;
					m_strStatusMessage = "Downloading package details now..." + m_iPercentageCompleted + "% completed";
					*/
				}
			}
		}
		else// 0 : upgrade options
		{
			if(!m_bAllUpgradeOptionsPriceFetched && !m_bAllUpgradeOptionsChannelsFetched && !m_bAllUpgradeOptionsAddOnsFetched)
			{
				m_bAllUpgradeOptionsPriceFetched	= true;
				m_bAllUpgradeOptionsChannelsFetched	=	true;
				m_bAllUpgradeOptionsAddOnsFetched = true;
				
				//lokesh - march'14
				/*
				m_iPercentageCompleted	+=	45;
				m_strStatusMessage = "Downloading package details now..." + m_iPercentageCompleted + "% completed";
				*/
			}
		}
		
		if(m_iCountDowngradePacks > 0)
    	{
    		var iIndex_DAPI_1 : int = Time.time * 50;
    		iIndex_DAPI_1 = iIndex_DAPI_1 % m_iCountDowngradePacks;
    		
    		//check whether the price of all downgrade options has been fetched
			if(!m_bAllDowngradeOptionsPriceFetched)
			{
				//price fetch ho gaye hain, to ab variables mein daal do	
				if(m_listDowngradeOptions[iIndex_DAPI_1].m_objGetCommercialProductPriceAPIPacket.m_bResponseReceived)
				{	
					ParseGetProductPriceByIdResponse(	m_listDowngradeOptions[iIndex_DAPI_1].m_objGetCommercialProductPriceAPIPacket.m_strOutput,
														iIndex_DAPI_1,
														false
													);
													
					if(m_listDowngradeOptions[iIndex_DAPI_1].m_objGetCommercialProductPriceAPIPacket.m_strErrorMessage != "")
					{
						//GUI.ModalWindow(0,g_rectErrorPrompt,ErrorPrompt,"Downgradeable Package Price" + g_objListDowngradeOptions[i].m_objGetCommercialProductPriceAPIPacket.m_strErrorMessage);
						m_listDowngradeOptions[iIndex_DAPI_1].m_strProductPrice = "0";
						//g_bHault = true;
					}
					m_iDAPI_1_ResponsesReceived++;
					m_listDowngradeOptions[iIndex_DAPI_1].m_objGetCommercialProductPriceAPIPacket.m_bResponseReceived = false;
				}
				
				if(m_iDAPI_1_ResponsesReceived == m_iCountDowngradePacks)
				{
					//Debug.Log("AllDowngradeOptionsPriceFetched");
					m_bAllDowngradeOptionsPriceFetched = true;
					
					//lokesh - march'14
					/*
					m_iPercentageCompleted	+=	15;
					m_strStatusMessage = "Downloading package details now..." + m_iPercentageCompleted + "% completed";
					*/
				}
			}
			
			//check whether the channels in all downgrade options has been fetched
			if(!m_bAllDowngradeOptionsChannelsFetched)
			{
				if(m_listDowngradeOptions[iIndex_DAPI_1].m_objProductToChannelInfoAPIPacket.m_bResponseReceived)
				{	
					//saare channels ki info aa gayi, ab json parse karke variables mein daal do
					ParseProductToChannelInfoResponse( 	m_listDowngradeOptions[iIndex_DAPI_1].m_objProductToChannelInfoAPIPacket.m_strOutput,
														iIndex_DAPI_1,
														false
													);
													
					if(m_listDowngradeOptions[iIndex_DAPI_1].m_objProductToChannelInfoAPIPacket.m_strErrorMessage != "")
					{
						//GUI.ModalWindow(0,g_rectErrorPrompt,ErrorPrompt,"Downgradeable Package Channel Info" + g_objListDowngradeOptions[i].m_objProductToChannelInfoAPIPacket.m_strErrorMessage);
						m_listDowngradeOptions[iIndex_DAPI_1].m_iChannelsCount = 0;
						//g_bHault = true;
					}
					m_iDAPI_2_ResponsesReceived++;
					m_listDowngradeOptions[iIndex_DAPI_1].m_objProductToChannelInfoAPIPacket.m_bResponseReceived = false;
				}
				
				if(m_iDAPI_2_ResponsesReceived == m_iCountDowngradePacks)
				{
					//Debug.Log("AllDowngradeOptionsChannelsInfoFetched");
					m_bAllDowngradeOptionsChannelsFetched = true;
					
					//lokesh - march'14
					/*
					m_iPercentageCompleted	+=	15;
					m_strStatusMessage = "Downloading package details now..." + m_iPercentageCompleted + "% completed";
					*/
				}
			}
			
			//check whether the add-ons of all downgrade options has been fetched
			if(!m_bAllDowngradeOptionsAddOnsFetched)
			{
				//saare addons ki info aa gayi, ab json parse karke variables mein daal do	
				if(m_listDowngradeOptions[iIndex_DAPI_1].m_objGetAddOnsAPIPacket.m_bResponseReceived)
				{	
					ParseGetAddOnsResponse(	m_listDowngradeOptions[iIndex_DAPI_1].m_objGetAddOnsAPIPacket.m_strOutput,
											iIndex_DAPI_1,
											false
											);
											
					if(m_listDowngradeOptions[iIndex_DAPI_1].m_objGetAddOnsAPIPacket.m_strErrorMessage != "")
					{
						//GUI.ModalWindow(0,g_rectErrorPrompt,ErrorPrompt,"Downgradeable Add Ons Info" + g_objListDowngradeOptions[i].m_objGetAddOnsAPIPacket.m_strErrorMessage);
						m_listDowngradeOptions[iIndex_DAPI_1].m_iAddOnsCount = 0;
						//f = true;
					}
					m_iDAPI_3_ResponsesReceived++;
					m_listDowngradeOptions[iIndex_DAPI_1].m_objGetAddOnsAPIPacket.m_bResponseReceived = false;
				}
				
				if(m_iDAPI_3_ResponsesReceived == m_iCountDowngradePacks)
				{
					//Debug.Log("AllDowngradeOptionsAddOnsFetched");
					m_bAllDowngradeOptionsAddOnsFetched = true;
					
					//lokesh - march'14
					/*
					m_iPercentageCompleted	+=	15;
					m_strStatusMessage = "Downloading package details now..." + m_iPercentageCompleted + "% completed";
					*/
				}
			}
    	}
    	else// 0 = downgrade options
		{
			if(!m_bAllDowngradeOptionsPriceFetched && !m_bAllDowngradeOptionsChannelsFetched && !m_bAllDowngradeOptionsAddOnsFetched)
			{
				m_bAllDowngradeOptionsPriceFetched	= true;
				m_bAllDowngradeOptionsChannelsFetched	=	true;
				m_bAllDowngradeOptionsAddOnsFetched = true;
				
				//lokesh - march'14
				/*
				m_iPercentageCompleted	+=	45;
				m_strStatusMessage = "Downloading package details now..." + m_iPercentageCompleted + "% completed";
				*/
			}
		}
		
		if(	( m_bAllUpgradeOptionsPriceFetched && m_bAllUpgradeOptionsChannelsFetched && m_bAllUpgradeOptionsAddOnsFetched && m_bAllDowngradeOptionsPriceFetched && m_bAllDowngradeOptionsChannelsFetched && m_bAllDowngradeOptionsAddOnsFetched) ||
			( m_iCountUpgradePacks == 0 && !m_bAllUpgradeOptionsPriceFetched && !m_bAllUpgradeOptionsChannelsFetched && !m_bAllUpgradeOptionsAddOnsFetched) ||
			( m_iCountDowngradePacks == 0 && !m_bAllDowngradeOptionsPriceFetched && !m_bAllDowngradeOptionsChannelsFetched && !m_bAllDowngradeOptionsAddOnsFetched))
		{
			m_iPrefetchingStepsCompleted = 2;
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////
function LoadStaticVariablesToInspectorVariables()
{
	m_strPresentPackId		=	ScriptMainPage.gs_strPresentProductID;
	m_strPresentPackName	=	ScriptMainPage.gs_strPresentProductName;
}

var m_objPresentPackagePriceAPIPacket		:	CWebAPIPacket;
var m_objPresentPackageChannelInfoAPIPacket	:	CWebAPIPacket;
var m_objGetUpgradeOptionsAPIPacket			:	CWebAPIPacket;
var m_objGetDowngradeOptionsAPIPacket		:	CWebAPIPacket;
function PrefetchDetailsForPackagesScreen()
{
	//1. Price of Present Product/Package
	var strAPIURL = ScriptAPIs.g_strWebservicesAtD2H + "MobileEPGServices/";
    var strAPIMethod = "MobileEPGService.UpgradeDowngradeService.svc/Method/GetCommercialProductPriceById";
    var strInput = "{\"BasePackageId\":\"" + m_strPresentPackId + "\"}";

    //Debug.Log("Invoke API : " + strAPIURL + strAPIMethod + " - " + strInput);    
    m_objPresentPackagePriceAPIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    g_objScriptAPIHandler.InvokeReSTfulAPI(m_objPresentPackagePriceAPIPacket);
    
    //2. No. & Name of channels in Present Product/Package
    strAPIURL = ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
    strAPIMethod = "product/ProductToChannelInfo";
    strInput = "{\"productId\":\"" + m_strPresentPackId + "\"}";
    
    //Debug.Log("Invoke API : " + strAPIURL + strAPIMethod + " - " + strInput);
    m_objPresentPackageChannelInfoAPIPacket = new CWebAPIPacket(strAPIURL, strAPIMethod, strInput);
    g_objScriptAPIHandler.InvokeReSTfulAPI(m_objPresentPackageChannelInfoAPIPacket);
    
    //3. Get Upgrade Options for the current user
    strAPIURL = ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
    strAPIMethod = "product/GetUpgradeDowngradeProductByCustomer";
    strInput = "{\"uuId\":\"" + ScriptMainPage.gs_strUUID + "\",\"ProcessFlow\":\"UPGRADE\"}";
    
    //Debug.Log("Invoke API : " + strAPIURL + strAPIMethod + " - " + strInput);
    m_objGetUpgradeOptionsAPIPacket = new CWebAPIPacket(strAPIURL, strAPIMethod, strInput);
    g_objScriptAPIHandler.InvokeReSTfulAPI(m_objGetUpgradeOptionsAPIPacket);
    
    //4. Get Downgrade Options for the current user
    strAPIURL = ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
    strAPIMethod = "product/GetUpgradeDowngradeProductByCustomer";
    strInput = "{\"uuId\":\"" + ScriptMainPage.gs_strUUID + "\",\"ProcessFlow\":\"DOWNGRADE\"}";
    
    //Debug.Log("Invoke API : " + strAPIURL + strAPIMethod + " - " + strInput);
    m_objGetDowngradeOptionsAPIPacket = new CWebAPIPacket(strAPIURL, strAPIMethod, strInput);
    g_objScriptAPIHandler.InvokeReSTfulAPI(m_objGetDowngradeOptionsAPIPacket);
}

function ProcessPresentProductPriceAPI() : int
{
	var iErrorCode : int = 0;
	if(m_objPresentPackagePriceAPIPacket.m_strResponseCode == "200 OK")
	{
		if(m_objPresentPackagePriceAPIPacket.m_strOutput != "") //output aaya
		{	
			m_objPresentPackagePriceAPIPacket.m_strErrorMessage = ParseResponseForPackagesScreen("GetCommercialProductPriceById", m_objPresentPackagePriceAPIPacket.m_strOutput);
			
			if(m_objPresentPackagePriceAPIPacket.m_strErrorMessage != "") //invalid output aaya
			{
				//Debug.Log("GetCommercialProductPriceById : Invalid Response Aaya");
				//g_bHault = true;
				
				m_objPresentPackagePriceAPIPacket.InitPrompt("Server Error","::PresentProductPriceAPI() - Invalid Response");
				iErrorCode = -1;
			}
			else //valid output aaya
			{
				//Debug.Log("GetCommercialProductPriceById : Valid Response Aaya");
				
				//set the flag to false so that this if condition isn;t called with every OnGUI
				//m_objPresentPackagePriceAPIPacket.m_bResponseReceived = false;
				
				iErrorCode = 1;
			}
		}
		else //khaali output
		{
			//message in the mid: 
			//Debug.Log("GetCommercialProductPriceById : Khaali Response Aaya");							
			//g_bHault = true;
			m_objPresentPackagePriceAPIPacket.InitPrompt("Server Error","::PresentProductPriceAPI() - Null Response");
			iErrorCode = 0;
		}
	}
	else //other than 200 OK
	{
		//Debug.Log("GetCommercialProductPriceById : http error aa gayi");
		//g_bHault = true;
		m_objPresentPackagePriceAPIPacket.InitPrompt("Connection Error","::PresentProductPriceAPI() - " + m_objPresentPackagePriceAPIPacket.m_strResponseCode);
		iErrorCode = 300;
	}
	return iErrorCode;
}

function ProcessPresentProductToChannelInfoAPI() : int
{
	var iErrorCode : int = 0;
	//Packages Screen - API No. 02
	if(m_objPresentPackageChannelInfoAPIPacket.m_strResponseCode == "200 OK")
	{
		if(m_objPresentPackageChannelInfoAPIPacket.m_strOutput != "") //output aaya
		{
			
			m_objPresentPackageChannelInfoAPIPacket.m_strErrorMessage = ParseResponseForPackagesScreen("ProductToChannelInfo", m_objPresentPackageChannelInfoAPIPacket.m_strOutput);
			
			if(m_objPresentPackageChannelInfoAPIPacket.m_strErrorMessage != "") //invalid output aaya
			{
				//Debug.Log("ProductToChannelInfo : Invalid Response Aaya");
				//g_bHault = true;
				
				m_objPresentPackageChannelInfoAPIPacket.InitPrompt("Server Error","::ProductToChannelInfo() - Invalid Response");
				iErrorCode = -1;
			}
			else //valid output aaya
			{
				//Debug.Log("ProductToChannelInfo : Valid Response Aaya");
				
				//set the flag to false so that this if condition isn;t called with every OnGUI
				//m_objPresentPackageChannelInfoAPIPacket.m_bResponseReceived = false;
				
				iErrorCode = 1;
			}
		}
		else //khaali output
		{
			//message in the mid: 
			//Debug.Log("ProductToChannelInfo : Khaali Response Aaya");
			//g_bHault = true;
			
			m_objPresentPackageChannelInfoAPIPacket.InitPrompt("Server Error","::ProductToChannelInfo() - Null Response");
			iErrorCode = 0;
		}
	}
	else //other than 200 OK
	{
		//Debug.Log("ProductToChannelInfo : HTTP Error Aayi");
		//g_bHault = true;
		
		m_objPresentPackageChannelInfoAPIPacket.InitPrompt("Connection Error","::ProductToChannelInfo() - " + m_objPresentPackageChannelInfoAPIPacket.m_strResponseCode);
		iErrorCode = 300;
	}
	return iErrorCode;
}

function ProcessGetUpgradeOptionsAPI()	:	int
{
	var iErrorCode : int = 0;

	if(m_objGetUpgradeOptionsAPIPacket.m_strResponseCode == "200 OK")
	{
		if(m_objGetUpgradeOptionsAPIPacket.m_strOutput != "") //output aaya
		{
			
			m_objGetUpgradeOptionsAPIPacket.m_strErrorMessage = ParseResponseForPackagesScreen("GetUpgradeOptions", m_objGetUpgradeOptionsAPIPacket.m_strOutput);
			
			if(m_objGetUpgradeOptionsAPIPacket.m_strErrorMessage != "") //invalid output aaya
			{
				//Debug.Log("GetUpgradeOptions : Invalid Response Aaya");
				//g_bHault = true;
				
				m_objGetUpgradeOptionsAPIPacket.InitPrompt("Server Error","::ProcessGetUpgradeOptionsAPI() - Invalid Response");
				iErrorCode = -1;
			}
			else //valid output aaya
			{
				//Debug.Log("GetUpgradeOptions : Valid Response Aaya");
				
				//set the flag to false so that this if condition isn;t called with every OnGUI
				//m_objGetUpgradeOptionsAPIPacket.m_bResponseReceived = false;
				
				iErrorCode = 1;
			}
		}
		else //khaali output
		{
			//message in the mid: 
			//Debug.Log("GetUpgradeOptions : Khaali Response Aaya");
			//g_bHault = true;
			
			m_objGetUpgradeOptionsAPIPacket.InitPrompt("Server Error","::ProcessGetUpgradeOptionsAPI() - Null Response");
			iErrorCode = 0;
		}
	}
	else //other than 200 OK
	{
		//Debug.Log("GetUpgradeOptions : HTTP Error Aayi");
		//g_bHault = true;
		
		m_objGetUpgradeOptionsAPIPacket.InitPrompt("Connection Error","::ProcessGetUpgradeOptionsAPI() - " + m_objGetUpgradeOptionsAPIPacket.m_strResponseCode);
		iErrorCode = 300;
	}
	return iErrorCode;
}

function ProcessGetDowngradeOptionsAPI()
{
	var iErrorCode : int = 0;

	if(m_objGetDowngradeOptionsAPIPacket.m_strResponseCode == "200 OK")
	{
		if(m_objGetDowngradeOptionsAPIPacket.m_strOutput != "") //output aaya
		{
			
			m_objGetDowngradeOptionsAPIPacket.m_strErrorMessage = ParseResponseForPackagesScreen("GetDowngradeOptions", m_objGetDowngradeOptionsAPIPacket.m_strOutput);
			
			if(m_objGetDowngradeOptionsAPIPacket.m_strErrorMessage != "") //invalid output aaya
			{
				//Debug.Log("GetDowgradeOptions : Invalid Response Aaya");
				
				m_objGetDowngradeOptionsAPIPacket.InitPrompt("Server Error","::ProcessGetDowngradeOptionsAPI() - Invalid Response");
				iErrorCode = -1;
			}
			else //valid output aaya
			{
				//Debug.Log("GetDowgradeOptions : Valid Response Aaya");
				//m_objGetDowngradeOptionsAPIPacket.m_bResponseReceived = false;
				m_iPrefetchingStepsCompleted = 1;
				//Application.LoadLevel("SceneHomePage");
				iErrorCode = 1;
			}
		}
		else //khaali output
		{
			//message in the mid: 
			//Debug.Log("GetDowgradeOptions : Khaali Response Aaya");
			
			m_objGetDowngradeOptionsAPIPacket.InitPrompt("Server Error","::ProcessGetDowngradeOptionsAPI() - NULL Response");
			iErrorCode = 0;
		}
	}
	else //other than 200 OK
	{
		//Debug.Log("GetDowgradeOptions : HTTP Error Aayi");

		m_objGetDowngradeOptionsAPIPacket.InitPrompt("Connection Error","::ProcessGetDowngradeOptionsAPI() - " + m_objGetDowngradeOptionsAPIPacket.m_strResponseCode);
		iErrorCode = 300;
	}
	return iErrorCode;
}

function ParseResponseForPackagesScreen(strAPI : String, strResponse : String) : String
{
	var N = JSON.Parse(strResponse);
	
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
		
		switch(strAPI)
		{
			case "GetCommercialProductPriceById":
				//Debug.Log("GetCommercialProductPriceById Parsing started...");
				ParsePresentProductPrice(strResponse);
				break;
				
			case "ProductToChannelInfo":
				//Debug.Log("ProductToChannelInfo Parsing started...");
				ParsePresentProductToChannelInfo(strResponse);
				break;
				
			case "GetUpgradeOptions":
				//Debug.Log("GetUpgradeOptions Parsing started...");
				ParseGetUpgradeOptions(strResponse);
				break;
				
			case "GetDowngradeOptions":
				//Debug.Log("GetDowngradeOptions Parsing started...");
				ParseGetDowngradeOptions(strResponse);
				break;
				
			default:
				//Debug.Log("default case: ParseResponseForPackagesScreen()");
				break;
				
		}	
		return "";
	}
}

function ParsePresentProductPrice(strResponse : String)
{
	var N = JSON.Parse(strResponse);

	m_strPresentPackPrice = N["GetCommercialProductPriceByIdResult"];
	PlayerPrefs.SetString("PresentPackagePrice",m_strPresentPackPrice);
}

function ParsePresentProductToChannelInfo(strResponse : String)
{
	var N = JSON.Parse(strResponse);
	
	while(N[m_iCountChannelsInPresentPack] != null)
	{
		m_iCountChannelsInPresentPack++;
	}
	
	//Debug.Log("Total Channels In Present Package : " + m_iCountChannelsInPresentPack);
	
	for(var j=0; j<m_iCountChannelsInPresentPack; j++)
	{
		m_listChannelsInPresentPack.Add(new CChannelInfo());
		m_listChannelsInPresentPack[j].strServiceName 	= N[j]["ServiceId"];
		m_listChannelsInPresentPack[j].strChannelName 	= N[j]["channelName"];
		m_listChannelsInPresentPack[j].strImageName 	= N[j]["ImageId"];
		m_listChannelsInPresentPack[j].strGenreId 		= N[j]["GenreId"];
		m_listChannelsInPresentPack[j].strGenreName 	= N[j]["GenreName"];
        	
		/*
		Debug.Log(	"Channel No. " + j + 
				" Service Id : " + m_listChannelsInPresentPack[j].strServiceName + 
				" Channel Name : " + m_listChannelsInPresentPack[j].strChannelName +
				" Image Name : " + m_listChannelsInPresentPack[j].strImageName +
				" Genre Id : " + m_listChannelsInPresentPack[j].strGenreId +
				" Genre Name : " + m_listChannelsInPresentPack[j].strGenreName
			);
		*/
	}

}

function ParseGetUpgradeOptions(strResponse : String)
{
	var N = JSON.Parse(strResponse);
	
	//capture API exception
	var strIsException	:	String	=	N["exceptionStatus"];
	if(strIsException != null)
	{
		if(strIsException == "true")
		{
			m_strUpgradeOptionsAPIException	=	N["message"];
			return;
		}
	}
	
	while(N["UpgradeDowngradeProduct"][m_iCountUpgradePacks] != null)
	{
	 	m_iCountUpgradePacks++;
	}
	
	//Debug.Log("Total Upgrade Options : " + m_iCountUpgradePacks);
	
	for(var j=0; j<m_iCountUpgradePacks; j++)
	{
		m_listUpgradeOptions.Add(new CUpgradeOption());
		m_listUpgradeOptions[j].m_strProductID	= N["UpgradeDowngradeProduct"][j]["productId"];
		m_listUpgradeOptions[j].m_strProductName	= N["UpgradeDowngradeProduct"][j]["productName"];
		m_listUpgradeOptions[j].m_strMinBalance	=	N["UpgradeDowngradeProduct"][j]["minBalance"];
		
		//Debug.Log("Upgrade Product No. " + j + " Id : " + m_listUpgradeOptions[j].m_strProductID + " Name : " + m_listUpgradeOptions[j].m_strProductName);
		
		//Get price of this Upgradeable product : GetCommercialProductPriceById API
		HitGetProductPriceByIdAPI(m_listUpgradeOptions[j].m_strProductID, j, true);
		
		//Get total no. of channels and name|id|image of each of the channel in this upgradeable product
		HitProductToChannelInfo(m_listUpgradeOptions[j].m_strProductID, j, true);
		
		//Get total no. of free add-ons of this Upgradeable product : GetAddOnsForSCardAtUpgradeDowngrade
		HitGetAddOns(m_listUpgradeOptions[j].m_strProductID, j, true, "false", "ALL");
	}
}

function ParseGetDowngradeOptions(strResponse : String)
{
	var N = JSON.Parse(strResponse);
	
	//capture API exception
	var strIsException	:	String	=	N["exceptionStatus"];
	if(strIsException != null)
	{
		if(strIsException == "true")
		{
			m_strDowngradeOptionsAPIException	=	N["message"];
			return;
		}
	}
	
	while(N["UpgradeDowngradeProduct"][m_iCountDowngradePacks] != null)
	{
	 	m_iCountDowngradePacks++;
	}
	
	//Debug.Log("Total Downgrade Options : " + m_iCountDowngradePacks);

	for(var j=0; j<m_iCountDowngradePacks; j++)
	{
		m_listDowngradeOptions.Add(new CDowngradeOption());
		m_listDowngradeOptions[j].m_strProductID	=	N["UpgradeDowngradeProduct"][j]["productId"];
		m_listDowngradeOptions[j].m_strProductName	=	N["UpgradeDowngradeProduct"][j]["productName"];
		m_listDowngradeOptions[j].m_strMinBalance	=	N["UpgradeDowngradeProduct"][j]["minBalance"];

		//Debug.Log("Downgrade Product No. " + j + " Id : " + m_listDowngradeOptions[j].m_strProductID + " Name : " + m_listDowngradeOptions[j].m_strProductName);
		
		//Get price of this Upgradeable product : GetCommercialProductPriceById API
		HitGetProductPriceByIdAPI(m_listDowngradeOptions[j].m_strProductID, j, false);
		
		//Get total no. of channels and name|id|image of each of the channel in this upgradeable product
		HitProductToChannelInfo(m_listDowngradeOptions[j].m_strProductID, j, false);
		
		//Get total no. of free add-ons of this Downgradeable product : GetAddOnsForSCardAtUpgradeDowngrade
		HitGetAddOns(m_listDowngradeOptions[j].m_strProductID, j, false, "false", "ALL");
	}
}

function HitGetProductPriceByIdAPI(strProductID : String, iIndex : int, bIsUpgradeable : boolean)
{
	//Price of the Product/Package
	var strAPIURL = ScriptAPIs.g_strWebservicesAtD2H + "MobileEPGServices/";
    var strAPIMethod = "MobileEPGService.UpgradeDowngradeService.svc/Method/GetCommercialProductPriceById";
    var strInput = "{\"BasePackageId\":\"" + strProductID + "\"}";

    //Debug.Log("HitGetProductPriceByIdAPI : " + strAPIURL + strAPIMethod + " - " + strInput);
    
    if(bIsUpgradeable)    
    {
    	m_listUpgradeOptions[iIndex].m_objGetCommercialProductPriceAPIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    	g_objScriptAPIHandler.InvokeReSTfulAPI(m_listUpgradeOptions[iIndex].m_objGetCommercialProductPriceAPIPacket);
    }
    else
    {
    	m_listDowngradeOptions[iIndex].m_objGetCommercialProductPriceAPIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
    	g_objScriptAPIHandler.InvokeReSTfulAPI(m_listDowngradeOptions[iIndex].m_objGetCommercialProductPriceAPIPacket);
    }
}

function ParseGetProductPriceByIdResponse(strResponse : String, iIndex : int, bIsUpgradeable : boolean)
{
	var N = JSON.Parse(strResponse);
	
	if(N == null)
	{
		//g_strPopUpMessage = "NULL JSON";
		
		if(bIsUpgradeable)
			m_listUpgradeOptions[iIndex].m_objGetCommercialProductPriceAPIPacket.m_strErrorMessage = "Infinity Error : Unable to get info from the server";
		else
			m_listDowngradeOptions[iIndex].m_objGetCommercialProductPriceAPIPacket.m_strErrorMessage = "Infinity Error : Unable to get info from the server";
		
		return;
	}
	else
	{
		//Debug.Log("Reassembled: " + N.ToString());
		if(N.ToString() == "{}")
		{
			//g_strPopUpMessage = "Empty JSON";
			
			if(bIsUpgradeable)
				m_listUpgradeOptions[iIndex].m_objGetCommercialProductPriceAPIPacket.m_strErrorMessage = "Infinity Error : Blank info returned by the server";
			else
				m_listDowngradeOptions[iIndex].m_objGetCommercialProductPriceAPIPacket.m_strErrorMessage = "Infinity Error : Blank info returned by the server";
			
			return;
		}
		
		if(bIsUpgradeable)
		{
			m_listUpgradeOptions[iIndex].m_strProductPrice = N["GetCommercialProductPriceByIdResult"];
			//Debug.Log("Price of " + m_listUpgradeOptions[iIndex].m_strProductName + " is : " + m_listUpgradeOptions[iIndex].m_strProductPrice);
		}
		else
		{
			m_listDowngradeOptions[iIndex].m_strProductPrice = N["GetCommercialProductPriceByIdResult"];
			//Debug.Log("Price of " + m_listDowngradeOptions[iIndex].m_strProductName + " is : " + m_listDowngradeOptions[iIndex].m_strProductPrice);
		}
	}
}

function HitProductToChannelInfo(strProductID : String, iIndex : int, bIsUpgradeable : boolean)
{
	// No. & Name of channels in the Product/Package
    var strAPIURL = ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
    var strAPIMethod = "product/ProductToChannelInfo";
    var strInput = "{\"productId\":\"" + strProductID + "\"}";
    
    //Debug.Log("HitProductToChannelInfo : " + strAPIURL + strAPIMethod + " - " + strInput);
    if(bIsUpgradeable)    
	{
		m_listUpgradeOptions[iIndex].m_objProductToChannelInfoAPIPacket = new CWebAPIPacket(strAPIURL, strAPIMethod, strInput);
    	g_objScriptAPIHandler.InvokeReSTfulAPI(m_listUpgradeOptions[iIndex].m_objProductToChannelInfoAPIPacket);
    }
    else
    {
    	m_listDowngradeOptions[iIndex].m_objProductToChannelInfoAPIPacket = new CWebAPIPacket(strAPIURL, strAPIMethod, strInput);
    	g_objScriptAPIHandler.InvokeReSTfulAPI(m_listDowngradeOptions[iIndex].m_objProductToChannelInfoAPIPacket);
    }
}

function ParseProductToChannelInfoResponse(strResponse : String, iIndex : int, bIsUpgradeable : boolean)
{
	//return;
	var N = JSON.Parse(strResponse);
	
	if(N == null)
	{
		//g_strPopUpMessage = "NULL JSON";
		if(bIsUpgradeable)
			m_listUpgradeOptions[iIndex].m_objProductToChannelInfoAPIPacket.m_strErrorMessage = "Infinity Error : Unable to get info from the server";
		else
			m_listDowngradeOptions[iIndex].m_objProductToChannelInfoAPIPacket.m_strErrorMessage = "Infinity Error : Unable to get info from the server";
		return;
	}
	else
	{
		//Debug.Log("Reassembled: " + N.ToString());
		if(N.ToString() == "{}")
		{
			//g_strPopUpMessage = "Empty JSON";
			if(bIsUpgradeable)
				m_listUpgradeOptions[iIndex].m_objProductToChannelInfoAPIPacket.m_strErrorMessage = "Infinity Error : Blank info returned by the server";
			else
				m_listDowngradeOptions[iIndex].m_objProductToChannelInfoAPIPacket.m_strErrorMessage = "Infinity Error : Blank info returned by the server";
			return;
		}
		
		if(bIsUpgradeable)
		{
			while(N[m_listUpgradeOptions[iIndex].m_iChannelsCount] != null)
			{
				m_listUpgradeOptions[iIndex].m_iChannelsCount++;
			}
			
			//Debug.Log("Total Channels In Upgradeable Package " +m_listUpgradeOptions[iIndex].m_strProductID+ " is : " + m_listUpgradeOptions[iIndex].m_iChannelsCount);
			
			m_listUpgradeOptions[iIndex].m_objListChannels = new List.<CChannelInfo>();
			for(var j=0; j<m_listUpgradeOptions[iIndex].m_iChannelsCount; j++)
			{
				m_listUpgradeOptions[iIndex].m_objListChannels.Add(new CChannelInfo());
				m_listUpgradeOptions[iIndex].m_objListChannels[j].strServiceName = N[j]["ServiceId"];
				m_listUpgradeOptions[iIndex].m_objListChannels[j].strChannelName = N[j]["channelName"];
				m_listUpgradeOptions[iIndex].m_objListChannels[j].strImageName 	= N[j]["ImageId"];
				m_listUpgradeOptions[iIndex].m_objListChannels[j].strGenreId 	= N[j]["GenreId"];
				m_listUpgradeOptions[iIndex].m_objListChannels[j].strGenreName 	= N[j]["GenreName"];
				
				/*Debug.Log(	"Channel No. " + j + 
						" Service Id : " + m_listUpgradeOptions[iIndex].m_objListChannels[j].strServiceName + 
						" Channel Name : " + m_listUpgradeOptions[iIndex].m_objListChannels[j].strChannelName +
						" Image Name : " + m_listUpgradeOptions[iIndex].m_objListChannels[j].strImageName +
						" Genre Id : " + m_listUpgradeOptions[iIndex].m_objListChannels[j].strGenreId +
						" Genre Name : " + m_listUpgradeOptions[iIndex].m_objListChannels[j].strGenreName
					);*/
			}
		}
		else
		{
			while(N[m_listDowngradeOptions[iIndex].m_iChannelsCount] != null)
			{
				m_listDowngradeOptions[iIndex].m_iChannelsCount++;
			}
			
			//Debug.Log("Total Channels In Downgradeable Package " +m_listDowngradeOptions[iIndex].m_strProductID+ " is : " + m_listDowngradeOptions[iIndex].m_iChannelsCount);
			
			m_listDowngradeOptions[iIndex].m_objListChannels = new List.<CChannelInfo>();
			for(j=0; j<m_listDowngradeOptions[iIndex].m_iChannelsCount; j++)
			{
				m_listDowngradeOptions[iIndex].m_objListChannels.Add(new CChannelInfo());
				m_listDowngradeOptions[iIndex].m_objListChannels[j].strServiceName = N[j]["ServiceId"];
				m_listDowngradeOptions[iIndex].m_objListChannels[j].strChannelName = N[j]["channelName"];
				m_listDowngradeOptions[iIndex].m_objListChannels[j].strImageName   = N[j]["ImageId"];
				m_listDowngradeOptions[iIndex].m_objListChannels[j].strGenreId	  = N[j]["GenreId"];
				m_listDowngradeOptions[iIndex].m_objListChannels[j].strGenreName   = N[j]["GenreName"];
				
				/*Debug.Log(	"Channel No. " + j + 
						" Service Id : " + m_listDowngradeOptions[iIndex].m_objListChannels[j].strServiceName + 
						" Channel Name : " + m_listDowngradeOptions[iIndex].m_objListChannels[j].strChannelName +
						" Image Name : " + m_listDowngradeOptions[iIndex].m_objListChannels[j].strImageName +
						" Genre Id : " + m_listDowngradeOptions[iIndex].m_objListChannels[j].strGenreId +
						" Genre Name : " + m_listDowngradeOptions[iIndex].m_objListChannels[j].strGenreName
					);*/
			}
		}
	}
}

function HitGetAddOns(strProductID : String, iIndex : int, bIsUpgradeable : boolean, strIsMirror : String, strMode : String)
{
	// API to hit paid or free addons for the specified ProductID
    var strAPIURL = ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
    var strAPIMethod = "product/getAddonsForScardAtUpgradeDowngrade";
    var strInput = "{\"uuId\":\"" + ScriptMainPage.gs_strUUID + "\",\"sCNumberField\":\"" + ScriptMainPage.gs_strSCNumberField + "\",\"queryProductId\":\"" + strProductID + "\",\"isMirror\":\"" + strIsMirror + "\",\"mode\":\"" + strMode + "\"}";
    
    //Debug.Log("HitGetAddOns : " + strAPIURL + strAPIMethod + " - " + strInput);
    
    if(iIndex != -1) // agar present package ka add-on nahi nikalna
    {
	    if(bIsUpgradeable)    
		{
			m_listUpgradeOptions[iIndex].m_objGetAddOnsAPIPacket = new CWebAPIPacket(strAPIURL, strAPIMethod, strInput);
	    	g_objScriptAPIHandler.InvokeReSTfulAPI(m_listUpgradeOptions[iIndex].m_objGetAddOnsAPIPacket);
	    }
	    else
	    {
	    	m_listDowngradeOptions[iIndex].m_objGetAddOnsAPIPacket = new CWebAPIPacket(strAPIURL, strAPIMethod, strInput);
	    	g_objScriptAPIHandler.InvokeReSTfulAPI(m_listDowngradeOptions[iIndex].m_objGetAddOnsAPIPacket);
	    }
	}
	else // agar present package ka add-on nikalna hai
	{
		//Debug.Log("Humare case mein Paid-Ons wali screen ke liye API hit karni hogi");
	}
}

function ParseGetAddOnsResponse(strResponse : String, iIndex : int, bIsUpgradeable : boolean)
{
	if(bIsUpgradeable)
	{
		if(m_listUpgradeOptions[iIndex].m_objGetAddOnsAPIPacket.m_strResponseCode != "200 OK")
		{
			m_listUpgradeOptions[iIndex].m_objGetAddOnsAPIPacket.m_strErrorMessage	=	"Infinity Error ::AddOnsAPI() - " + m_listUpgradeOptions[iIndex].m_objGetAddOnsAPIPacket.m_strResponseCode;
			return;
		}
	}
	else
	{
		if(m_listDowngradeOptions[iIndex].m_objGetAddOnsAPIPacket.m_strResponseCode != "200 OK")
		{
			m_listDowngradeOptions[iIndex].m_objGetAddOnsAPIPacket.m_strErrorMessage	=	"Infinity Error ::AddOnsAPI() - " + m_listDowngradeOptions[iIndex].m_objGetAddOnsAPIPacket.m_strResponseCode;
			return;
		}
	}
	var N = JSON.Parse(strResponse);
	
	if(N == null)
	{
		//g_strPopUpMessage = "NULL JSON";
		if(bIsUpgradeable)
			m_listUpgradeOptions[iIndex].m_objGetAddOnsAPIPacket.m_strErrorMessage = "Infinity Error : Unable to get info from the server";
		else
			m_listDowngradeOptions[iIndex].m_objGetAddOnsAPIPacket.m_strErrorMessage = "Infinity Error : Unable to get info from the server";
			
		return;
	}
	else
	{
		//Debug.Log("Reassembled: " + N.ToString());
		if(N.ToString() == "{}")
		{
			//g_strPopUpMessage = "Empty JSON";
			
			if(bIsUpgradeable)
				m_listUpgradeOptions[iIndex].m_objGetAddOnsAPIPacket.m_strErrorMessage = "Infinity Error : Blank info returned by the server";
			else
				m_listDowngradeOptions[iIndex].m_objGetAddOnsAPIPacket.m_strErrorMessage = "Infinity Error : Blank info returned by the server";
			
			return;
		}
		
		var strMessage = N["message"];
		if(strMessage.Value == "API not working")
		{
			m_listUpgradeOptions[iIndex].m_objGetAddOnsAPIPacket.m_strErrorMessage	=	"Error 401 : " + strMessage;
			//Debug.Log("Error 401 : " + strMessage);
			return;
		}
		
		
		if(bIsUpgradeable)
		{
			m_listUpgradeOptions[iIndex].m_iMinAddOns = parseInt(N["minPackages"]);
			m_listUpgradeOptions[iIndex].m_iMaxAddOns = parseInt(N["maxPackages"]);
			
			var iAddOnsCount = 0;
			while(N["AddonList"][iAddOnsCount] != null)
			{
				iAddOnsCount++;
			}
			m_listUpgradeOptions[iIndex].m_iAddOnsCount = iAddOnsCount;
			
			//Debug.Log("Total AddOns In Upgradeable Package " +m_listUpgradeOptions[iIndex].m_strProductID+ " is : " + m_listUpgradeOptions[iIndex].m_iAddOnsCount);

			m_listUpgradeOptions[iIndex].m_objListAddOns = new List.<CAddOn>();
			
			for(var j=0; j<m_listUpgradeOptions[iIndex].m_iAddOnsCount; j++)
			{
				m_listUpgradeOptions[iIndex].m_objListAddOns.Add(new CAddOn());
				m_listUpgradeOptions[iIndex].m_objListAddOns[j].m_strAddOnID = N["AddonList"][j]["ID"];
				m_listUpgradeOptions[iIndex].m_objListAddOns[j].m_strAddOnName = N["AddonList"][j]["Name"];
				m_listUpgradeOptions[iIndex].m_objListAddOns[j].m_strAddOnPrice = N["AddonList"][j]["Price"];
				
				if(parseFloat(m_listUpgradeOptions[iIndex].m_objListAddOns[j].m_strAddOnPrice) > 0.0)
				{
					m_listUpgradeOptions[iIndex].m_objListAddOns[j].m_bIsAddOnFree	=	false;
				}
				else
				{
					m_listUpgradeOptions[iIndex].m_objListAddOns[j].m_bIsAddOnFree	=	true;
				}
			}
		}
		else
		{
			m_listDowngradeOptions[iIndex].m_iMinAddOns = parseInt(N["minPackages"]);
			m_listDowngradeOptions[iIndex].m_iMaxAddOns = parseInt(N["maxPackages"]);
			
			while(N["AddonList"][m_listDowngradeOptions[iIndex].m_iAddOnsCount] != null)
			{
				m_listDowngradeOptions[iIndex].m_iAddOnsCount++;
			}
			
			//Debug.Log("Total AddOns In Downgradeable Package " +m_listDowngradeOptions[iIndex].m_strProductID+ " is : " + m_listDowngradeOptions[iIndex].m_iAddOnsCount);
			
			m_listDowngradeOptions[iIndex].m_objListAddOns = new List.<CAddOn>();
			
			for(j=0; j<m_listDowngradeOptions[iIndex].m_iAddOnsCount; j++)
			{
				m_listDowngradeOptions[iIndex].m_objListAddOns.Add(new CAddOn());
				m_listDowngradeOptions[iIndex].m_objListAddOns[j].m_strAddOnID = N["AddonList"][j]["ID"];
				m_listDowngradeOptions[iIndex].m_objListAddOns[j].m_strAddOnName = N["AddonList"][j]["Name"];
				m_listDowngradeOptions[iIndex].m_objListAddOns[j].m_strAddOnPrice = N["AddonList"][j]["Price"];
				
				if(parseFloat(m_listDowngradeOptions[iIndex].m_objListAddOns[j].m_strAddOnPrice) > 0.0)
				{
					m_listDowngradeOptions[iIndex].m_objListAddOns[j].m_bIsAddOnFree	=	false;
				}
				else
				{
					m_listDowngradeOptions[iIndex].m_objListAddOns[j].m_bIsAddOnFree	=	true;
				}
			}
		}
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

function Identify(strClickedOn : String) {
	var strDeviceType : String  = "Android";
	var objHeaders : Hashtable = new Hashtable();
	objHeaders.Add("Content-Type","application/json");
	var customerId = PlayerPrefs.GetString("CustomerId");
	var emailId = PlayerPrefs.GetString("EmailId");
	var balance = PlayerPrefs.GetString("Balance");
	var nextRechargeDate = PlayerPrefs.GetString("NextRechargeDate");
	//var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"email\":\"" + emailId + "\",\"balance\":\"" + balance +"\",\"nextRechargeDate\":\"" + nextRechargeDate +"\",\"event\":\"" + strClickedOn + "\"}";
	var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"traits\":{\"email\":\"" + emailId + "\",\"description\":\""+ balance +"\",\"createdAt\":\"" + nextRechargeDate +"\",\"Name\":\"" + strClickedOn + "\",\"DeviceType\":\"" + strDeviceType +"\"}}";
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
