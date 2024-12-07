using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class MenuItemController : MonoBehaviour
{
    public Image itemImage;
    public TMP_Text itemName;
    public TMP_Text itemPrice;
    public Button showMore;

    public void SetData(Sprite imageSprite, string name, string price)
    {
        if (imageSprite != null)
        {
            itemImage.sprite = imageSprite;
        }
        else
        {
            Debug.LogWarning("Failed to load image, setting fallback.");
        }

        itemName.text = name;
        itemPrice.text = price;
    }
}