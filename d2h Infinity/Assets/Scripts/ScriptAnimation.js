#pragma strict
var m_skinAnimation	:	GUISkin;
var m_iFPS			:	int;
var m_iImageCount	:	int;
var m_fGAP			:	float;
var m_listInfinityAnimationFrames = new List.<Texture2D>();

function Start ()
{
	m_iImageCount = 171;
    m_iFPS = 50;
    m_fGAP = Screen.height / 45;

    for(var i = 1; i <= m_iImageCount; i++)
    {
        var path = "image-"+i;
        var img = Resources.Load(path) as Texture2D;
        m_listInfinityAnimationFrames.Add(img);
    }
}

function Update () {

}

function OnGUI () {

}

function AnimationInfinity(strCaption : String)
{
	GUI.skin = m_skinAnimation ;
	m_skinAnimation.label.alignment = TextAnchor.MiddleCenter;
	
	var index : int = Time.time * m_iFPS;
    index = index % m_iImageCount;
	
	GUI.DrawTexture(Rect(Screen.width/2 - Screen.width/4,Screen.height/2 - Screen.width/4,Screen.width/2,Screen.width/2),m_listInfinityAnimationFrames[index]);
	
	m_skinAnimation.label.fontSize	=	Mathf.Min(Screen.width,Screen.height)/18;
	GUI.Label(Rect(Screen.width/2 - Screen.width/4,Screen.height/2 + Screen.height/6,Screen.width/2,Screen.height/8),"Please wait");
	
	m_skinAnimation.label.fontSize	=	Mathf.Min(Screen.width,Screen.height)/36;
	m_skinAnimation.label.alignment = 	TextAnchor.UpperCenter;
	GUI.Label(Rect(0,Screen.height/2 + Screen.height/4,Screen.width,Screen.height/8),"(" + strCaption + ")");
	
	GUI.skin = null ;
}