using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;

public class MainMenuManager : MonoBehaviour
{
    private static MainMenuManager _singleton;
    public static MainMenuManager Singleton
    {
        get => _singleton;
        private set
        {
            if (_singleton == null)
                _singleton = value;
            else if (_singleton != value)
            {
                Debug.Log($"{nameof(MainMenuManager)} instance already exists, destroying duplicate!");
                Destroy(value);
            }
        }
    }

    private void Awake()
    {
        Singleton = this;
        UsernameText.text = username;
        EmailText.text = email;
        LastLoginText.text = lastLogin;
    }

    private static string username;
    private static string email;
    private static string lastLogin;

    public TMP_Text UsernameText;
    public TMP_Text EmailText;
    public TMP_Text LastLoginText;

    public GameObject MenuCategory_GameObject;

    public static void GetData(string _username, string _email, string _lastLogin)
    {
        username = _username;
        email = _email;
        lastLogin = _lastLogin;
    }

    #region Logout
    public void OnClick_Logout()
    {
        var checkAuthData = new { };
        StartCoroutine(ComunicationController.SendToServer("POST", checkAuthData, $"api/auth/logout", (responseJson) => OnLogoutResponse(responseJson, 123), (responseJson) => OnLogoutResponseError(responseJson, "Error")));
    }

    private void OnLogoutResponse(string responseJson, int num)
    {
        SceneManager.LoadScene("AuthorizationScene");
    }
    private void OnLogoutResponseError(string responseJson, string str)
    {
        Debug.LogError($"Logout error {responseJson}");
    }
    #endregion Logout



}
