using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class MyOrderItemBlockController : MonoBehaviour
{
    public Image itemImage;
    public TMP_Text NameText;
    public TMP_Text QuantityText;
    public TMP_Text PriceText;

    public void SetData(Sprite imageSprite, ProductInfo productInfo)
    {
        if (imageSprite != null)
        {
            itemImage.sprite = imageSprite;
        }
        else
        {
            Debug.LogWarning("Failed to load image, setting fallback.");
        }
        NameText.text = $"{productInfo.name}";
        QuantityText.text = $"x{productInfo.quantity}";
        PriceText.text = $"${productInfo.price}";
    }
}
