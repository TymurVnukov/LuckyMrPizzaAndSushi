using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class OrderItemController : MonoBehaviour
{
    public Image itemImage;
    public TMP_Text itemName;
    public TMP_Text itemDescription;
    public TMP_Text itemQuantity;
    public TMP_Text itemPrice;

    public Button increaseQuantity;
    public Button decreaseQuantity;
    public Button removeItem;

    public void SetData(Sprite imageSprite, OrderItem item)
    {
        if (imageSprite != null)
        {
            itemImage.sprite = imageSprite;
        }
        else
        {
            Debug.LogWarning("Failed to load image, setting fallback.");
        }

        itemName.text = item.name;
        itemDescription.text = item.description;
        itemQuantity.text = $"x{item.quantity}";
        itemPrice.text = item.price.ToString("F2");

        increaseQuantity.onClick.RemoveAllListeners();
        decreaseQuantity.onClick.RemoveAllListeners();
        removeItem.onClick.RemoveAllListeners();

        increaseQuantity.onClick.AddListener(() => OnClick_UpdateQuantity(item, +1));
        decreaseQuantity.onClick.AddListener(() => OnClick_UpdateQuantity(item, -1));
        removeItem.onClick.AddListener(() => OnClick_RemoveItem(item));
    }

    private void OnClick_UpdateQuantity(OrderItem item, int delta)
    {
        int newQuantity = OrderManager.Singleton.UpdateQuantity(item, delta);
        if (newQuantity <= 0)
        {
            Destroy(this.gameObject);
        }
        else
        {
            itemQuantity.text = $"x{newQuantity}";
        }
    }

    private void OnClick_RemoveItem(OrderItem item)
    {
        OrderManager.Singleton.RemoveFromCart(item);
        Destroy(this.gameObject);
    }


}