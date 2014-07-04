#pragma strict
import UnityEngine;
import System.Collections;
import com.shephertz.app42.paas.sdk.csharp;
import com.shephertz.app42.paas.sdk.csharp.pushNotification;
//lokesh
class CChannelSchedule
{
	var strEventId	:	String;
	var strEventName:	String;
	var strStartDate:	String;
	var strStartTime:	String;
	var strDuration	:	String;
	var strSynopsis	:	String;
	var bReminderSet:	boolean;
}
class CD2HCinemaChannels
{
	var strMovieName	:	String;
	var strChannelNo	:	String;
	var strShowDates	:	String;
	var strURL			:	String;
	var tex2DThumbnail	:	Texture2D;
}
class CChannelInfo
{
	var strServiceName	: String;
	var strImageName	: String;
	var strGenreId		: String;
	var strGenreName	: String;
	var strChannelName	: String;
	var strChannelId	: String;
	var iHaveSchedule	: int; //0: schedule not present	1: schedule present		2:	schedule fetching in progress
	var bIsFavourite	: boolean;
	var objListChannelSchedule	:	List.<CChannelSchedule>;
	function AddToScheduleList()
	{
		objListChannelSchedule.Add(new CChannelSchedule());
	}
}

var m_Tex2DFilterBackground		:	Texture2D;
var m_Tex2DFilterLeftArrow		:	Texture2D;
var m_Tex2DFilterRightArrow		:	Texture2D;
var m_Tex2DFilterIcon			:	Texture2D;
var m_Tex2DHeart				:	Texture2D;
var m_Tex2DVerticalDots			:	Texture2D;
//var m_Tex2DSearchLensIcon		:	Texture2D;
var m_Tex2DArrowNext			: 	Texture2D;
var m_Tex2DPause				: 	Texture2D;
var m_Tex2DArrowLeft			:	Texture2D;
var m_Tex2DArrowRight			:	Texture2D;
//var m_Tex2DArrowDown			:	Texture2D;
var m_Tex2DBorderLine			:	Texture2D;
//var m_Tex2DTwitterIcon			:	Texture2D;
//var m_Tex2DFacebookIcon			:	Texture2D;
var m_Tex2DVideoThumbnail		:	Texture2D;
var m_Tex2DPurple				:	Texture2D;
var m_Tex2DOrange				:	Texture2D;
var m_Tex2DPlayWhite			:	Texture2D;
var m_Tex2DPlayPurple			:	Texture2D;
var m_Tex2DTransparent			:	Texture2D;
var m_Tex2DPreviousWhite		:	Texture2D;
var m_Tex2DNextWhite			:	Texture2D;
var m_Tex2DPreviousPurple		:	Texture2D;
var m_Tex2DNextPurple			:	Texture2D;

var m_skinProgramGuide			:	GUISkin;
var m_skinTimeLineArrows		:	GUISkin;
var m_skinCustomerID			:	GUISkin;
var m_skinFilterButton			:	GUISkin;
var m_skinGenresGrid			:	GUISkin;
var m_skinRefreshButton			:	GUISkin;
var m_skinSearchGroup			: 	GUISkin;
var m_skinTimeColumnSearchBox	:	GUISkin;
var m_skinEPGEventDetails		:	GUISkin;
var m_skinEPGChannelsList		:	GUISkin;
var m_skinD2HCinemaHeader		:	GUISkin;
var m_skinD2HCinemaPlayer		:	GUISkin;
var m_skinD2HCinemaGetNowDiv	:	GUISkin;

var m_fontRegular				:	Font;
var m_fontBold					:	Font;

var m_iIndexOfActiveFilterItem	:	int;

var m_iIndexOfChannelTappedEvent	:	int;
var m_iIndexOfEventTappedEvent		:	int;
var m_iEventDetailPopUpFrameNo		:	int;
var m_bIsSwipeActive				:	boolean;

private var m_fSW					:	float;
private var m_fSH					:	float;
private var m_fAspectRatio			:	float;

static var g_iChannelCount				:	int;
static var g_objListChannelInfo			= new List.<CChannelInfo>();

static var g_objListD2HCinemaChannels	=	new List.<CD2HCinemaChannels>();
static var g_iD2HCinemaChannelCount		:	int;
var m_iIndexOfCurrentD2HCinemaChannel	:	int;
var m_bSlideShowOnForD2HCinema			:	boolean;
var m_strAddD2HCinemaResult				:	String;

var g_strGridItemsName			:	String[];
var g_strarrMonth				: 	String[];
var g_iRenderVideoPlayer		: 	int;
var g_iChannelIndexToAddToFav	: 	int;
var g_iChannelIndexToRemFromFav	:	int;
var m_bChannelToggleState		:	boolean[];
var m_bFilterToggleState		:	boolean[];

/*UI Layouting */
var m_bShowFilter						:	boolean;
var m_fDisplacementX					:	float;

var m_fWidthFilterDiv					:	float;
var m_fWidthTVGuideDiv					:	float;

var m_fWidthFilterButton				:	float;
var m_fHeightFilterButton				:	float;
var m_fHeightFilterOptions				:	float;
var m_fHeightSearchBox					:	float;

var m_fWidthTimeLineLeftArrowButton		:	float;
var m_fHeightTimeLineLeftArrowButton	:	float;

var m_fWidthTimeLineDiv					:	float;
var m_fWidthHalfHourSlot				:	float;
var m_fHeightTimeLineDiv				:	float;

var m_fWidthChannelIcon					:	float;
var m_fHeightChannelIcon				:	float;
//~lokesh

// Internal variables for managing touches and drags
private var m_fVelocityEPGInX 							:	float = 0f;
private var m_fVelocityFiltersInY 						:	float = 0f;
private var m_fVelocityEPGInY 							:	float = 0f;
private var m_fTimeStampWhenTouchPhaseEnded 			:	float = 0f;
private var m_fPreviousDeltaX 							:	float = 0f;
private var m_fPreviousDeltaY 							:	float = 0f;

private var m_iScrollDirectionX							:	int;

private var m_v2ScrollFiltersYAxis						: Vector2;
private var m_v2ScrollChannelThumbnailYAxis 			: Vector2;
private var m_v2ScrollScheduleXYAxis					: Vector2;
private var m_v2ScrollTimelineXAxis 					: Vector2;

var m_bInitializeTouchAreas					:	boolean;
var m_rectProgramGuideScreenScrollArea1		:	Rect;	//search box : time drop down
var m_rectProgramGuideScreenScrollArea2		:	Rect;	//program guide
var m_rectProgramGuideScreenScrollArea3		:	Rect;	//filter

var m_rectChannelsListViewPort				:	Rect;
var m_rectChannelsListFullScroll			:	Rect;

var m_rectEPGScheduleViewPort				:	Rect;
var m_rectEPGScheduleFullScroll				:	Rect;

// GUI Elements and Variables
private var g_strConnectionId 				: String;
var m_strCustomerId							:	String;
private var g_bShowTimeInDropDown			: boolean;

var	g_strListGenres							: String[];

var m_bGetNowPressed				:	boolean;
var m_strPassword					:	String = "Password Required";
var m_iD2HCinemaGetNowWindowScene	:	int;
var g_strSearch 	  				:	String = "Search";
var g_strTime						:	String[];
var g_strTimeColumn					:	String[];
var m_count							: 	int;
var m_lastStrGener					:	String;		
////////////////////////////////	2D Array	////////////////////////////////
//var g_strProgramName				:	String[,];
////////////////////////////////////////////////////////////////////////////////

private var m_v2ScrollSelectTime	:	Vector2;
private var g_strTimeshown			:	String;


function Start () 
{	Debug.Log(".....................hiii");
	g_strConnectionId = PlayerPrefs.GetString("ConnectionID");
	g_iRenderVideoPlayer = PlayerPrefs.GetInt("RenderVideoPlayer");
	m_strCustomerId = PlayerPrefs.GetString("CustomerId");
	m_count = 0;
	m_lastStrGener = "";
//	StartCoroutine(TrackEvent(0.25));
		
	g_objScriptAPIHandler = GetComponent(ScriptAPIHandler);
	
	m_bInitializeTouchAreas = false;
	m_bIsSwipeActive 		= false;
	m_fSW				=	Screen.width;
	m_fSH				=	Screen.height;
	m_fAspectRatio		=	m_fSW/m_fSH;
	m_bShowFilter		=	true;
	m_fDisplacementX	=	0.0;
	
	m_iScrollDirectionX	=	0;
	
	g_iChannelIndexToAddToFav = -1;
	g_iChannelIndexToRemFromFav = -1;
	
	m_iIndexOfChannelTappedEvent	=	-1;
	m_iIndexOfEventTappedEvent	=	-1;
	m_iEventDetailPopUpFrameNo	=	0;
	
	g_bShowTimeInDropDown = false;
	m_bGetNowPressed = false;
	
	m_iIndexOfCurrentD2HCinemaChannel	=	0;
	m_bSlideShowOnForD2HCinema	=	false;
	m_iD2HCinemaGetNowWindowScene = 0;
	
	m_strAddD2HCinemaResult	=	"Please wait...";
	
	g_strarrMonth = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
			
	InitFilterToggleState();
	ResetStateOfRestFilterToggles(0);
	m_iIndexOfActiveFilterItem	=	4;
	
	if(g_iChannelCount > 0)
	{
		InitChannelToggleState();
		//GetScheduleForAllChannels();
	}
	else
	{
		if(IsFreshListChannelsPresentInCache())
		{
			StartCoroutine(LoadListChannelsFromCache(1.0));
		}
		else
		{
			StartCoroutine(DownloadListChannels(1.0));
		}
	}
	
	if(g_iD2HCinemaChannelCount == 0)
		StartCoroutine(GetD2HCinemaDetails(1.0));
	
}

function DownloadListChannels(fWaitTime	:	float)
{
	/******Get All Channels Schedule *******/
	yield	WaitForSeconds(fWaitTime);
	//hit API and get all the channels info n schedule for present package:
	var strPackageId = "-1";
	//var strPackageId = PlayerPrefs.GetString("PresentPackageId"); 
	var strInput = "{\"genreId\":\"-1\",\"productId\":\""+strPackageId+"\"}"; 
	var strAPI = "epg/getAllEpgByGenre";
	InvokeReSTfulAPI(strAPI,strInput,-1);
}

function DownloadRemainingSchedule(fWaitTime	:	float)
{
	yield	WaitForSeconds(fWaitTime);
	
	for(var j=0; j<g_iChannelCount; j++)
	{
		if(g_objListChannelInfo[j].iHaveSchedule == 0)
		{
			InvokeReSTfulAPI("epg/getChannelSchedule","{\"serviceId\":\""+g_objListChannelInfo[j].strServiceName+"\",\"scheduleDays=\":\"2\"}",j);
		}
	}
}

function GetD2HCinemaDetails(fWaitTime	:	float)
{
	/******Get All Channels Schedule *******/
	yield	WaitForSeconds(fWaitTime);
	//hit API and get all d2h cinema channels info n schedule:
	var strUUID	:	String	=	PlayerPrefs.GetString("DeviceUID");
	var strInput = "{\"uuId\":\""+strUUID+"\"}"; 
	var strAPI = "product/GetD2HCinemaDetails";
	InvokeReSTfulAPI(strAPI,strInput,-1);
}

function AddD2HCinema(fWaitTime	:	float)
{
	/******Get All Channels Schedule *******/
	yield	WaitForSeconds(fWaitTime);
	//hit API and get all d2h cinema channels info n schedule:
	var strUUID	:	String	=	PlayerPrefs.GetString("DeviceUID");
	var strInput = "{\"uuId\":\""+strUUID+"\",\"sCNumberField\":\""+g_strConnectionId+"\"}"; 
	var strAPI = "product/AddD2HCinema";
	InvokeReSTfulAPI(strAPI,strInput,-1);
}

function CacheDumpListChannel(strResponse	:	String)
{
	PlayerPrefs.SetString("EPGAllChannelsList", strResponse);
}

function CacheDumpScheduleByChannel(strResponse, iChannelIndex)
{
	var strChannelNameAsKeyForSchedule	:	String	=	g_objListChannelInfo[iChannelIndex].strServiceName;
	
	var strTodaysDate				:	String 	=	System.DateTime.Today.ToString("d");
	var strChannelLastCachedDate	:	String	=	strChannelNameAsKeyForSchedule + "_" + "LastCachedDate";
	
	PlayerPrefs.SetString(strChannelNameAsKeyForSchedule, strResponse);
	PlayerPrefs.SetString(strChannelLastCachedDate, strTodaysDate);
}

function IsFreshListChannelsPresentInCache()	:	boolean
{
	if(PlayerPrefs.HasKey("EPGAllChannelsList"))
	{
		return true;
	}
	else
	{
		return false;
	}
}

function LoadListChannelsFromCache(fWaitTime	:	float)
{
	yield	WaitForSeconds(fWaitTime);
	
	var strCachedJSON	:	String	=	PlayerPrefs.GetString("EPGAllChannelsList");
	
	var N = JSON.Parse(strCachedJSON);
	
	while(N["Data"][g_iChannelCount] != null)
	{
		g_objListChannelInfo.Add(new CChannelInfo());
		g_objListChannelInfo[g_iChannelCount].strServiceName 			=	N["Data"][g_iChannelCount]["SERVICE"];//for icons
		g_objListChannelInfo[g_iChannelCount].strGenreName 				=	N["Data"][g_iChannelCount]["GENRENAME"];
		g_objListChannelInfo[g_iChannelCount].strChannelName 			=	N["Data"][g_iChannelCount]["channelName"];
		g_objListChannelInfo[g_iChannelCount].objListChannelSchedule 	=	new List.<CChannelSchedule>();
	 	g_iChannelCount++;
	}
	InitChannelToggleState();	//initialize all to false
	
	//GetScheduleForAllChannels();
}

function GetScheduleForChannelByIndex(iIndex	:	int)
{
	var strChannelLastCachedDate	:	String	=	"";
	var strTodaysDate				:	String 	=	System.DateTime.Today.ToString("d");
	
	if(g_objListChannelInfo[iIndex].iHaveSchedule == 0)
	{
		//getting schedule
		g_objListChannelInfo[iIndex].iHaveSchedule	=	2;
		
		strChannelLastCachedDate	=	g_objListChannelInfo[iIndex].strServiceName + "_" + "LastCachedDate";
		
		if(IsFreshSchedulePresentInCache(strChannelLastCachedDate))
		{
			StartCoroutine(LoadScheduleFromCacheByChannelIndex(iIndex));
		}
		else
		{
			StartCoroutine(DownloadScheduleByChannelIndex(iIndex));
		}
	}
}

function GetScheduleForAllChannels()
{
	var strChannelLastCachedDate	:	String	=	"";
	var strTodaysDate				:	String 	=	System.DateTime.Today.ToString("d");
	for(var j=0; j<g_iChannelCount; j++)
	{	
		if(g_objListChannelInfo[j].iHaveSchedule == 0)
		{
			strChannelLastCachedDate	=	g_objListChannelInfo[j].strServiceName + "_" + "LastCachedDate";
		
			if(IsFreshSchedulePresentInCache(strChannelLastCachedDate))
			{
				StartCoroutine(LoadScheduleFromCacheByChannelIndex(j));
			}
			else
			{
				StartCoroutine(DownloadScheduleByChannelIndex(j));
			}
		}
	}
}

function IsFreshSchedulePresentInCache(strChannelLastCachedDateKey	:	String)	:	boolean
{
	var strLastCachedDate	:	String	=	PlayerPrefs.GetString(strChannelLastCachedDateKey);
	var strTodaysDate		:	String 	=	System.DateTime.Today.ToString("d");
	
	if(strLastCachedDate == strTodaysDate)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function LoadScheduleFromCacheByChannelIndex(iChannelIndex	:	int)
{
	yield WaitForSeconds(1.0);
	
	var strChannelNameAsKeyForSchedule	:	String;
	var strCachedScheduleJSON			:	String;
	
	strChannelNameAsKeyForSchedule	=	g_objListChannelInfo[iChannelIndex].strServiceName;
	strCachedScheduleJSON			=	PlayerPrefs.GetString(strChannelNameAsKeyForSchedule);
		
	ProcessScheduleByChannel(iChannelIndex, strCachedScheduleJSON);
}

function ProcessScheduleByChannel(iChannelIndex : int, strCachedScheduleJSON	:	String)
{	
	var N = JSON.Parse(strCachedScheduleJSON);
	
	var i : int = 0;
	
	var strProgramName : String = "";
	
	//aaj
	while(N["Data"]["Schedule"][0][i] != null)
	{
		g_objListChannelInfo[iChannelIndex].AddToScheduleList();
		
		strProgramName = N["Data"]["Schedule"][0][i][0]["NAME"];
		g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strEventName = strProgramName;
		
		g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strStartDate = N["Data"]["Schedule"][0][i][0]["START"]["DATE"];
		g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strStartTime = N["Data"]["Schedule"][0][i][0]["START"]["TIME"];
		
		g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strDuration  = N["Data"]["Schedule"][0][i][0]["DURATION"];
		
		g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strSynopsis  = N["Data"]["Schedule"][0][i][0]["SYNOPSIS"];
		
		////print("Channel: " + g_objListChannelInfo[iChannelIndex].strChannelName + " EventName: " + g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strEventName);
		i++;
	}
	
	//kal
	var k : int = 0;
	while(N["Data"]["Schedule"][1][k] != null)
	{
		g_objListChannelInfo[iChannelIndex].AddToScheduleList();
		
		strProgramName = N["Data"]["Schedule"][1][k][0]["NAME"];
		g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strEventName = strProgramName;
		
		g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strStartDate = N["Data"]["Schedule"][1][k][0]["START"]["DATE"];
		g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strStartTime = N["Data"]["Schedule"][1][k][0]["START"]["TIME"];
		
		g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strDuration  = N["Data"]["Schedule"][1][k][0]["DURATION"];
		
		g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strSynopsis  = N["Data"]["Schedule"][1][k][0]["SYNOPSIS"];
		
		////print("Channel: " + g_objListChannelInfo[iChannelIndex].strChannelName + " EventName: " + g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strEventName);
		i++;
		k++;
	}
	
	//parso
	var j : int = 0;
	while(N["Data"]["Schedule"][2][j] != null)
	{
		g_objListChannelInfo[iChannelIndex].AddToScheduleList();
		
		strProgramName = N["Data"]["Schedule"][2][j][0]["NAME"];
		g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strEventName = strProgramName;
		
		g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strStartDate = N["Data"]["Schedule"][2][j][0]["START"]["DATE"];
		g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strStartTime = N["Data"]["Schedule"][2][j][0]["START"]["TIME"];
		
		g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strDuration  = N["Data"]["Schedule"][2][j][0]["DURATION"];
		
		g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strSynopsis  = N["Data"]["Schedule"][2][j][0]["SYNOPSIS"];
		
		////print("Channel: " + g_objListChannelInfo[iChannelIndex].strChannelName + " EventName: " + g_objListChannelInfo[iChannelIndex].objListChannelSchedule[i].strEventName);
		i++;
		j++;
	}
	
	g_objListChannelInfo[iChannelIndex].iHaveSchedule	=	1;
}

function DownloadScheduleByChannelIndex(iChannelIndex	:	int)
{
	yield WaitForSeconds(0.0);
	
	if(g_objListChannelInfo[iChannelIndex].iHaveSchedule == 2)
	{
		InvokeReSTfulAPI("epg/getChannelSchedule","{\"serviceId\":\""+g_objListChannelInfo[iChannelIndex].strServiceName+"\",\"scheduleDays=\":\"2\"}",iChannelIndex);
	}
}

function Update ()
{
	if(Input.GetKeyDown(KeyCode.Escape))
	{
		if((m_iIndexOfChannelTappedEvent >= 0 && m_iIndexOfEventTappedEvent >= 0))
		{
			m_iIndexOfChannelTappedEvent	=	-1;
			m_iIndexOfEventTappedEvent		=	-1;
		}
		else if(m_bGetNowPressed)
		{
			if(m_iD2HCinemaGetNowWindowScene > 0)
			{
				m_iD2HCinemaGetNowWindowScene	=	0;
			}
			else
			{
				m_bGetNowPressed	=	false;
			}
		}
		else if(g_iChannelIndexToAddToFav > -1)
		{
			m_bChannelToggleState[g_iChannelIndexToAddToFav] = false;
		}
		else if(g_iChannelIndexToRemFromFav > -1)
		{
			m_bChannelToggleState[g_iChannelIndexToRemFromFav] = false;
		}
		else
		{
			Application.LoadLevel("SceneHomePage");
		}
	}
		
	if((m_iIndexOfChannelTappedEvent < 0 && m_iIndexOfEventTappedEvent < 0))
	{
		InertialScroll();
	}      
}

function InertialScroll()
{
	if(m_bInitializeTouchAreas == true)
	{	
		if(Input.touchCount)
		{		
			//print("Input Touch Count : " + Input.touchCount);
		}
		
		var fingerCount = 0;
		for( var touch : Touch in Input.touches)
		{
			var v2TouchToGUIPos	: Vector2;
			v2TouchToGUIPos.x = touch.position.x;
			v2TouchToGUIPos.y = m_fSH - touch.position.y;
			
			if (touch.phase == TouchPhase.Began)
			{
				m_fPreviousDeltaY = touch.deltaPosition.y;
				m_fPreviousDeltaX = touch.deltaPosition.x;
				//print("Touch Phase Began and m_bIsSwipeActive = " + m_bIsSwipeActive + " m_fPreviousDeltaX : " + m_fPreviousDeltaX + " m_fPreviousDeltaY : " + m_fPreviousDeltaY + " deltaTime : " + touch.deltaTime);
				
				/*if(m_fPreviousDeltaX >= 0.01*m_fSW || m_fPreviousDeltaY >= 0.01*m_fSH)
				{
					m_bIsSwipeActive = true;
				}*/
				if((m_fVelocityEPGInX == 0.0 && m_fVelocityEPGInY == 0.0) || m_fVelocityFiltersInY == 0.0)
				{
					m_bIsSwipeActive	=	false;
				}
			}
				
			if (touch.phase == TouchPhase.Moved)
			{
				// dragging
				//print("Touch Phase Moved");
				m_bIsSwipeActive = true;
				m_fPreviousDeltaY = touch.deltaPosition.y;
				m_fPreviousDeltaX = touch.deltaPosition.x;
				if( Mathf.Abs( m_fPreviousDeltaY)> Mathf.Abs(m_fPreviousDeltaX))
				{
					if(m_rectProgramGuideScreenScrollArea1.Contains(v2TouchToGUIPos))
						m_v2ScrollSelectTime.y += 3.5*touch.deltaPosition.y; //search box wala time : drop down
				
					if(m_rectProgramGuideScreenScrollArea2.Contains(v2TouchToGUIPos))
					{
						m_v2ScrollScheduleXYAxis.y += 3.5*touch.deltaPosition.y;			//schedule grid
						m_v2ScrollChannelThumbnailYAxis.y += 3.5*touch.deltaPosition.y; 	//channels ke icons
					}
					
					if(m_rectProgramGuideScreenScrollArea3.Contains(v2TouchToGUIPos))
					{
						m_v2ScrollFiltersYAxis.y += 3.5*touch.deltaPosition.y;
					}
						
					//print("Touch Phase Moved in Y and m_bIsSwipeActive = " + m_bIsSwipeActive);
				}
				else
				{
					if(m_rectProgramGuideScreenScrollArea2.Contains(v2TouchToGUIPos))
					{
				    	m_v2ScrollScheduleXYAxis.x -= 3.5*touch.deltaPosition.x;
						m_v2ScrollTimelineXAxis.x -= 3.5*touch.deltaPosition.x;
					}
					//print("Touch Phase Moved in X and m_bIsSwipeActive = " + m_bIsSwipeActive);
				}
			}
			
			if (touch.phase == TouchPhase.Stationary)
			{
				//print("A finger is touching the screen but hasn't moved and m_bIsSwipeActive = " + m_bIsSwipeActive);
				m_bIsSwipeActive	=	false;
			}
			
			if (touch.phase == TouchPhase.Ended)
			{
				// impart momentum, using last delta as the starting velocity
				if( Mathf.Abs( m_fPreviousDeltaY)> Mathf.Abs(m_fPreviousDeltaX))
				{
					if(	m_rectProgramGuideScreenScrollArea1.Contains(v2TouchToGUIPos) || 
						m_rectProgramGuideScreenScrollArea2.Contains(v2TouchToGUIPos))
					{   
						m_fVelocityEPGInY = m_fPreviousDeltaY/touch.deltaTime;
					}
					//filter
					if( m_rectProgramGuideScreenScrollArea3.Contains(v2TouchToGUIPos))
					{
						m_fVelocityFiltersInY = m_fPreviousDeltaY/touch.deltaTime;
					}
				}
				else
				{
					if(m_rectProgramGuideScreenScrollArea2.Contains(v2TouchToGUIPos))
						m_fVelocityEPGInX = -m_fPreviousDeltaX/touch.deltaTime;
				}
					
				m_fTimeStampWhenTouchPhaseEnded = Time.time;
				m_bIsSwipeActive	=	false;
				//print("Imparting Momentum using last delta as initial velocity and m_bIsSwipeActive = " + m_bIsSwipeActive);
			}
			
			if (touch.phase == TouchPhase.Canceled)
			{
				m_fPreviousDeltaX = 0f;
				m_fPreviousDeltaY = 0f;
				m_bIsSwipeActive  = false;
				//print("Touch Phase Cancelled and m_bIsSwipeActive = " + m_bIsSwipeActive);
			}
			
			if(touch.phase != TouchPhase.Ended && touch.phase != TouchPhase.Canceled)
	        {
	        	fingerCount++;
	        }
		}
		
		/*if (fingerCount > 0)
		{
			print ("User has " + fingerCount + " finger(s) touching the screen");
		}*/
		
		var fInertiaDuration	:	float = 0.75;
		if (Input.touchCount != 1) //if this is a short touch
		{			
			if ( m_fVelocityEPGInX != 0.0f || m_fVelocityFiltersInY != 0.0f  || m_fVelocityEPGInY != 0.0f)
			{
				//print("If touch count is not 1, and slow down over time. Touch Count is: " + Input.touchCount + " and m_bIsSwipeActive = " + m_bIsSwipeActive);
				// slow down over time
				var t : float;
				t = Time.time;
				t = t - m_fTimeStampWhenTouchPhaseEnded;
				t = t / fInertiaDuration;
				
				var frameVelocityEPGInX		: float = Mathf.Lerp(m_fVelocityEPGInX, 0, t);
				var frameVelocityFiltersInY	: float = Mathf.Lerp(m_fVelocityFiltersInY, 0, t);
				var frameVelocityEPGInY		: float = Mathf.Lerp(m_fVelocityEPGInY, 0, t);
				
				//m_v2ScrollSelectTime.y += 2*frameVelocityY * Time.deltaTime;
				m_v2ScrollFiltersYAxis.y			+=	frameVelocityFiltersInY * Time.deltaTime;
				m_v2ScrollChannelThumbnailYAxis.y 	+=	frameVelocityEPGInY * Time.deltaTime;
				m_v2ScrollScheduleXYAxis.x 			+=	frameVelocityEPGInX * Time.deltaTime;
				m_v2ScrollScheduleXYAxis.y 			+=	frameVelocityEPGInY * Time.deltaTime;
				m_v2ScrollTimelineXAxis.x 			+=	frameVelocityEPGInX * Time.deltaTime;
				
				// after N seconds, we’ve stopped
				if (t >= fInertiaDuration)
				{
					m_bIsSwipeActive = false;
					
					//print("If touch count is not 1, t >= Interia Duration. WE STOP and m_bIsSwipeActive = " + m_bIsSwipeActive);
					m_fVelocityEPGInX = 0.0f;
					m_fVelocityFiltersInY = 0.0f;
					m_fVelocityEPGInY = 0.0f;
				}
			}
			
			return;
		}
	}
}

// Rotate a button 10 degrees clockwise when presed.
private var m_fDeltaAngleOfRotation : float = 0;
private var m_v2PivotPoint 			: Vector2;

function OnGUI ()
{
	if((m_iIndexOfChannelTappedEvent	>= 0 && m_iIndexOfEventTappedEvent >= 0) || m_bGetNowPressed)
	{
		GUI.enabled = false;
	}
	
	RenderProgramGuideForIPHONE();
	
	GUI.enabled	=	true;
		
	if(m_iIndexOfChannelTappedEvent	>= 0 && m_iIndexOfEventTappedEvent >= 0)
	{
		GUI.ModalWindow(0,Rect(m_fDisplacementX + m_fWidthFilterDiv + m_fWidthTimeLineLeftArrowButton,m_fHeightTimeLineDiv,m_fWidthTVGuideDiv - m_fWidthTimeLineLeftArrowButton,4*m_fHeightChannelIcon), PopUpEventDetails, "", m_skinEPGEventDetails.window);
	}
	
	if(m_bGetNowPressed)
	{
		var fUnitX	:	float = Screen.width/24.4;
		GUI.ModalWindow(0,Rect(0,m_fHeightTimeLineDiv,m_fWidthTVGuideDiv,4*m_fHeightChannelIcon + fUnitX), D2HCinemaGetNowWindow, "", m_skinEPGEventDetails.window);
	}
}

function D2HCinemaGetNowWindow(iWindowID	:	int)
{
	GUI.skin = m_skinEPGEventDetails;
	
	//close popup
	m_skinEPGEventDetails.button.fontSize			= 	Mathf.Min(12*m_fWidthHalfHourSlot/18.0,m_fHeightChannelIcon/2.0);
	m_skinEPGEventDetails.button.font				=	m_fontRegular;	
	m_skinEPGEventDetails.button.normal.background	=	null;
	m_skinEPGEventDetails.button.active.background	=	null;
	m_skinEPGEventDetails.button.hover.background	=	null;
	m_skinEPGEventDetails.button.normal.textColor	=	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
	
	if(GUI.Button(Rect(m_fWidthTVGuideDiv - 0.8*m_fHeightChannelIcon,0,0.8*m_fHeightChannelIcon,0.8*m_fHeightChannelIcon),"x"))
	{
		m_bGetNowPressed = false;
		m_iD2HCinemaGetNowWindowScene = 0;
		m_strAddD2HCinemaResult	=	"Please wait...";
	}
	
	InitSkinForD2HCinemaGetNowWindow();
	if(m_iD2HCinemaGetNowWindowScene == 0)
	{
		RenderD2HCinemaGetNowWindowScene(0);
	}
	
	if(m_iD2HCinemaGetNowWindowScene == 1)
	{
		RenderD2HCinemaGetNowWindowScene(1);
	}
	
	if(m_iD2HCinemaGetNowWindowScene == 2)
	{
		RenderD2HCinemaGetNowWindowScene(2);
	}
	
	if(m_iD2HCinemaGetNowWindowScene == 3)
	{
		m_skinEPGEventDetails.label.alignment		=	TextAnchor.UpperLeft;
		RenderD2HCinemaGetNowWindowScene(3);
	}
	GUI.skin = null;
}

function InitSkinForD2HCinemaGetNowWindow()
{
	//event name : heading
	m_skinEPGEventDetails.label.fontSize 				=	Mathf.Min(0.8*m_fWidthTVGuideDiv,3*m_fHeightChannelIcon)/12.5;
	m_skinEPGEventDetails.label.alignment				=	TextAnchor.MiddleLeft;
	m_skinEPGEventDetails.label.normal.textColor		=	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
	m_skinEPGEventDetails.textField.contentOffset.x		=	0.0;
	
	
	//password field
	m_skinEPGEventDetails.textField.fontSize 			=	Mathf.Min(0.8*m_fWidthTVGuideDiv,3*m_fHeightChannelIcon)/12.5;
	m_skinEPGEventDetails.textField.alignment			=	TextAnchor.MiddleLeft;
	m_skinEPGEventDetails.textField.normal.textColor	=	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
	m_skinEPGEventDetails.textField.contentOffset.x		=	Mathf.Min(0.8*m_fWidthTVGuideDiv,3*m_fHeightChannelIcon)/12.5;
	
	//Yes | No buttons
	m_skinEPGEventDetails.button.fontSize 			= 	Mathf.Min(12*m_fWidthHalfHourSlot/18.0,m_fHeightChannelIcon/2.0)/2.0;
	m_skinEPGEventDetails.button.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinEPGEventDetails.button.normal.background 	= 	m_Tex2DPurple;
	m_skinEPGEventDetails.button.active.background	=	m_Tex2DOrange;
	m_skinEPGEventDetails.button.hover.background	=	m_Tex2DOrange;
}

function RenderD2HCinemaGetNowWindowScene(iSceneID	:	int)
{
	switch(iSceneID)
	{
 		case 0:
 			if(m_count == 0){
 				m_count ++;	
				tracking(g_objListD2HCinemaChannels[m_iIndexOfCurrentD2HCinemaChannel].strMovieName+"-->D2HCinema -> GetNow");
			}
			GUI.Label(Rect(0.1*m_fWidthTVGuideDiv,1*m_fHeightChannelIcon/3.0,0.8*m_fWidthTVGuideDiv,4*m_fHeightChannelIcon/3.0),"INR 60.00 will be deducted from your account for this service. Please enter your password to confirm.");
			m_strPassword = GUI.PasswordField(Rect(0.1*m_fWidthTVGuideDiv,5*m_fHeightChannelIcon/3.0,0.78*m_fWidthTVGuideDiv,2*m_fHeightChannelIcon/3.0),m_strPassword,"*"[0],25);
			if(GUI.Button(Rect(0.5*m_fWidthTVGuideDiv,8*m_fHeightChannelIcon/3.0,0.38*m_fWidthTVGuideDiv,2*m_fHeightChannelIcon/3.0),"Get Now"))
			{	
				var strStoredPassword :	String	=	PlayerPrefs.GetString("Password");
				if(m_strPassword	==	strStoredPassword)
				{
					var strCurrentBalance	=	PlayerPrefs.GetString("Balance");
					if(parseFloat(strCurrentBalance)	>= 60.0)
					{
						StartCoroutine(AddD2HCinema(0.0));
						m_iD2HCinemaGetNowWindowScene	=	3;
					}
					else
					{
						m_iD2HCinemaGetNowWindowScene = 1;
					}
				}
				else
				{
					m_iD2HCinemaGetNowWindowScene	=	2;
				}
			}
			if(GUI.Button(Rect(0.1*m_fWidthTVGuideDiv,8*m_fHeightChannelIcon/3.0,0.38*m_fWidthTVGuideDiv,2*m_fHeightChannelIcon/3.0),"Later"))
			{	tracking("D2HCinema -> GetNow-> Later");
				m_bGetNowPressed = false;
				m_iD2HCinemaGetNowWindowScene = 0;
			}
			break;
		
		case 1:
			tracking("D2HCinema -> GetNow-> Insufficient balance.");
			GUI.Label(Rect(0.1*m_fWidthTVGuideDiv,1*m_fHeightChannelIcon/3.0,0.8*m_fWidthTVGuideDiv,8*m_fHeightChannelIcon/3.0),"You have insufficient balance.\n\n Please recharge your account to get this service activated.");
			if(GUI.Button(Rect(0.1*m_fWidthTVGuideDiv,8*m_fHeightChannelIcon/3.0,0.38*m_fWidthTVGuideDiv,2*m_fHeightChannelIcon/3.0),"Recharge Now"))
			{
				Application.LoadLevel("sceneRecharge");
			}
			break;
			
		case 2:
			tracking("D2HCinema -> GetNow->Incorrect password. Please try again");
			GUI.Label(Rect(0.1*m_fWidthTVGuideDiv,1*m_fHeightChannelIcon/3.0,0.8*m_fWidthTVGuideDiv,8*m_fHeightChannelIcon/3.0),"Incorrect password. Please try again.");
			if(GUI.Button(Rect(0.1*m_fWidthTVGuideDiv,8*m_fHeightChannelIcon/3.0,0.38*m_fWidthTVGuideDiv,2*m_fHeightChannelIcon/3.0),"OK"))
			{
				m_iD2HCinemaGetNowWindowScene	=	0;
			}
			break;
			
		case 3:
			if(m_strAddD2HCinemaResult	==	"Please wait...")
			{
				var fUnitY	:	float	=	Screen.height/12.8;
				m_v2PivotPoint = Vector2(m_fWidthTVGuideDiv/2,(4*m_fHeightChannelIcon + fUnitY)/2);
				GUIUtility.RotateAroundPivot (m_fDeltaAngleOfRotation, m_v2PivotPoint);
				GUI.Label(Rect(m_fWidthTVGuideDiv/2 - 48,(4*m_fHeightChannelIcon + fUnitY)/2 - 48, 96, 96),"",m_skinRefreshButton.label);
				m_fDeltaAngleOfRotation += 2.0;
			}
			else
			{	tracking("D2HCinema -> GetNow-> Success");
				if(m_strAddD2HCinemaResult	==	"Success")
				{
					m_strAddD2HCinemaResult	=	"Congratulations! d2h Cinema has been successfully added to your account.";
					//DeductBalanceLocally();
				}
				GUI.Label(Rect(0.1*m_fWidthTVGuideDiv,m_fHeightChannelIcon,0.8*m_fWidthTVGuideDiv,3*m_fHeightChannelIcon),m_strAddD2HCinemaResult);
				if(GUI.Button(Rect(0.5*m_fWidthTVGuideDiv,8*m_fHeightChannelIcon/3.0,0.38*m_fWidthTVGuideDiv,2*m_fHeightChannelIcon/3.0),"OK"))
				{
					RefreshBalance();
					
					m_bGetNowPressed = false;
					m_iD2HCinemaGetNowWindowScene = 0;
					m_strAddD2HCinemaResult	=	"Please wait...";
				}
			}
			break;
			
		default:
			break;
	}
}

function RefreshBalance()
{
	PlayerPrefs.SetInt("Refresh",1);
	Application.LoadLevel("SceneMainPage");
}

function DeductBalanceLocally()
{
	var strBalance	:	String	=	PlayerPrefs.GetString("Balance");
	
	var fPrice		:	float	=	60.0;
	var fNewBalance	:	float	=	parseFloat(strBalance) - (fPrice + (12.36/100)*fPrice);
		
	var strNewBalance	:	String	=	fNewBalance.ToString("f2");
	PlayerPrefs.SetString("Balance",strNewBalance);
}

//5*m_fWidthHalfHourSlot,3*m_fHeightChannelIcon
function PopUpEventDetails(iWindowID	:	int)
{
	var fPopupWidth	:	float	=	m_fWidthTVGuideDiv - m_fWidthTimeLineLeftArrowButton; // = 4*m_fWidthHalfHourSlot
	
	GUI.skin = m_skinEPGEventDetails;
	
	m_skinEPGEventDetails.box.fontSize = Mathf.Min(5*m_fWidthHalfHourSlot,3*m_fHeightChannelIcon)/12.5;
	m_skinEPGEventDetails.box.wordWrap = true;
	GUI.Box(Rect(m_fHeightChannelIcon/2.0,m_fHeightChannelIcon/2.0,0.25*fPopupWidth,2*m_fHeightChannelIcon),g_objListChannelInfo[m_iIndexOfChannelTappedEvent].objListChannelSchedule[m_iIndexOfEventTappedEvent].strEventName);
	
	if(m_iEventDetailPopUpFrameNo	==	0)
	{
		//event name : heading
		m_skinEPGEventDetails.label.fontSize = Mathf.Min(5*m_fWidthHalfHourSlot,3*m_fHeightChannelIcon)/12.5;
		m_skinEPGEventDetails.label.alignment =	TextAnchor.UpperLeft;
		GUI.Label(Rect(m_fHeightChannelIcon/2.0 + 0.25*fPopupWidth + 0.05*fPopupWidth,m_fHeightChannelIcon/2.0,0.6*fPopupWidth,m_fHeightChannelIcon),g_objListChannelInfo[m_iIndexOfChannelTappedEvent].objListChannelSchedule[m_iIndexOfEventTappedEvent].strEventName);
		
		m_skinEPGEventDetails.label.fontSize = Mathf.Min(5*m_fWidthHalfHourSlot,3*m_fHeightChannelIcon)/15.0;
		GUI.Label(Rect(m_fHeightChannelIcon/2.0 + 0.25*fPopupWidth + 0.05*fPopupWidth,m_fHeightChannelIcon,0.6*fPopupWidth,2.0*m_fHeightChannelIcon),g_objListChannelInfo[m_iIndexOfChannelTappedEvent].objListChannelSchedule[m_iIndexOfEventTappedEvent].strSynopsis);
		
		
		//GUI.Label(Rect(5*m_fWidthHalfHourSlot/3.0,2.0*m_fHeightChannelIcon,10*m_fWidthHalfHourSlot/9.0,m_fHeightChannelIcon/2.0),"Tell your friends");
		
		//social links
		//GUI.DrawTexture(Rect(5*m_fWidthHalfHourSlot/3.0 + 10*m_fWidthHalfHourSlot/9.0,2.0*m_fHeightChannelIcon,m_fHeightChannelIcon/2.0,m_fHeightChannelIcon/2.0),m_Tex2DTwitterIcon);
		//GUI.DrawTexture(Rect(5*m_fWidthHalfHourSlot/3.0 + 10*m_fWidthHalfHourSlot/9.0 + m_fHeightChannelIcon/2.0,2.0*m_fHeightChannelIcon,m_fHeightChannelIcon/2.0,m_fHeightChannelIcon/2.0),m_Tex2DFacebookIcon);
		
		//reminder button
		
		m_skinEPGEventDetails.button.fontSize 			= 	Mathf.Min(12*m_fWidthHalfHourSlot/18.0,m_fHeightChannelIcon/2.0)/2.0;
		m_skinEPGEventDetails.button.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinEPGEventDetails.button.normal.background 	= 	m_Tex2DPurple;
		m_skinEPGEventDetails.button.active.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinEPGEventDetails.button.active.background	=	m_Tex2DOrange;
		m_skinEPGEventDetails.button.hover.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinEPGEventDetails.button.hover.background	=	m_Tex2DOrange;
		if(GUI.Button(Rect(m_fHeightChannelIcon/2.0 + 0.6*fPopupWidth,3.0*m_fHeightChannelIcon,0.25*fPopupWidth,m_fHeightChannelIcon/2.0),"Remind"))
		{
			tracking(g_objListChannelInfo[m_iIndexOfChannelTappedEvent].objListChannelSchedule[m_iIndexOfEventTappedEvent].strEventName+"Program Guide -> Set Reminder");
			m_iEventDetailPopUpFrameNo	=	IsEventInFuture();
		}
	}
	
	if(m_iEventDetailPopUpFrameNo	==	1)
	{
		//event name : heading
		m_skinEPGEventDetails.label.fontSize = Mathf.Min(5*m_fWidthHalfHourSlot,3*m_fHeightChannelIcon)/12.5;
		m_skinEPGEventDetails.label.alignment =	TextAnchor.UpperLeft;
		GUI.Label(Rect(m_fHeightChannelIcon/2.0 + 0.25*fPopupWidth + 0.05*fPopupWidth,m_fHeightChannelIcon/2.0,0.6*fPopupWidth,m_fHeightChannelIcon),"Programme Reminder");
		
		m_skinEPGEventDetails.label.fontSize = Mathf.Min(5*m_fWidthHalfHourSlot,3*m_fHeightChannelIcon)/15.0;
		GUI.Label(Rect(m_fHeightChannelIcon/2.0 + 0.25*fPopupWidth + 0.05*fPopupWidth,m_fHeightChannelIcon,0.6*fPopupWidth,2.0*m_fHeightChannelIcon),"Reminder set successfully. You will be reminded about the programme 5 minutes before it starts.");
		
		m_skinEPGEventDetails.button.fontSize 			= 	Mathf.Min(12*m_fWidthHalfHourSlot/18.0,m_fHeightChannelIcon/2.0)/2.0;
		m_skinEPGEventDetails.button.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinEPGEventDetails.button.normal.background 	= 	m_Tex2DPurple;
		m_skinEPGEventDetails.button.active.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinEPGEventDetails.button.active.background	=	m_Tex2DOrange;
		m_skinEPGEventDetails.button.hover.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinEPGEventDetails.button.hover.background	=	m_Tex2DOrange;
		if(GUI.Button(Rect(m_fHeightChannelIcon/2.0 + 0.6*fPopupWidth,3.0*m_fHeightChannelIcon,0.25*fPopupWidth,m_fHeightChannelIcon/2.0),"OK"))
		{
			m_iEventDetailPopUpFrameNo	=	0;
		}
	}
	
	if(m_iEventDetailPopUpFrameNo	==	2)
	{
		//event name : heading
		m_skinEPGEventDetails.label.fontSize = Mathf.Min(5*m_fWidthHalfHourSlot,3*m_fHeightChannelIcon)/12.5;
		m_skinEPGEventDetails.label.alignment =	TextAnchor.UpperLeft;
		GUI.Label(Rect(m_fHeightChannelIcon/2.0 + 0.25*fPopupWidth + 0.05*fPopupWidth,m_fHeightChannelIcon/2.0,0.6*fPopupWidth,m_fHeightChannelIcon),"Programme Reminder");
		
		m_skinEPGEventDetails.label.fontSize = Mathf.Min(5*m_fWidthHalfHourSlot,3*m_fHeightChannelIcon)/15.0;
		GUI.Label(Rect(m_fHeightChannelIcon/2.0 + 0.25*fPopupWidth + 0.05*fPopupWidth,m_fHeightChannelIcon,0.6*fPopupWidth,2.0*m_fHeightChannelIcon),"This programme is already about to start in few minutes, thus reminder can not be set for this programme.");
		
		m_skinEPGEventDetails.button.fontSize 			= 	Mathf.Min(12*m_fWidthHalfHourSlot/18.0,m_fHeightChannelIcon/2.0)/2.0;
		m_skinEPGEventDetails.button.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinEPGEventDetails.button.normal.background 	= 	m_Tex2DPurple;
		m_skinEPGEventDetails.button.active.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinEPGEventDetails.button.active.background	=	m_Tex2DOrange;
		m_skinEPGEventDetails.button.hover.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinEPGEventDetails.button.hover.background	=	m_Tex2DOrange;
		if(GUI.Button(Rect(m_fHeightChannelIcon/2.0 + 0.6*fPopupWidth,3.0*m_fHeightChannelIcon,0.25*fPopupWidth,m_fHeightChannelIcon/2.0),"OK"))
		{
			m_iEventDetailPopUpFrameNo	=	0;
		}
	}
	
	if(m_iEventDetailPopUpFrameNo	==	3)
	{
		//event name : heading
		m_skinEPGEventDetails.label.fontSize = Mathf.Min(5*m_fWidthHalfHourSlot,3*m_fHeightChannelIcon)/12.5;
		m_skinEPGEventDetails.label.alignment =	TextAnchor.UpperLeft;
		GUI.Label(Rect(m_fHeightChannelIcon/2.0 + 0.25*fPopupWidth + 0.05*fPopupWidth,m_fHeightChannelIcon/2.0,0.6*fPopupWidth,m_fHeightChannelIcon),"Programme Reminder");
		
		m_skinEPGEventDetails.label.fontSize = Mathf.Min(5*m_fWidthHalfHourSlot,3*m_fHeightChannelIcon)/15.0;
		GUI.Label(Rect(m_fHeightChannelIcon/2.0 + 0.25*fPopupWidth + 0.05*fPopupWidth,m_fHeightChannelIcon,0.6*fPopupWidth,2.0*m_fHeightChannelIcon),"Sorry you can not set reminder for the programme that has already been telecasted or is curently being telecasted.");
		
		m_skinEPGEventDetails.button.fontSize 			= 	Mathf.Min(12*m_fWidthHalfHourSlot/18.0,m_fHeightChannelIcon/2.0)/2.0;
		m_skinEPGEventDetails.button.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinEPGEventDetails.button.normal.background 	= 	m_Tex2DPurple;
		m_skinEPGEventDetails.button.active.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinEPGEventDetails.button.active.background	=	m_Tex2DOrange;
		m_skinEPGEventDetails.button.hover.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinEPGEventDetails.button.hover.background	=	m_Tex2DOrange;
		if(GUI.Button(Rect(m_fHeightChannelIcon/2.0 + 0.6*fPopupWidth,3.0*m_fHeightChannelIcon,0.25*fPopupWidth,m_fHeightChannelIcon/2.0),"OK"))
		{
			m_iEventDetailPopUpFrameNo	=	0;
		}
	}
	
	if(m_iEventDetailPopUpFrameNo	==	4)
	{
		//event name : heading
		m_skinEPGEventDetails.label.fontSize = Mathf.Min(5*m_fWidthHalfHourSlot,3*m_fHeightChannelIcon)/12.5;
		m_skinEPGEventDetails.label.alignment =	TextAnchor.UpperLeft;
		GUI.Label(Rect(m_fHeightChannelIcon/2.0 + 0.25*fPopupWidth + 0.05*fPopupWidth,m_fHeightChannelIcon/2.0,0.6*fPopupWidth,m_fHeightChannelIcon),"Programme Reminder");
		
		m_skinEPGEventDetails.label.fontSize = Mathf.Min(5*m_fWidthHalfHourSlot,3*m_fHeightChannelIcon)/15.0;
		GUI.Label(Rect(m_fHeightChannelIcon/2.0 + 0.25*fPopupWidth + 0.05*fPopupWidth,m_fHeightChannelIcon,0.6*fPopupWidth,2.0*m_fHeightChannelIcon),"Reminder for this programme is already set. You will be reminded about the progamme 5 minutes before it starts.");
		
		m_skinEPGEventDetails.button.fontSize 			= 	Mathf.Min(12*m_fWidthHalfHourSlot/18.0,m_fHeightChannelIcon/2.0)/2.0;
		m_skinEPGEventDetails.button.normal.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinEPGEventDetails.button.normal.background 	= 	m_Tex2DPurple;
		m_skinEPGEventDetails.button.active.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinEPGEventDetails.button.active.background	=	m_Tex2DOrange;
		m_skinEPGEventDetails.button.hover.textColor	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinEPGEventDetails.button.hover.background	=	m_Tex2DOrange;
		if(GUI.Button(Rect(m_fHeightChannelIcon/2.0 + 0.6*fPopupWidth,3.0*m_fHeightChannelIcon,0.25*fPopupWidth,m_fHeightChannelIcon/2.0),"OK"))
		{
			m_iEventDetailPopUpFrameNo	=	0;
		}
	}
	
	//close popup
	m_skinEPGEventDetails.button.fontSize			= 	Mathf.Min(m_fWidthHalfHourSlot/2.0,m_fWidthHalfHourSlot/2.0)/2.0;
	m_skinEPGEventDetails.button.normal.textColor	=	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
	m_skinEPGEventDetails.button.font				=	m_fontRegular;	
	m_skinEPGEventDetails.button.normal.background	=	null;
	m_skinEPGEventDetails.button.active.background	=	null;
	m_skinEPGEventDetails.button.hover.background	=	null;

	if(GUI.Button(Rect(fPopupWidth - m_fWidthHalfHourSlot/3.0,0,m_fWidthHalfHourSlot/3.0,m_fWidthHalfHourSlot/3.0),"x"))
	{
		m_iEventDetailPopUpFrameNo	=	0;
		m_iIndexOfChannelTappedEvent = -1;
		m_iIndexOfEventTappedEvent = -1;
	}
	GUI.skin = null;
}

function IsEventInFuture()	:	int
{
	var strEventDTStamp	:	String			=	g_objListChannelInfo[m_iIndexOfChannelTappedEvent].objListChannelSchedule[m_iIndexOfEventTappedEvent].strStartDate + " " + g_objListChannelInfo[m_iIndexOfChannelTappedEvent].objListChannelSchedule[m_iIndexOfEventTappedEvent].strStartTime;
	
	var dtEventDTStamp	:	System.DateTime	=	System.DateTime.Parse(strEventDTStamp);
	var dtNowDTStamp	:	System.DateTime	=	System.DateTime.Now;
	
	var span			:	System.TimeSpan	=	dtEventDTStamp	-	dtNowDTStamp;
	
	var iDiffInSec		:	int			=	span.TotalSeconds;
	
	if(iDiffInSec	>=	300)
	{
		if(g_objListChannelInfo[m_iIndexOfChannelTappedEvent].objListChannelSchedule[m_iIndexOfEventTappedEvent].bReminderSet == false)
		{
			SetReminder(iDiffInSec);
			g_objListChannelInfo[m_iIndexOfChannelTappedEvent].objListChannelSchedule[m_iIndexOfEventTappedEvent].bReminderSet = true;
			return 1;
		}
		else
		{
			return 4;
		}
	}
	else if(iDiffInSec	> 0 && iDiffInSec < 300)
	{
		return 2;
	}
	else
	{
		return 3;
	}
}

function SetReminder(iDelay	:	int)
{
	var strPushMsg : String				=	g_objListChannelInfo[m_iIndexOfChannelTappedEvent].strChannelName + " : " + g_objListChannelInfo[m_iIndexOfChannelTappedEvent].objListChannelSchedule[m_iIndexOfEventTappedEvent].strEventName + " starting in 5 mins...";
	var expiryTime : System.DateTime	=	System.DateTime.UtcNow.AddSeconds(iDelay);
	
	App42API.BuildPushNotificationService().ScheduleMessageToUser(Constants.UserId, strPushMsg, expiryTime, new Callback());
}

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
		var fUnitX	:	float	=	Screen.width/24.4;
		if((m_fDisplacementX + (m_fWidthFilterDiv - 0.8*fUnitX)) > 0.0)
		{
			m_fDisplacementX -= 25.0;
		}
		else if((m_fDisplacementX + (m_fWidthFilterDiv - 0.8*fUnitX)) < 0.0)
		{
			m_fDisplacementX = -(m_fWidthFilterDiv - 0.8*fUnitX);
		}
	}
}

function RenderProgramGuideForIPHONE()
{
	if(!g_iRenderVideoPlayer)
	{
		ShowHideFilter();
		RenderFilters();		 		 	
 	}
 		 		 	
	if((m_iIndexOfChannelTappedEvent >= 0 && m_iIndexOfEventTappedEvent >= 0) || m_bGetNowPressed)
	{
		GUI.enabled = false;
	}
	
	RenderEPGGrid(g_strListGenres[m_iIndexOfActiveFilterItem]);
}

function RenderFilters()
{
	//***********GROUP FOR THE WHOLE SCREEN****************************//
 	//GUI.BeginGroup(new Rect (0,0,Screen.width,Screen.height));
 	var fUnitX	:	float = Screen.width/24.4;
 	var fUnitY	:	float = Screen.height/12.8;
 	
 	m_fWidthFilterDiv	=	5.8*fUnitX;
	m_fWidthTVGuideDiv	=	18.6*fUnitX;
	if(m_fDisplacementX < 0)
 	{
 		m_fWidthTVGuideDiv -= m_fDisplacementX;
 	}
	
	m_fWidthFilterButton				=	4.2*fUnitX;
	m_fHeightFilterButton				=	0.9*fUnitY;
	
	m_fHeightFilterOptions				=	7.2*fUnitY;
	m_fHeightSearchBox					=	3.4*fUnitY;
	
	m_fWidthTimeLineLeftArrowButton		=	2.47*fUnitX;//1.8*fUnitX;
	m_fHeightTimeLineLeftArrowButton	=	2.3*fUnitY;//1.3*fUnitY;

	m_fWidthTimeLineDiv					=	16.8*fUnitX;
	
	m_fWidthHalfHourSlot				=	1.5*2.8*fUnitX; //16.8 by 6 slots
	m_fHeightTimeLineDiv				=	2.3*fUnitY;//1.3*fUnitY;
	
	m_fWidthChannelIcon					=	2.47*fUnitX;//1.8*fUnitX;
	m_fHeightChannelIcon				=	2.3*fUnitY;//1.7*fUnitY;
	
	//initialize touch areas on the first frame
	if(m_bInitializeTouchAreas == false)
	{
		/************ For iPhone ***************/
		//search box mein drop down
		m_rectProgramGuideScreenScrollArea1 = Rect(	0.8*fUnitX + m_fWidthFilterButton/2,m_fHeightFilterButton + m_fHeightFilterOptions + 0.2*fUnitY,m_fWidthFilterButton/2.0,m_fHeightSearchBox);
		
		if(m_bShowFilter)
		{
			//poora program guide grid - right side wala div
			m_rectProgramGuideScreenScrollArea2 = Rect(m_fWidthFilterDiv,0,m_fWidthTVGuideDiv,11.5*fUnitY);
		
			//filter options - left side wala div
			m_rectProgramGuideScreenScrollArea3 = Rect(0.8*fUnitX, m_fHeightFilterButton + 1.2*fUnitY, m_fWidthFilterButton, 9.2*fUnitY);
		}
		else
		{
			//m_fWidthFilterDiv - 0.8*fUnitX
			//poora program guide grid - right side wala div
			m_rectProgramGuideScreenScrollArea2 = Rect(0.8*fUnitX,0,23.6*fUnitX,11.5*fUnitY);
		
			//filter options - left side wala div
			m_rectProgramGuideScreenScrollArea3 = Rect(0.0 - m_fWidthFilterButton, m_fHeightFilterButton + 1.2*fUnitY, m_fWidthFilterButton, 9.2*fUnitY);
		}
		
		SetScrollPosXToCurrentTime();
		
		m_bInitializeTouchAreas = true;
	}
 	
 	//lokesh
 	//FOR GRADIENT in the first column
	GUI.DrawTexture(Rect(m_fDisplacementX,0,m_fWidthFilterDiv,Screen.height), m_Tex2DFilterBackground);
	//~lokesh
	
	//***********Arrow | Filters | Menu : Filter Button on TOP ***************//
	GUI.BeginGroup(Rect(m_fDisplacementX,0,m_fWidthFilterDiv,m_fHeightFilterButton),"");//creating the filters menu screen
	//GUI.Box(Rect(0,0,m_fWidthFilterDiv,m_fHeightFilterButton),"");//box for above group
	
	m_skinFilterButton.button.fontSize			=	Mathf.Min(m_fWidthFilterButton,m_fHeightFilterButton)/2.0;
	m_skinFilterButton.button.font				= 	m_fontBold;	
	m_skinFilterButton.button.normal.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	
	GUI.Label(Rect(0.8*fUnitX,0,m_fWidthFilterButton,m_fHeightFilterButton),m_Tex2DFilterLeftArrow,m_skinFilterButton.label); //arrow icon
	GUI.Box(Rect(0.8*fUnitX,0,m_fWidthFilterButton,m_fHeightFilterButton),m_Tex2DFilterIcon,m_skinFilterButton.box); //menu icon
	if(GUI.RepeatButton(Rect(0.8*fUnitX,0,m_fWidthFilterButton,m_fHeightFilterButton),"Filters",m_skinFilterButton.button))	//arrow icon
	{
		if(m_bShowFilter)
		{
			m_bShowFilter	=	false;
		}
		
		if(m_bInitializeTouchAreas)
		{
			m_bInitializeTouchAreas	=	false;
		}
	}
	
	if(m_bShowFilter	==	false)
	{
		if(GUI.RepeatButton(Rect(0.8*fUnitX + m_fWidthFilterButton,0,0.8*fUnitX,m_fHeightFilterButton),m_Tex2DFilterRightArrow,m_skinFilterButton.button))//right arrow icon
		{
			m_bShowFilter	=	true;
			
			if(m_bInitializeTouchAreas)
			{
				m_bInitializeTouchAreas	=	false;
			}
		}
	}
	GUI.EndGroup();

	//***************Connection ID ************************************//
	GUI.BeginGroup(Rect(m_fDisplacementX,m_fHeightFilterButton,m_fWidthFilterDiv,m_fHeightFilterOptions));
	//GUI.Box(Rect(0,0,m_fWidthFilterDiv,m_fHeightFilterOptions),"");
	
	m_skinCustomerID.button.fontSize			=	Mathf.Min(m_fWidthFilterButton,m_fHeightFilterButton)/2.0;
	m_skinCustomerID.button.font				= 	m_fontBold;	
	m_skinCustomerID.button.normal.textColor 	= 	Color(100/255.0F,49/255.0F,140/255.0F,255/255.0F);
	
	GUI.DrawTexture(Rect(0,0,m_fWidthFilterDiv,3),m_Tex2DBorderLine);//for line seperating Filter and the next column				
	GUI.Button(Rect(0.8*fUnitX,0.2*fUnitY,m_fWidthFilterButton,0.8*fUnitY),g_strConnectionId,m_skinCustomerID.button); // for connection ID
	
	GUI.EndGroup();
	
	//***************Scrollable circular grid : All Channels | Favorites | Genres******************//
	
	GUI.skin = m_skinGenresGrid;
	m_skinGenresGrid.toggle.fontSize			=	Mathf.Max(m_fWidthFilterButton,m_fHeightFilterButton)/9.0;
	m_skinGenresGrid.toggle.font				= 	m_fontRegular;	
	m_skinGenresGrid.toggle.normal.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	
	GUI.BeginGroup(Rect(m_fDisplacementX + 0.8*fUnitX, m_fHeightFilterButton + 1.2*fUnitY,	m_fWidthFilterButton, 5.8*fUnitY + m_fHeightSearchBox));// 5.8 for filters
	
	m_v2ScrollFiltersYAxis = GUI.BeginScrollView(Rect(0,0,m_fWidthFilterButton,5.8*fUnitY + m_fHeightSearchBox), m_v2ScrollFiltersYAxis, Rect(0,0,m_fWidthFilterButton,25*1.16*fUnitY));
	
		var strActiveGenre	:	String;
		for(var i=1; i<26; i++)
		{
			if(i != 1)//all the buttons except fav
			{
				strActiveGenre	=	g_strListGenres[i];	
				if(strActiveGenre.Length > 14)
				{
					strActiveGenre	=	strActiveGenre.Substring(0,12) + "...";
				}
				m_bFilterToggleState[i] = GUI.Toggle(Rect(-0.025*m_fWidthFilterButton, (i-1)*1.16*fUnitY, 1.05*m_fWidthFilterButton, 1.16*fUnitY),m_bFilterToggleState[i],strActiveGenre);
				
				if(m_bFilterToggleState[i])
				{
					m_iIndexOfActiveFilterItem	=	i;
					//tracking(g_strListGenres[m_iIndexOfActiveFilterItem]);
					//m_count = 0;
					ResetStateOfRestFilterToggles(m_iIndexOfActiveFilterItem);
					
					if(m_strGetFavChannelsAPIResult	!= "")
					{
						m_strGetFavChannelsAPIResult	=	"";
					}
				}
				else
				{
					if(i == m_iIndexOfActiveFilterItem)
					{
						m_bFilterToggleState[i]	=	true;
					}
				}
			}
			else//fav button
			{
				var contentsFavButton : GUIContent = new GUIContent(g_strListGenres[i],m_Tex2DHeart);
				m_bFilterToggleState[i] = GUI.Toggle(Rect(-0.025*m_fWidthFilterButton, (i-1)*1.16*fUnitY, 1.05*m_fWidthFilterButton, 1.16*fUnitY),m_bFilterToggleState[i],contentsFavButton);
				
				if(m_bFilterToggleState[i])
				{
					/*if(g_iRenderVideoPlayer == 1)
					{
						g_iRenderVideoPlayer = 0;
					}*/
						
					m_iIndexOfActiveFilterItem	=	i;
					
					ResetStateOfRestFilterToggles(m_iIndexOfActiveFilterItem);
					
					//get list of fav channels
					if(m_bGetFavChannelsListAPIInProgress == false)
					{
						if(m_iCountFavChannels <= 0 && m_strGetFavChannelsAPIResult == "")
						{
							HitGetFavChannelsListAPI();
						}
					}
				}
				else
				{
					if(i == m_iIndexOfActiveFilterItem)
					{
						m_bFilterToggleState[i]	=	true;
					}
					else
					{
						m_iCountFavChannels = 0;
					}
				}
			}
		}
	GUI.EndScrollView();
		
	GUI.EndGroup();
	GUI.skin = null;
	
	if(m_bShowFilter == false)
	{
		//Show vertical dots to represent scroll
		GUI.DrawTexture(Rect(m_fDisplacementX + 0.8*fUnitX + m_fWidthFilterButton ,m_fHeightFilterButton + m_fHeightFilterOptions/2.0 + m_fHeightSearchBox/2.0 + 0.2*fUnitX,0.8*fUnitX,0.8*fUnitX),m_Tex2DVerticalDots);//vertical dots
	
		if(GUI.RepeatButton(Rect(0,m_fHeightFilterButton,0.8*fUnitX,10.6*fUnitY),"",m_skinFilterButton.button))//right arrow icon
		{
			m_bShowFilter	=	true;
			
			if(m_bInitializeTouchAreas)
			{
				m_bInitializeTouchAreas	=	false;
			}
		}
	}
	
	//seperator line
	//GUI.DrawTexture(Rect(0,m_fHeightFilterButton + m_fHeightFilterOptions,m_fWidthFilterDiv,3),m_Tex2DBorderLine);//for seperating line

	//***************SEARCH GROUP BOX*************************************//
	//GUI.enabled = false;
	//RenderGroupBoxForSearch(fUnitX, fUnitY);
	//GUI.enabled = true;
}

function SetScrollPosXToCurrentTime()
{
	var iCurrentMin		:	int		=	System.DateTime.Now.Minute;
	
	var fCurrentHour	:	float	=	System.DateTime.Now.Hour;
	
	if(iCurrentMin > 30)
	{
		fCurrentHour += 0.5;
	}
	else
	{
		fCurrentHour += 0.0;
	}
	
	var fFactor	:	float	=	(fCurrentHour*m_fWidthHalfHourSlot)/0.5;
	m_v2ScrollTimelineXAxis.x = fFactor;
}

function RenderGroupBoxForSearch(fUnitX : float, fUnitY : float)
{
	//*************Time | Date | Search Group*******//
	GUI.skin = m_skinSearchGroup ;
	m_skinSearchGroup.button.fontSize				=	Mathf.Min(m_fWidthFilterButton,m_fHeightFilterButton)/2.25;
	m_skinSearchGroup.button.font				= 	m_fontRegular;	
	m_skinSearchGroup.button.normal.textColor 		= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);

	m_skinSearchGroup.textField.fontSize			=	Mathf.Min(m_fWidthFilterButton,m_fHeightFilterButton)/2.25;
	m_skinSearchGroup.textField.font			= 	m_fontRegular;	
	m_skinSearchGroup.textField.normal.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	
	GUI.BeginGroup(Rect(0.8*fUnitX,m_fHeightFilterButton + m_fHeightFilterOptions,m_fWidthFilterButton,m_fHeightSearchBox));	
	//GUI.Box(Rect(0,0,m_fWidthFilterButton,m_fHeightSearchBox),"");	

	//Drop down for time : making it a button to toggle drop down list for time
	m_skinTimeColumnSearchBox.button.fontSize				=	Mathf.Min(m_fWidthFilterButton,m_fHeightFilterButton)/2.25;
	m_skinTimeColumnSearchBox.button.font			= 	m_fontRegular;	
	m_skinTimeColumnSearchBox.button.normal.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	
	g_strTimeshown = GetCurrentTime();
	
	if(GUI.Button(Rect(m_fWidthFilterButton/2,0.2*fUnitY,m_fWidthFilterButton/2,0.9*fUnitY), g_strTimeshown, m_skinTimeColumnSearchBox.button))
	{
		if(g_bShowTimeInDropDown)
		{
			g_bShowTimeInDropDown = false;
		}
		else
		{
			g_bShowTimeInDropDown = true;		
		}
	}
	
	//GUI.enabled = !g_bShowTimeInDropDown;			
	GUI.Button(Rect(0,0.2*fUnitY,m_fWidthFilterButton/2 - 2,0.9*fUnitY),"Now"); //now
	GUI.Button(Rect(0,0.2*fUnitY + 0.9*fUnitY + 0.2*fUnitY,m_fWidthFilterButton,0.9*fUnitY),GetCurrentDayDateMonth()); //date
	
	g_strSearch = GUI.TextField(Rect(0,0.2*fUnitY + 0.9*fUnitY + 0.2*fUnitY + 0.9*fUnitY + 0.2*fUnitY,0.75*m_fWidthFilterButton,0.9*fUnitY),g_strSearch); // search
	
	//GUI.Button(Rect(0.75*m_fWidthFilterButton,0.2*fUnitY + 0.9*fUnitY + 0.2*fUnitY + 0.9*fUnitY + 0.2*fUnitY,0.25*m_fWidthFilterButton,0.9*fUnitY),m_Tex2DSearchLensIcon);
	
	//GUI.enabled = true;
	//if button is clicked to toggle the list of time : render a box and the buttons inside represent the hour of day
	if(g_bShowTimeInDropDown == true)
	{
		GUI.BeginGroup(Rect(Screen.width/10 + Screen.width/40+2 ,Screen.height/30,Screen.width/10-2,Screen.height/5));
	    GUI.Box(Rect(0,Screen.height/14 - 10,Screen.width/10-2,Screen.height/7.5), "");
		m_v2ScrollSelectTime = GUI.BeginScrollView (Rect (0 ,Screen.height/14 - 10,Screen.width/9,Screen.height/7.5),m_v2ScrollSelectTime, Rect (0, 0,Screen.width/10-2,24*Screen.height/20));
		for( var p = 0; p<24 ; p++)
		{
	    	if(GUI.Button(Rect(0,(p)*Screen.height/20,Screen.width/10-2,Screen.height/20), g_strTimeColumn[p],m_skinTimeColumnSearchBox.button))
	    	{
	    		g_strTimeshown = g_strTimeColumn[p];
	    		g_bShowTimeInDropDown = false;
	    	}			
	    }
		GUI.EndScrollView ();	
		GUI.EndGroup ();
	}
 	//GUI.Label(Rect(Screen.width/10 + Screen.width/40 + Screen.width/14,Screen.height/22 ,Screen.width/40,Screen.height/35),m_Tex2DArrowDown); //FOR SHOWING THE DOWN ARROW     			
	GUI.EndGroup ();
	GUI.skin = null ;
}
function RenderD2HCinemaForIPHONE()
{	
	if(m_count == 0 ){
		m_count ++;
		tracking("D2H Cinema");
			
	}
	//************************** Header *************************//
	var fUnitX	:	float	=	Screen.width/24.4;
	var fUnitY	:	float	=	Screen.height/12.8;
	m_fWidthHalfHourSlot	=	4.2*fUnitX;
	m_fWidthTVGuideDiv		=	Screen.width;
	m_fHeightTimeLineDiv	=	1.3*fUnitY;
	m_fHeightChannelIcon	=	2.3*fUnitY;
	
	GUI.skin = m_skinD2HCinemaHeader;
	m_skinD2HCinemaHeader.box.fontSize			=	Mathf.Min(m_fWidthHalfHourSlot,m_fHeightTimeLineDiv)/2.0;
	m_skinD2HCinemaHeader.box.font				= 	m_fontBold;	
	m_skinD2HCinemaHeader.box.normal.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinD2HCinemaHeader.box.contentOffset.x	=	Mathf.Min(m_fWidthHalfHourSlot,m_fHeightTimeLineDiv)/2.5;
	
	if(g_iD2HCinemaChannelCount <= 0)
	{
		GUI.BeginGroup(Rect(0,0,m_fWidthTVGuideDiv,m_fHeightTimeLineDiv));// header
		
			GUI.Box(Rect(0,0,m_fWidthTVGuideDiv,m_fHeightTimeLineDiv),"D2H Cinema");
		
		GUI.EndGroup();
		GUI.skin = null ;
		
		RenderSplash(true);
	}
	else
	{
		GUI.BeginGroup(Rect(0,0,m_fWidthTVGuideDiv,m_fHeightTimeLineDiv));// header
		
		GUI.Box(Rect(0,0,m_fWidthTVGuideDiv,m_fHeightTimeLineDiv),"Now Showing (" + (m_iIndexOfCurrentD2HCinemaChannel+1) + " of " + g_iD2HCinemaChannelCount +")");
		
		/*var objTex2DSlideShowState	:	Texture2D	=	m_Tex2DArrowNext;
		if(m_bSlideShowOnForD2HCinema)
		{
			objTex2DSlideShowState	=	m_Tex2DPause;
			
			m_iIndexOfCurrentD2HCinemaChannel = Time.time * 0.5;
    		m_iIndexOfCurrentD2HCinemaChannel = m_iIndexOfCurrentD2HCinemaChannel % g_iD2HCinemaChannelCount;
		}
		if(GUI.Button(Rect(m_fWidthTVGuideDiv - 1.25*m_fHeightTimeLineDiv,0,m_fHeightTimeLineDiv,m_fHeightTimeLineDiv),objTex2DSlideShowState))
		{
			m_bSlideShowOnForD2HCinema	=	!m_bSlideShowOnForD2HCinema;
			
			m_iIndexOfCurrentD2HCinemaChannel++;
			m_iIndexOfCurrentD2HCinemaChannel	=	m_iIndexOfCurrentD2HCinemaChannel % g_iD2HCinemaChannelCount;
		}*/
		
		GUI.EndGroup();
		GUI.skin = null ;
		
		//****************************MOVIE SCREEN**************************//
		GUI.skin = m_skinD2HCinemaPlayer;
		GUI.BeginGroup(Rect(0,m_fHeightTimeLineDiv,m_fWidthTVGuideDiv,3*m_fHeightChannelIcon + fUnitY));
		
			var fPosterHeight	:	float =	3*m_fHeightChannelIcon + fUnitY + 4.5*m_fHeightTimeLineDiv;
			var fPosterWidth	:	float =	640.0*fPosterHeight/480.0;
			var fArrowWidth		:	float = 0.0;
			
			if(m_fAspectRatio	>= 1.7)
			{
				fArrowWidth = (m_fSW - fPosterWidth)/2.0;
			}
			else
			{
				fArrowWidth	=	m_fHeightChannelIcon;
			}
			//GUI.Box(Rect(0,0,m_fWidthTVGuideDiv,3*m_fHeightChannelIcon + fUnitY),g_objListD2HCinemaChannels[m_iIndexOfCurrentD2HCinemaChannel].tex2DThumbnail);
			if(g_objListD2HCinemaChannels[m_iIndexOfCurrentD2HCinemaChannel].tex2DThumbnail)
			{
				GUI.DrawTexture(Rect(m_fSW/2.0 - fPosterWidth/2.0,-2.25*m_fHeightTimeLineDiv,fPosterWidth,fPosterHeight),g_objListD2HCinemaChannels[m_iIndexOfCurrentD2HCinemaChannel].tex2DThumbnail);
			}
			
			m_skinD2HCinemaPlayer.button.normal.background	=	m_Tex2DPreviousWhite;
			//m_skinD2HCinemaPlayer.button.normal.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
			m_skinD2HCinemaPlayer.button.hover.background	=	m_Tex2DPreviousPurple;
			//m_skinD2HCinemaPlayer.button.hover.textColor 	= 	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
			m_skinD2HCinemaPlayer.button.active.background	=	m_Tex2DPreviousPurple;
			//m_skinD2HCinemaPlayer.button.active.textColor 	= 	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
			//m_skinD2HCinemaPlayer.button.fontSize			=	Mathf.Min(m_fHeightChannelIcon,m_fHeightChannelIcon)/1.0;
			//m_skinD2HCinemaPlayer.button.font				= 	m_fontRegular;	
		
			if(GUI.Button(Rect(0.0,1.75*m_fHeightChannelIcon/2.0 + 0.5*fUnitY,fArrowWidth,fArrowWidth),""))
			{
				if(m_iIndexOfCurrentD2HCinemaChannel == 0)
				{
					m_iIndexOfCurrentD2HCinemaChannel = g_iD2HCinemaChannelCount;
				}
				m_iIndexOfCurrentD2HCinemaChannel--;
			}
			
			m_skinD2HCinemaPlayer.button.normal.background	=	m_Tex2DNextWhite;
			m_skinD2HCinemaPlayer.button.hover.background	=	m_Tex2DNextPurple;
			m_skinD2HCinemaPlayer.button.active.background	=	m_Tex2DNextPurple;
			if(GUI.Button(Rect(m_fSW - fArrowWidth,1.75*m_fHeightChannelIcon/2.0 + 0.5*fUnitY,fArrowWidth,fArrowWidth),""))
			{
				m_iIndexOfCurrentD2HCinemaChannel++;
				m_iIndexOfCurrentD2HCinemaChannel	=	m_iIndexOfCurrentD2HCinemaChannel % g_iD2HCinemaChannelCount;
			}
			
			m_skinD2HCinemaPlayer.button.normal.background	=	m_Tex2DPlayWhite;
			m_skinD2HCinemaPlayer.button.hover.background	=	m_Tex2DPlayPurple;
			m_skinD2HCinemaPlayer.button.active.background	=	m_Tex2DPlayPurple;
			if(GUI.Button(Rect(m_fWidthTVGuideDiv/2 - 1.5*m_fHeightChannelIcon/2.0,1.5*m_fHeightChannelIcon/2.0 + 0.5*fUnitY,1.5*m_fHeightChannelIcon,1.5*m_fHeightChannelIcon),""))
			{
				Application.OpenURL(g_objListD2HCinemaChannels[m_iIndexOfCurrentD2HCinemaChannel].strURL);
			}
		
		GUI.EndGroup();
		GUI.skin = null ;

		//************************GET NOW BOTTOM AREA**********************//
		GUI.skin = m_skinD2HCinemaGetNowDiv;
		m_skinD2HCinemaGetNowDiv.label.fontSize			=	Mathf.Min(m_fWidthHalfHourSlot,m_fHeightTimeLineDiv)/3.0;
		m_skinD2HCinemaGetNowDiv.label.font				= 	m_fontRegular;	
		m_skinD2HCinemaGetNowDiv.label.normal.textColor = 	Color(64/255.0F,64/255.0F,64/255.0F,255/255.0F);
		m_skinD2HCinemaGetNowDiv.label.contentOffset.x	=	Mathf.Min(m_fWidthHalfHourSlot,m_fHeightTimeLineDiv)/2.5;
		
		m_skinD2HCinemaGetNowDiv.button.fontSize			=	Mathf.Min(m_fWidthHalfHourSlot,m_fHeightTimeLineDiv)/2.5;
		m_skinD2HCinemaGetNowDiv.button.normal.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	
		GUI.BeginGroup(Rect(0,m_fHeightTimeLineDiv + 3*m_fHeightChannelIcon + fUnitY,m_fWidthTVGuideDiv,m_fHeightChannelIcon));
		
			//m_skinD2HCinemaPlayer.box.normal.background	=	g_objListD2HCinemaChannels[m_iIndexOfCurrentD2HCinemaChannel].tex2DThumbnail;
			GUI.Box(Rect(0,0,m_fWidthTVGuideDiv,m_fHeightChannelIcon),"");//g_objListD2HCinemaChannels[m_iIndexOfCurrentD2HCinemaChannel].tex2DThumbnail);
			
			GUI.Label(Rect(0,0,0.7*m_fWidthTVGuideDiv,0.33*m_fHeightChannelIcon),"Channel No.\t\t" + g_objListD2HCinemaChannels[m_iIndexOfCurrentD2HCinemaChannel].strChannelNo);
			GUI.Label(Rect(0,0.33*m_fHeightChannelIcon,0.7*m_fWidthTVGuideDiv,0.33*m_fHeightChannelIcon),"Show Name\t\t" + g_objListD2HCinemaChannels[m_iIndexOfCurrentD2HCinemaChannel].strMovieName);
			GUI.Label(Rect(0,0.66*m_fHeightChannelIcon,0.7*m_fWidthTVGuideDiv,0.33*m_fHeightChannelIcon),"Show Dates\t\t" + g_objListD2HCinemaChannels[m_iIndexOfCurrentD2HCinemaChannel].strShowDates);
			
			if(GUI.Button(Rect(0.75*m_fWidthTVGuideDiv,0.25*m_fHeightChannelIcon,0.2*m_fWidthTVGuideDiv,0.5*m_fHeightChannelIcon),"Get Now"))
			{
				m_bGetNowPressed = true;
				tracking(g_objListD2HCinemaChannels[m_iIndexOfCurrentD2HCinemaChannel].strMovieName+"-->D2HCinema -> GetNow");
			}
		
		GUI.EndGroup();
		GUI.skin = null;
	}
}

function RenderChannelScheduleGridForIPHONE()
{
	//GUI.depth = 1;
	//**************************Time Line******************************//
	RenderHeaderTimeLine();
	
	//*************Program Guide with respect to channels***************//
	GUI.skin = m_skinProgramGuide ;
	m_skinProgramGuide.button.fontSize			=	Mathf.Min(m_fWidthHalfHourSlot,m_fHeightChannelIcon)/5.0;
	m_skinProgramGuide.button.font				= 	m_fontRegular;	
	m_skinProgramGuide.button.normal.textColor 	= 	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);

	//rotate please wait n refresh button till channel data doesn't come from API
	if(g_iChannelCount <= 0)
	{
		RenderSplash(false);
	}
	else//show schedule grid
	{
		m_rectEPGScheduleViewPort	=	Rect(m_fDisplacementX + m_fWidthFilterDiv + m_fWidthTimeLineLeftArrowButton,m_fHeightTimeLineDiv,m_fWidthTVGuideDiv - m_fWidthChannelIcon,4*m_fHeightChannelIcon);
		m_rectEPGScheduleFullScroll	=	Rect(0,0,144*m_fWidthHalfHourSlot,g_iChannelCount*m_fHeightChannelIcon);
		
		m_v2ScrollScheduleXYAxis 			= 	GUI.BeginScrollView (m_rectEPGScheduleViewPort,m_v2ScrollScheduleXYAxis,m_rectEPGScheduleFullScroll);
		m_v2ScrollChannelThumbnailYAxis.y	=	m_v2ScrollScheduleXYAxis.y;// to store the position so we can drag the window with respect to the channel list
		
			if(g_iChannelIndexToAddToFav > -1)
			{
				GUI.enabled	=	false;
			}
			
			for(var m = 0; m < g_iChannelCount; m++)
			{
				for(var n = 0; n < g_objListChannelInfo[m].objListChannelSchedule.Count; n++)
				{
					var fPosX	:	float	=	ConvertHHMMSSToHalfHourSlotMultiple(g_objListChannelInfo[m].objListChannelSchedule[n].strStartTime)*m_fWidthHalfHourSlot;
					var fPosY	:	float	=	m*m_fHeightChannelIcon;
					var fDimX	:	float	=	ConvertHHMMSSToHalfHourSlotMultiple(g_objListChannelInfo[m].objListChannelSchedule[n].strDuration)*m_fWidthHalfHourSlot;
					var fDimY	:	float	=	m_fHeightChannelIcon;
					
					var rectEvent	:	Rect = Rect(fPosX, fPosY, fDimX, fDimY);
					
					if(IsEventRectIntersectingEPGScheduleViewPort(rectEvent))
					{
						var strProg	:	String	=	g_objListChannelInfo[m].objListChannelSchedule[n].strEventName;
						if(GUI.Button(rectEvent,strProg) && !m_bIsSwipeActive)
						{
							m_iIndexOfChannelTappedEvent	=	m;
							m_iIndexOfEventTappedEvent	=	n;
						}
						//print(m+"_"+n);
					}
				}
			}
			
		GUI.EndScrollView ();
	}
	GUI.skin = null ;
	
	GUI.enabled	=	true;
	
	//**************************Channels Icons****************************//
	GUI.skin = m_skinEPGChannelsList;
	
	m_rectChannelsListViewPort		=	Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightTimeLineLeftArrowButton,m_fWidthChannelIcon + 2*m_fWidthHalfHourSlot,4*m_fHeightChannelIcon);
	m_rectChannelsListFullScroll	=	Rect(0,0,m_fWidthChannelIcon + 2*m_fWidthHalfHourSlot,g_iChannelCount*m_fHeightChannelIcon);
	m_v2ScrollChannelThumbnailYAxis = GUI.BeginScrollView(m_rectChannelsListViewPort,m_v2ScrollChannelThumbnailYAxis,m_rectChannelsListFullScroll);
	
	for(var i=0;i<g_iChannelCount;i++)
	{
		var rectChannel	:	Rect = Rect(0,i*m_fHeightChannelIcon,m_fWidthChannelIcon,m_fHeightChannelIcon);
		
		if(IsChannelRectIntersectingChannelsListViewPort(rectChannel))
		{
			var strImagePath = g_objListChannelInfo[i].strServiceName;
			var tex2DChannelImage = Resources.Load(strImagePath) as Texture2D;
			if(tex2DChannelImage == null)
	    	{	Debug.Log("....................IKN5");
	    		Debug.Log("NameWithOUtIcon==>"+g_objListChannelInfo[i].strServiceName +"......."+g_objListChannelInfo[i].strGenreName);
	    		print(g_objListChannelInfo[i].strServiceName +"......."+g_objListChannelInfo[i].strGenreName);
	    		tex2DChannelImage = Resources.Load("000BLANK") as Texture2D;
	    		if(tex2DChannelImage == null)
	    		{
	    			//print("Locha");
	    		}
	    	}
			Debug.Log("NameWithOUtIcon==>"+g_objListChannelInfo[i].strServiceName +"......."+g_objListChannelInfo[i].strGenreName);
			Debug.Log(".......................IKN");
			m_bChannelToggleState[i] = GUI.Toggle(rectChannel,m_bChannelToggleState[i],tex2DChannelImage);
			//print(i);
			
			if(m_bChannelToggleState[i])
			{
				g_iChannelIndexToAddToFav	=	i;
				ResetStateOfRestOtherToggles(g_iChannelIndexToAddToFav);
			}
			
			if(g_iChannelIndexToAddToFav > -1)
			{
				if(m_bChannelToggleState[g_iChannelIndexToAddToFav] == false)
				{
					g_iChannelIndexToAddToFav	=	-1;
				}
			}
		}
	}
	
	if(g_iChannelIndexToAddToFav > -1)
	{
		m_skinEPGChannelsList.button.fontSize	=	Mathf.Min(2*m_fWidthHalfHourSlot,m_fHeightChannelIcon)/4.5;
		
		var strButtonText	:	String;
		if(g_objListChannelInfo[g_iChannelIndexToAddToFav].bIsFavourite	== false)
		{
			strButtonText	=	"+ Add To Favourites";
		}
		else
		{
			strButtonText	=	"  Already Favourite";
		}
		
		if(GUI.Button(Rect(m_fWidthChannelIcon,g_iChannelIndexToAddToFav*m_fHeightChannelIcon,2*m_fWidthHalfHourSlot,m_fHeightChannelIcon),strButtonText,m_skinEPGChannelsList.button))
		{	
			if(strButtonText	==	"+ Add To Favourites")
			{	tracking("Add To Favourites"+g_objListChannelInfo[g_iChannelIndexToAddToFav].strChannelName);
				//call AddToFav API
				var strUUID : String = PlayerPrefs.GetString("DeviceUID");
				var strInput = "{\"uuId\":\"" + strUUID + "\",\"serviceId\":\"" + g_objListChannelInfo[g_iChannelIndexToAddToFav].strServiceName +"\",\"sCNumberField\":\"" + g_strConnectionId +"\"}";
				InvokeReSTfulAPI("epg/AddToUserFavouriteList",strInput,-1);
				
				g_objListChannelInfo[g_iChannelIndexToAddToFav].bIsFavourite	=	true;
			}
			
			m_bChannelToggleState[g_iChannelIndexToAddToFav] = false;
			g_iChannelIndexToAddToFav = -1;
		}
	}
            		
	GUI.EndScrollView ();						
	GUI.skin = null ;
}

var m_fPosX	:	float;
var m_fDimX	:	float;
function RenderChannelScheduleGridBy(strGenre	:	String)
{	
	if(m_count == 0 ){
		m_count ++;
		tracking("TV Guide");
		//IdentifyGener(strGenre);
	}
	RenderHeaderTimeLine();
	
	//*************Program Guide with respect to channels***************//
	GUI.skin = m_skinProgramGuide ;
	m_skinProgramGuide.button.fontSize			=	Mathf.Min(m_fWidthHalfHourSlot,m_fHeightChannelIcon)/5.0;
	m_skinProgramGuide.button.font				= 	m_fontRegular;	
	m_skinProgramGuide.button.normal.textColor 	= 	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);

	//rotate please wait n refresh button till channel data doesn't come from API
	if(g_iChannelCount <= 0)
	{
		RenderSplash(false);
	}
	else//show schedule grid
	{
		var iChannelsCountInCurrentGenre	:	int	= 0;
		
		if(g_iChannelIndexToAddToFav > -1)
		{
			GUI.enabled	=	false;
		}
		
		for(var i = 0; i < g_iChannelCount; i++)
		{
			if(g_objListChannelInfo[i].strGenreName == strGenre)
			{	//tracking(strGenre);
				iChannelsCountInCurrentGenre++;
			}
		}
		
		if(iChannelsCountInCurrentGenre == 0)
		{
			m_skinRefreshButton.box.fontSize		=	Mathf.Min(m_fWidthTVGuideDiv,4*m_fHeightChannelIcon)/18.0;
			GUI.Box(Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightTimeLineLeftArrowButton,m_fWidthTVGuideDiv,4*m_fHeightChannelIcon),"Your present package does not have channels from this genre.",m_skinRefreshButton.box);
		}
		else
		{
			m_rectEPGScheduleViewPort	=	Rect(m_fDisplacementX + m_fWidthFilterDiv + m_fWidthTimeLineLeftArrowButton,m_fHeightTimeLineDiv,m_fWidthTVGuideDiv - m_fWidthChannelIcon,4*m_fHeightChannelIcon);
			m_rectEPGScheduleFullScroll	=	Rect(0,0,144*m_fWidthHalfHourSlot,iChannelsCountInCurrentGenre*m_fHeightChannelIcon);
		
			//now make a scroll which is m_fHeightChannelIcon x iChannelsCountInCurrentGenre			
			m_v2ScrollScheduleXYAxis = GUI.BeginScrollView(m_rectEPGScheduleViewPort,m_v2ScrollScheduleXYAxis,m_rectEPGScheduleFullScroll);
			m_v2ScrollChannelThumbnailYAxis.y = m_v2ScrollScheduleXYAxis.y;// to store the position so we can drag the window with respect to the channel list			//2days schedule grid
				
				iChannelsCountInCurrentGenre = 0;
				for(var m = 0; m < g_iChannelCount; m++)
				{
					if(g_objListChannelInfo[m].strGenreName == strGenre)
					{
						m_fPosX	=	0.0;
						m_fDimX	=	0.0;
						if(g_objListChannelInfo[m].objListChannelSchedule.Count > 0)
						{
							for(var n = 0; n < g_objListChannelInfo[m].objListChannelSchedule.Count; n++)
							{
								var fPosX	:	float	=	ConvertHHMMSSToHalfHourSlotMultiple(g_objListChannelInfo[m].objListChannelSchedule[n].strStartTime)*m_fWidthHalfHourSlot;
								if(fPosX < m_fPosX)
								{
									m_fPosX = m_fPosX + m_fDimX;
								}
								else
								{
									m_fPosX = fPosX;
								}
								
								var fPosY	:	float	=	iChannelsCountInCurrentGenre*m_fHeightChannelIcon;
								
								m_fDimX					=	ConvertHHMMSSToHalfHourSlotMultiple(g_objListChannelInfo[m].objListChannelSchedule[n].strDuration)*m_fWidthHalfHourSlot;
								var fDimY	:	float	=	m_fHeightChannelIcon;
									
								var rectEvent	:	Rect = Rect(m_fPosX, fPosY, m_fDimX, fDimY);
								
								if(IsEventRectIntersectingEPGScheduleViewPort(rectEvent))
								{
									var strProg	:	String	=	g_objListChannelInfo[m].objListChannelSchedule[n].strEventName;
									if(GUI.Button(rectEvent,strProg) && !m_bIsSwipeActive)
									{	tracking(strProg);
										m_iIndexOfChannelTappedEvent = m;
										m_iIndexOfEventTappedEvent = n;
									}
								}
							}
						}
						else
						{
							for(n = 0; n < 144; n++)
							{
								var rectHalfHourEvent	:	Rect	=	Rect(n*m_fWidthHalfHourSlot, iChannelsCountInCurrentGenre*m_fHeightChannelIcon, m_fWidthHalfHourSlot, m_fHeightChannelIcon);
								if(IsEventRectIntersectingEPGScheduleViewPort(rectHalfHourEvent))
								{
									GUI.Button(rectHalfHourEvent,"Loading...");
								}
							}
						}
						
						iChannelsCountInCurrentGenre++;
					}
				}
				
			GUI.EndScrollView ();
			
			GUI.enabled	=	true;
		
			//**************************Channels Icons****************************//
			GUI.skin = m_skinEPGChannelsList;
			
			m_rectChannelsListViewPort		=	Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightTimeLineLeftArrowButton,m_fWidthChannelIcon + 2*m_fWidthHalfHourSlot,4*m_fHeightChannelIcon);
			m_rectChannelsListFullScroll	=	Rect(0,0,m_fWidthChannelIcon + 2*m_fWidthHalfHourSlot,iChannelsCountInCurrentGenre*m_fHeightChannelIcon);
			
			m_v2ScrollChannelThumbnailYAxis = GUI.BeginScrollView(m_rectChannelsListViewPort,m_v2ScrollChannelThumbnailYAxis, m_rectChannelsListFullScroll);
			
				var iIndexGridFromTop : int = -1;
				iChannelsCountInCurrentGenre = 0;
				for(i = 0; i < g_iChannelCount; i++)
				{
					if(g_objListChannelInfo[i].strGenreName == strGenre)
					{
						var rectChannel	:	Rect = Rect(0,iChannelsCountInCurrentGenre	*m_fHeightChannelIcon,m_fWidthChannelIcon,m_fHeightChannelIcon);
		
						if(IsChannelRectIntersectingChannelsListViewPort(rectChannel))
						{
							//loading channels icons
							var strImagePath = g_objListChannelInfo[i].strServiceName;
							var tex2DChannelImage = Resources.Load(strImagePath) as Texture2D;
							if(tex2DChannelImage == null)
			    			{
			    				Debug.Log("....................IKN3"+"ikn.333....."+g_objListChannelInfo[i].strServiceName+"............"+g_objListChannelInfo[i].strGenreName);
			    				tex2DChannelImage = Resources.Load("000BLANK") as Texture2D;
			    				if(tex2DChannelImage == null)
			    				{
			    					//print("Locha");
			    				}
			    			}
			    			//Debug.Log("....................IKN4"+"ikn......"+g_objListChannelInfo[i].strServiceName+"............"+g_objListChannelInfo[i].strGenreName);
			    			//render i'th channel icon
			    			m_bChannelToggleState[i] = GUI.Toggle(rectChannel,m_bChannelToggleState[i],tex2DChannelImage);
			    			
			    			if(m_bChannelToggleState[i])
							{
								g_iChannelIndexToAddToFav	=	i;
								iIndexGridFromTop			=	iChannelsCountInCurrentGenre;
								ResetStateOfRestOtherToggles(g_iChannelIndexToAddToFav);
							}
							
							//toggle off : normal channel icon
							if(g_iChannelIndexToAddToFav > -1)
							{
								if(m_bChannelToggleState[g_iChannelIndexToAddToFav] == false)
								{
									g_iChannelIndexToAddToFav	=	-1;
									iIndexGridFromTop			=	-1;
								}
							}
							
							GetScheduleForChannelByIndex(i);
			    		}
			    		//increment channel
			    		iChannelsCountInCurrentGenre++;
		    		}
		    	}
		    	
		    	if(g_iChannelIndexToAddToFav > -1)
				{
					m_skinEPGChannelsList.button.fontSize	=	Mathf.Min(2*m_fWidthHalfHourSlot,m_fHeightChannelIcon)/4.5;
					
					var strButtonText	:	String;
					if(g_objListChannelInfo[g_iChannelIndexToAddToFav].bIsFavourite	== false)
					{
						strButtonText	=	"+ Add To Favourites";
					}
					else
					{
						strButtonText	=	"Already In Favourites";
					}
					
					if(GUI.Button(Rect(m_fWidthChannelIcon,iIndexGridFromTop*m_fHeightChannelIcon,2*m_fWidthHalfHourSlot,m_fHeightChannelIcon),strButtonText,m_skinEPGChannelsList.button))
					{	
						if(strButtonText	==	"+ Add To Favourites")
						{
							//call AddToFav API
							var strUUID : String = PlayerPrefs.GetString("DeviceUID");
							var strInput = "{\"uuId\":\"" + strUUID + "\",\"serviceId\":\"" + g_objListChannelInfo[g_iChannelIndexToAddToFav].strServiceName +"\",\"sCNumberField\":\"" + g_strConnectionId +"\"}";
							InvokeReSTfulAPI("epg/AddToUserFavouriteList",strInput,-1);
							
							g_objListChannelInfo[g_iChannelIndexToAddToFav].bIsFavourite	=	true;
						}
						
						tracking("ServiceId:"+g_objListChannelInfo[g_iChannelIndexToAddToFav].strServiceName);
						
						m_bChannelToggleState[g_iChannelIndexToAddToFav] = false;
						g_iChannelIndexToAddToFav = -1;
					}
				}
		    	
		    GUI.EndScrollView();
		    GUI.skin	=	null;
		}
	}
}

function RenderFavChannelsScheduleGrid()
{
	RenderHeaderTimeLine();
	
	if(m_objGetFavChannelsListAPIPacket.m_bResponseReceived == false)
	{
		if(m_bGetFavChannelsListAPIInProgress)
		{
			RenderSplash(false);
		}
		else
		{
			PopulateFavChannelsWithScheduleToUI();
		}
	}
	else
	{
		//parse response
		ParseGetFavChannelsListAPIResponse();
		m_bGetFavChannelsListAPIInProgress = false;
	}
}

function PopulateFavChannelsWithScheduleToUI()
{
	if(m_strGetFavChannelsAPIResult != "")
	{
		//display error
		m_skinRefreshButton.box.fontSize		=	Mathf.Min(m_fWidthTVGuideDiv,4*m_fHeightChannelIcon)/18.0;
		GUI.Box(Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightTimeLineLeftArrowButton,m_fWidthTVGuideDiv,4*m_fHeightChannelIcon),m_strGetFavChannelsAPIResult,m_skinRefreshButton.box);
	}
	else
	{
		if(m_iCountFavChannels <= 0)
		{
			m_skinRefreshButton.box.fontSize		=	Mathf.Min(m_fWidthTVGuideDiv,4*m_fHeightChannelIcon)/18.0;
			GUI.Box(Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightTimeLineLeftArrowButton,m_fWidthTVGuideDiv,4*m_fHeightChannelIcon),m_strGetFavChannelsAPIResult,m_skinRefreshButton.box);
			return;
		}
		
		GUI.skin = m_skinProgramGuide;
		m_skinProgramGuide.button.fontSize			=	Mathf.Min(m_fWidthHalfHourSlot,m_fHeightChannelIcon)/5.0;
		m_skinProgramGuide.button.font				= 	m_fontRegular;	
		m_skinProgramGuide.button.normal.textColor 	= 	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
		
		m_rectEPGScheduleViewPort	=	Rect(m_fDisplacementX + m_fWidthFilterDiv+m_fWidthTimeLineLeftArrowButton,m_fHeightTimeLineDiv,m_fWidthTVGuideDiv - m_fWidthChannelIcon,4*m_fHeightChannelIcon);
		m_rectEPGScheduleFullScroll	=	Rect (0, 0,144*m_fWidthHalfHourSlot,m_iCountFavChannels*m_fHeightChannelIcon);

		m_v2ScrollScheduleXYAxis = GUI.BeginScrollView (m_rectEPGScheduleViewPort,m_v2ScrollScheduleXYAxis,m_rectEPGScheduleFullScroll);
		m_v2ScrollChannelThumbnailYAxis.y=m_v2ScrollScheduleXYAxis.y;// to store the position so we can drag the window with respect to the channel list
			
			if(g_iChannelIndexToRemFromFav > -1)
			{
				GUI.enabled	=	false;
			}
	
			for(var m = 0; m < m_iCountFavChannels; m++)
			{
				m_fPosX	=	0.0;
				m_fDimX	=	0.0;
				var iIndexInMainList	:	int	=	GetChannelIndexInMainListByName(m_strArrayOfFavChannels[m]);
				
				if(g_objListChannelInfo[iIndexInMainList].bIsFavourite	== false)
				{
					g_objListChannelInfo[iIndexInMainList].bIsFavourite	=	true;
				}
				
				if(g_objListChannelInfo[iIndexInMainList].objListChannelSchedule.Count > 0)
				{
					for(var n = 0; n < g_objListChannelInfo[iIndexInMainList].objListChannelSchedule.Count; n++)
					{
						var fPosX	:	float	=	ConvertHHMMSSToHalfHourSlotMultiple(g_objListChannelInfo[iIndexInMainList].objListChannelSchedule[n].strStartTime)*m_fWidthHalfHourSlot;
						if(fPosX < m_fPosX)
						{
							m_fPosX = m_fPosX + m_fDimX;
						}
						else
						{
							m_fPosX = fPosX;
						}
						
						var fPosY	:	float	=	m*m_fHeightChannelIcon;
						
						m_fDimX					=	ConvertHHMMSSToHalfHourSlotMultiple(g_objListChannelInfo[iIndexInMainList].objListChannelSchedule[n].strDuration)*m_fWidthHalfHourSlot;
						var fDimY	:	float	=	m_fHeightChannelIcon;
							
						var rectEvent	:	Rect = Rect(m_fPosX, fPosY, m_fDimX, fDimY);
	
						if(IsEventRectIntersectingEPGScheduleViewPort(rectEvent))
						{
							var strProg	:	String	=	g_objListChannelInfo[iIndexInMainList].objListChannelSchedule[n].strEventName;
							if(GUI.Button(rectEvent,strProg) && !m_bIsSwipeActive)
							{
								m_iIndexOfChannelTappedEvent = iIndexInMainList;
								m_iIndexOfEventTappedEvent = n;
							}
						}
					}
				}
				else
				{
					for(n = 0; n < 144; n++)
					{
						var rectHalfHourEvent	:	Rect	=	Rect(n*m_fWidthHalfHourSlot, m*m_fHeightChannelIcon, m_fWidthHalfHourSlot, m_fHeightChannelIcon);
						if(IsEventRectIntersectingEPGScheduleViewPort(rectHalfHourEvent))
						{
							GUI.Button(rectHalfHourEvent,"Loading...");
						}
					}
				}
			}
		
		GUI.EndScrollView ();
		GUI.skin = null ;
		
		GUI.enabled	=	true;
	
		//channel grids
		//**************************Channels Icons****************************//
		GUI.skin = m_skinEPGChannelsList;
		
		m_rectChannelsListViewPort		=	Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightTimeLineLeftArrowButton,m_fWidthChannelIcon + 2*m_fWidthHalfHourSlot,4*m_fHeightChannelIcon);
		m_rectChannelsListFullScroll	=	Rect(0,0,m_fWidthChannelIcon + 2*m_fWidthHalfHourSlot,m_iCountFavChannels*m_fHeightChannelIcon);
	
		m_v2ScrollChannelThumbnailYAxis =	GUI.BeginScrollView(m_rectChannelsListViewPort,m_v2ScrollChannelThumbnailYAxis,m_rectChannelsListFullScroll);
		
		
		for(var i=0;i<m_iCountFavChannels;i++)
		{
			var rectChannel	:	Rect = Rect(0,i*m_fHeightChannelIcon,m_fWidthChannelIcon,m_fHeightChannelIcon);
			if(IsChannelRectIntersectingChannelsListViewPort(rectChannel))
			{
				var strImagePath = m_strArrayOfFavChannels[i];
				var tex2DChannelImage = Resources.Load(strImagePath) as Texture2D;
				if(tex2DChannelImage == null)
		    	{	Debug.Log("....................IKN1");
		    		tex2DChannelImage = Resources.Load("000BLANK") as Texture2D;
		    		if(tex2DChannelImage == null)
		    		{
		    			//print("Locha");
		    		}
		    	}
				Debug.Log("....................IKN2");
				m_bChannelToggleState[i] = GUI.Toggle(Rect(0,i*m_fHeightChannelIcon,m_fWidthChannelIcon,m_fHeightChannelIcon),m_bChannelToggleState[i],tex2DChannelImage);
				
				if(m_bChannelToggleState[i])
				{
					g_iChannelIndexToRemFromFav	=	i;
					ResetStateOfRestOtherToggles(g_iChannelIndexToRemFromFav);
				}
				
				if(g_iChannelIndexToRemFromFav > -1)
				{
					if(m_bChannelToggleState[g_iChannelIndexToRemFromFav] == false)
					{
						g_iChannelIndexToRemFromFav	=	-1;
					}
				}
				
				iIndexInMainList	=	GetChannelIndexInMainListByName(m_strArrayOfFavChannels[i]);
				GetScheduleForChannelByIndex(iIndexInMainList);
			}
		}
		
		if(g_iChannelIndexToRemFromFav > -1)
		{
			m_skinEPGChannelsList.button.fontSize	=	Mathf.Min(2*m_fWidthHalfHourSlot,m_fHeightChannelIcon)/4.5;
			
			if(GUI.Button(Rect(m_fWidthChannelIcon,g_iChannelIndexToRemFromFav*m_fHeightChannelIcon,2*m_fWidthHalfHourSlot,m_fHeightChannelIcon),"- Remove From Favourites",m_skinEPGChannelsList.button))
			{	
				//call AddToFav API
				var strUUID : String = PlayerPrefs.GetString("DeviceUID");
				var strInput = "{\"uuId\":\"" + strUUID + "\",\"serviceId\":\"" + m_strArrayOfFavChannels[g_iChannelIndexToRemFromFav] +"\",\"sCNumberField\":\"" + g_strConnectionId +"\"}";
				InvokeReSTfulAPI("epg/deleteChannelFromFavouriteList",strInput,-1);
				
				g_objListChannelInfo[g_iChannelIndexToRemFromFav].bIsFavourite	=	false;
				
				m_bChannelToggleState[g_iChannelIndexToRemFromFav] = false;
				
				RemoveChannelFromFavList(g_iChannelIndexToRemFromFav);
				
				g_iChannelIndexToRemFromFav = -1;
			}
		}
		GUI.EndScrollView ();						
		GUI.skin = null ;
	}
}

var m_iCountFavChannels					:	int;
var m_bGetFavChannelsListAPIInProgress	:	boolean;
var m_objGetFavChannelsListAPIPacket	:	CWebAPIPacket;
var g_objScriptAPIHandler				:	ScriptAPIHandler;
var m_strGetFavChannelsAPIResult		:	String;
var m_strArrayOfFavChannels				:	String[];
var m_strArrayOfFavChannelsSchedule		:	String[];
function HitGetFavChannelsListAPI()
{	
	//tracking("one"+g_strListGenres[m_iIndexOfActiveFilterItem]);
	var strUUID 		: String 	= 	PlayerPrefs.GetString("DeviceUID");
	
	var strAPIURL		:	String	=	ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
	var strAPIMethod	:	String	=	"epg/GetUserFavChannelList";
    var strInput		:	String	=	"{\"uuId\":\"" + strUUID +"\",\"sCNumberField\":\"" + g_strConnectionId +"\"}";
    
    Debug.Log("Invoke API.....Imran KHAN NIAZI : " + strAPIURL + strAPIMethod + " - " + strInput);
    
    m_objGetFavChannelsListAPIPacket 		= 	new CWebAPIPacket(strAPIURL, strAPIMethod, strInput);
    m_bGetFavChannelsListAPIInProgress		=	true;
    g_objScriptAPIHandler.InvokeReSTfulAPI(m_objGetFavChannelsListAPIPacket);
}

function ParseGetFavChannelsListAPIResponse()
{
	if(m_objGetFavChannelsListAPIPacket.m_strResponseCode == "200 OK")
	{
		var N = JSON.Parse(m_objGetFavChannelsListAPIPacket.m_strOutput);
		if(N == null)
		{
			m_strGetFavChannelsAPIResult	=	"No channels added in the favorites list yet.";
			//print(m_strGetFavChannelsAPIResult);
		}
		else
		{
			//Debug.Log("Reassembled: " + N.ToString());
			if(N.ToString() == "{}")
			{
				m_strGetFavChannelsAPIResult	=	"Empty JSON";
				//print(m_strGetFavChannelsAPIResult);
			}
			else
			{
				m_iCountFavChannels = 0;
				while(N[m_iCountFavChannels] != null)
				{
					m_iCountFavChannels++;
				}
				
				m_strArrayOfFavChannels	=	new String[m_iCountFavChannels];					
				for(var i = 0; i < m_iCountFavChannels; i++)
				{
					m_strArrayOfFavChannels[i]	=	N[i];
				}
								
				if(m_iCountFavChannels == 0)
				{
					m_strGetFavChannelsAPIResult = "You have not yet added any channels to your favourite channels' list.";
				}
				else
				{
					m_strGetFavChannelsAPIResult = "";
				}
			}
		}
	}
	else
	{
		m_strGetFavChannelsAPIResult	=	"HTTP Error : " + m_objGetFavChannelsListAPIPacket.m_strResponseCode + ". Please try later.";
		//print(m_strGetFavChannelsAPIResult);
	}
	
	m_objGetFavChannelsListAPIPacket.m_bResponseReceived 	= 	false;
}

function RenderHeaderTimeLine()
{
	//**************************Time Line******************************//
	GUI.skin = m_skinTimeLineArrows ;
	
	m_skinTimeLineArrows.box.fontSize				=	Mathf.Min(m_fWidthHalfHourSlot,0.5*m_fHeightTimeLineDiv)/1.75;
	m_skinTimeLineArrows.box.font					= 	m_fontBold;	
	m_skinTimeLineArrows.box.normal.textColor 		= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	GUI.Box(Rect(m_fDisplacementX + m_fWidthFilterDiv,0.0,m_fWidthTVGuideDiv,0.49*m_fHeightTimeLineDiv),GetDayDateWRTScrollPos());
	
	var rectViewPort	:	Rect	=	Rect (m_fDisplacementX + m_fWidthFilterDiv + m_fWidthTimeLineLeftArrowButton,0.5*m_fHeightTimeLineDiv,m_fWidthTVGuideDiv - m_fWidthTimeLineLeftArrowButton,0.5*m_fHeightTimeLineDiv);
	var rectFullScroll	:	Rect	=	Rect (0, 0,144*m_fWidthHalfHourSlot,0.5*m_fHeightTimeLineDiv);
	m_v2ScrollTimelineXAxis = GUI.BeginScrollView (rectViewPort,m_v2ScrollTimelineXAxis, rectFullScroll);
	m_v2ScrollScheduleXYAxis.x = m_v2ScrollTimelineXAxis.x;			

		for(var i=0; i < 144; i++)
		{
			var rectHalfHourBox	: Rect = Rect(i*m_fWidthHalfHourSlot, 0, m_fWidthHalfHourSlot, 0.5*m_fHeightTimeLineDiv);
			if(IsHalfHourRectIntersectingTimeLineViewPort(rectViewPort, rectHalfHourBox))
			{
				m_skinTimeLineArrows.label.fontSize				=	Mathf.Min(m_fWidthHalfHourSlot,0.5*m_fHeightTimeLineDiv)/1.75;
				m_skinTimeLineArrows.label.font					= 	m_fontBold;	
				m_skinTimeLineArrows.label.normal.background	=	m_Tex2DPurple;
				m_skinTimeLineArrows.label.normal.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);

				GUI.Label(rectHalfHourBox, g_strTime[i]);
			}
		}
		
	GUI.EndScrollView ();
	
	GUI.BeginGroup(Rect(m_fDisplacementX + m_fWidthFilterDiv,0,m_fWidthTVGuideDiv,m_fHeightTimeLineDiv),""); // time line for the programs running in the channel	
		
		//GUI.Box(Rect(0,0,m_fWidthTVGuideDiv,m_fHeightTimeLineDiv),"");
		m_skinTimeLineArrows.button.normal.background	=	m_Tex2DBorderLine;
		if(GUI.RepeatButton(Rect(0,0,m_fWidthTimeLineLeftArrowButton,m_fHeightTimeLineLeftArrowButton),m_Tex2DArrowLeft))// left Arrow Key
		{
			//m_iScrollDirectionX	=	-1;
			m_v2ScrollTimelineXAxis.x -= 25;
		}
		
		if(GUI.RepeatButton(Rect(m_fWidthTVGuideDiv - m_fWidthTimeLineLeftArrowButton,0,m_fWidthTimeLineLeftArrowButton,m_fHeightTimeLineLeftArrowButton),m_Tex2DArrowRight))// right arror key
		{
			//m_iScrollDirectionX	=	1;
			m_v2ScrollTimelineXAxis.x += 25;
		}
		
		/*if(m_iScrollDirectionX != 0)
		{
			if(m_iScrollDirectionX < 0)
			{
				TakeScrollToLeft();
			}
			else
			{
				TakeScrollToRight();
			}
		}*/
		
	GUI.EndGroup();
	GUI.skin = null ;
}
function TakeScrollToLeft()
{
	if(m_v2ScrollTimelineXAxis.x <= 48.0*m_fWidthHalfHourSlot)
	{
		m_v2ScrollTimelineXAxis.x	-=	100.0;
		
		if(m_v2ScrollTimelineXAxis.x <= 0.0)
		{
			m_iScrollDirectionX = 0;
			m_v2ScrollTimelineXAxis.x	=	0.0;
		}
	}
	else if(m_v2ScrollTimelineXAxis.x > 48.0*m_fWidthHalfHourSlot && m_v2ScrollTimelineXAxis.x <= 96.0*m_fWidthHalfHourSlot)
	{
		m_v2ScrollTimelineXAxis.x	-=	100.0;
		
		if(m_v2ScrollTimelineXAxis.x <= 48.0*m_fWidthHalfHourSlot)
		{
			m_iScrollDirectionX = 0;
			m_v2ScrollTimelineXAxis.x	=	48.0*m_fWidthHalfHourSlot;
		}
	}
	else if(m_v2ScrollTimelineXAxis.x > 96.0*m_fWidthHalfHourSlot)
	{
		m_v2ScrollTimelineXAxis.x	-=	100.0;
		
		if(m_v2ScrollTimelineXAxis.x <= 96.0*m_fWidthHalfHourSlot)
		{
			m_iScrollDirectionX = 0;
			m_v2ScrollTimelineXAxis.x	=	96.0*m_fWidthHalfHourSlot;
		}
	}
}
function TakeScrollToRight()
{
	if(m_v2ScrollTimelineXAxis.x < 48.0*m_fWidthHalfHourSlot)
	{
		m_v2ScrollTimelineXAxis.x	+=	100.0;
		
		if(m_v2ScrollTimelineXAxis.x >= 48.0*m_fWidthHalfHourSlot)
		{
			m_iScrollDirectionX = 0;
			m_v2ScrollTimelineXAxis.x	=	48.0*m_fWidthHalfHourSlot;
		}
	}
	else if(m_v2ScrollTimelineXAxis.x >= 48.0*m_fWidthHalfHourSlot && m_v2ScrollTimelineXAxis.x < 96.0*m_fWidthHalfHourSlot)
	{
		m_v2ScrollTimelineXAxis.x	+=	100.0;
		
		if(m_v2ScrollTimelineXAxis.x >= 96.0*m_fWidthHalfHourSlot)
		{
			m_iScrollDirectionX = 0;
			m_v2ScrollTimelineXAxis.x	=	96.0*m_fWidthHalfHourSlot;
		}
	}
}
function RenderEPGGrid(strActiveGenre	:	String)
{
	if(strActiveGenre	==	"All Channels" && !g_iRenderVideoPlayer)
	{
		RenderChannelScheduleGridForIPHONE();
	}
	else if(strActiveGenre == "Favourites" && !g_iRenderVideoPlayer)
	{
		RenderFavChannelsScheduleGrid();
	}
	else if(g_iRenderVideoPlayer)
	{
		RenderD2HCinemaForIPHONE();
	}
	else
	{
		RenderChannelScheduleGridBy(strActiveGenre);
	}
}


//*************for pop up window****************//




/*
function LoadThumbnail()
{
	var imageBytes : byte[] = IYoutubeBinding.GetYoutubeThumbnailQuick("http://www.youtube.com/watch?v=BmOpD46eZoA", "medium");
	Debug.Log(imageBytes);
	if(imageBytes != null)
	{
		m_Tex2DVideoThumbnail = new Texture2D(1, 1);
		m_Tex2DVideoThumbnail.SetPixel(0, 0, Color.white);
		m_Tex2DVideoThumbnail.LoadImage(imageBytes);
		m_Tex2DVideoThumbnail.Apply();
	}
}
*/

function InvokeReSTfulAPI(strAPI : String, strInput : String, iChannelIndex : int)
{
	var objHeaders : Hashtable = new Hashtable();
	objHeaders.Add("Content-Type","application/json");
	
	var body : byte[] = System.Text.Encoding.ASCII.GetBytes(strInput);
	
	var objWWWReq : WWW = new WWW(ScriptAPIs.g_strWebservicesAtEC2+"api/v1/"+strAPI,body,objHeaders);
	yield objWWWReq;
	
	if(objWWWReq.error == null)
	{
		//print(objWWWReq.text);
		ParseResponse(objWWWReq.text, strAPI, iChannelIndex);
	}
	else
	{
		print("Web invoke error: "+objWWWReq.error);
	}
}
function ParseResponse(strResponse : String, strAPI : String, iChannelIndex : int)
{
	var N = JSON.Parse(strResponse);
	
	if(N == null)
	{
		//print(strAPI + " : NULL JSON Response");
	}
	else
	{
		switch(strAPI)
		{
		case "epg/getAllEpgByGenre":
			////print("Reassembled: " + N.ToString());
			CacheDumpListChannel(strResponse);
			while(N["Data"][g_iChannelCount] != null)
			{
				g_objListChannelInfo.Add(new CChannelInfo());
				g_objListChannelInfo[g_iChannelCount].strServiceName 			=	N["Data"][g_iChannelCount]["SERVICE"];//for icons
				g_objListChannelInfo[g_iChannelCount].strGenreName 				=	N["Data"][g_iChannelCount]["GENRENAME"];
				g_objListChannelInfo[g_iChannelCount].strChannelName 			=	N["Data"][g_iChannelCount]["channelName"];
				g_objListChannelInfo[g_iChannelCount].objListChannelSchedule 	=	new List.<CChannelSchedule>();
			 	g_iChannelCount++;
			}
			InitChannelToggleState();	//initialize all to false
			//StartCoroutine(DownloadRemainingSchedule(0.0));
			break;
			
		case "epg/getChannelSchedule":
			CacheDumpScheduleByChannel(strResponse,iChannelIndex);
			
			ProcessScheduleByChannel(iChannelIndex,strResponse);
			
			////print("Total Events: "+i);	
			break;
			
		case "product/GetD2HCinemaDetails":
			
			while(N[g_iD2HCinemaChannelCount] != null)
			{
				g_objListD2HCinemaChannels.Add(new CD2HCinemaChannels());
				
				g_objListD2HCinemaChannels[g_iD2HCinemaChannelCount].strMovieName	=	N[g_iD2HCinemaChannelCount]["movieName"];
				g_objListD2HCinemaChannels[g_iD2HCinemaChannelCount].strChannelNo	=	N[g_iD2HCinemaChannelCount]["channelNo"];
				g_objListD2HCinemaChannels[g_iD2HCinemaChannelCount].strShowDates	=	N[g_iD2HCinemaChannelCount]["ShowDates"];
				g_objListD2HCinemaChannels[g_iD2HCinemaChannelCount].strURL			=	N[g_iD2HCinemaChannelCount]["youtube"];
				
				var strVideoId	:	String	=	g_objListD2HCinemaChannels[g_iD2HCinemaChannelCount].strURL;
				var position	:	int		=	strVideoId.LastIndexOf('/');
				if (position > -1)
				    strVideoId = strVideoId.Substring(position + 1);
				DownloadThumbnail(g_iD2HCinemaChannelCount, strVideoId);
				
				g_iD2HCinemaChannelCount++;
			}
			break;
		
		case "product/AddD2HCinema":
			m_strAddD2HCinemaResult	=	N["AddD2HCinemaResult"];
			break;
			
		default:
			//print("Default");
			break;
		}
	}
}
function DownloadThumbnail(iIndex	:	int, strVideoId	:	String)
{
	var www : WWW = new WWW ("http://img.youtube.com/vi/" + strVideoId + "/sddefault.jpg");
	// Wait for download to complete
	yield www;
	g_objListD2HCinemaChannels[iIndex].tex2DThumbnail	=	www.texture;
}
function IsChannelFav(iChannelIndex	:	int)	:	boolean
{
	for(var i = 0; i < m_iCountFavChannels; i++)
	{
		if(g_objListChannelInfo[iChannelIndex].strServiceName	==	m_strArrayOfFavChannels[i])
		{
			return true;
		}
	}
	return false;
}
function RemoveChannelFromFavList(iChannelIndex	:	int)
{
	for(var i = iChannelIndex; i < m_iCountFavChannels - 1; i++)
	{
		m_strArrayOfFavChannels[i] = "";
		
		if(m_strArrayOfFavChannels[i+1])
		{
			if(m_strArrayOfFavChannels[i+1] != "")
				m_strArrayOfFavChannels[i] = m_strArrayOfFavChannels[i+1];
		}
	}
	m_iCountFavChannels--;
}
function GetChannelIndexInMainListByName(strChannelName	:	String)	:	int
{
	var iIndex	:	int = -1;
	for(var i = 0; i < g_iChannelCount; i++)
	{
		if(g_objListChannelInfo[i].strServiceName	==	strChannelName)
		{
			iIndex	=	i;
			break;
		}
	}
	return iIndex;
}

function InitChannelToggleState()
{
	m_bChannelToggleState = new boolean[g_iChannelCount];
	
	for(var i = 0; i < g_iChannelCount; i++)
	{
		m_bChannelToggleState[i] = false;
		
		if(g_objListChannelInfo[i].iHaveSchedule == 2)
		{
			g_objListChannelInfo[i].iHaveSchedule	=	0;
		}
	}
}
function ResetStateOfRestOtherToggles(iExceptionIndex	:	int)
{
	for(var i=0; i<g_iChannelCount; i++)
	{
		if(i != iExceptionIndex)
		{
			m_bChannelToggleState[i] = false;
		}
	}
}

function InitFilterToggleState()
{
	m_bFilterToggleState = new boolean[26];
	
	for(var i = 0; i < 26; i++)
	{
		m_bFilterToggleState[i] = false;
	}
}
function ResetStateOfRestFilterToggles(iExceptionIndex	:	int)
{	
		
	//tracking(g_strListGenres[iExceptionIndex]);
	for(var i=0; i<26; i++)
	{
		if(i != iExceptionIndex){
			m_bFilterToggleState[i] = false;
		}
	}
}

function GetDayDateWRTScrollPos() : String
{
	if(m_v2ScrollTimelineXAxis.x < 48*m_fWidthHalfHourSlot)
	{
		return GetCurrentDayDateMonth();
	}
	else if(m_v2ScrollTimelineXAxis.x >= 48*m_fWidthHalfHourSlot && m_v2ScrollTimelineXAxis.x < 96*m_fWidthHalfHourSlot)
	{
		return GetTomorrowDayDateMonth();
	}
	else
	{
		return GetDayAfterTomorrowDayDateMonth();
	}
}

function GetCurrentDayDateMonth() : String
{
	var iCurrentMonth = System.DateTime.Now.Month;
	var strCurrentDate = System.DateTime.Now.get_Day();
	var strCurrentDay = System.DateTime.Now.DayOfWeek;
	var strCurrentYear	=	System.DateTime.Now.Year;
	
	return strCurrentDay + ", " + strCurrentDate + " " + g_strarrMonth[iCurrentMonth-1] + " " + strCurrentYear;
}
function GetTomorrowDayDateMonth() : String
{
	var iCurrentMonth = System.DateTime.Now.AddDays(1).Month;
	var strCurrentDate = System.DateTime.Now.AddDays(1).get_Day();
	var strCurrentDay = System.DateTime.Now.AddDays(1).DayOfWeek;
	var strCurrentYear	=	System.DateTime.Now.AddDays(1).Year;
	
	return strCurrentDay + ", " + strCurrentDate + " " + g_strarrMonth[iCurrentMonth-1] + " " + strCurrentYear;
}
function GetDayAfterTomorrowDayDateMonth() : String
{
	var iCurrentMonth = System.DateTime.Now.AddDays(2).Month;
	var strCurrentDate = System.DateTime.Now.AddDays(2).get_Day();
	var strCurrentDay = System.DateTime.Now.AddDays(2).DayOfWeek;
	var strCurrentYear	=	System.DateTime.Now.AddDays(2).Year;
	
	return strCurrentDay + ", " + strCurrentDate + " " + g_strarrMonth[iCurrentMonth-1] + " " + strCurrentYear;
}

function GetCurrentTime() : String
{
	var iCurrentHour = System.DateTime.Now.Hour;
	var iCurrentMin = System.DateTime.Now.Minute;
	
	var strHour : String = iCurrentHour.ToString();
	var strMin	: String = iCurrentMin.ToString();
	
	if(iCurrentHour < 10)
	{
		strHour = "0" + iCurrentHour.ToString();
	}
	
	if(iCurrentMin < 10)
	{
		strMin = "0" + iCurrentMin.ToString();
	}
	
	return strHour + ":" + strMin;
}

function ConvertHHMMSSToHalfHourSlotMultiple(strTimeInHHMMSS	:	String)	:	float
{
	var elapsedSpan = System.TimeSpan.Parse(strTimeInHHMMSS);
	return elapsedSpan.TotalMinutes/30.0;
}

function RenderSplash(bIsD2HCinemaScreen	:	boolean)
{
	//render please wait splash

	if(bIsD2HCinemaScreen)
	{
		var fUnitY	:	float	=	Screen.height/12.8;
		m_fHeightTimeLineDiv	=	1.3*fUnitY;
	
		GUI.Box(Rect(0,m_fHeightTimeLineDiv,m_fWidthTVGuideDiv,4*m_fHeightChannelIcon + fUnitY),"",m_skinRefreshButton.box);//FOR GRADIENT in the first column
		
		m_v2PivotPoint = Vector2(m_fWidthTVGuideDiv/2,m_fHeightTimeLineDiv + (4*m_fHeightChannelIcon + fUnitY)/2);
		GUIUtility.RotateAroundPivot (m_fDeltaAngleOfRotation, m_v2PivotPoint);
		GUI.Label(Rect(m_fWidthTVGuideDiv/2 - 48,m_fHeightTimeLineDiv + (4*m_fHeightChannelIcon + fUnitY)/2 - 48, 96, 96),"",m_skinRefreshButton.label);
		m_fDeltaAngleOfRotation += 2.0;
	}
	else
	{
		m_skinRefreshButton.box.fontSize		=	Mathf.Min(m_fWidthTVGuideDiv,4*m_fHeightChannelIcon)/18.0;
		GUI.Box(Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightTimeLineLeftArrowButton,m_fWidthTVGuideDiv,4*m_fHeightChannelIcon),"",m_skinRefreshButton.box);//FOR GRADIENT in the first column
		
		m_v2PivotPoint = Vector2(m_fDisplacementX + m_fWidthFilterDiv + m_fWidthTVGuideDiv/2,m_fHeightTimeLineLeftArrowButton + (4*m_fHeightChannelIcon)/2);
		GUIUtility.RotateAroundPivot (m_fDeltaAngleOfRotation, m_v2PivotPoint);
		GUI.Label(Rect(m_fDisplacementX + m_fWidthFilterDiv + m_fWidthTVGuideDiv/2 - 48,m_fHeightTimeLineLeftArrowButton + (4*m_fHeightChannelIcon)/2 - 48, 96, 96),"",m_skinRefreshButton.label);
		m_fDeltaAngleOfRotation += 2.0;
	}
}

function IsHalfHourRectIntersectingTimeLineViewPort(rectViewPort	:	Rect, rectContender	:	Rect)
{
	var v2PointTopLeft		:	Vector2 = Vector2(rectContender.xMin - m_v2ScrollTimelineXAxis.x + m_fDisplacementX + m_fWidthFilterDiv + m_fWidthTimeLineLeftArrowButton, rectContender.yMin - m_v2ScrollTimelineXAxis.y + 0.5*m_fHeightTimeLineDiv);
	var v2PointTopRight		:	Vector2 = Vector2(rectContender.xMax - m_v2ScrollTimelineXAxis.x + m_fDisplacementX + m_fWidthFilterDiv + m_fWidthTimeLineLeftArrowButton, rectContender.yMin - m_v2ScrollTimelineXAxis.y + 0.5*m_fHeightTimeLineDiv);
	var v2PointBottomRight	:	Vector2 = Vector2(rectContender.xMax - m_v2ScrollTimelineXAxis.x + m_fDisplacementX + m_fWidthFilterDiv + m_fWidthTimeLineLeftArrowButton, rectContender.yMax - m_v2ScrollTimelineXAxis.y + 0.5*m_fHeightTimeLineDiv);
	var v2PointBottomLeft	:	Vector2 = Vector2(rectContender.xMin - m_v2ScrollTimelineXAxis.x + m_fDisplacementX + m_fWidthFilterDiv + m_fWidthTimeLineLeftArrowButton, rectContender.yMax - m_v2ScrollTimelineXAxis.y + 0.5*m_fHeightTimeLineDiv);
	
	if(	rectViewPort.Contains(v2PointTopLeft)	|| 
		rectViewPort.Contains(v2PointTopRight)	||
		rectViewPort.Contains(v2PointBottomRight)	||
		rectViewPort.Contains(v2PointBottomLeft) )
		{
			return true;
		}
		else
		{
			return false;
		}
}

function IsEventRectIntersectingEPGScheduleViewPort(rectContender	:	Rect)
{
	var v2PointTopLeft		:	Vector2 = Vector2(rectContender.xMin - m_v2ScrollScheduleXYAxis.x + m_fDisplacementX + m_fWidthFilterDiv + m_fWidthTimeLineLeftArrowButton, rectContender.yMin - m_v2ScrollScheduleXYAxis.y + m_fHeightTimeLineDiv);
	var v2PointTopRight		:	Vector2 = Vector2(rectContender.xMax - m_v2ScrollScheduleXYAxis.x + m_fDisplacementX + m_fWidthFilterDiv + m_fWidthTimeLineLeftArrowButton, rectContender.yMin - m_v2ScrollScheduleXYAxis.y + m_fHeightTimeLineDiv);
	var v2PointBottomRight	:	Vector2 = Vector2(rectContender.xMax - m_v2ScrollScheduleXYAxis.x + m_fDisplacementX + m_fWidthFilterDiv + m_fWidthTimeLineLeftArrowButton, rectContender.yMax - m_v2ScrollScheduleXYAxis.y + m_fHeightTimeLineDiv);
	var v2PointBottomLeft	:	Vector2 = Vector2(rectContender.xMin - m_v2ScrollScheduleXYAxis.x + m_fDisplacementX + m_fWidthFilterDiv + m_fWidthTimeLineLeftArrowButton, rectContender.yMax - m_v2ScrollScheduleXYAxis.y + m_fHeightTimeLineDiv);
	
	if(	m_rectEPGScheduleViewPort.Contains(v2PointTopLeft)	|| 
		m_rectEPGScheduleViewPort.Contains(v2PointTopRight)	||
		m_rectEPGScheduleViewPort.Contains(v2PointBottomRight)	||
		m_rectEPGScheduleViewPort.Contains(v2PointBottomLeft) )
		{
			return true;
		}
		else if((v2PointTopLeft.x < m_rectEPGScheduleViewPort.xMin && v2PointTopRight.x > m_rectEPGScheduleViewPort.xMax && v2PointTopLeft.y < m_rectEPGScheduleViewPort.yMax && v2PointTopLeft.y > m_rectEPGScheduleViewPort.yMin && v2PointTopRight.y < m_rectEPGScheduleViewPort.yMax && v2PointTopRight.y > m_rectEPGScheduleViewPort.yMin) ||
				(v2PointBottomLeft.x < m_rectEPGScheduleViewPort.xMin && v2PointBottomRight.x > m_rectEPGScheduleViewPort.xMax && v2PointBottomLeft.y < m_rectEPGScheduleViewPort.yMax && v2PointBottomLeft.y > m_rectEPGScheduleViewPort.yMin && v2PointBottomRight.y < m_rectEPGScheduleViewPort.yMax && v2PointBottomRight.y > m_rectEPGScheduleViewPort.yMin))
		{
			return true;
		}
		else
		{
			return false;
		}
}

function IsChannelRectIntersectingChannelsListViewPort(rectContender	:	Rect)
{
	var v2PointTopLeft		:	Vector2 = Vector2(rectContender.xMin - m_v2ScrollChannelThumbnailYAxis.x + m_fDisplacementX + m_fWidthFilterDiv, rectContender.yMin - m_v2ScrollChannelThumbnailYAxis.y + m_fHeightTimeLineDiv);
	var v2PointTopRight		:	Vector2 = Vector2(rectContender.xMax - m_v2ScrollChannelThumbnailYAxis.x + m_fDisplacementX + m_fWidthFilterDiv, rectContender.yMin - m_v2ScrollChannelThumbnailYAxis.y + m_fHeightTimeLineDiv);
	var v2PointBottomRight	:	Vector2 = Vector2(rectContender.xMax - m_v2ScrollChannelThumbnailYAxis.x + m_fDisplacementX + m_fWidthFilterDiv, rectContender.yMax - m_v2ScrollChannelThumbnailYAxis.y + m_fHeightTimeLineDiv);
	var v2PointBottomLeft	:	Vector2 = Vector2(rectContender.xMin - m_v2ScrollChannelThumbnailYAxis.x + m_fDisplacementX + m_fWidthFilterDiv, rectContender.yMax - m_v2ScrollChannelThumbnailYAxis.y + m_fHeightTimeLineDiv);
	
	if(	m_rectChannelsListViewPort.Contains(v2PointTopLeft)	|| 
		m_rectChannelsListViewPort.Contains(v2PointTopRight)	||
		m_rectChannelsListViewPort.Contains(v2PointBottomRight)	||
		m_rectChannelsListViewPort.Contains(v2PointBottomLeft) )
		{
			return true;
		}
		else if((v2PointTopLeft.x < m_rectChannelsListViewPort.xMin && v2PointTopRight.x > m_rectChannelsListViewPort.xMax && v2PointTopLeft.y < m_rectChannelsListViewPort.yMax && v2PointTopLeft.y > m_rectChannelsListViewPort.yMin && v2PointTopRight.y < m_rectChannelsListViewPort.yMax && v2PointTopRight.y > m_rectChannelsListViewPort.yMin) ||
				(v2PointBottomLeft.x < m_rectChannelsListViewPort.xMin && v2PointBottomRight.x > m_rectChannelsListViewPort.xMax && v2PointBottomLeft.y < m_rectChannelsListViewPort.yMax && v2PointBottomLeft.y > m_rectChannelsListViewPort.yMin && v2PointBottomRight.y < m_rectChannelsListViewPort.yMax && v2PointBottomRight.y > m_rectChannelsListViewPort.yMin))
		{
			return true;
		}
		else
		{
			return false;
		}
}

//function TrackEvent(fWaitTime	:	float)
//{
//	yield WaitForSeconds(fWaitTime);
//	
//	if(!g_iRenderVideoPlayer)
//		TE("Program Guide");
//		
//	if(g_iRenderVideoPlayer)
//		TE("D2H Cinema");
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
function IdentifyProgram(strClickedOn : String) {
	var event = "Reminder";
	var objHeaders : Hashtable = new Hashtable();
	objHeaders.Add("Content-Type","application/json");
	var customerId = PlayerPrefs.GetString("CustomerId");
	var emailId = PlayerPrefs.GetString("EmailId");
	var balance = PlayerPrefs.GetString("Balance");
	var nextRechargeDate = PlayerPrefs.GetString("NextRechargeDate");
	//var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"email\":\"" + emailId + "\",\"balance\":\"" + balance +"\",\"nextRechargeDate\":\"" + nextRechargeDate +"\",\"event\":\"" + strClickedOn + "\"}";
	var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"traits\":{\"ProgramName\":\"" + strClickedOn + "\",\"Event\":\"" + event + "\"}}";
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

//9edgcoigpu LOKESH
//rrenb1jpxo IKN
function IdentifyChannel(strClickedOn : String) {
	var event = "Add To Favourites";
	var objHeaders : Hashtable = new Hashtable();
	objHeaders.Add("Content-Type","application/json");
	var customerId = PlayerPrefs.GetString("CustomerId");
	var emailId = PlayerPrefs.GetString("EmailId");
	var balance = PlayerPrefs.GetString("Balance");
	var nextRechargeDate = PlayerPrefs.GetString("NextRechargeDate");
	//var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"email\":\"" + emailId + "\",\"balance\":\"" + balance +"\",\"nextRechargeDate\":\"" + nextRechargeDate +"\",\"event\":\"" + strClickedOn + "\"}";
	var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"traits\":{\"ChannelName\":\"" + strClickedOn + "\",\"Event\":\"" + event + "\"}}";
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

//9edgcoigpu LOKESH
//rrenb1jpxo IKN
function IdentifyGener(strClickedOn : String) {
	var event = "Add To Favourites";
	var objHeaders : Hashtable = new Hashtable();
	objHeaders.Add("Content-Type","application/json");
	var customerId = PlayerPrefs.GetString("CustomerId");
	var emailId = PlayerPrefs.GetString("EmailId");
	var balance = PlayerPrefs.GetString("Balance");
	var nextRechargeDate = PlayerPrefs.GetString("NextRechargeDate");
	//var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"email\":\"" + emailId + "\",\"balance\":\"" + balance +"\",\"nextRechargeDate\":\"" + nextRechargeDate +"\",\"event\":\"" + strClickedOn + "\"}";
	var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"traits\":{\"GenerName\":\"" + strClickedOn + "\"}}";
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
