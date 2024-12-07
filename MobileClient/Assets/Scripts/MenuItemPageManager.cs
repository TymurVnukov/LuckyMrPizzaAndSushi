using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class MenuItemPageManager : MonoBehaviour
{
    public Image itemImage;
    public TMP_Text itemName;
    public TMP_Text itemDescription;
    public TMP_Text itemPrice;
    public Button addToCardButton;
    public Button backToMenuButton;

    public void ShowItem(string itemName, string categoryName)
    {
        var checkAuthData = new { };

        StartCoroutine(ComunicationController.SendToServer("GET", checkAuthData, $"menu/item/{itemName}",
        (responseJson) => StartCoroutine(OnShowItemResponse(responseJson, categoryName)),
        (responseJson) => OnShowItemResponseError(responseJson)));
    }

    private IEnumerator OnShowItemResponse(string responseJson, string categoryName)
    {
        MenuItemPageResponseData responseData = JsonConvert.DeserializeObject<MenuItemPageResponseData>(responseJson);
        MenuPageList menuItem = responseData.menuItem[0];

        Sprite loadedSprite = null;
        yield return ComunicationController.LoadImage(menuItem.imagePath, (sprite) => loadedSprite = sprite);

        SetData(loadedSprite, menuItem.id, menuItem.imagePath, menuItem.name, menuItem.description, menuItem.price, categoryName);
    }
    private void OnShowItemResponseError(string responseJson)
    {
        Debug.LogError($"ShowItem error {responseJson}");
    }


    private void SetData(Sprite image, int id, string imagePath, string name, string description, double price, string categoryName)
    {
        if (image != null)
        {
            itemImage.sprite = image;
        }
        else
        {
            Debug.LogWarning("Failed to load image, setting fallback.");
        }

        itemName.text = name;
        itemDescription.text = description;
        itemPrice.text = $"${price}";

        backToMenuButton.onClick.RemoveAllListeners();
        backToMenuButton.onClick.AddListener(() => OnClick_BackToMenu(categoryName));

        addToCardButton.onClick.RemoveAllListeners();
        addToCardButton.onClick.AddListener(() => OnClick_AddToCard(id, imagePath, name, description, price));
    }

    public void OnClick_AddToCard(int id, string imagePath, string name, string description, double price)
    {
        OrderManager.Singleton.AddToCart(new OrderItem { id = id, imagePath = imagePath, name = name, description = description, price = price, quantity = 1 });
    }

    private void OnClick_BackToMenu(string categoryName)
    {
        MainSceneManager.Singleton.OnClick_ShowMenuPage(categoryName);
    }
}
