#pragma strict

//touch controls
private var m_fPreviousDeltaX			:	float;
private var m_fPreviousDeltaY			:	float;
private var m_fVelocityChannelsGridInX	:	float;
private var m_fVelocityFiltersInY		:	float;

private var m_fTimeStampWhenTouchPhaseEnded	:	float;

private var m_rectAddOnsScreenScrollArea1	:	Rect;
private var m_rectAddOnsScreenScrollArea2	:	Rect;


private var scrollPosition 				: 	Vector2;
private var scrollPosition_Time			:	Vector2;
private var scrollPositionX				:	Vector2;

//lokesh

var m_strConnectionId 					: 	String;
var m_strCustomerId						:	String;
var m_strPresentPackageId				:	String;
var m_strUUID							:	String;
var m_strBalance						:	String;
var m_strPassword						:	String;

var g_objScriptAPIHandler				:	ScriptAPIHandler;
var g_objGetAddOnsListAPIPacket			:	CWebAPIPacket;
var g_objAddOrRemoveAPIPacket			:	CWebAPIPacket;

var m_fDisplacementX					:	float;
var m_bShowFilter						:	boolean;
var m_bRenderAPIErrorPrompt				:	boolean;
var m_bAddOrRemoveActionInitiated		:	boolean;
var m_bFilterToggleState				:	boolean[];

var m_iIndexSelectedAddOn				:	int;
var m_iSlideId							:	int;

var m_fWidthPopup						:	float;
var m_fHeightPopup						:	float;

var m_count								:	int;

//~lokesh

function Start () 
{
	m_strConnectionId		=	PlayerPrefs.GetString("ConnectionID");
	m_strPresentPackageId	=	PlayerPrefs.GetString("PresentPackageId");
	m_strCustomerId 		= 	PlayerPrefs.GetString("CustomerId");
	m_strUUID				=	PlayerPrefs.GetString("DeviceUID");
	m_strBalance			=	PlayerPrefs.GetString("Balance");
	
	m_strPassword			=	"Password Required";
	
	m_bShowFilter		=	true;
	m_fDisplacementX	=	0.0;
	
	m_iIndexSelectedAddOn	=	0;
	m_count 	=	0;
	
	CreateFlatTextures();
	
	g_objScriptAPIHandler = GetComponent(ScriptAPIHandler);
	GetAddOnsList();
	
//	StartCoroutine(TrackEvent(0.1));
}

function Update () 
{
	if(Input.GetKeyDown(KeyCode.Escape))
	{
		Application.LoadLevel("SceneHomePage");
	}
	
	InertialScroll();
}
function InertialScroll()
{
	var fingerCount = 0;
	for( var touch : Touch in Input.touches)
	{
		var v2TouchToGUIPos	: Vector2;
		v2TouchToGUIPos.x = touch.position.x;
		v2TouchToGUIPos.y = Screen.height - touch.position.y;
		
		if (touch.phase == TouchPhase.Began)
		{
			m_fPreviousDeltaY = touch.deltaPosition.y;
			m_fPreviousDeltaX = touch.deltaPosition.x;
			////print("Touch Phase Began and m_bIsSwipeActive = " + m_bIsSwipeActive + " m_fPreviousDeltaX : " + m_fPreviousDeltaX + " m_fPreviousDeltaY : " + m_fPreviousDeltaY + " deltaTime : " + touch.deltaTime);
			
			if(m_fPreviousDeltaX != 0 || m_fPreviousDeltaY != 0)
			{
				//m_bIsSwipeActive = true;
			} 
		}
			
		if (touch.phase == TouchPhase.Moved)
		{
			// dragging
			////print("Touch Phase Moved");
			//m_bIsSwipeActive = true;
			m_fPreviousDeltaY = touch.deltaPosition.y;
			m_fPreviousDeltaX = touch.deltaPosition.x;
			if( Mathf.Abs( m_fPreviousDeltaY)> Mathf.Abs(m_fPreviousDeltaX))
			{
				if(m_rectAddOnsScreenScrollArea1.Contains(v2TouchToGUIPos))
					g_v2AddOnGenreWiseGridList_Y.y += 3.5*touch.deltaPosition.y; // 
			}
			else
			{
				if(m_rectAddOnsScreenScrollArea2.Contains(v2TouchToGUIPos))
				{
			    	g_v2AddOnGenrewiseChannelsGrid_X.x -= 3.5*touch.deltaPosition.x;
				}
				////print("Touch Phase Moved in X and m_bIsSwipeActive = " + m_bIsSwipeActive);
			}
		}
		
		if (touch.phase == TouchPhase.Stationary)
		{
			////print("A finger is touching the screen but hasn't moved and m_bIsSwipeActive = " + m_bIsSwipeActive);
		}
		
		if (touch.phase == TouchPhase.Ended)
		{
			// impart momentum, using last delta as the starting velocity
			if( Mathf.Abs( m_fPreviousDeltaY)> Mathf.Abs(m_fPreviousDeltaX))
			{
				if(	m_rectAddOnsScreenScrollArea1.Contains(v2TouchToGUIPos))
				{   
					m_fVelocityFiltersInY = m_fPreviousDeltaY/touch.deltaTime;
				}
			}
			else
			{
				if(m_rectAddOnsScreenScrollArea1.Contains(v2TouchToGUIPos))
					m_fVelocityChannelsGridInX = -m_fPreviousDeltaX/touch.deltaTime;
			}
				
			m_fTimeStampWhenTouchPhaseEnded = Time.time;
			////print("Imparting Momentum using last delta as initial velocity and m_bIsSwipeActive = " + m_bIsSwipeActive);
		}
		
		if (touch.phase == TouchPhase.Canceled)
		{
			m_fPreviousDeltaX = 0f;
			m_fPreviousDeltaY = 0f;
			////print("Touch Phase Cancelled and m_bIsSwipeActive = " + m_bIsSwipeActive);
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
		if ( m_fVelocityChannelsGridInX != 0.0f || m_fVelocityFiltersInY != 0.0f )
		{
			////print("If touch count is not 1, and slow down over time. Touch Count is: " + Input.touchCount + " and m_bIsSwipeActive = " + m_bIsSwipeActive);
			// slow down over time
			var t : float;
			t = Time.time;
			t = t - m_fTimeStampWhenTouchPhaseEnded;
			t = t / fInertiaDuration;
			
			var frameVelocityChannelsGridInX	:	float = Mathf.Lerp(m_fVelocityChannelsGridInX, 0, t);
			var frameVelocityFiltersInY			:	float = Mathf.Lerp(m_fVelocityFiltersInY, 0, t);
			
			g_v2AddOnGenrewiseChannelsGrid_X.x 	+=	frameVelocityChannelsGridInX * Time.deltaTime;
			g_v2AddOnGenreWiseGridList_Y.y		+=	frameVelocityFiltersInY * Time.deltaTime;
			
			// after N seconds, we’ve stopped
			if (t >= fInertiaDuration)
			{					
				////print("If touch count is not 1, t >= Interia Duration. WE STOP and m_bIsSwipeActive = " + m_bIsSwipeActive);
				m_fVelocityChannelsGridInX = 0.0f;
				m_fVelocityFiltersInY = 0.0f;
			}
		}
		
		return;
	}
}

private var g_v2AddOnGenreWiseGridList_Y		:	Vector2;
private var g_v2AddOnGenrewiseChannelsGrid_X	:	Vector2;
function OnGUI ()
{
	if(g_objGetAddOnsListAPIPacket.m_bResponseReceived)
	{
		if(ProcessResponseGetAddOnsList() == 200)
		{
			m_bRenderAPIErrorPrompt = false;
		}
		else
		{
			//error- 300:http or 0:khali
			m_bRenderAPIErrorPrompt = true;
		}
	}
	
	if(gs_iCountAddOns == 0 || m_bRenderAPIErrorPrompt == true || m_bAddOrRemoveActionInitiated == true)
	{
		GUI.depth = 0;
		//GUI.enabled	=	false;
	}
	RenderAddOnsForIPhone();
	GUI.enabled	=	true;
	
	if(m_bAddOrRemoveActionInitiated)
	{
		var fUnitX			:	float	= Screen.width/24.4;
	 	var fUnitY			:	float 	= Screen.height/12.8;
	 	
	 	var fWidthMainDiv	:	float	=	18.6*fUnitX;
	 	if(m_fDisplacementX < 0)
	 	{
	 		fWidthMainDiv -= m_fDisplacementX;
	 	}
	 	var fHeightTitle	:	float	=	1.5*m_fHeightHeader;
	 	var fHeightMiddle	:	float	=	6.3*fUnitY;
	 	
	 	m_fWidthPopup			=	fWidthMainDiv;
		m_fHeightPopup			=	fHeightMiddle;
		
		m_skinAddOnsScreen.window.normal.background	=	m_tex2DGrey;
		GUI.ModalWindow(0,Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightHeader + fHeightTitle,m_fWidthPopup,m_fHeightPopup), RenderAddOrRemovePrompt, "", m_skinAddOnsScreen.window);
	}
	
	if(gs_iCountAddOns == 0 || m_bRenderAPIErrorPrompt == true)
	{
		GUI.depth = 1;
		
		if(m_bRenderAPIErrorPrompt)
		{
			m_fWidthPopup			=	Screen.width;
			m_fHeightPopup			=	Screen.height	-	2.0*m_fHeightHeader;
			
			m_skinAddOnsScreen.window.normal.background	=	m_tex2DWhite;
			GUI.ModalWindow(0,Rect(0.0, m_fHeightHeader, m_fWidthPopup, m_fHeightPopup), RenderAPIErrorPrompt, "", m_skinAddOnsScreen.window);
		}
		else
		{
			GUI.Box(Rect(0,m_fHeightHeader,Screen.width,Screen.height - 2*m_fHeightHeader),"",m_skinRefreshButton.box);
			RenderPleaseWaitSplash(Screen.width/2.0, Screen.height/2.0);
		}
	}	
	return;
 }
 

function RenderAddOnsForIPhone()
{
	ShowHideFilter();
	
	RenderHeader();
	RenderFilters();
	RenderMainDiv();
	
	if(gs_iCountAddOns > 0)
	{
		ProcessChannelsForActiveAddOn(m_iIndexSelectedAddOn);
	}
}

var	m_fHeightHeader					:	float;
var m_fWidthFilterDiv				:	float;
var m_fWidthFilterButton			:	float;
var m_fHeightFilterButton			:	float;
var m_fHeightFilterOptions			:	float;

static var	gs_iCountAddOns			:	int;
static var	gs_objArrayOfAddOns		:	CAddOn[];

var m_skinAddOnsScreen				:	GUISkin;
var m_skinFilterButton				:	GUISkin;
var m_skinCustomerID				:	GUISkin;
var m_skinGenresGrid				:	GUISkin;

var m_fontRegular					:	Font;
var m_fontBold						:	Font;

//var m_tex2DFilterBackground			:	Texture2D;	//BACKGROUNDTEX
var m_tex2DFilterIcon				:	Texture2D;	//filter-icon
var m_tex2DFilterLeftArrow			:	Texture2D;	//filter-arrow-inside
var m_tex2DFilterRightArrow			:	Texture2D;	//filter-arrow-inside
var m_tex2DBorder					:	Texture2D;	//border
var m_tex2DHorizontalBlackDots		:	Texture2D;
var m_tex2DVerticalWhiteDots		:	Texture2D;
var m_tex2DServerError				:	Texture2D;

private var m_tex2DPurple			:	Texture2D;
private var m_tex2DLightPurple		:	Texture2D;
private var m_tex2DOrange			:	Texture2D;
private var m_tex2DWhite			:	Texture2D;
private var m_tex2DGrey				:	Texture2D;

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

function RenderHeader()
{
	var fUnitX	:	float	=	Screen.width/24.4;
 	var fUnitY	:	float 	=	Screen.height/12.8;
	
	m_fHeightHeader		 	=	1.3*fUnitY;
	
	GUI.skin				=	m_skinAddOnsScreen;
	//*************************	Header	***********************//
	GUI.BeginGroup(Rect(0,0,Screen.width,m_fHeightHeader));
		
		m_skinAddOnsScreen.box.alignment			=	TextAnchor.MiddleCenter;
		m_skinAddOnsScreen.box.normal.background	=	m_tex2DPurple;
		m_skinAddOnsScreen.box.normal.textColor  	=	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
		m_skinAddOnsScreen.box.fontSize 			=	Mathf.Min(Screen.width,m_fHeightHeader)/1.5;
		m_skinAddOnsScreen.box.font					=	m_fontRegular;
		m_skinAddOnsScreen.box.contentOffset.x		=	0;
		GUI.Box(Rect(0,0,Screen.width,m_fHeightHeader),"Add Ons");
	
	GUI.EndGroup();
}

function RenderFilters()
{
	var fUnitX	:	float	= Screen.width/24.4;
 	var fUnitY	:	float 	= Screen.height/12.8;
 	
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
	}
	
	if(m_bShowFilter	==	false)
	{
		if(GUI.RepeatButton(Rect(0.8*fUnitX + m_fWidthFilterButton,0,0.8*fUnitX,m_fHeightFilterButton),m_tex2DFilterRightArrow,m_skinFilterButton.button))//right arrow icon
		{
			m_bShowFilter	=	true;
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
	GUI.Button(Rect(0.8*fUnitX,0.2*fUnitY,m_fWidthFilterButton,0.8*fUnitY),m_strConnectionId,m_skinCustomerID.button); // for connection ID
	
	GUI.EndGroup();
	
	//***************Scrollable circular grid : All Channels | Favorites | Genres******************//
	
	GUI.skin = m_skinGenresGrid;
	m_skinGenresGrid.toggle.fontSize			=	Mathf.Max(m_fWidthFilterButton,m_fHeightFilterButton)/9.0;
	m_skinGenresGrid.toggle.font				= 	m_fontRegular;
	m_skinGenresGrid.toggle.normal.textColor 	= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	
	m_rectAddOnsScreenScrollArea1	=	Rect(m_fDisplacementX + 0.8*fUnitX, m_fHeightHeader + m_fHeightFilterButton + 1.2*fUnitY,	m_fWidthFilterButton, 7.9*fUnitY);
	GUI.BeginGroup(m_rectAddOnsScreenScrollArea1);
	
		if(gs_iCountAddOns > 0)
		{
			g_v2AddOnGenreWiseGridList_Y = GUI.BeginScrollView(Rect(0,0,m_fWidthFilterButton,7.9*fUnitY), g_v2AddOnGenreWiseGridList_Y, Rect(0,0,m_fWidthFilterButton,gs_iCountAddOns*1.16*fUnitY));//,g_styleHorizontalScrollbar,g_styleVerticalScrollbar);
			
			var strActiveGenre	:	String;
			for(var i=0; i<gs_iCountAddOns; i++)
			{
				strActiveGenre	=	gs_objArrayOfAddOns[i].m_strAddOnName;	
				if(strActiveGenre.Length > 14)
				{
					strActiveGenre	=	strActiveGenre.Substring(0,12) + "...";
				}
				
				m_bFilterToggleState[i]	=	GUI.Toggle(Rect(-0.025*m_fWidthFilterButton, i*1.16*fUnitY, 1.05*m_fWidthFilterButton, 1.16*fUnitY),m_bFilterToggleState[i],strActiveGenre);
				
				if(m_bFilterToggleState[i])
				{
					if(i != m_iIndexSelectedAddOn)
					{
						m_iIndexSelectedAddOn	=	i;
						ResetStateOfRestFilterToggles(m_iIndexSelectedAddOn);
						
						tracking( strActiveGenre);
					}
				}
				else
				{
					if(i == m_iIndexSelectedAddOn)
					{
						m_bFilterToggleState[i]	=	true;
					}
				}
			}
			GUI.EndScrollView();
		}
	GUI.EndGroup();
	GUI.skin = null;
	
	if(m_bShowFilter	==	false)
	{
		//Show vertical dots to represent scroll
		GUI.DrawTexture(Rect(m_fDisplacementX + 0.8*fUnitX + m_fWidthFilterButton ,m_fHeightHeader + m_fHeightFilterButton + m_fHeightFilterOptions/2.0 + 0.2*fUnitX,0.8*fUnitX,0.8*fUnitX),m_tex2DVerticalWhiteDots);//vertical dots
	
		if(GUI.RepeatButton(Rect(0,m_fHeightHeader + m_fHeightFilterButton,0.8*fUnitX,9.3*fUnitY),"",m_skinFilterButton.button))//right arrow icon
		{
			m_bShowFilter	=	true;
		}
	}
}

function InitFilterToggleState()
{
	m_bFilterToggleState = new boolean[gs_iCountAddOns];
	
	for(var i = 0; i < gs_iCountAddOns; i++)
	{
		m_bFilterToggleState[i] = false;
	}
}
function ResetStateOfRestFilterToggles(iExceptionIndex	:	int)
{
	for(var i=0; i<gs_iCountAddOns; i++)
	{
		if(i != iExceptionIndex)
		{
			m_bFilterToggleState[i] = false;
		}
	}
}

function RenderMainDiv()
{
	var fUnitX			:	float	= Screen.width/24.4;
 	var fUnitY			:	float 	= Screen.height/12.8;
 	
 	var fWidthMainDiv	:	float	=	18.6*fUnitX;
 	if(m_fDisplacementX < 0)
 	{
 		fWidthMainDiv -= m_fDisplacementX;
 	}
 	var fHeightTitle	:	float	=	1.5*m_fHeightHeader;
 	var fHeightMiddle	:	float	=	6.3*fUnitY;
 	var fHeightFooter	:	float	=	1.5*m_fHeightHeader;
 	
 	GUI.skin = m_skinAddOnsScreen;
 	
	/************************	main div title	************************/
	m_skinAddOnsScreen.box.normal.background	=	m_tex2DWhite;
	m_skinAddOnsScreen.box.normal.textColor		=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
	m_skinAddOnsScreen.box.fontSize 			=	Mathf.Min(fWidthMainDiv,fHeightTitle)/3.0;
	m_skinAddOnsScreen.box.font					=	m_fontRegular;
	m_skinAddOnsScreen.box.contentOffset.x		=	0.5*fUnitX;
	m_skinAddOnsScreen.box.alignment			=	TextAnchor.MiddleLeft;
	
	m_skinAddOnsScreen.label.normal.textColor	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
	m_skinAddOnsScreen.label.fontSize 			=	Mathf.Min(fWidthMainDiv,fHeightTitle)/5.0;
	m_skinAddOnsScreen.label.font				=	m_fontRegular;
	m_skinAddOnsScreen.label.alignment			=	TextAnchor.MiddleLeft;
	
	GUI.BeginGroup(Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightHeader,fWidthMainDiv,fHeightTitle));
		GUI.Box(Rect(0,0,fWidthMainDiv,fHeightTitle),GetSelectedAddOnName());
		GUI.Label(Rect(0.6*fWidthMainDiv,0,0.4*(fWidthMainDiv),fHeightTitle),"(ADD ON Code: " + GetSelectedAddOnId() + ")" + GetSelectedAddOnPriceString());
	GUI.EndGroup();
	
	//main div middle
	m_skinAddOnsScreen.box.normal.background	=	m_tex2DGrey;
	
	m_rectAddOnsScreenScrollArea2 = Rect(m_fDisplacementX + m_fWidthFilterDiv,m_fHeightHeader + fHeightTitle,fWidthMainDiv,fHeightMiddle);
	GUI.BeginGroup(m_rectAddOnsScreenScrollArea2);
		GUI.Box(Rect(0,0,fWidthMainDiv,fHeightMiddle),"");
		
		var iChannelsCount	:	int = 0;
		if(gs_iCountAddOns > 0)
		{
			iChannelsCount	=	gs_objArrayOfAddOns[m_iIndexSelectedAddOn].m_iChannelsCount;
		}
		
		var rectViewPortScroll	:	Rect	=	Rect(0,0,fWidthMainDiv,fHeightMiddle);
		var rectFullScroll		:	Rect	=	rectViewPortScroll;
		if(iChannelsCount > 0)
		{
			//elongate the width of full scroll rect		
			rectFullScroll.width				=	(iChannelsCount/5.0) * rectViewPortScroll.width;
			
			g_v2AddOnGenrewiseChannelsGrid_X	=	GUI.BeginScrollView(rectViewPortScroll, g_v2AddOnGenrewiseChannelsGrid_X, rectFullScroll);
			
				m_skinAddOnsScreen.button.normal.background	=	null;
				m_skinAddOnsScreen.button.hover.background	=	null;
				m_skinAddOnsScreen.button.active.background	=	null;
				GUI.SelectionGrid(rectFullScroll, -1, gs_objArrayOfAddOns[m_iIndexSelectedAddOn].m_tex2dListIcons, iChannelsCount); /*not hardcoded_val : need to change*/
			
			GUI.EndScrollView();
			
			if(iChannelsCount > 5)
			{
				m_skinAddOnsScreen.label.alignment	=	TextAnchor.MiddleCenter;
				GUI.Label(Rect(0,0.8*fHeightMiddle,fWidthMainDiv,0.2*fHeightMiddle),m_tex2DHorizontalBlackDots);
			}
		}
		else if(iChannelsCount == -1)
		{
			m_skinAddOnsScreen.label.alignment	=	TextAnchor.MiddleCenter;
			GUI.Label(rectViewPortScroll,gs_objArrayOfAddOns[m_iIndexSelectedAddOn].m_objProductToChannelInfoAPIPacket.m_strErrorMessage);
		}
	GUI.EndGroup();
	
	//main div footer
	m_skinAddOnsScreen.box.normal.background	=	m_tex2DWhite;
	GUI.BeginGroup(Rect(m_fWidthFilterDiv + m_fDisplacementX,m_fHeightHeader + fHeightTitle + fHeightMiddle,fWidthMainDiv,fHeightFooter));
		GUI.Box(Rect(0,0,fWidthMainDiv - m_fDisplacementX,fHeightMiddle),"");
		
		m_skinAddOnsScreen.button.normal.background	=	m_tex2DWhite;
		m_skinAddOnsScreen.button.normal.textColor	=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
		m_skinAddOnsScreen.button.hover.background	=	m_tex2DWhite;
		m_skinAddOnsScreen.button.hover.textColor	=	Color(192/255.0F,192/255.0F,192/255.0F,255/255.0F);
		m_skinAddOnsScreen.button.active.background	=	m_tex2DWhite;
		m_skinAddOnsScreen.button.active.textColor	=	Color(192/255.0F,192/255.0F,192/255.0F,255/255.0F);		
		m_skinAddOnsScreen.button.fontSize 			=	Mathf.Min(fWidthMainDiv,fHeightFooter)/2.5;
		m_skinAddOnsScreen.button.font				= 	m_fontBold;	
		
		var strButtonCaption	:	String			=	GetSubscriptionOption();	
		
		if(iChannelsCount == 0)
		{
			GUI.enabled	=	false;
		}
		else
		{
			GUI.enabled	=	true;
		}
		
		if(GUI.Button(Rect(0.6*fWidthMainDiv,0,0.4*fWidthMainDiv,fHeightFooter),strButtonCaption))
		{
			//AddOrRemoveAnAddOn();
			m_iSlideId	=	0;
			m_bAddOrRemoveActionInitiated	=	true;
						
		}
		
		GUI.enabled	=	true;
			
	GUI.EndGroup();	
}

/*
	http://<hostserver>/MobileEPGService/MobileEPGService.AddOnService.svc/Method/GetConfiguredAddOnsByPackageIdAndCustomerType
	
	http://ec2-54-251-161-31.ap-southeast-1.compute.amazonaws.com/api/v1/product/getAllUserAddonsByScard
	{"uuId":"xxxx","sCNumberField":"yyyy"}
*/
function GetAddOnsList()
{
	if(gs_iCountAddOns == 0)
	{
	/*	
		var strAPIURL = "http://203.223.176.33:9000/MobileEPGServices/";
	    var strAPIMethod = "MobileEPGService.AddOnService.svc/Method/GetConfiguredAddOnsByPackageIdAndCustomerType";
	    
	    //'{"PackageId":"332","TypeKey":"N"}'
	    var strInput = "{\"PackageId\":\"" + m_strPresentPackageId + "\",\"TypeKey\":\"N\"}";
	*/   
		var strAPIURL = ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
	    var strAPIMethod = "product/getAllUserAddonsByScard";
	    
	    //'{"PackageId":"332","TypeKey":"N"}'
	    var strInput = "{\"uuId\":\"" + m_strUUID + "\",\"sCNumberField\":\"" + m_strConnectionId + "\"}";
	    
	    g_objGetAddOnsListAPIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
	    g_objScriptAPIHandler.InvokeReSTfulAPI(g_objGetAddOnsListAPIPacket);
	}
	else
	{
		InitFilterToggleState();
	}
}

function ProcessResponseGetAddOnsList() : int
{
	var iErrorCode	:	int;
	if(g_objGetAddOnsListAPIPacket.m_strResponseCode == "200 OK")
	{
		if(g_objGetAddOnsListAPIPacket.m_strOutput != "")
		{
			g_objGetAddOnsListAPIPacket.m_strErrorMessage = ParseResponse(g_objGetAddOnsListAPIPacket.m_strOutput);
			iErrorCode = 200;
		}
		else
		{
			//message in the mid: 
			g_objGetAddOnsListAPIPacket.m_strErrorMessage = "GetAddOnsList : NULL Response";
    		//Debug.Log(g_objGetAddOnsListAPIPacket.m_strErrorMessage);
    		iErrorCode = 0;
		}
	}
	else
	{
		g_objGetAddOnsListAPIPacket.m_strErrorMessage = "HTTP Error : " + g_objGetAddOnsListAPIPacket.m_strResponseCode;
    	//Debug.Log(g_objGetAddOnsListAPIPacket.m_strErrorMessage);
		//g_bHault = true;
		iErrorCode = 300;
	}
	
	g_objGetAddOnsListAPIPacket.m_bResponseReceived = false;
	return iErrorCode;
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
		//Debug.Log("Reassembled: " + N.ToString());
		if(N.ToString() == "{}")
		{
			return "Empty JSON";
		}
		
		var strMessage = N["message"];
		if(strMessage.Value == "Server not Responding")
		{
			//Debug.Log("Error -" + strMessage);
			return "Server not responding";
		}
		
		while(N[gs_iCountAddOns] != null)
		{
			gs_iCountAddOns++;
		}
		//print("AddOns Count : " + gs_iCountAddOns);
		
		InitFilterToggleState();
		
		gs_objArrayOfAddOns	=	new CAddOn[gs_iCountAddOns];
		
		var strAddOnName	:	String;
		for(var i = 0; i < gs_iCountAddOns; i++)
		{
			gs_objArrayOfAddOns[i]	=	new CAddOn();
			
			gs_objArrayOfAddOns[i].m_strAddOnID	=	N[i]["CommercialProductId"];
			HitFetchChannelsAPI(i);
			
			strAddOnName = N[i]["CommercialProductName"];
			var j	:	int	=	strAddOnName.IndexOf("(");
			if(j > 0)
			{
				gs_objArrayOfAddOns[i].m_strAddOnName	=	strAddOnName.Substring(0,j);	
			}
			
			gs_objArrayOfAddOns[i].m_strAddOnPrice	=	N[i]["Price"];
			
			gs_objArrayOfAddOns[i].m_strSubscribed	=	N[i]["TYPE"];
		}
		return;
	}
}

function HitFetchChannelsAPI(iIndex	:	int)
{	
	//No. & Name of channels in the input Product/Package
    var strAPIURL		:	String	=	ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
	var strAPIMethod	:	String	=	"product/ProductToChannelInfo";
    var strInput		:	String	=	"{\"productId\":\"" + gs_objArrayOfAddOns[iIndex].m_strAddOnID + "\"}";
    
    //Debug.Log("Invoke API : " + strAPIURL + strAPIMethod + " - " + strInput);
    
    gs_objArrayOfAddOns[iIndex].m_objProductToChannelInfoAPIPacket	=	new CWebAPIPacket(strAPIURL, strAPIMethod, strInput);
    g_objScriptAPIHandler.InvokeReSTfulAPI(gs_objArrayOfAddOns[iIndex].m_objProductToChannelInfoAPIPacket);
}

function ProcessChannelsForActiveAddOn(iIndex : int)
{
	if(gs_objArrayOfAddOns[iIndex].m_objProductToChannelInfoAPIPacket.m_bResponseReceived)
	{
		//parse json output, make m_bAddOnsChannelsListAvailable = true and m_bResponseReceived = false kardo
		ParseAddOnsToChannelInfoAPIResponse(iIndex);
		gs_objArrayOfAddOns[iIndex].m_objProductToChannelInfoAPIPacket.m_iConnectionStatus	=	0;
	}
	else
	{
		//if gs_objArrayOfAddOnToChannelInfoAPIPackets[m_iIndexSelectedAddOn].m_iConnectionStatus - show please wait splash
		if(gs_objArrayOfAddOns[iIndex].m_objProductToChannelInfoAPIPacket.m_iConnectionStatus == 1)
		{
			//please wait splash
			var fUnitX			:	float	= Screen.width/24.4;
		 	var fUnitY			:	float 	= Screen.height/12.8;
		 	
		 	var fWidthMainDiv	:	float	=	18.6*fUnitX;
		 	if(m_fDisplacementX < 0)
		 	{
		 		fWidthMainDiv -= m_fDisplacementX;
		 	}
		 	var fHeightTitle	:	float	=	1.5*m_fHeightHeader;
		 	var fHeightMiddle	:	float	=	6.3*fUnitY;

			var fX				:	float	=	m_fDisplacementX + m_fWidthFilterDiv + fWidthMainDiv/2.0;
			var fY				:	float	=	m_fHeightHeader + fHeightTitle + fHeightMiddle/2.0;
			RenderPleaseWaitSplash(fX,fY);
		}
		else
		{
			//render error message;
		}
	}
}

function ParseAddOnsToChannelInfoAPIResponse(iIndex	:	int)
{
	if(gs_objArrayOfAddOns[iIndex].m_objProductToChannelInfoAPIPacket.m_strResponseCode == "200 OK")
	{
		var N = JSON.Parse(gs_objArrayOfAddOns[iIndex].m_objProductToChannelInfoAPIPacket.m_strOutput);
		if(N == null)
		{
			gs_objArrayOfAddOns[iIndex].m_iChannelsCount	=	-1;
			gs_objArrayOfAddOns[iIndex].m_objProductToChannelInfoAPIPacket.m_strErrorMessage	=	"Connection Error : Please ensure you have an active internet connection.";
			//print(gs_objArrayOfAddOns[iIndex].m_objProductToChannelInfoAPIPacket.m_strErrorMessage);
		}
		else
		{
			//Debug.Log("Reassembled: " + N.ToString());
			if(N.ToString() == "{}")
			{
				gs_objArrayOfAddOns[iIndex].m_iChannelsCount	=	-1;
				gs_objArrayOfAddOns[iIndex].m_objProductToChannelInfoAPIPacket.m_strErrorMessage	=	"Connection Error :	Please ensure you have an active internet connection.";
				//print(gs_objArrayOfAddOns[iIndex].m_objProductToChannelInfoAPIPacket.m_strErrorMessage);
			}
			else
			{
				var iChannelsCount	:	int = 0;
				while(N[iChannelsCount] != null)
				{
					iChannelsCount++;
				}
				
				gs_objArrayOfAddOns[iIndex].m_iChannelsCount	=	iChannelsCount;
				
				gs_objArrayOfAddOns[iIndex].m_tex2dListIcons	=	new Texture2D[iChannelsCount];
					
				for(var i = 0; i < iChannelsCount; i++)
				{
					gs_objArrayOfAddOns[iIndex].m_tex2dListIcons[i]	=	Resources.Load(N[i]["ServiceId"]) as Texture2D;	
			    	if(gs_objArrayOfAddOns[iIndex].m_tex2dListIcons[i]	== 	null)
			    	{
			    		print("Missing Icon: " + N[i]["ServiceId"]);
			    		gs_objArrayOfAddOns[iIndex].m_tex2dListIcons[i] 	= 	Resources.Load("000BLANK") as Texture2D;
			    		if(gs_objArrayOfAddOns[iIndex].m_tex2dListIcons[i]	== 	null)
			    		{
			    			//print("Locha");
			    		}
			    	}
				}
			}
		}
	}
	else
	{
		gs_objArrayOfAddOns[iIndex].m_iChannelsCount	=	-1;
		gs_objArrayOfAddOns[iIndex].m_objProductToChannelInfoAPIPacket.m_strErrorMessage	=	"HTTP Error : " + gs_objArrayOfAddOns[iIndex].m_objProductToChannelInfoAPIPacket.m_strResponseCode + ". Please try later.";
		//print(gs_objArrayOfAddOns[iIndex].m_objProductToChannelInfoAPIPacket.m_strErrorMessage);
	}
	
	gs_objArrayOfAddOns[iIndex].m_objProductToChannelInfoAPIPacket.m_bResponseReceived 	= 	false;
}

//http://ec2-54-251-161-31.ap-southeast-1.compute.amazonaws.com/api/v1/product/AddRemoveAddons
function AddOrRemoveAnAddOn()
{
	var strAPIURL = ScriptAPIs.g_strWebservicesAtEC2 + "api/v1/";
	var strAPIMethod = "product/AddRemoveAddons";
	var strInput = "{\"uuId\":\"" + m_strUUID + "\",\"sCNumberField\":\"" + m_strConnectionId + "\",\"AddOnsIds\":[\"" + GetSelectedAddOnId() + "\"],\"mode\":\"" + GetAction() + "\"}";
	
	g_objAddOrRemoveAPIPacket = new CWebAPIPacket(strAPIURL,strAPIMethod,strInput);
	g_objScriptAPIHandler.InvokeReSTfulAPI(g_objAddOrRemoveAPIPacket);
}

function ParseAddOrRemoveAPIResponse(iAction	:	int)
{
	if(g_objAddOrRemoveAPIPacket.m_strResponseCode == "200 OK")
	{
		var N = JSON.Parse(g_objAddOrRemoveAPIPacket.m_strOutput);
		if(N == null)
		{
			g_objAddOrRemoveAPIPacket.m_strErrorMessage	=	"NULL JSON	:	No data available at server.";
			//print(g_objAddOrRemoveAPIPacket.m_strErrorMessage);
		}
		else
		{
			//Debug.Log("Reassembled: " + N.ToString());
			if(N.ToString() == "{}")
			{
				g_objAddOrRemoveAPIPacket.m_strErrorMessage	=	"Empty JSON	:	No data available at server.";
				//print(g_objAddOrRemoveAPIPacket.m_strErrorMessage);
			}
			else
			{
				if(iAction == 1)
				{
					g_objAddOrRemoveAPIPacket.m_strOutput	=	N["AddAddOnsResult"];
				}
				else if(iAction == -1)
				{
					g_objAddOrRemoveAPIPacket.m_strOutput	=	N["RemoveAddOnsResult"];
				}
				else
				{
					g_objAddOrRemoveAPIPacket.m_strOutput	=	"Action Failed : Server Exception Occured";
				}
				g_objAddOrRemoveAPIPacket.m_strErrorMessage	=	"";
			}
		}
	}
	else
	{
		g_objAddOrRemoveAPIPacket.m_strErrorMessage	=	"HTTP Error : " + g_objAddOrRemoveAPIPacket.m_strResponseCode + " Please try later.";
		//print(g_objAddOrRemoveAPIPacket.m_strErrorMessage);
	}
	
	g_objAddOrRemoveAPIPacket.m_bResponseReceived 	= 	false;
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

function GetSelectedAddOnName()	:	String
{
	if(gs_iCountAddOns > 0)
	{
		return gs_objArrayOfAddOns[m_iIndexSelectedAddOn].m_strAddOnName;
	}
	else
	{
		return "Add-On Name";
	}
}

function GetSelectedAddOnId()	:	String
{
	if(gs_iCountAddOns > 0)
	{	
		//Identify(gs_objArrayOfAddOns[m_iIndexSelectedAddOn].m_strAddOnName);
		return gs_objArrayOfAddOns[m_iIndexSelectedAddOn].m_strAddOnID;
		
	}
	else
	{
		return "Add-On Id";
	}
}

function GetSelectedAddOnPrice() : String
{
	return gs_objArrayOfAddOns[m_iIndexSelectedAddOn].m_strAddOnPrice;
}

function GetSelectedAddOnPriceString() : String
{	
	if(gs_iCountAddOns > 0)
	{
		return "\nPrice: INR " + gs_objArrayOfAddOns[m_iIndexSelectedAddOn].m_strAddOnPrice +" PM";
	}
	else
	{
		return " ____ ";
	}
}

function GetSelectedAddOnPriceWithTax() : String
{
	var fPrice : float = parseFloat(gs_objArrayOfAddOns[m_iIndexSelectedAddOn].m_strAddOnPrice);
	var fNetPrice : float = fPrice + (12.36/100)*fPrice;
	
	return fNetPrice.ToString("f2");
}

function GetSelectedAddOnPriceWithTaxAndString() : String
{	
	if(gs_iCountAddOns > 0)
	{
		var fPrice : float = parseFloat(gs_objArrayOfAddOns[m_iIndexSelectedAddOn].m_strAddOnPrice);
		
		if(fPrice == 0)
		{
			return "";
		}
		else
		{
			var fNetPrice : float = fPrice + (12.36/100)*fPrice;
			return "\nINR " + gs_objArrayOfAddOns[m_iIndexSelectedAddOn].m_strAddOnPrice + "+12.36%Tax = " + fNetPrice.ToString("f2") +" PM";
		}
	}
	else
	{
		return " ____ ";
	}
}

function IsEnoughBalance()	:	boolean
{
	var fPrice : float = parseFloat(gs_objArrayOfAddOns[m_iIndexSelectedAddOn].m_strAddOnPrice);
	var fNetPrice : float = fPrice + (12.36/100)*fPrice;
	
	var fBalance : float = parseFloat(m_strBalance);
	
	if(fBalance >= fNetPrice)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function GetSubscriptionOption()	:	String
{
	if(gs_iCountAddOns > 0)
	{
		if(gs_objArrayOfAddOns[m_iIndexSelectedAddOn].m_strSubscribed == "UNSUBSCRIBED")
			return "Subscribe >";
		else
			return "Unsubscribe >";
	}
	//return "Subscribe >";
	
}

function GetAction() : String
{	
	if(GetSubscriptionOption() == "Subscribe >")
	{
		return "ADD";
	}
	else
	{
		return "REMOVE";
	}
}

function GetActionId() : int
{
	if(GetSubscriptionOption() == "Subscribe >")
	{
		return 1;
	}
	else
	{
		return -1;
	}
}

function RenderAPIErrorPrompt(iWindowID : int)
{
	m_skinAddOnsScreen.box.fontSize 				=	Mathf.Min(0.8*m_fWidthPopup,m_fHeightPopup/3.0)/4.0;
	m_skinAddOnsScreen.box.alignment				=	TextAnchor.MiddleLeft;
	m_skinAddOnsScreen.box.normal.background		=	null;
	m_skinAddOnsScreen.box.normal.textColor			=	Color(100/255.0F,50/255.0F,140/255.0F,255/255.0F);
	m_skinAddOnsScreen.box.contentOffset.x			=	0.0;
	m_skinAddOnsScreen.box.font						= 	m_fontBold;

	
	var guicontentsPromptTitle	:	GUIContent 		=	new GUIContent("Server Error",m_tex2DServerError);
	GUI.Box(Rect(0.1*m_fWidthPopup,0,0.8*m_fWidthPopup,m_fHeightPopup/3.0),guicontentsPromptTitle);

	m_skinAddOnsScreen.label.fontSize 				=	Mathf.Min(0.8*m_fWidthPopup,m_fHeightPopup/3.0)/5.0;
	m_skinAddOnsScreen.label.alignment				=	TextAnchor.UpperLeft;
	m_skinAddOnsScreen.label.normal.background		=	null;
	m_skinAddOnsScreen.label.normal.textColor		=	Color(96/255.0F,96/255.0F,96/255.0F,255/255.0F);
	
	GUI.Label(Rect(0.1*m_fWidthPopup,0.67*m_fHeightPopup/3.0 + m_fHeightPopup/12.0,0.8*m_fWidthPopup,m_fHeightPopup/3.0),g_objGetAddOnsListAPIPacket.m_strErrorMessage);
	
	SkinButtonAsAButton();
	if(GUI.Button(Rect(0.57*m_fWidthPopup,2*m_fHeightPopup/3.0 + m_fHeightPopup/12.0,0.33*m_fWidthPopup,m_fHeightPopup/6.0),"OK"))
	{
		Application.LoadLevel("SceneHomePage");
	}
}

function RenderAddOrRemovePrompt(iWindowID	:	int)
{
	//Is password correct?
	////AddOrRemoveAnAddOn();
	if(m_iSlideId	==	0)
	{
		m_skinAddOnsScreen.label.alignment				=	TextAnchor.MiddleLeft;
		m_skinAddOnsScreen.label.fontSize				=	0.3*m_fHeightPopup/3.0;
		
		var strPrompt	:	String;
		
		if(GetActionId() == 1)
		{
			strPrompt	=	"Subscription to this service costs INR " + GetSelectedAddOnPrice() + " per month.";
		}
		else
		{
			strPrompt	=	"Please enter your password and confirm to remove this service from your account.";
		}
		GUI.Label(Rect(0.1*m_fWidthPopup, 0.1*m_fHeightPopup, 0.8*m_fWidthPopup, 0.3*m_fHeightPopup),strPrompt); 
		
		m_skinAddOnsScreen.textField.fontSize			=	0.3*m_fHeightPopup/3.0;
		m_strPassword = GUI.PasswordField(Rect(0.1*m_fWidthPopup,0.4*m_fHeightPopup,0.6*m_fWidthPopup,0.2*m_fHeightPopup),m_strPassword,"*"[0],25);
	
		SkinButtonAsAButton();
		if(GUI.Button(Rect(0.1*m_fWidthPopup,0.7*m_fHeightPopup,0.35*m_fWidthPopup,0.2*m_fHeightPopup),"Cancel"))
		{	tracking(GetSelectedAddOnName()+"Add Ons -> Subscribe|Unsubscribe -> Cancel");
			m_bAddOrRemoveActionInitiated	=	false;
		}
		
		if(GUI.Button(Rect(0.55*m_fWidthPopup,0.7*m_fHeightPopup,0.35*m_fWidthPopup,0.2*m_fHeightPopup),"Confirm"))
		{	
			tracking(GetSelectedAddOnName()+"Add Ons -> Subscribe|Unsubscribe -> Confirm");
			var strPassword	:	String	=	PlayerPrefs.GetString("Password");
			if(m_strPassword == strPassword)
			{
				if(IsEnoughBalance() == false)//if balance is less
				{
					m_iSlideId = 2;
				}
				else//if enough balance
				{
					AddOrRemoveAnAddOn();
					m_iSlideId = 3;
				}
			}
			else
			{
				m_iSlideId = 1;
			}
		}
	}
	
	if(m_iSlideId == 1)//if wrong pwd
	{
		m_skinAddOnsScreen.label.alignment				=	TextAnchor.MiddleLeft;
		m_skinAddOnsScreen.label.fontSize				=	0.3*m_fHeightPopup/3.0;
		GUI.Label(Rect(0.1*m_fWidthPopup, 0.1*m_fHeightPopup, 0.8*m_fWidthPopup, 0.3*m_fHeightPopup),"Incorrect password! Please try again."); 
		SkinButtonAsAButton();
		if(GUI.Button(Rect(0.55*m_fWidthPopup,0.7*m_fHeightPopup,0.35*m_fWidthPopup,0.2*m_fHeightPopup),"Retry"))
		{
			m_iSlideId = 0;
		}
		
		if(GUI.Button(Rect(0.1*m_fWidthPopup,0.7*m_fHeightPopup,0.35*m_fWidthPopup,0.2*m_fHeightPopup),"Cancel"))
		{
			m_bAddOrRemoveActionInitiated	=	false;
		}
	}
	
	if(m_iSlideId == 2)//recharge now pe redirect karo
	{
		m_skinAddOnsScreen.label.alignment				=	TextAnchor.MiddleLeft;
		m_skinAddOnsScreen.label.fontSize				=	0.3*m_fHeightPopup/3.0;
		GUI.Label(Rect(0.1*m_fWidthPopup, 0.1*m_fHeightPopup, 0.8*m_fWidthPopup, 0.3*m_fHeightPopup),"You have insufficient balance. Please recharge your account to subscribe this channel."); 
		
		SkinButtonAsAButton();
		if(GUI.Button(Rect(0.55*m_fWidthPopup,0.7*m_fHeightPopup,0.35*m_fWidthPopup,0.2*m_fHeightPopup),"Recharge Now"))
		{
			Application.LoadLevel("sceneRecharge");
		}
		
		if(GUI.Button(Rect(0.1*m_fWidthPopup,0.7*m_fHeightPopup,0.35*m_fWidthPopup,0.2*m_fHeightPopup),"Later"))
		{
			m_bAddOrRemoveActionInitiated	=	false;
		}
	}
	
	if(m_iSlideId == 3)//hit Add/Remove AddOn API
	{
		if(g_objAddOrRemoveAPIPacket.m_bResponseReceived == false)
		{
			RenderPleaseWaitSplash(0.5*m_fWidthPopup, 0.5*m_fHeightPopup);
		}
		else
		{
			ParseAddOrRemoveAPIResponse(GetActionId());
			m_iSlideId = 4;
		}
	}
	
	if(m_iSlideId == 4)//success or failure message
	{
		m_skinAddOnsScreen.label.alignment				=	TextAnchor.MiddleLeft;
		m_skinAddOnsScreen.label.fontSize				=	0.3*m_fHeightPopup/3.0;
		
		var strResponseMessage	:	String;
		if(g_objAddOrRemoveAPIPacket.m_strErrorMessage == "")
		{	
			strResponseMessage	=	"Add On " + g_objAddOrRemoveAPIPacket.m_strOutput;
		}
		else
		{
			strResponseMessage	=	g_objAddOrRemoveAPIPacket.m_strErrorMessage;
			
		}
		if(m_count == 0){
			tracking(strResponseMessage);
			m_count++;
		}
		GUI.Label(Rect(0.1*m_fWidthPopup, 0.1*m_fHeightPopup, 0.8*m_fWidthPopup, 0.3*m_fHeightPopup),strResponseMessage); 
		
		SkinButtonAsAButton();
		if(GUI.Button(Rect(0.55*m_fWidthPopup,0.7*m_fHeightPopup,0.35*m_fWidthPopup,0.2*m_fHeightPopup),"OK"))
		{
			//DeductBalanceLocally();//this will get refreshed after login anyways
			m_bAddOrRemoveActionInitiated	=	false;
			gs_iCountAddOns = 0;
			//GetAddOnsList();
			RefreshBalance();
		}
	}
}

function RefreshBalance()
{
	PlayerPrefs.SetInt("Refresh",1);
	Application.LoadLevel("SceneMainPage");
}

function DeductBalanceLocally()
{
	var iActionId : int = GetActionId();
	
	if(iActionId == 1) //subscribe pe hi balance katega | unsubscribe pe kuch nahi karna
	{		
		var fNewBalance	:	float	=	parseFloat(m_strBalance) - parseFloat(GetSelectedAddOnPrice());
		
		var strNewBalance	:	String	=	fNewBalance.ToString();
		PlayerPrefs.SetString("Balance",strNewBalance);
	}
}

function SkinButtonAsAButton()
{
	m_skinAddOnsScreen.button.normal.background 	= 	m_tex2DPurple;
	m_skinAddOnsScreen.button.hover.background 		= 	m_tex2DOrange;
	m_skinAddOnsScreen.button.active.background 	= 	m_tex2DOrange;
	m_skinAddOnsScreen.button.normal.textColor 		= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinAddOnsScreen.button.hover.textColor 		= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinAddOnsScreen.button.active.textColor 		= 	Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F);
	m_skinAddOnsScreen.button.font					= 	m_fontRegular;
	m_skinAddOnsScreen.button.fontSize 				=	Mathf.Min(m_fWidthPopup,m_fHeightHeader)/1.75;
	m_skinAddOnsScreen.button.alignment				=	TextAnchor.MiddleCenter;
	m_skinAddOnsScreen.button.contentOffset.x		=	0.0;
}

function DrawTexture(color : Color)	:	Texture2D
{
    var texture : Texture2D = new Texture2D(1, 1);
    texture.SetPixel(0,0,color);
    texture.Apply();
    
	return texture;
}

function DrawPatternTexture(colorA	:	Color, colorB	:	Color)
{
	var texture : Texture2D = new Texture2D(128, 128);
    // Fill the texture with Sierpinski's fractal pattern!
	for (var y : int = 0; y < texture.height; ++y) 
	{
		for (var x : int = 0; x < texture.width; ++x) 
		{
			var color = (x&y) ? colorA : colorB;
			texture.SetPixel (x, y, color);
		}
	}
	texture.Apply();
    
	return texture;
}

function DrawTextureGradientY(colorA	:	Color, colorB	:	Color)
{
	var texture : Texture2D = new Texture2D(128, 128);
	
	var colors : Color[] = new Color[texture.height];
	
	var fIncrement	:	float	=	0.000f;
    // Fill the texture with Sierpinski's fractal pattern!
	for (var y : int = 0; y < texture.height; ++y) 
	{
		fIncrement	=	y/128.0;
		colors[y]	=	Color.Lerp(colorA,colorB,fIncrement);
		for (var x : int = 0; x < texture.width; ++x) 
		{
			texture.SetPixel (x, y, colors[y]);
		}
	}
	texture.Apply();
    
	return texture;
}

function CreateFlatTextures()
{
	m_tex2DPurple		=	DrawTexture(Color(103/255.0F,49/255.0F,141/255.0F,255/255.0F));
	m_tex2DLightPurple	=	DrawTexture(Color(174/255.0F,142/255.0F,192/255.0F,255/255.0F));
	m_tex2DOrange		=	DrawTexture(Color(249/255.0F,127/255.0F,6/255.0F,255/255.0F));
	m_tex2DWhite		=	DrawTexture(Color(255/255.0F,255/255.0F,255/255.0F,255/255.0F));
	//m_tex2DGrey			=	DrawTexture(Color(216/255.0F,216/255.0F,216/255.0F,255/255.0F));
	m_tex2DGrey			=	DrawTextureGradientY(Color(208/255.0F,208/255.0F,208/255.0F,255/255.0F),Color(224/255.0F,224/255.0F,224/255.0F,255/255.0F));
}

//function TrackEvent(fWaitTime	:	float)
//{
//	yield WaitForSeconds(fWaitTime);
//	TE("Add Ons");
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
	
	//var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"traits\":{\"Username\":\"" + userName + "\",\"EmailId\":\"" + emailId + "\",\"PresentPackageId\":\"" + presentPackageId + "\","+
	//"\"NextRechargeDate\":\"" + nextRechargeDate + "\",\"PresentPackageName\":\"" + presentPackageName + "\","+
	//"\"PostalCode\":\"" + postalCode + "\",\"Contact\":\"" + contact + "\","+
	//"\"City\":\"" + city + "\",\"State\":\"" + state + "\","+
	//"\"Balance\":\"" + balance + "\"}\"event\":\"" + strClickedOn + "\"}";
	
	var strInput = "{\"secret\":\"rrenb1jpxo\",\"userId\":\"" + customerId + "\",\"traits\":{\"Addons\":\"" + strClickedOn + "\"}}";
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
