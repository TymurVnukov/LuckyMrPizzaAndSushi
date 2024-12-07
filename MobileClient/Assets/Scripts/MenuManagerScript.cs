using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;

public class MenuManagerScript : MonoBehaviour
{
    public GameObject MenuItemPrefab;
    public Transform MenuContainer;

    public void GetMenuList(string categoryName)
    {
        foreach (Transform child in MenuContainer.transform)
        {
            GameObject.Destroy(child.gameObject);
        }
        var checkAuthData = new { };
        StartCoroutine(ComunicationController.SendToServer("GET", checkAuthData, $"menu/{categoryName}", (responseJson) => OnGetMenuListResponse(responseJson, categoryName), (responseJson) => OnGetMenuListResponseError(responseJson)));
    }

    private void OnGetMenuListResponse(string responseJson, string categoryName)
    {
        MenuPageResponseData responseData = JsonConvert.DeserializeObject<MenuPageResponseData>(responseJson);
        foreach (MenuPageList item in responseData.menuList)
        {
            GameObject newMenuItem = Instantiate(MenuItemPrefab, MenuContainer);
            MenuItemController menuItemController = newMenuItem.GetComponent<MenuItemController>();

            StartCoroutine(ComunicationController.LoadImage(item.imagePath, (loadedSprite) =>
            {
                menuItemController.SetData(loadedSprite, item.name, $"${item.price}");
            }));

            menuItemController.showMore.onClick.AddListener(() => OnClick_ShowItem(item.imagePath, categoryName));
        }
    }
    public void OnClick_ShowItem(string itemName, string categoryName)
    {
        MainSceneManager.Singleton.ShowMenuItemPage(itemName, categoryName);
    }

    private void OnGetMenuListResponseError(string responseJson)
    {
        Debug.LogError($"GetMenuList error {responseJson}");
    }

}
