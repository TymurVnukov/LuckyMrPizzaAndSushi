using Newtonsoft.Json;
using System.Collections;
using System.Text;
using UnityEditor;
using UnityEngine;
using UnityEngine.Networking;

public static class ComunicationController
{
    private static string cookies = "";
    public static string baseUrl = "http://localhost:22903/"; // "http://18.153.33.44:22903/"


    public static IEnumerator SendToServer(string type, object signupData, string endpoint, System.Action<string> callback, System.Action<string> callbackError)
    {
        string apiUrl = baseUrl + endpoint;

        string jsonData = JsonConvert.SerializeObject(signupData);

        using (UnityWebRequest request = new UnityWebRequest(apiUrl, type))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            string get = PlayerPrefs.GetString("MyCookies");
            cookies = get;

            request.SetRequestHeader("Cookie", cookies);
            

            yield return request.SendWebRequest();

            var responseHeaders = request.GetResponseHeaders();
            if (responseHeaders != null && responseHeaders.ContainsKey("Set-Cookie"))
            {
                string setCookieHeader = responseHeaders["Set-Cookie"];
                cookies = setCookieHeader;
                PlayerPrefs.SetString("MyCookies", cookies);
            }

            if (request.result == UnityWebRequest.Result.Success)
            {
                callback(request.downloadHandler.text);
            }
            else
            {
                callbackError(request.downloadHandler.text);
            }

            //Debug.Log(cookies);
        }
    }

    public static IEnumerator LoadImage(string imagePath, System.Action<Sprite> onLoaded)
    {
        string url = $"http://localhost:33903/download/{imagePath}"; //http://18.153.33.44:33903/download/

        using (UnityWebRequest request = UnityWebRequestTexture.GetTexture(url))
        {
            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Texture2D texture = ((DownloadHandlerTexture)request.downloadHandler).texture;
                Sprite sprite = Sprite.Create(texture, new Rect(0, 0, texture.width, texture.height), new Vector2(0.5f, 0.5f));
                onLoaded(sprite); // Pass the loaded Sprite to the callback
            }
            else
            {
                Debug.LogError($"Failed to load image from URL: {url}. Error: {request.error}");
                onLoaded(null); // Pass null or a fallback sprite
            }
        }
    }


}
[System.Serializable]
public class ErrorData
{
    public bool success { get; set; }
    public string message { get; set; }
}

[System.Serializable]
public class AutorizationResponseData
{
    public bool success { get; set; }
    public string message { get; set; }
    public AutorizationUserData user { get; set; }
}

[System.Serializable]
public class AutorizationUserData
{
    public int id { get; set; }
    public string verificationToken { get; set; }
    public string name { get; set; }
    public string email { get; set; }
    public string lastlogin { get; set; }
    public bool isVerified { get; set; }
}

[System.Serializable]
public class MenuPageResponseData
{
    public bool success { get; set; }
    public string message { get; set; }
    public MenuPageList[] menuList { get; set; }
}

[System.Serializable]
public class MenuItemPageResponseData
{
    public bool success { get; set; }
    public string message { get; set; }
    public MenuPageList[] menuItem { get; set; }
}

[System.Serializable]
public class MenuPageList
{
    public int id { get; set; }
    public string name { get; set; }
    public string description { get; set; }
    public double price { get; set; }
    public int categoryId { get; set; }
    public bool lightRequire { get; set; }
    public bool availability { get; set; }
    public string imagePath { get; set; }
    public string image { get; set; }
}