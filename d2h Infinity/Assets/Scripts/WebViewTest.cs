using UnityEngine;
using System.Collections;

class WebViewCallbackTest : Kogarasi.WebView.IWebViewCallback
{
	public void onLoadStart( string url )
	{
		Debug.Log( "call onLoadStart : " + url );
	}
	public void onLoadFinish( string url )
	{
		Debug.Log( "call onLoadFinish : " + url );
	}
	public void onLoadFail( string url )
	{
		Debug.Log( "call onLoadFail : " + url );
	}
}

public class WebViewTest : MonoBehaviour
{

	WebViewCallbackTest m_callback;
	string	m_strURL;
	public GUISkin	m_skinLoadingLabel;
	public Font	m_fontRegular;

	// Use this for initialization
	void Start () 
	{	
		m_strURL	=	PlayerPrefs.GetString("BrowserURL");
		m_callback	=	new WebViewCallbackTest();

		WebViewBehavior webview = GetComponent<WebViewBehavior>();
	
		if( webview != null )
		{
			//int left	=	(int)0;
			int	top		=	(int) (1.3*Screen.height/12.8);
			//int right	=	(int)Screen.width;
			//int bottom	=	(int) (11.5*Screen.height/12.8);*/
			webview.SetMargins(0, top, 0, top);
			
			webview.LoadURL( m_strURL );
			webview.SetVisibility( true );
			webview.setCallback( m_callback );
		}
	}
	
	void Update()
	{
        
	}
	
	void OnGUI()
	{
		float left		=	0.0f;
		float top		=	(float)0.4*Screen.height;
		float width		=	(float)Screen.width;
		float height	=	(float)0.2*Screen.height;
		m_skinLoadingLabel.label.fontSize	=	(int)(0.25*height);
		m_skinLoadingLabel.label.font		=	m_fontRegular;
		GUI.Label(new Rect(left,top,width,height),"Loading...",m_skinLoadingLabel.label);
	}
}
