using UnityEngine;
using System.Collections;
using System.IO;
using com.shephertz.app42.paas.sdk.csharp;
using com.shephertz.app42.paas.sdk.csharp.pushNotification;
using System;
using System.Net;


public class PushSample: MonoBehaviour
{
	string message = "No Message yet";
	private AndroidJavaObject testobj = null;
	private AndroidJavaObject playerActivityContext = null;
	private string userName = "";
	private string myMsg = "Hi I am using Push App42";
	public const string UnityRegistrationMethod = "StoreDeviceId";
	public string app42Response="";
	
	
	
#if UNITY_ANDROID
	void OnGUI()
    {
	}
	
	public void sendPushToUser(string userName,string msg)
	{
		App42API.BuildPushNotificationService().SendPushMessageToUser(userName,msg,new Callback());	
	}
	
	public void sendPushToAll(string msg)
	{	
		App42API.BuildPushNotificationService().SendPushMessageToAll(msg,new Callback());    
	}
	
	public void sendScheduledPushToMyself()
	{
		DateTime expiryTime =DateTime.UtcNow.AddSeconds(60);
		App42API.BuildPushNotificationService().ScheduleMessageToUser(Constants.UserId, "Scheduled Hello", expiryTime, new Callback());
	}
	
	void Start ()
	{
		//print(Constants.UserId);
		
		    GameObject androidtest = GameObject.Find(Constants.GameObjectName);
			//DontDestroyOnLoad(transform.gameObject);
			this.gameObject.name = Constants.GameObjectName;
		    App42API.Initialize(Constants.ApiKey,Constants.SecretKey);
	    	App42API.SetLoggedInUser(Constants.UserId);
		    //If your App is ACL App, uncomment and pass session id of logged in user in below line
		    //App42API.SetUserSessionId("<Logged_In_User_Session_Id>");
		    RegisterForPush();
		    getLastMessage();
	}
	
	
	
	public void RegisterForPush()
	{
		 object[] googleProjectNo = new object[]{Constants.GoogleProjectNo};
          object[] unityParam = new object[]{Constants.CallBackMethod,Constants.GameObjectName,UnityRegistrationMethod};
          using (var actClass = new AndroidJavaClass("com.unity3d.player.UnityPlayer")) {
                playerActivityContext = actClass.GetStatic<AndroidJavaObject>("currentActivity");
		     using (var pluginClass = new AndroidJavaClass("com.shephertz.app42.android.pushservice.App42PushService")) {
                if (pluginClass != null) {
                    testobj = pluginClass.CallStatic<AndroidJavaObject>("instance",playerActivityContext);
				    testobj.Call("setProjectNo",googleProjectNo);
                    testobj.Call("registerForNotification",unityParam);
                }
          	  }
            }
	}
	
	
	public void getLastMessage()
	{
		 object[] googleProjectNo = new object[]{Constants.GoogleProjectNo};
          object[] unityParam = new object[]{Constants.CallBackMethod,Constants.GameObjectName,UnityRegistrationMethod};
          using (var actClass = new AndroidJavaClass("com.unity3d.player.UnityPlayer")) {
                playerActivityContext = actClass.GetStatic<AndroidJavaObject>("currentActivity");
		     using (var pluginClass = new AndroidJavaClass("com.shephertz.app42.android.pushservice.App42PushService")) {
                if (pluginClass != null) {
                    testobj = pluginClass.CallStatic<AndroidJavaObject>("instance",playerActivityContext);
				    testobj.Call("getLastMessage");
                }
          	  }
            }
	}
	/*
	 * This function is called from Native Android Code to store Device Id for Push Notification.
	 * @param deviceId require to register for Push Notification on App42 API
	 * 
	 */
	public void StoreDeviceId(string deviceId) 
	{
		  	App42API.BuildPushNotificationService().StoreDeviceToken(App42API.GetLoggedInUser(),deviceId,
			Constants.DeviceType,new Callback());
    }	
	
	/*
	 * This function is called from Native Android Code to whenever any Push Notification receive.
	 * @param msg Push Notification message
	 * 
	 */
    public void Success(string msg)
	{
         if(msg != null)
		{
			Debug.Log("Push Message is Here: " + msg);
			message=msg;
			app42Response="";
		}
	}

#endif
}
	
