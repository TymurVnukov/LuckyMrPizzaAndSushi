using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using UnityEngine.Networking;
using System.Collections;
using Newtonsoft.Json;
using System.Text;
using System;
using TMPro;

public class AuthorizeScript : MonoBehaviour
{

    [Header("Sign Up.")]
    public GameObject Signup_Menu;
    public TMP_Text Signup_UsernameText;
    public TMP_Text Signup_EmailText;
    public TMP_Text Signup_PasswordText;
    public TMP_Text Signup_ErrorText;

    [Header("Log In.")]
    public GameObject Login_Menu;
    public TMP_Text Login_EmailText;
    public TMP_Text Login_PasswordText;
    public TMP_Text Login_ErrorText;

    [Header("Verify E-mail.")]
    public GameObject VerifyEmail_Menu;
    public TMP_Text VerifyEmail_CodeText;
    public TMP_Text VerifyEmail_ErrorText;

    

    private void Awake()
    {
        CheckAuth();
    }

    public void OnClick_OpenLogInMenu()
    {
        Signup_Menu.SetActive(false);
        Login_Menu.SetActive(true);
    }
    public void OnClick_OpenSignUpMenu()
    {
        Login_Menu.SetActive(false);
        Signup_Menu.SetActive(true);
    }




    #region CheckAuth
    public void CheckAuth()
    {
        var checkAuthData = new { };
        StartCoroutine(ComunicationController.SendToServer("GET", checkAuthData, $"api/auth/check-auth", (responseJson) => OnCheckAuthResponse(responseJson, 123), (responseJson) => OnCheckAuthResponseError(responseJson, "Error")));
    }

    private void OnCheckAuthResponse(string responseJson, int num)
    {
        AutorizationResponseData responseData = JsonConvert.DeserializeObject<AutorizationResponseData>(responseJson);

        if(responseData.user.isVerified == false)
        {
            Signup_Menu.SetActive(false);
            Login_Menu.SetActive(false);
            VerifyEmail_Menu.SetActive(true);
        }
        else
        {
            MainMenuManager.GetData(responseData.user.name, responseData.user.email, responseData.user.lastlogin);
            SceneManager.LoadScene("MainScene");
        }
    }
    private void OnCheckAuthResponseError(string responseJson, string str)
    {
        ErrorData responseData = JsonConvert.DeserializeObject<ErrorData>(responseJson);
        //Debug.LogError($"Not Auth ({responseData.message})");
    }
    #endregion CheckAuth

    #region SignUp
    public void OnClick_SignUp()
    {
        string emailText = Signup_EmailText.text;
        string passwordText = Signup_PasswordText.text;
        string nameText = Signup_UsernameText.text;
        var signupData = new
        {
            email = emailText.Substring(0, emailText.Length - 1), // delete invisible char
            password = passwordText.Substring(0, passwordText.Length - 1),
            name = nameText.Substring(0, nameText.Length - 1)
        };

        StartCoroutine(ComunicationController.SendToServer("POST", signupData, $"api/auth/signup", (responseJson) => OnSignupResponse(responseJson, 123), (responseJson) => OnSignupResponseError(responseJson, "Error")));
    }

    private void OnSignupResponse(string responseJson, int num)
    {
        AutorizationResponseData responseData = JsonConvert.DeserializeObject<AutorizationResponseData>(responseJson);

        Signup_Menu.SetActive(false);
        VerifyEmail_Menu.SetActive(true);
    }
    private void OnSignupResponseError(string responseJson, string str)
    {
        ErrorData responseData = JsonConvert.DeserializeObject<ErrorData>(responseJson);
        Signup_ErrorText.enabled = true;
        Signup_ErrorText.text = responseData.message;
    }
    #endregion SignUp

    #region VerifyEmail
    public void OnClick_VerifyEmail()
    {
        string codeText = VerifyEmail_CodeText.text;
        var verifyEmailData = new
        {
            code = codeText.Substring(0, codeText.Length - 1)
        };
        StartCoroutine(ComunicationController.SendToServer("POST", verifyEmailData, $"api/auth/verify-email", (responseJson) => OnVerifyEmailResponse(responseJson, 123), (responseJson) => OnVerifyEmailResponseError(responseJson, 123)));
    }

    private void OnVerifyEmailResponse(string responseJson, int num)
    {
        AutorizationResponseData responseData = JsonConvert.DeserializeObject<AutorizationResponseData>(responseJson);
        Debug.Log("message: " + responseData.message);

        MainMenuManager.GetData(responseData.user.name, responseData.user.email, responseData.user.lastlogin);
        SceneManager.LoadScene("MainScene");
    }
    private void OnVerifyEmailResponseError(string responseJson, int num)
    {
        ErrorData responseData = JsonConvert.DeserializeObject<ErrorData>(responseJson);
        VerifyEmail_ErrorText.enabled = true;
        VerifyEmail_ErrorText.text = responseData.message;
    }
    #endregion SignUp

    #region LogIn
    public void OnClick_Login()
    {
        string emailText = Login_EmailText.text;
        string passwordText = Login_PasswordText.text;
        var signupData = new
        {
            email = emailText.Substring(0, emailText.Length - 1), // delete invisible char
            password = passwordText.Substring(0, passwordText.Length - 1)
        };

        StartCoroutine(ComunicationController.SendToServer("POST", signupData, $"api/auth/login", (responseJson) => OnLoginResponse(responseJson, 123), (responseJson) => OnLoginResponseError(responseJson, "Error")));
    }

    private void OnLoginResponse(string responseJson, int num)
    {
        AutorizationResponseData responseData = JsonConvert.DeserializeObject<AutorizationResponseData>(responseJson);

        MainMenuManager.GetData(responseData.user.name, responseData.user.email, responseData.user.lastlogin);
        SceneManager.LoadScene("MainScene");
    }
    private void OnLoginResponseError(string responseJson, string str)
    {
        ErrorData responseData = JsonConvert.DeserializeObject<ErrorData>(responseJson);
        Login_ErrorText.enabled = true;
        Login_ErrorText.text = responseData.message;
    }
    #endregion LogIn
}
